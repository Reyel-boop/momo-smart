import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { CALL_LEVELS, scoreCall } from "~/lib/games/call-sim";
import { CODE_LEVELS, codeStars } from "~/lib/games/code-quest";
import { createTRPCRouter, studentProcedure } from "~/server/api/trpc";
import type { PrismaClient } from "../../../../generated/prisma";

/**
 * Course games. Code Quest belongs to Computer Programming and Call
 * Simulator to Telecommunications; each is open only to students enrolled
 * in a class of that course. Levels unlock one after another, and the best
 * stars on each level count toward the leaderboard.
 */
type Game = "code" | "call";

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
  game: Game,
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
});
