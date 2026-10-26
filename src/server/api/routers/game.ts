import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { CALL_LEVELS, scoreCall } from "~/lib/games/call-sim";
import { CODE_LEVELS, codeStars } from "~/lib/games/code-quest";
import { questStars, replay } from "~/lib/games/quest";
import { createTRPCRouter, studentProcedure } from "~/server/api/trpc";
import type { PrismaClient } from "../../../../generated/prisma";

/**
 * Course games. Code Quest belongs to Computer Programming and Call
 * Simulator to Telecommunications; each is open only to students enrolled
 * in a class of that course. Levels unlock one after another, and the best
 * stars on each level count toward the leaderboard.
 */
type Game = "code" | "call";
/** Progress rows also use "quest" (Momo's Quest, one level per unit quiz). */
type SavedGame = Game | "quest";

const GAMES = {
  code: {
    title: "Code Quest",
    course: "Computer Programming",
    codeSuffix: "-CP",
    levels: CODE_LEVELS,
  },
  call: {
    title: "Call Simulator",
    course: "Telecommunications",
    codeSuffix: "-TEL",
    levels: CALL_LEVELS,
  },
} as const;

/** The games this student can play, from the courses they're enrolled in. */
async function gamesFor(db: PrismaClient, studentId: string) {
  const enrollments = await db.enrollment.findMany({
    where: { studentId, status: "ACTIVE" },
    select: { section: { select: { course: { select: { code: true } } } } },
  });
  const codes = enrollments.map((e) => e.section.course.code);
  return (Object.keys(GAMES) as Game[]).filter((game) =>
    codes.some((code) => code.endsWith(GAMES[game].codeSuffix)),
  );
}

/** Best stars per level of one game. */
async function progressOf(db: PrismaClient, studentId: string, game: Game) {
  const rows = await db.gameProgress.findMany({
    where: { studentId, game },
    select: { levelId: true, stars: true, score: true },
  });
  return new Map(rows.map((r) => [r.levelId, r]));
}

/** A level is open when it's the first one or the one before has a star. */
function isUnlocked(
  game: Game,
  levelId: string,
  done: Map<string, { stars: number }>,
) {
  const levels = GAMES[game].levels;
  const index = levels.findIndex((l) => l.id === levelId);
  if (index < 0) return false;
  return index === 0 || (done.get(levels[index - 1]!.id)?.stars ?? 0) > 0;
}

async function assertPlayable(
  db: PrismaClient,
  studentId: string,
  game: Game,
  levelId: string,
) {
  if (!(await gamesFor(db, studentId)).includes(game)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: `${GAMES[game].title} is for students of ${GAMES[game].course}.`,
    });
  }
  const done = await progressOf(db, studentId, game);
  if (!isUnlocked(game, levelId, done)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Finish the level before this one first.",
    });
  }
  return done;
}

/** Saves a result, keeping the best stars (and best score) per level. */
async function saveBest(
  db: PrismaClient,
  studentId: string,
  game: SavedGame,
  levelId: string,
  stars: number,
  score: number,
) {
  const before = await db.gameProgress.findUnique({
    where: { studentId_levelId: { studentId, levelId } },
    select: { stars: true, score: true },
  });
  if (!before) {
    await db.gameProgress.create({
      data: { studentId, game, levelId, stars, score },
    });
  } else if (stars > before.stars || score > before.score) {
    await db.gameProgress.update({
      where: { studentId_levelId: { studentId, levelId } },
      data: {
        stars: Math.max(stars, before.stars),
        score: Math.max(score, before.score),
      },
    });
  }
  return {
    best: Math.max(stars, before?.stars ?? 0),
    newStars: Math.max(0, stars - (before?.stars ?? 0)),
  };
}

export const gameRouter = createTRPCRouter({
  /** The student's games, each with its levels, stars and locks. */
  hub: studentProcedure.query(async ({ ctx }) => {
    const games = await gamesFor(ctx.db, ctx.studentId);
    return Promise.all(
      games.map(async (game) => {
        const done = await progressOf(ctx.db, ctx.studentId, game);
        const levels = GAMES[game].levels.map((level) => ({
          id: level.id,
          unit: level.unit,
          unitTitle: level.unitTitle,
          title: level.title,
          stars: done.get(level.id)?.stars ?? null,
          unlocked: isUnlocked(game, level.id, done),
        }));
        return {
          game,
          title: GAMES[game].title,
          course: GAMES[game].course,
          stars: levels.reduce((sum, l) => sum + (l.stars ?? 0), 0),
          maxStars: levels.length * 3,
          cleared: levels.filter((l) => (l.stars ?? 0) > 0).length,
          levels,
        };
      }),
    );
  }),

  /** Whether the student may play a level, and their best so far. */
  level: studentProcedure
    .input(z.object({ game: z.enum(["code", "call"]), levelId: z.string() }))
    .query(async ({ ctx, input }) => {
      const done = await assertPlayable(
        ctx.db,
        ctx.studentId,
        input.game,
        input.levelId,
      );
      const levels = GAMES[input.game].levels;
      const index = levels.findIndex((l) => l.id === input.levelId);
      return {
        best: done.get(input.levelId)?.stars ?? 0,
        number: index + 1,
        count: levels.length,
        nextId: levels[index + 1]?.id ?? null,
      };
    }),

  /** Code Quest: a level's checks all passed in the preview. */
  finishCode: studentProcedure
    .input(
      z.object({
        levelId: z.string(),
        usedHint: z.boolean(),
        sawSolution: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await assertPlayable(ctx.db, ctx.studentId, "code", input.levelId);
      const stars = codeStars(input.usedHint, input.sawSolution);
      const saved = await saveBest(
        ctx.db,
        ctx.studentId,
        "code",
        input.levelId,
        stars,
        stars,
      );
      return { stars, ...saved };
    }),

  /** Call Simulator: scores the replies picked at each step of the call. */
  finishCall: studentProcedure
    .input(
      z.object({
        levelId: z.string(),
        choices: z.array(z.number().int().min(0).max(5)).max(12),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await assertPlayable(ctx.db, ctx.studentId, "call", input.levelId);
      const level = CALL_LEVELS.find((l) => l.id === input.levelId)!;
      if (input.choices.length !== level.steps.length) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Finish every step of the call.",
        });
      }
      const result = scoreCall(level, input.choices);
      const saved =
        result.stars > 0
          ? await saveBest(
              ctx.db,
              ctx.studentId,
              "call",
              input.levelId,
              result.stars,
              result.percent,
            )
          : { best: 0, newStars: 0 };
      return { ...result, ...saved };
    }),

  /** Momo's Quest: the unit quizzes of the student's classes, with best stars. */
  questUnits: studentProcedure.query(async ({ ctx }) => {
    const quizzes = await ctx.db.assessment.findMany({
      where: {
        assignmentId: null,
        unitId: { not: null },
        publishedAt: { not: null },
        section: {
          term: { isCurrent: true },
          enrollments: { some: { studentId: ctx.studentId, status: "ACTIVE" } },
        },
      },
      orderBy: [
        { section: { course: { name: "asc" } } },
        { unit: { order: "asc" } },
      ],
      select: {
        id: true,
        section: { select: { code: true, course: { select: { name: true } } } },
        unit: { select: { order: true, title: true } },
        _count: { select: { questions: true } },
      },
    });
    const best = await ctx.db.gameProgress.findMany({
      where: { studentId: ctx.studentId, game: "quest" },
      select: { levelId: true, stars: true },
    });
    const stars = new Map(best.map((b) => [b.levelId, b.stars]));
    return quizzes
      .filter((q) => q._count.questions > 0)
      .map((q) => ({
        assessmentId: q.id,
        className: `${q.section.course.name} — ${q.section.code}`,
        unit: q.unit!.order,
        unitTitle: q.unit!.title,
        questions: q._count.questions,
        stars: stars.get(q.id) ?? 0,
      }));
  }),

  /** Momo's Quest: a unit's questions, shuffled, without the answers. */
  questQuestions: studentProcedure
    .input(z.object({ assessmentId: z.string() }))
    .query(async ({ ctx, input }) => {
      const quiz = await questQuiz(ctx.db, ctx.studentId, input.assessmentId);
      const questions = await ctx.db.question.findMany({
        where: {
          type: "MULTIPLE_CHOICE",
          options: { some: { isCorrect: true } },
          assessment: {
            sectionId: quiz.sectionId,
            OR: [{ id: quiz.id }, { bankForUnitId: quiz.unitId }],
          },
        },
        select: {
          id: true,
          prompt: true,
          options: {
            orderBy: { order: "asc" },
            select: { id: true, label: true, text: true },
          },
        },
      });
      for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j]!, questions[i]!];
      }
      return {
        // Unit titles may already start with "Unit 3: …".
        title: /^unit\s+\d/i.test(quiz.unitTitle)
          ? quiz.unitTitle
          : `Unit ${quiz.unitOrder}: ${quiz.unitTitle}`,
        className: quiz.className,
        best: quiz.best,
        questions,
      };
    }),

  /** Momo's Quest: checks one answer and gives the rationale. */
  questAnswer: studentProcedure
    .input(
      z.object({
        assessmentId: z.string(),
        questionId: z.string(),
        optionId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const quiz = await questQuiz(ctx.db, ctx.studentId, input.assessmentId);
      const question = await questionOf(ctx.db, quiz, input.questionId);
      const right = question.options.find((o) => o.isCorrect);
      return {
        correct: right?.id === input.optionId,
        correctOptionId: right?.id ?? null,
        explanation: question.explanation,
      };
    }),

  /** Momo's Quest: replays the answers, and saves the stars of a win. */
  questFinish: studentProcedure
    .input(
      z.object({
        assessmentId: z.string(),
        answers: z
          .array(z.object({ questionId: z.string(), optionId: z.string() }))
          .max(200),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const quiz = await questQuiz(ctx.db, ctx.studentId, input.assessmentId);
      const ids = [...new Set(input.answers.map((a) => a.questionId))];
      const questions = await ctx.db.question.findMany({
        where: {
          id: { in: ids },
          assessment: {
            sectionId: quiz.sectionId,
            OR: [{ id: quiz.id }, { bankForUnitId: quiz.unitId }],
          },
        },
        select: {
          id: true,
          options: { where: { isCorrect: true }, select: { id: true } },
        },
      });
      const correctOf = new Map(questions.map((q) => [q.id, q.options[0]?.id]));
      const state = replay(
        input.answers.map((a) => correctOf.get(a.questionId) === a.optionId),
      );
      const stars = questStars(state);
      const saved =
        stars > 0
          ? await saveBest(
              ctx.db,
              ctx.studentId,
              "quest",
              quiz.id,
              stars,
              state.lives,
            )
          : { best: quiz.best, newStars: 0 };
      return {
        won: state.won,
        dead: state.dead,
        stars,
        wrong: state.wrong,
        ...saved,
      };
    }),
});

/** A unit quiz the student can quest on (enrolled, published). */
async function questQuiz(
  db: PrismaClient,
  studentId: string,
  assessmentId: string,
) {
  const quiz = await db.assessment.findFirst({
    where: {
      id: assessmentId,
      assignmentId: null,
      unitId: { not: null },
      publishedAt: { not: null },
      section: { enrollments: { some: { studentId, status: "ACTIVE" } } },
    },
    select: {
      id: true,
      sectionId: true,
      unitId: true,
      unit: { select: { order: true, title: true } },
      section: { select: { code: true, course: { select: { name: true } } } },
    },
  });
  if (!quiz?.unitId || !quiz.unit) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "That quest is not in your classes.",
    });
  }
  const best = await db.gameProgress.findUnique({
    where: { studentId_levelId: { studentId, levelId: quiz.id } },
    select: { stars: true },
  });
  return {
    id: quiz.id,
    sectionId: quiz.sectionId,
    unitId: quiz.unitId,
    unitOrder: quiz.unit.order,
    unitTitle: quiz.unit.title,
    className: `${quiz.section.course.name} — ${quiz.section.code}`,
    best: best?.stars ?? 0,
  };
}

async function questionOf(
  db: PrismaClient,
  quiz: { id: string; sectionId: string; unitId: string },
  questionId: string,
) {
  const question = await db.question.findFirst({
    where: {
      id: questionId,
      assessment: {
        sectionId: quiz.sectionId,
        OR: [{ id: quiz.id }, { bankForUnitId: quiz.unitId }],
      },
    },
    select: {
      explanation: true,
      options: { select: { id: true, isCorrect: true } },
    },
  });
  if (!question) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Question not found." });
  }
  return question;
}
