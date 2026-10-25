import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  studentProcedure,
  teacherProcedure,
} from "~/server/api/trpc";
import type { Prisma, PrismaClient } from "../../../../generated/prisma";

/**
 * Live Quiz: a Kahoot-style game the teacher hosts on the projector from a
 * set of Unit Questions. Students join from their devices and race to
 * answer; quicker correct answers earn more points (up to 1,000). Screens
 * poll for the game state, so it works without a socket server.
 */

type Db = PrismaClient | Prisma.TransactionClient;

/** Late answers within this margin still count (network delay). */
const GRACE_MS = 1500;
/** Games older than this are no longer offered to students. */
const ACTIVE_FOR_MS = 6 * 60 * 60 * 1000;
export const MAX_POINTS = 1000;

/** Kahoot-style scoring: full points for an instant answer, half at the buzzer. */
export function pointsFor(elapsedMs: number, limitMs: number) {
  const fraction = Math.min(1, Math.max(0, elapsedMs / limitMs));
  return Math.round(MAX_POINTS * (1 - fraction / 2));
}

const remainingMs = (game: {
  status: string;
  questionStartedAt: Date | null;
  secondsPerQuestion: number;
}) =>
  game.status === "QUESTION" && game.questionStartedAt
    ? Math.max(
        0,
        game.questionStartedAt.getTime() +
          game.secondsPerQuestion * 1000 -
          Date.now(),
      )
    : 0;

async function questionsOf(db: Db, ids: string[]) {
  const rows = await db.question.findMany({
    where: { id: { in: ids } },
    select: {
      id: true,
      assessment: { select: { unitId: true, bankForUnitId: true } },
      prompt: true,
      explanation: true,
      options: {
        orderBy: { order: "asc" },
        select: { id: true, label: true, text: true, isCorrect: true },
      },
    },
  });
  return ids
    .map((id) => rows.find((r) => r.id === id))
    .filter((q): q is NonNullable<typeof q> => Boolean(q));
}

/** A unit's Unit Questions in a class the teacher teaches. */
async function unitQuizOf(
  db: Db,
  assessmentId: string,
  teacherId: string | null,
) {
  const quiz = await db.assessment.findUnique({
    where: { id: assessmentId },
    select: {
      sectionId: true,
      unitId: true,
      title: true,
      section: { select: { teacherId: true } },
      _count: { select: { questions: true } },
    },
  });
  if (!quiz?.unitId || quiz.section.teacherId !== teacherId) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You can only change questions of your own class.",
    });
  }
  return {
    sectionId: quiz.sectionId,
    unitId: quiz.unitId,
    title: quiz.title,
    questions: quiz._count.questions,
  };
}

/** Players ranked by score (ties share a rank), with names and teams. */
async function standings(db: Db, gameId: string) {
  const players = await db.livePlayer.findMany({
    where: { gameId },
    orderBy: [{ score: "desc" }, { joinedAt: "asc" }],
    select: {
      id: true,
      studentId: true,
      team: true,
      score: true,
      student: { select: { user: { select: { name: true } } } },
    },
  });
  return players.map((p, i) => ({
    playerId: p.id,
    studentId: p.studentId,
    name: p.student.user.name ?? "Student",
    team: p.team,
    score: p.score,
    rank:
      i > 0 && players[i - 1]!.score === p.score
        ? players.findIndex((x) => x.score === p.score) + 1
        : i + 1,
  }));
}

const teamTotals = (rows: Array<{ team: number | null; score: number }>) => [
  rows.filter((r) => r.team === 0).reduce((s, r) => s + r.score, 0),
  rows.filter((r) => r.team === 1).reduce((s, r) => s + r.score, 0),
];

async function hostGame(db: Db, gameId: string, teacherId: string | null) {
  const game = await db.liveGame.findUnique({
    where: { id: gameId },
    select: {
      id: true,
      hostId: true,
      status: true,
      questionIds: true,
      currentIndex: true,
      questionStartedAt: true,
      secondsPerQuestion: true,
      teamMode: true,
      section: { select: { code: true, course: { select: { name: true } } } },
      assessment: {
        select: { title: true, unit: { select: { title: true } } },
      },
    },
  });
  if (game?.hostId !== teacherId || !game) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "This live quiz isn't yours or no longer exists.",
    });
  }
  return game;
}

export const liveRouter = createTRPCRouter({
  /** Teacher: the classes and Unit Questions a game can be started from. */
  setupOptions: teacherProcedure.query(async ({ ctx }) => {
    const sections = await ctx.db.section.findMany({
      where: { teacherId: ctx.teacherId ?? "", term: { isCurrent: true } },
      orderBy: [{ course: { name: "asc" } }, { code: "asc" }],
      select: {
        id: true,
        code: true,
        course: { select: { name: true } },
        _count: { select: { enrollments: { where: { status: "ACTIVE" } } } },
        assessments: {
          where: {
            assignmentId: null,
            OR: [{ unitId: { not: null } }, { bankForUnitId: { not: null } }],
          },
          select: {
            id: true,
            title: true,
            unitId: true,
            bankForUnitId: true,
            unit: { select: { title: true, order: true } },
            _count: { select: { questions: true } },
          },
        },
        liveGames: {
          where: {
            status: { not: "FINISHED" },
            createdAt: { gte: new Date(Date.now() - ACTIVE_FOR_MS) },
          },
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { id: true, status: true },
        },
      },
    });
    return sections.map((s) => ({
      id: s.id,
      label: `${s.course.name} — ${s.code}`,
      students: s._count.enrollments,
      activeGameId: s.liveGames[0]?.id ?? null,
      // One entry per unit: its Unit Questions plus its Live Quiz bank.
      quizzes: s.assessments
        .filter((a) => a.unitId)
        .sort((a, b) => (a.unit?.order ?? 0) - (b.unit?.order ?? 0))
        .map((a) => {
          const bank = s.assessments
            .filter((b) => b.bankForUnitId === a.unitId)
            .reduce((sum, b) => sum + b._count.questions, 0);
          return {
            id: a.id,
            label: a.unit?.title ?? a.title,
            questions: a._count.questions + bank,
            extra: bank,
          };
        })
        .filter((q) => q.questions > 0),
    }));
  }),

  /**
   * Teacher: opens a new game in the lobby (ending any open one for the
   * class) with 5, 10, 15 or 20 questions, drawn at random from one unit's
   * questions or from all the class's units (a mixed review).
   */
  create: teacherProcedure
    .input(
      z.object({
        sectionId: z.string(),
        /** One unit's Unit Questions, or null for all units. */
        assessmentId: z.string().nullable(),
        questionCount: z.union([
          z.literal(5),
          z.literal(10),
          z.literal(15),
          z.literal(20),
        ]),
        secondsPerQuestion: z.number().int().min(5).max(120),
        teamMode: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const section = await ctx.db.section.findUnique({
        where: { id: input.sectionId },
        select: { teacherId: true },
      });
      if (section?.teacherId !== ctx.teacherId || !section) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only start a live quiz for your own class.",
        });
      }
      const unitId = input.assessmentId
        ? (
            await ctx.db.assessment.findFirst({
              where: { id: input.assessmentId, sectionId: input.sectionId },
              select: { unitId: true },
            })
          )?.unitId
        : null;
      if (input.assessmentId && !unitId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "That unit is not part of this class.",
        });
      }
      // The unit's Unit Questions and its Live Quiz bank (or every unit's).
      const pool = await ctx.db.question.findMany({
        where: {
          options: { some: { isCorrect: true } },
          assessment: {
            sectionId: input.sectionId,
            assignmentId: null,
            OR: unitId
              ? [{ unitId }, { bankForUnitId: unitId }]
              : [{ unitId: { not: null } }, { bankForUnitId: { not: null } }],
          },
        },
        select: { id: true, assessmentId: true },
      });
      if (pool.length < input.questionCount) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `There are only ${pool.length} questions here. Choose fewer questions${input.assessmentId ? ", or All units" : ""}.`,
        });
      }
      // Fisher–Yates shuffle, then take the number asked for.
      const shuffled = [...pool];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
      }
      const chosen = shuffled.slice(0, input.questionCount);
      await ctx.db.liveGame.updateMany({
        where: { sectionId: input.sectionId, status: { not: "FINISHED" } },
        data: { status: "FINISHED", finishedAt: new Date() },
      });
      const game = await ctx.db.liveGame.create({
        data: {
          sectionId: input.sectionId,
          hostId: ctx.teacherId,
          assessmentId: input.assessmentId ?? chosen[0]!.assessmentId,
          questionIds: chosen.map((q) => q.id),
          secondsPerQuestion: input.secondsPerQuestion,
          teamMode: input.teamMode,
        },
        select: { id: true },
      });
      return { gameId: game.id };
    }),

  /** Teacher: the extra Live Quiz questions of one unit in a class. */
  bank: teacherProcedure
    .input(z.object({ assessmentId: z.string() }))
    .query(async ({ ctx, input }) => {
      const quiz = await unitQuizOf(ctx.db, input.assessmentId, ctx.teacherId);
      const questions = await ctx.db.question.findMany({
        where: {
          assessment: { sectionId: quiz.sectionId, bankForUnitId: quiz.unitId },
        },
        orderBy: { order: "asc" },
        select: {
          id: true,
          prompt: true,
          explanation: true,
          options: {
            orderBy: { order: "asc" },
            select: { label: true, text: true, isCorrect: true },
          },
        },
      });
      return { unitQuestions: quiz.questions, questions };
    }),

  /** Teacher: adds a multiple-choice question to a unit's Live Quiz bank. */
  addQuestion: teacherProcedure
    .input(
      z.object({
        assessmentId: z.string(),
        prompt: z.string().trim().min(3).max(500),
        choices: z.array(z.string().trim().min(1).max(200)).min(2).max(4),
        answer: z.number().int().min(0).max(3),
        explanation: z.string().trim().max(500).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.answer >= input.choices.length) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Mark which choice is correct.",
        });
      }
      const quiz = await unitQuizOf(ctx.db, input.assessmentId, ctx.teacherId);
      const bank =
        (await ctx.db.assessment.findFirst({
          where: { sectionId: quiz.sectionId, bankForUnitId: quiz.unitId },
          select: { id: true },
        })) ??
        (await ctx.db.assessment.create({
          data: {
            sectionId: quiz.sectionId,
            bankForUnitId: quiz.unitId,
            title:
              quiz.title.replace(/ Questions$/, "") + " Live Quiz Questions",
            totalPoints: 0,
            maxAttempts: 1,
            allowScratchpad: false,
          },
          select: { id: true },
        }));
      const last = await ctx.db.question.findFirst({
        where: { assessmentId: bank.id },
        orderBy: { order: "desc" },
        select: { order: true },
      });
      await ctx.db.question.create({
        data: {
          assessmentId: bank.id,
          order: (last?.order ?? 0) + 1,
          type: "MULTIPLE_CHOICE",
          prompt: input.prompt,
          points: 1,
          explanation: input.explanation ?? null,
          options: {
            create: input.choices.map((text, k) => ({
              label: "ABCD"[k]!,
              text,
              isCorrect: k === input.answer,
              order: k,
            })),
          },
        },
      });
      await ctx.db.assessment.update({
        where: { id: bank.id },
        data: { totalPoints: { increment: 1 } },
      });
      return { ok: true };
    }),

  /** Teacher: removes a question from a unit's Live Quiz bank. */
  removeQuestion: teacherProcedure
    .input(z.object({ questionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const question = await ctx.db.question.findUnique({
        where: { id: input.questionId },
        select: {
          assessmentId: true,
          assessment: {
            select: {
              bankForUnitId: true,
              section: { select: { teacherId: true } },
            },
          },
        },
      });
      if (
        !question?.assessment.bankForUnitId ||
        question.assessment.section.teacherId !== ctx.teacherId
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "Only extra Live Quiz questions of your class can be removed.",
        });
      }
      await ctx.db.question.delete({ where: { id: input.questionId } });
      await ctx.db.assessment.update({
        where: { id: question.assessmentId },
        data: { totalPoints: { decrement: 1 } },
      });
      return { ok: true };
    }),

  /** Teacher: everything the projector screen shows. */
  hostState: teacherProcedure
    .input(z.object({ gameId: z.string() }))
    .query(async ({ ctx, input }) => {
      const game = await hostGame(ctx.db, input.gameId, ctx.teacherId);
      const [players, questions] = await Promise.all([
        standings(ctx.db, game.id),
        questionsOf(ctx.db, game.questionIds),
      ]);
      const question = questions[game.currentIndex] ?? null;
      const answers = question
        ? await ctx.db.liveAnswer.findMany({
            where: { gameId: game.id, questionId: question.id },
            select: { optionId: true, isCorrect: true, points: true },
          })
        : [];
      const reveal = game.status === "REVEAL" || game.status === "FINISHED";
      // Questions from several units make a mixed review.
      const units = new Set(
        questions.map((q) => q.assessment.unitId ?? q.assessment.bankForUnitId),
      ).size;
      return {
        id: game.id,
        status: game.status,
        title: `${game.section.course.name} — ${game.section.code}`,
        unit:
          units > 1
            ? `Mixed review · ${units} units`
            : (game.assessment.unit?.title ?? game.assessment.title),
        teamMode: game.teamMode,
        index: game.currentIndex,
        total: game.questionIds.length,
        secondsPerQuestion: game.secondsPerQuestion,
        remainingMs: remainingMs(game),
        question: question && {
          prompt: question.prompt,
          explanation: reveal ? question.explanation : null,
          options: question.options.map((o) => ({
            id: o.id,
            label: o.label,
            text: o.text,
            isCorrect: reveal ? o.isCorrect : null,
            count: reveal
              ? answers.filter((a) => a.optionId === o.id).length
              : null,
          })),
        },
        answered: answers.length,
        correct: reveal ? answers.filter((a) => a.isCorrect).length : null,
        players,
        teams: teamTotals(players),
      };
    }),

  /** Teacher: lobby → first question. */
  start: teacherProcedure
    .input(z.object({ gameId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const game = await hostGame(ctx.db, input.gameId, ctx.teacherId);
      if (game.status !== "LOBBY") return { ok: true };
      await ctx.db.liveGame.update({
        where: { id: game.id },
        data: {
          status: "QUESTION",
          currentIndex: 0,
          questionStartedAt: new Date(),
        },
      });
      return { ok: true };
    }),

  /** Teacher: time's up (or everyone answered) — show the right answer. */
  reveal: teacherProcedure
    .input(z.object({ gameId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const game = await hostGame(ctx.db, input.gameId, ctx.teacherId);
      if (game.status === "QUESTION") {
        await ctx.db.liveGame.update({
          where: { id: game.id },
          data: { status: "REVEAL" },
        });
      }
      return { ok: true };
    }),

  /** Teacher: the next question, or the final results after the last one. */
  next: teacherProcedure
    .input(z.object({ gameId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const game = await hostGame(ctx.db, input.gameId, ctx.teacherId);
      if (game.status !== "REVEAL") return { ok: true };
      const last = game.currentIndex + 1 >= game.questionIds.length;
      await ctx.db.liveGame.update({
        where: { id: game.id },
        data: last
          ? { status: "FINISHED", finishedAt: new Date() }
          : {
              status: "QUESTION",
              currentIndex: game.currentIndex + 1,
              questionStartedAt: new Date(),
            },
      });
      return { ok: true };
    }),

  /** Teacher: ends the game early. */
  end: teacherProcedure
    .input(z.object({ gameId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const game = await hostGame(ctx.db, input.gameId, ctx.teacherId);
      if (game.status !== "FINISHED") {
        await ctx.db.liveGame.update({
          where: { id: game.id },
          data: { status: "FINISHED", finishedAt: new Date() },
        });
      }
      return { ok: true };
    }),

  /** Student: the live quiz running for one of their classes, if any. */
  mine: studentProcedure.query(async ({ ctx }) => {
    const game = await ctx.db.liveGame.findFirst({
      where: {
        status: { not: "FINISHED" },
        createdAt: { gte: new Date(Date.now() - ACTIVE_FOR_MS) },
        section: {
          enrollments: { some: { studentId: ctx.studentId, status: "ACTIVE" } },
        },
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        status: true,
        section: { select: { code: true, course: { select: { name: true } } } },
        players: { where: { studentId: ctx.studentId }, select: { id: true } },
      },
    });
    return game
      ? {
          gameId: game.id,
          status: game.status,
          title: `${game.section.course.name} — ${game.section.code}`,
          joined: game.players.length > 0,
        }
      : null;
  }),

  /** Student: joins the game (team mode balances the teams). */
  join: studentProcedure
    .input(z.object({ gameId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const game = await ctx.db.liveGame.findUnique({
        where: { id: input.gameId },
        select: {
          id: true,
          status: true,
          teamMode: true,
          section: {
            select: {
              enrollments: {
                where: { studentId: ctx.studentId, status: "ACTIVE" },
                select: { id: true },
              },
            },
          },
        },
      });
      if (!game || game.section.enrollments.length === 0) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This live quiz is for another class.",
        });
      }
      if (game.status === "FINISHED") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This live quiz has ended.",
        });
      }
      const existing = await ctx.db.livePlayer.findUnique({
        where: {
          gameId_studentId: { gameId: game.id, studentId: ctx.studentId },
        },
        select: { id: true },
      });
      if (existing) return { ok: true };
      let team: number | null = null;
      if (game.teamMode) {
        const [a, b] = await Promise.all([
          ctx.db.livePlayer.count({ where: { gameId: game.id, team: 0 } }),
          ctx.db.livePlayer.count({ where: { gameId: game.id, team: 1 } }),
        ]);
        team = a <= b ? 0 : 1;
      }
      await ctx.db.livePlayer.upsert({
        where: {
          gameId_studentId: { gameId: game.id, studentId: ctx.studentId },
        },
        create: { gameId: game.id, studentId: ctx.studentId, team },
        update: {},
      });
      return { ok: true };
    }),

  /** Student: what their screen shows — never the answer before the reveal. */
  playerState: studentProcedure
    .input(z.object({ gameId: z.string() }))
    .query(async ({ ctx, input }) => {
      const game = await ctx.db.liveGame.findUnique({
        where: { id: input.gameId },
        select: {
          id: true,
          status: true,
          questionIds: true,
          currentIndex: true,
          questionStartedAt: true,
          secondsPerQuestion: true,
          teamMode: true,
          section: {
            select: { code: true, course: { select: { name: true } } },
          },
        },
      });
      if (!game) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This live quiz no longer exists.",
        });
      }
      const players = await standings(ctx.db, game.id);
      const me = players.find((p) => p.studentId === ctx.studentId) ?? null;
      const questionId = game.questionIds[game.currentIndex];
      const [question] = questionId
        ? await questionsOf(ctx.db, [questionId])
        : [];
      const myAnswer =
        me && questionId
          ? await ctx.db.liveAnswer.findUnique({
              where: {
                playerId_questionId: { playerId: me.playerId, questionId },
              },
              select: { optionId: true, isCorrect: true, points: true },
            })
          : null;
      const reveal = game.status === "REVEAL" || game.status === "FINISHED";
      return {
        status: game.status,
        title: `${game.section.course.name} — ${game.section.code}`,
        teamMode: game.teamMode,
        index: game.currentIndex,
        total: game.questionIds.length,
        secondsPerQuestion: game.secondsPerQuestion,
        remainingMs: remainingMs(game),
        question: question
          ? {
              prompt: question.prompt,
              options: question.options.map((o) => ({
                id: o.id,
                label: o.label,
                text: o.text,
                isCorrect: reveal ? o.isCorrect : null,
              })),
            }
          : null,
        answer: myAnswer
          ? {
              optionId: myAnswer.optionId,
              isCorrect: reveal ? myAnswer.isCorrect : null,
              points: reveal ? myAnswer.points : null,
            }
          : null,
        me: me && {
          score: me.score,
          rank: me.rank,
          team: me.team,
        },
        playerCount: players.length,
        teams: teamTotals(players),
        podium: game.status === "FINISHED" ? players.slice(0, 3) : [],
      };
    }),

  /** Student: locks in an answer to the current question. */
  answer: studentProcedure
    .input(z.object({ gameId: z.string(), optionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const game = await ctx.db.liveGame.findUnique({
        where: { id: input.gameId },
        select: {
          id: true,
          status: true,
          questionIds: true,
          currentIndex: true,
          questionStartedAt: true,
          secondsPerQuestion: true,
        },
      });
      const questionId = game?.questionIds[game.currentIndex];
      if (game?.status !== "QUESTION" || !questionId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Time's up for this question.",
        });
      }
      const limitMs = game.secondsPerQuestion * 1000;
      const elapsedMs = Date.now() - (game.questionStartedAt?.getTime() ?? 0);
      if (elapsedMs > limitMs + GRACE_MS) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Time's up for this question.",
        });
      }
      const [player, option] = await Promise.all([
        ctx.db.livePlayer.findUnique({
          where: {
            gameId_studentId: { gameId: game.id, studentId: ctx.studentId },
          },
          select: { id: true },
        }),
        ctx.db.questionOption.findFirst({
          where: { id: input.optionId, questionId },
          select: { id: true, isCorrect: true },
        }),
      ]);
      if (!player) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Join the live quiz first.",
        });
      }
      if (!option) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "That choice isn't part of this question.",
        });
      }
      const points = option.isCorrect ? pointsFor(elapsedMs, limitMs) : 0;
      try {
        await ctx.db.$transaction([
          ctx.db.liveAnswer.create({
            data: {
              gameId: game.id,
              playerId: player.id,
              questionId,
              optionId: option.id,
              isCorrect: option.isCorrect,
              points,
            },
          }),
          ctx.db.livePlayer.update({
            where: { id: player.id },
            data: { score: { increment: points } },
          }),
        ]);
      } catch {
        // Already answered (double tap): the first answer stands.
      }
      return { ok: true };
    }),
});
