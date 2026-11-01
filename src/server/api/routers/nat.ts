import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  ownerProcedure,
  studentProcedure,
} from "~/server/api/trpc";
import type { PrismaClient } from "../../../../generated/prisma";

/**
 * CB-NAT Review: practice tests for Grade 10 students, with questions given
 * by the owner and shared by every school. A try runs like a unit's
 * questions in Courses: one question at a time, 2 minutes each, the
 * rationale after every answer, and the next question opens only when the
 * 2 minutes are up.
 */

const QUESTION_SECONDS = 120;
/** Network slack before an answer counts as late. */
const GRACE_SECONDS = 5;
const NAT_GRADE = 10;

export const NAT_SUBJECTS = [
  "ENGLISH",
  "FILIPINO",
  "MATH",
  "SCIENCE",
  "AP",
  "MIXED",
] as const;

const secondsLeft = (openedAt: Date) =>
  Math.max(
    0,
    QUESTION_SECONDS - Math.floor((Date.now() - openedAt.getTime()) / 1000),
  );

async function assertGrade10(db: PrismaClient, studentId: string) {
  const profile = await db.studentProfile.findUnique({
    where: { id: studentId },
    select: { gradeLevel: true },
  });
  if (profile?.gradeLevel !== NAT_GRADE) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "CB-NAT Review is for Grade 10 students.",
    });
  }
}

/** The student's running try, with what scoring needs. */
async function runningAttempt(
  db: PrismaClient,
  studentId: string,
  attemptId: string,
) {
  const attempt = await db.natAttempt.findFirst({
    where: { id: attemptId, studentId },
    select: {
      id: true,
      status: true,
      openedAt: true,
      nextQuestionAt: true,
      responses: { select: { questionId: true, isCorrect: true } },
      test: {
        select: {
          questions: {
            orderBy: { order: "asc" },
            select: {
              id: true,
              explanation: true,
              options: {
                orderBy: { order: "asc" },
                select: { id: true, label: true, text: true, isCorrect: true },
              },
            },
          },
        },
      },
    },
  });
  if (!attempt) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Try not found." });
  }
  if (attempt.status !== "IN_PROGRESS") {
    throw new TRPCError({
      code: "CONFLICT",
      message: "This try is already finished.",
    });
  }
  return attempt;
}

const questionInput = z.object({
  prompt: z.string().trim().min(1).max(4000),
  options: z.array(z.string().trim().min(1).max(1000)).min(2).max(6),
  /** 0-based index of the right option. */
  answer: z.number().int().min(0).max(5),
  explanation: z.string().trim().max(4000).optional(),
});

const LABELS = ["A", "B", "C", "D", "E", "F"];

export const natRouter = createTRPCRouter({
  /** The published tests, with the student's tries and best score. */
  tests: studentProcedure.query(async ({ ctx }) => {
    await assertGrade10(ctx.db, ctx.studentId);
    const tests = await ctx.db.natTest.findMany({
      where: { publishedAt: { not: null } },
      orderBy: [{ subject: "asc" }, { title: "asc" }],
      select: {
        id: true,
        subject: true,
        title: true,
        description: true,
        maxAttempts: true,
        _count: { select: { questions: true } },
        attempts: {
          where: { studentId: ctx.studentId },
          select: { status: true, score: true },
        },
      },
    });
    return tests.map(({ attempts, _count, ...test }) => {
      const graded = attempts.filter((a) => a.status === "GRADED");
      return {
        ...test,
        questionCount: _count.questions,
        triesUsed: attempts.length,
        running: attempts.some((a) => a.status === "IN_PROGRESS"),
        bestScore: graded.length
          ? Math.max(...graded.map((a) => a.score ?? 0))
          : null,
      };
    });
  }),

  /** One test for the focus-mode screen (the same shape as Unit Questions). */
  test: studentProcedure
    .input(z.object({ testId: z.string() }))
    .query(async ({ ctx, input }) => {
      await assertGrade10(ctx.db, ctx.studentId);
      const test = await ctx.db.natTest.findFirst({
        where: { id: input.testId, publishedAt: { not: null } },
        select: {
          id: true,
          subject: true,
          title: true,
          description: true,
          maxAttempts: true,
          questions: {
            orderBy: { order: "asc" },
            select: {
              id: true,
              order: true,
              prompt: true,
              explanation: true,
              options: {
                orderBy: { order: "asc" },
                select: { id: true, label: true, text: true, isCorrect: true },
              },
            },
          },
          attempts: {
            where: { studentId: ctx.studentId },
            orderBy: { attempt: "desc" },
            select: {
              id: true,
              attempt: true,
              status: true,
              score: true,
              openedAt: true,
              nextQuestionAt: true,
              focusLosses: true,
              responses: {
                select: { questionId: true, optionId: true, isCorrect: true },
              },
            },
          },
        },
      });
      if (!test) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Test not found." });
      }

      const { attempts, questions, ...rest } = test;
      const graded = attempts.filter((a) => a.status === "GRADED");
      const running = attempts.find((a) => a.status === "IN_PROGRESS") ?? null;

      let current = null;
      if (running) {
        const answered = new Set(running.responses.map((r) => r.questionId));
        const index = questions.findIndex((q) => !answered.has(q.id));
        const question = questions[index];
        if (question) {
          const openedAt = running.openedAt;
          current = {
            number: index + 1,
            // Shown only once opened, so the clock is running while it's read.
            question: openedAt
              ? {
                  id: question.id,
                  prompt: question.prompt,
                  options: question.options.map(({ isCorrect: _, ...o }) => o),
                }
              : null,
            secondsLeft: openedAt ? secondsLeft(openedAt) : QUESTION_SECONDS,
          };
        }
      }

      const latest = graded[0];
      return {
        ...rest,
        questionCount: questions.length,
        questionSeconds: QUESTION_SECONDS,
        totalPoints: questions.length,
        triesLeft: Math.max(0, test.maxAttempts - attempts.length),
        bestScore: graded.length
          ? Math.max(...graded.map((a) => a.score ?? 0))
          : null,
        running: running
          ? {
              id: running.id,
              attempt: running.attempt,
              answeredCount: running.responses.length,
              score: running.responses.filter((r) => r.isCorrect).length,
              focusLosses: running.focusLosses,
              current,
              nextOpensIn: running.nextQuestionAt
                ? Math.max(
                    0,
                    Math.ceil(
                      (running.nextQuestionAt.getTime() - Date.now()) / 1000,
                    ),
                  )
                : 0,
            }
          : null,
        latest: latest
          ? {
              attempt: latest.attempt,
              totalScore: latest.score,
              focusLosses: latest.focusLosses,
              responses: latest.responses.map((r) => ({
                questionId: r.questionId,
                selectedOptionIds: r.optionId ? [r.optionId] : [],
                isCorrect: r.isCorrect,
              })),
            }
          : null,
        // The review (with answers) only after a finished try.
        questions: graded.length > 0 ? questions : [],
      };
    }),

  /** Starts a try, or returns the one already running. */
  start: studentProcedure
    .input(z.object({ testId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await assertGrade10(ctx.db, ctx.studentId);
      const test = await ctx.db.natTest.findFirst({
        where: { id: input.testId, publishedAt: { not: null } },
        select: {
          id: true,
          maxAttempts: true,
          _count: { select: { questions: true } },
          attempts: {
            where: { studentId: ctx.studentId },
            select: { id: true, status: true },
          },
        },
      });
      if (!test) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Test not found." });
      }
      if (test._count.questions === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This test has no questions yet.",
        });
      }
      const running = test.attempts.find((a) => a.status === "IN_PROGRESS");
      if (running) return { attemptId: running.id };
      if (test.attempts.length >= test.maxAttempts) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You have used all your tries for this test.",
        });
      }
      const attempt = await ctx.db.natAttempt.create({
        data: {
          testId: test.id,
          studentId: ctx.studentId,
          attempt: test.attempts.length + 1,
        },
        select: { id: true },
      });
      return { attemptId: attempt.id };
    }),

  /**
   * Opens the next question and starts its clock — only once the answered
   * question's 2 minutes are up. Opening the open question again keeps its
   * start time, so reloading never resets the clock.
   */
  open: studentProcedure
    .input(z.object({ attemptId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const attempt = await runningAttempt(
        ctx.db,
        ctx.studentId,
        input.attemptId,
      );
      if (!attempt.openedAt) {
        const wait = attempt.nextQuestionAt
          ? attempt.nextQuestionAt.getTime() - Date.now()
          : 0;
        if (wait > 1000) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: `The next question opens in ${Math.ceil(wait / 1000)} seconds, when this question's 2 minutes are up.`,
          });
        }
        await ctx.db.natAttempt.update({
          where: { id: attempt.id },
          data: { openedAt: new Date(), nextQuestionAt: null },
        });
      }
      return { ok: true };
    }),

  /**
   * Records the answer to the open question (none when time ran out) and
   * returns the verdict, the right answer and the rationale. Answering the
   * last question finishes the try.
   */
  answer: studentProcedure
    .input(
      z.object({
        attemptId: z.string(),
        questionId: z.string(),
        optionId: z.string().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const attempt = await runningAttempt(
        ctx.db,
        ctx.studentId,
        input.attemptId,
      );
      const openedAt = attempt.openedAt;
      if (!openedAt) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Open the question before answering it.",
        });
      }
      const { questions } = attempt.test;
      const answered = new Set(attempt.responses.map((r) => r.questionId));
      const index = questions.findIndex((q) => !answered.has(q.id));
      const question = questions[index];
      if (question?.id !== input.questionId) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "That question has already been answered.",
        });
      }

      const now = new Date();
      const timedOut =
        now.getTime() - openedAt.getTime() >
        (QUESTION_SECONDS + GRACE_SECONDS) * 1000;
      const option =
        !timedOut && input.optionId
          ? question.options.find((o) => o.id === input.optionId)
          : undefined;
      if (input.optionId && !timedOut && !option) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "That answer does not belong to this question.",
        });
      }
      const isCorrect = option?.isCorrect ?? false;
      const finished = index === questions.length - 1;
      const score =
        attempt.responses.filter((r) => r.isCorrect).length +
        (isCorrect ? 1 : 0);

      await ctx.db.$transaction([
        ctx.db.natResponse.create({
          data: {
            attemptId: attempt.id,
            questionId: question.id,
            optionId: option?.id ?? null,
            isCorrect,
            answeredAt: now,
          },
        }),
        ctx.db.natAttempt.update({
          where: { id: attempt.id },
          data: finished
            ? {
                openedAt: null,
                nextQuestionAt: null,
                status: "GRADED",
                submittedAt: now,
                score,
              }
            : {
                openedAt: null,
                nextQuestionAt: new Date(
                  openedAt.getTime() + QUESTION_SECONDS * 1000,
                ),
              },
        }),
      ]);

      const correct = question.options.find((o) => o.isCorrect);
      return {
        isCorrect,
        timedOut: timedOut || !input.optionId,
        chosen: option ? { label: option.label, text: option.text } : null,
        correct: correct ? { label: correct.label, text: correct.text } : null,
        explanation: question.explanation,
        finished,
        score,
        totalPoints: questions.length,
      };
    }),

  /** Counts the student leaving the test screen. */
  focusLoss: studentProcedure
    .input(z.object({ attemptId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.natAttempt.updateMany({
        where: {
          id: input.attemptId,
          studentId: ctx.studentId,
          status: "IN_PROGRESS",
        },
        data: { focusLosses: { increment: 1 } },
      });
      return { ok: true };
    }),

  // --- Owner: the question sets ----------------------------------------------

  /** Every test, published or not, with its questions and how it's used. */
  adminList: ownerProcedure.query(async ({ ctx }) => {
    const tests = await ctx.db.natTest.findMany({
      orderBy: [{ subject: "asc" }, { title: "asc" }],
      select: {
        id: true,
        subject: true,
        title: true,
        description: true,
        maxAttempts: true,
        publishedAt: true,
        updatedAt: true,
        questions: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            order: true,
            prompt: true,
            explanation: true,
            options: {
              orderBy: { order: "asc" },
              select: { label: true, text: true, isCorrect: true },
            },
          },
        },
        _count: { select: { attempts: true } },
      },
    });
    const finished = await ctx.db.natAttempt.groupBy({
      by: ["testId"],
      where: { status: "GRADED" },
      _count: { _all: true },
      _avg: { score: true },
    });
    const stats = new Map(finished.map((f) => [f.testId, f]));
    return tests.map(({ _count, ...t }) => ({
      ...t,
      tries: _count.attempts,
      finished: stats.get(t.id)?._count._all ?? 0,
      averageScore: stats.get(t.id)?._avg.score ?? null,
    }));
  }),

  /**
   * Adds tests from the uploaded spreadsheet. A test with the same subject
   * and title has its questions replaced — unless students already took it,
   * so their results stay right.
   */
  importTests: ownerProcedure
    .input(
      z.object({
        tests: z
          .array(
            z.object({
              subject: z.enum(NAT_SUBJECTS),
              title: z.string().trim().min(1).max(160),
              questions: z.array(questionInput).min(1).max(200),
            }),
          )
          .min(1)
          .max(50),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      for (const t of input.tests) {
        t.questions.forEach((q, i) => {
          if (q.answer >= q.options.length) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: `${t.title}, question ${i + 1}: the answer is not one of its choices.`,
            });
          }
        });
      }
      const existing = await ctx.db.natTest.findMany({
        where: {
          OR: input.tests.map((t) => ({ subject: t.subject, title: t.title })),
        },
        select: {
          id: true,
          subject: true,
          title: true,
          _count: { select: { attempts: true } },
        },
      });
      const taken = existing.filter((t) => t._count.attempts > 0);
      if (taken.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: `Students already took ${taken.map((t) => `"${t.title}"`).join(", ")}. Give the new questions a different test title so their results stay right.`,
        });
      }

      let created = 0;
      let replaced = 0;
      let questionCount = 0;
      for (const t of input.tests) {
        const old = existing.find(
          (e) => e.subject === t.subject && e.title === t.title,
        );
        await ctx.db.$transaction(async (tx) => {
          let testId = old?.id;
          if (testId) {
            await tx.natQuestion.deleteMany({ where: { testId } });
            replaced++;
          } else {
            testId = (
              await tx.natTest.create({
                data: { subject: t.subject, title: t.title },
                select: { id: true },
              })
            ).id;
            created++;
          }
          for (const [i, q] of t.questions.entries()) {
            await tx.natQuestion.create({
              data: {
                testId,
                order: i + 1,
                prompt: q.prompt,
                explanation: q.explanation ?? null,
                options: {
                  create: q.options.map((text, k) => ({
                    order: k + 1,
                    label: LABELS[k]!,
                    text,
                    isCorrect: k === q.answer,
                  })),
                },
              },
            });
          }
          await tx.natTest.update({
            where: { id: testId },
            data: { updatedAt: new Date() },
          });
        });
        questionCount += t.questions.length;
      }
      return { created, replaced, questions: questionCount };
    }),

  /** Shows a test to Grade 10 students, or hides it. */
  setPublished: ownerProcedure
    .input(z.object({ testId: z.string(), published: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.natTest.update({
        where: { id: input.testId },
        data: { publishedAt: input.published ? new Date() : null },
      });
      return { ok: true };
    }),

  /** Changes how many tries each student gets. */
  setMaxAttempts: ownerProcedure
    .input(
      z.object({
        testId: z.string(),
        maxAttempts: z.number().int().min(1).max(10),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.natTest.update({
        where: { id: input.testId },
        data: { maxAttempts: input.maxAttempts },
      });
      return { ok: true };
    }),

  /** Deletes a test with its questions and every student's tries. */
  remove: ownerProcedure
    .input(z.object({ testId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.natTest.delete({ where: { id: input.testId } });
      return { ok: true };
    }),
});
