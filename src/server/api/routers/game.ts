import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { BUG_LEVELS, scoreBugs } from "~/lib/games/bug-hunt";
import { CALL_LEVELS, scoreCall } from "~/lib/games/call-sim";
import {
  GAME_IDS,
  GAMES,
  gamesForCourse,
  type GameId,
} from "~/lib/games/catalog";
import { codeStars } from "~/lib/games/code-quest";
import { GRAMMAR_LEVELS, scoreGrammar } from "~/lib/games/grammar-hunt";
import { LAB_LEVELS } from "~/lib/games/lab-sorter";
import { MATH_LEVELS, MATH_PROBLEMS, scoreMath } from "~/lib/games/number-rush";
import {
  BOSS,
  BOSS_UNLOCK_WINS,
  QUEST,
  questStars,
  replay,
} from "~/lib/games/quest";
import { SALITA_LEVELS } from "~/lib/games/salita-sprint";
import { scoreSort } from "~/lib/games/sort";
import { scoreSpeed } from "~/lib/games/speed";
import { scoreTama, TAMA_LEVELS } from "~/lib/games/tama-o-mali";
import { SPRINT_LEVELS } from "~/lib/games/tag-sprint";
import { TICKET_LEVELS } from "~/lib/games/ticket-rush";
import { TOOL_LEVELS } from "~/lib/games/tool-shed";
import { createTRPCRouter, studentProcedure } from "~/server/api/trpc";
import type { PrismaClient } from "../../../../generated/prisma";

/**
 * Course games, one or more for every subject (see ~/lib/games/catalog).
 * Each is open only to students enrolled in a class of its course. Levels
 * unlock one after another, and the best stars on each level count toward
 * the leaderboard.
 */
type Game = GameId;
/** Progress rows also use "quest" (Momo's Quest, one level per unit quiz). */
type SavedGame = Game | "quest" | "boss";

const gameInput = z.enum(GAME_IDS);
/** The games on each shared engine, and where their levels live. */
const SORT_GAMES = {
  ticket: TICKET_LEVELS,
  lab: LAB_LEVELS,
  tools: TOOL_LEVELS,
};
const SPEED_GAMES = { sprint: SPRINT_LEVELS, salita: SALITA_LEVELS };

/** The games this student can play, from the courses they're enrolled in. */
async function gamesFor(db: PrismaClient, studentId: string) {
  const enrollments = await db.enrollment.findMany({
    where: { studentId, status: "ACTIVE" },
    select: { section: { select: { course: { select: { code: true } } } } },
  });
  const games = new Set(
    enrollments.flatMap((e) => gamesForCourse(e.section.course.code)),
  );
  return GAME_IDS.filter((game) => games.has(game));
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

const elementInput = z.enum(["water", "fire", "air", "earth"]);

/** Where a battle happens: one unit's quest, or a class's Boss Level. */
const arenaInput = z.object({
  kind: z.enum(["unit", "boss"]),
  id: z.string(),
});

export const bossLevelId = (sectionId: string) => `boss-${sectionId}`;

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
    .input(z.object({ game: gameInput, levelId: z.string() }))
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

  /** Bug Hunt: every line tapped and, per bug, the fixes picked. */
  finishBug: studentProcedure
    .input(
      z.object({
        levelId: z.string(),
        taps: z.array(z.number().int().min(0)).max(60),
        picks: z.array(z.array(z.number().int().min(0).max(2)).max(3)).max(6),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await assertPlayable(ctx.db, ctx.studentId, "bug", input.levelId);
      const level = BUG_LEVELS.find((l) => l.id === input.levelId)!;
      const result = scoreBugs(level, input.taps, input.picks);
      if (!result) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Fix every bug first.",
        });
      }
      const saved = await saveBest(
        ctx.db,
        ctx.studentId,
        "bug",
        input.levelId,
        result.stars,
        Math.max(0, 10 - result.mistakes),
      );
      return { ...result, ...saved };
    }),

  /** Speed rounds (Tag Sprint, Salita Sprint): every answer tapped. */
  finishSpeed: studentProcedure
    .input(
      z.object({
        game: z.enum(["sprint", "salita"]),
        levelId: z.string(),
        answers: z
          .array(z.object({ id: z.string(), choice: z.string() }))
          .max(120),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await assertPlayable(ctx.db, ctx.studentId, input.game, input.levelId);
      const level = SPEED_GAMES[input.game].find(
        (l) => l.id === input.levelId,
      )!;
      const result = scoreSpeed(level, input.answers);
      const saved =
        result.stars > 0
          ? await saveBest(
              ctx.db,
              ctx.studentId,
              input.game,
              input.levelId,
              result.stars,
              result.net,
            )
          : { best: 0, newStars: 0 };
      return { ...result, ...saved };
    }),

  /**
   * Sorting rounds (Ticket Rush, Lab Sorter, Tool Shed): the bin picked
   * for every card (-1 when it ran out).
   */
  finishSort: studentProcedure
    .input(
      z.object({
        game: z.enum(["ticket", "lab", "tools"]),
        levelId: z.string(),
        answers: z
          .array(z.object({ id: z.string(), bin: z.number().int().min(-1) }))
          .max(40),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await assertPlayable(ctx.db, ctx.studentId, input.game, input.levelId);
      const level = SORT_GAMES[input.game].find((l) => l.id === input.levelId)!;
      const result = scoreSort(level, input.answers);
      if (!result) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Finish the whole round first.",
        });
      }
      const saved =
        result.stars > 0
          ? await saveBest(
              ctx.db,
              ctx.studentId,
              input.game,
              input.levelId,
              result.stars,
              result.percent,
            )
          : { best: 0, newStars: 0 };
      return { ...result, ...saved };
    }),

  /** Number Rush: the balloon popped for each problem's seed. */
  finishMath: studentProcedure
    .input(
      z.object({
        levelId: z.string(),
        answers: z
          .array(
            z.object({
              seed: z.number().int().min(0).max(2_000_000_000),
              choice: z.string().max(60),
            }),
          )
          .length(MATH_PROBLEMS),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await assertPlayable(ctx.db, ctx.studentId, "math", input.levelId);
      const level = MATH_LEVELS.find((l) => l.id === input.levelId)!;
      const result = scoreMath(level, input.answers);
      if (!result) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Answer all the problems first.",
        });
      }
      const saved =
        result.stars > 0
          ? await saveBest(
              ctx.db,
              ctx.studentId,
              "math",
              input.levelId,
              result.stars,
              result.right,
            )
          : { best: 0, newStars: 0 };
      return { ...result, ...saved };
    }),

  /** Tama o Mali: Tama or Mali for every card. */
  finishTama: studentProcedure
    .input(
      z.object({
        levelId: z.string(),
        answers: z
          .array(z.object({ id: z.string(), tama: z.boolean() }))
          .max(20),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await assertPlayable(ctx.db, ctx.studentId, "tama", input.levelId);
      const level = TAMA_LEVELS.find((l) => l.id === input.levelId)!;
      const result = scoreTama(level, input.answers);
      if (!result) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Answer every card first.",
        });
      }
      const saved =
        result.stars > 0
          ? await saveBest(
              ctx.db,
              ctx.studentId,
              "tama",
              input.levelId,
              result.stars,
              result.right,
            )
          : { best: 0, newStars: 0 };
      return { ...result, ...saved };
    }),

  /** Grammar Hunt: per sentence, every word tapped and the fixes picked. */
  finishGrammar: studentProcedure
    .input(
      z.object({
        levelId: z.string(),
        taps: z.array(z.array(z.number().int().min(0)).max(30)).max(10),
        picks: z.array(z.array(z.number().int().min(0).max(2)).max(3)).max(10),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await assertPlayable(ctx.db, ctx.studentId, "grammar", input.levelId);
      const level = GRAMMAR_LEVELS.find((l) => l.id === input.levelId)!;
      const result = scoreGrammar(level, input.taps, input.picks);
      if (!result) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Fix every sentence first.",
        });
      }
      const saved = await saveBest(
        ctx.db,
        ctx.studentId,
        "grammar",
        input.levelId,
        result.stars,
        Math.max(0, 10 - result.mistakes),
      );
      return { ...result, ...saved };
    }),

  /**
   * Momo's Quest: the unit quests of the student's classes with best
   * stars, and each class's Boss Level with how close it is to unlocking.
   */
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
        sectionId: true,
        section: { select: { code: true, course: { select: { name: true } } } },
        unit: { select: { order: true, title: true } },
        _count: { select: { questions: true } },
      },
    });
    const best = await ctx.db.gameProgress.findMany({
      where: { studentId: ctx.studentId, game: { in: ["quest", "boss"] } },
      select: { levelId: true, stars: true },
    });
    const stars = new Map(best.map((b) => [b.levelId, b.stars]));
    const units = quizzes
      .filter((q) => q._count.questions > 0)
      .map((q) => ({
        assessmentId: q.id,
        sectionId: q.sectionId,
        className: `${q.section.course.name} — ${q.section.code}`,
        unit: q.unit!.order,
        unitTitle: q.unit!.title,
        questions: q._count.questions,
        stars: stars.get(q.id) ?? 0,
      }));
    const sections = [...new Set(units.map((u) => u.sectionId))];
    const bosses = sections.map((sectionId) => {
      const mine = units.filter((u) => u.sectionId === sectionId);
      const needed = Math.min(BOSS_UNLOCK_WINS, mine.length);
      const wins = mine.filter((u) => u.stars > 0).length;
      return {
        sectionId,
        className: mine[0]!.className,
        questions: mine.reduce((sum, u) => sum + u.questions, 0),
        wins,
        needed,
        unlocked: wins >= needed,
        stars: stars.get(bossLevelId(sectionId)) ?? 0,
      };
    });
    return { units, bosses };
  }),

  /** Momo's Quest: a battle's questions, shuffled, without the answers. */
  questQuestions: studentProcedure
    .input(z.object({ arena: arenaInput }))
    .query(async ({ ctx, input }) => {
      const arena = await arenaOf(ctx.db, ctx.studentId, input.arena);
      const questions = await ctx.db.question.findMany({
        where: {
          type: "MULTIPLE_CHOICE",
          options: { some: { isCorrect: true } },
          assessment: arena.questionsIn,
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
        mode: input.arena.kind,
        title: arena.title,
        className: arena.className,
        best: arena.best,
        questions,
      };
    }),

  /** Momo's Quest: checks one answer and gives the rationale. */
  questAnswer: studentProcedure
    .input(
      z.object({
        arena: arenaInput,
        questionId: z.string(),
        // Empty when the timer ran out.
        optionId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const arena = await arenaOf(ctx.db, ctx.studentId, input.arena);
      const question = await ctx.db.question.findFirst({
        where: { id: input.questionId, assessment: arena.questionsIn },
        select: {
          explanation: true,
          options: { select: { id: true, isCorrect: true } },
        },
      });
      if (!question) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Question not found.",
        });
      }
      const right = question.options.find((o) => o.isCorrect);
      const correct = !!input.optionId && right?.id === input.optionId;
      // One star per question, once — shared with Unit Questions and Live Quiz.
      let newStar = false;
      if (correct) {
        const [earlier, live, quest] = await Promise.all([
          ctx.db.questionResponse.count({
            where: {
              questionId: input.questionId,
              isCorrect: true,
              attempt: { studentId: ctx.studentId },
            },
          }),
          ctx.db.liveAnswer.count({
            where: {
              questionId: input.questionId,
              isCorrect: true,
              player: { studentId: ctx.studentId },
            },
          }),
          ctx.db.questAnswer.count({
            where: { questionId: input.questionId, studentId: ctx.studentId },
          }),
        ]);
        if (quest === 0) {
          await ctx.db.questAnswer.createMany({
            data: [{ studentId: ctx.studentId, questionId: input.questionId }],
            skipDuplicates: true,
          });
        }
        newStar = earlier + live + quest === 0;
      }
      return {
        correct,
        newStar,
        correctOptionId: right?.id ?? null,
        explanation: question.explanation,
      };
    }),

  /** Momo's Quest: replays the battle, and saves the stars of a win. */
  questFinish: studentProcedure
    .input(
      z.object({
        arena: arenaInput,
        // Every turn in order: answers, skill casts and heals.
        answers: z
          .array(
            z.discriminatedUnion("kind", [
              z.object({
                kind: z.literal("answer"),
                questionId: z.string(),
                optionId: z.string(),
                element: elementInput,
              }),
              z.object({ kind: z.literal("cast"), element: elementInput }),
              z.object({ kind: z.literal("heal") }),
            ]),
          )
          .max(400),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const arena = await arenaOf(ctx.db, ctx.studentId, input.arena);
      const ids = [
        ...new Set(
          input.answers.flatMap((a) =>
            a.kind === "answer" ? [a.questionId] : [],
          ),
        ),
      ];
      const questions = await ctx.db.question.findMany({
        where: { id: { in: ids }, assessment: arena.questionsIn },
        select: {
          id: true,
          options: { where: { isCorrect: true }, select: { id: true } },
        },
      });
      const correctOf = new Map(questions.map((q) => [q.id, q.options[0]?.id]));
      const state = replay(
        input.answers.map((a) =>
          a.kind === "answer"
            ? {
                kind: "answer" as const,
                correct:
                  !!a.optionId && correctOf.get(a.questionId) === a.optionId,
                element: a.element,
              }
            : a,
        ),
        arena.rules,
      );
      const stars = questStars(state, arena.rules);
      const saved =
        stars > 0
          ? await saveBest(
              ctx.db,
              ctx.studentId,
              input.arena.kind === "boss" ? "boss" : "quest",
              arena.levelId,
              stars,
              state.lives,
            )
          : { best: arena.best, newStars: 0 };
      return {
        won: state.won,
        dead: state.dead,
        stars,
        wrong: state.wrong,
        ...saved,
      };
    }),
});

/**
 * The battle's rules, title, progress key and question pool, checking the
 * student is in the class (and, for a Boss Level, has unlocked it).
 */
async function arenaOf(
  db: PrismaClient,
  studentId: string,
  arena: z.infer<typeof arenaInput>,
) {
  if (arena.kind === "unit") {
    const quiz = await db.assessment.findFirst({
      where: {
        id: arena.id,
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
      rules: QUEST,
      levelId: quiz.id,
      // Unit titles may already start with "Unit 3: …".
      title: /^unit\s+\d/i.test(quiz.unit.title)
        ? quiz.unit.title
        : `Unit ${quiz.unit.order}: ${quiz.unit.title}`,
      className: `${quiz.section.course.name} — ${quiz.section.code}`,
      best: best?.stars ?? 0,
      questionsIn: {
        sectionId: quiz.sectionId,
        OR: [{ id: quiz.id }, { bankForUnitId: quiz.unitId }],
      },
    };
  }

  const section = await db.section.findFirst({
    where: {
      id: arena.id,
      enrollments: { some: { studentId, status: "ACTIVE" } },
    },
    select: {
      id: true,
      code: true,
      course: { select: { name: true } },
      assessments: {
        where: {
          assignmentId: null,
          unitId: { not: null },
          publishedAt: { not: null },
        },
        select: { id: true },
      },
    },
  });
  if (!section || section.assessments.length === 0) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "That Boss Level is not in your classes.",
    });
  }
  const unitIds = section.assessments.map((a) => a.id);
  const [wins, best] = await Promise.all([
    db.gameProgress.count({
      where: {
        studentId,
        game: "quest",
        levelId: { in: unitIds },
        stars: { gt: 0 },
      },
    }),
    db.gameProgress.findUnique({
      where: {
        studentId_levelId: { studentId, levelId: bossLevelId(section.id) },
      },
      select: { stars: true },
    }),
  ]);
  const needed = Math.min(BOSS_UNLOCK_WINS, unitIds.length);
  if (wins < needed) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: `Win ${needed} unit quests in this class to unlock the Boss Level (${wins}/${needed}).`,
    });
  }
  return {
    rules: BOSS,
    levelId: bossLevelId(section.id),
    title: "Boss Level: The Shadow Dragon",
    className: `${section.course.name} — ${section.code}`,
    best: best?.stars ?? 0,
    // Every unit's questions, and the Live Quiz banks.
    questionsIn: {
      sectionId: section.id,
      assignmentId: null,
      OR: [
        { unitId: { not: null }, publishedAt: { not: null } },
        { bankForUnitId: { not: null } },
      ],
    },
  };
}
