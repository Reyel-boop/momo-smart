import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  studentProcedure,
  teacherProcedure,
} from "~/server/api/trpc";
import {
  assertSectionAccess,
  assertTeachesSection,
} from "~/server/lib/permissions";
import { refreshEnrollmentGrade } from "~/server/lib/grading";
import type { PrismaClient } from "../../../../generated/prisma";

const assignmentTypes = [
  "LAB_REPORT",
  "ESSAY",
  "QUIZ",
  "EXAM",
  "DIAGRAM",
  "WORKSHEET",
  "PRACTICUM",
  "PROBLEM_SET",
  "DISCUSSION",
  "PROJECT",
] as const;

const submissionFormats = [
  "FILE_UPLOAD",
  "TEXT_ENTRY",
  "EXTERNAL_LINK",
  "ONLINE_ASSESSMENT",
  "ON_PAPER",
] as const;

/** The last word of a name, for sorting a class list by surname. */
const surname = (name: string) => name.trim().split(/\s+/).at(-1) ?? name;

export const assignmentRouter = createTRPCRouter({
  /** Assignments for a section, with per-student submission state for staff. */
  listForSection: protectedProcedure
    .input(
      z.object({
        sectionId: z.string(),
        includeUnpublished: z.boolean().default(false),
      }),
    )
    .query(async ({ ctx, input }) => {
      await assertSectionAccess(ctx.db, ctx.session.user, input.sectionId);
      const isStaff = ctx.session.user.role !== "STUDENT";

      return ctx.db.assignment.findMany({
        where: {
          sectionId: input.sectionId,
          ...(isStaff && input.includeUnpublished
            ? {}
            : { publishedAt: { not: null } }),
        },
        orderBy: { dueAt: "asc" },
        select: {
          id: true,
          title: true,
          description: true,
          type: true,
          format: true,
          pointsPossible: true,
          dueAt: true,
          closesAt: true,
          allowLate: true,
          graceMinutes: true,
          publishedAt: true,
          unit: { select: { id: true, title: true, order: true } },
          rubric: {
            select: { id: true, title: true, type: true, totalPoints: true },
          },
          category: { select: { id: true, name: true, weightPercent: true } },
          _count: {
            select: { submissions: { where: { submittedAt: { not: null } } } },
          },
          submissions: {
            where: { studentId: ctx.session.user.studentId ?? "" },
            orderBy: { attempt: "desc" },
            take: 1,
            select: {
              id: true,
              status: true,
              timeliness: true,
              submittedAt: true,
              grade: {
                select: {
                  score: true,
                  letter: true,
                  status: true,
                  releasedAt: true,
                },
              },
            },
          },
        },
      });
    }),

  /** Assignment detail including the full rubric breakdown. */
  get: protectedProcedure
    .input(z.object({ assignmentId: z.string() }))
    .query(async ({ ctx, input }) => {
      const assignment = await ctx.db.assignment.findUnique({
        where: { id: input.assignmentId },
        select: {
          id: true,
          sectionId: true,
          title: true,
          description: true,
          type: true,
          format: true,
          pointsPossible: true,
          dueAt: true,
          availableFrom: true,
          closesAt: true,
          allowLate: true,
          graceMinutes: true,
          publishedAt: true,
          _count: {
            select: { submissions: { where: { submittedAt: { not: null } } } },
          },
          section: {
            select: {
              id: true,
              code: true,
              period: true,
              course: { select: { id: true, name: true, code: true } },
            },
          },
          unit: { select: { id: true, title: true, order: true } },
          lesson: { select: { id: true, title: true } },
          rubric: {
            select: {
              id: true,
              title: true,
              description: true,
              type: true,
              totalPoints: true,
              criteria: {
                orderBy: { order: "asc" },
                select: {
                  id: true,
                  title: true,
                  description: true,
                  maxPoints: true,
                  levels: {
                    orderBy: { order: "asc" },
                    select: {
                      id: true,
                      label: true,
                      points: true,
                      description: true,
                    },
                  },
                },
              },
            },
          },
          assessment: {
            select: {
              id: true,
              title: true,
              timeLimitMinutes: true,
              totalPoints: true,
              maxAttempts: true,
            },
          },
        },
      });

      if (!assignment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Assignment not found.",
        });
      }
      await assertSectionAccess(ctx.db, ctx.session.user, assignment.sectionId);
      return assignment;
    }),

  /**
   * The student's "Due Soon" rail: published, still-open work in their active
   * sections that has not been submitted yet.
   */
  dueSoon: studentProcedure
    .input(
      z.object({ withinDays: z.number().int().min(1).max(60).default(14) }),
    )
    .query(async ({ ctx, input }) => {
      const horizon = new Date(
        Date.now() + input.withinDays * 24 * 60 * 60 * 1000,
      );

      const assignments = await ctx.db.assignment.findMany({
        where: {
          publishedAt: { not: null },
          dueAt: { lte: horizon },
          section: {
            enrollments: {
              some: { studentId: ctx.studentId, status: "ACTIVE" },
            },
          },
          NOT: {
            submissions: {
              some: {
                studentId: ctx.studentId,
                status: { in: ["SUBMITTED", "GRADED", "RETURNED", "EXCUSED"] },
              },
            },
          },
        },
        orderBy: { dueAt: "asc" },
        select: {
          id: true,
          title: true,
          type: true,
          format: true,
          pointsPossible: true,
          dueAt: true,
          allowLate: true,
          rubric: { select: { id: true, type: true } },
          section: {
            select: {
              id: true,
              code: true,
              course: { select: { name: true, code: true, colorToken: true } },
            },
          },
          submissions: {
            where: { studentId: ctx.studentId },
            select: { id: true, status: true },
            take: 1,
          },
        },
      });

      const now = Date.now();
      return assignments.map(({ submissions, ...assignment }) => ({
        ...assignment,
        draft: submissions[0] ?? null,
        isOverdue: assignment.dueAt.getTime() < now,
        hoursRemaining: Math.round(
          (assignment.dueAt.getTime() - now) / (60 * 60 * 1000),
        ),
      }));
    }),

  /**
   * The "My Assignments" page: every published assignment in the student's
   * active sections this term, with their latest submission, bucketed into
   * to-do / submitted / completed. Grades appear only once released.
   */
  mine: studentProcedure.query(async ({ ctx }) => {
    const assignments = await ctx.db.assignment.findMany({
      where: {
        publishedAt: { not: null },
        section: {
          term: { isCurrent: true },
          enrollments: {
            some: { studentId: ctx.studentId, status: "ACTIVE" },
          },
        },
      },
      orderBy: { dueAt: "asc" },
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        format: true,
        pointsPossible: true,
        dueAt: true,
        closesAt: true,
        allowLate: true,
        section: {
          select: {
            id: true,
            period: true,
            course: { select: { name: true, colorToken: true } },
            teacher: {
              select: { user: { select: { name: true, title: true } } },
            },
          },
        },
        rubric: {
          select: {
            id: true,
            title: true,
            totalPoints: true,
            criteria: {
              orderBy: { order: "asc" },
              select: {
                id: true,
                title: true,
                description: true,
                maxPoints: true,
              },
            },
          },
        },
        submissions: {
          where: { studentId: ctx.studentId },
          orderBy: { attempt: "desc" },
          take: 1,
          select: {
            id: true,
            status: true,
            timeliness: true,
            submittedAt: true,
            updatedAt: true,
            textBody: true,
            externalUrl: true,
            attachments: {
              select: {
                file: {
                  select: {
                    id: true,
                    url: true,
                    fileName: true,
                    sizeBytes: true,
                  },
                },
              },
            },
            grade: {
              select: {
                status: true,
                score: true,
                letter: true,
                feedback: true,
                releasedAt: true,
                grader: { select: { name: true, title: true } },
              },
            },
          },
        },
      },
    });

    return assignments.map(({ submissions, ...assignment }) => {
      const latest = submissions[0] ?? null;
      // Students only ever see a grade once the teacher has released it.
      const grade = latest?.grade?.status === "RELEASED" ? latest.grade : null;
      const bucket: "TODO" | "SUBMITTED" | "COMPLETED" =
        grade || latest?.status === "EXCUSED"
          ? "COMPLETED"
          : latest?.status === "SUBMITTED" || latest?.status === "GRADED"
            ? "SUBMITTED"
            : "TODO";

      return {
        ...assignment,
        submission: latest ? { ...latest, grade } : null,
        bucket,
      };
    });
  }),

  /**
   * The class roster split by who has handed in an assignment. Everyone
   * actively enrolled appears, including students with no submission at all.
   */
  submissionStatus: teacherProcedure
    .input(z.object({ assignmentId: z.string() }))
    .query(async ({ ctx, input }) => {
      const assignment = await ctx.db.assignment.findUnique({
        where: { id: input.assignmentId },
        select: {
          id: true,
          title: true,
          dueAt: true,
          pointsPossible: true,
          sectionId: true,
          section: {
            select: { code: true, course: { select: { name: true } } },
          },
        },
      });
      if (!assignment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Assignment not found.",
        });
      }
      await assertTeachesSection(
        ctx.db,
        ctx.session.user,
        assignment.sectionId,
      );

      const [roster, submissions] = await Promise.all([
        ctx.db.enrollment.findMany({
          where: { sectionId: assignment.sectionId, status: "ACTIVE" },
          select: {
            studentId: true,
            student: { select: { user: { select: { name: true } } } },
          },
        }),
        ctx.db.submission.findMany({
          where: { assignmentId: assignment.id },
          orderBy: { attempt: "asc" },
          select: {
            id: true,
            studentId: true,
            status: true,
            timeliness: true,
            submittedAt: true,
            grade: { select: { status: true, score: true } },
          },
        }),
      ]);

      // Ordered by attempt, so the newest attempt wins.
      const latest = new Map(submissions.map((s) => [s.studentId, s]));
      const people = roster
        .map((entry) => ({
          studentId: entry.studentId,
          name: entry.student.user.name ?? "Student",
          submission: latest.get(entry.studentId) ?? null,
        }))
        .sort((a, b) =>
          surname(a.name).localeCompare(surname(b.name), "en", {
            sensitivity: "base",
          }),
        );

      const handedIn = (status?: string) =>
        status === "SUBMITTED" || status === "RETURNED" || status === "GRADED";

      return {
        assignment: {
          id: assignment.id,
          title: assignment.title,
          dueAt: assignment.dueAt,
          pointsPossible: assignment.pointsPossible,
          sectionId: assignment.sectionId,
          classLabel: `${assignment.section.course.name} — ${assignment.section.code}`,
        },
        submitted: people.flatMap(({ studentId, name, submission }) =>
          submission && handedIn(submission.status)
            ? [
                {
                  studentId,
                  name,
                  submissionId: submission.id,
                  submittedAt: submission.submittedAt,
                  timeliness: submission.timeliness,
                  graded: submission.grade?.status === "RELEASED",
                  score: submission.grade?.score ?? null,
                },
              ]
            : [],
        ),
        notSubmitted: people
          .filter(
            (p) =>
              !handedIn(p.submission?.status) &&
              p.submission?.status !== "EXCUSED",
          )
          .map(({ studentId, name, submission }) => ({
            studentId,
            name,
            started: submission?.status === "DRAFT",
          })),
        excused: people
          .filter((p) => p.submission?.status === "EXCUSED")
          .map(({ studentId, name }) => ({ studentId, name })),
      };
    }),

  // --- Authoring ------------------------------------------------------------

  create: teacherProcedure
    .input(
      z.object({
        sectionId: z.string(),
        title: z.string().min(1).max(200),
        description: z.string().max(10_000).optional(),
        type: z.enum(assignmentTypes),
        format: z.enum(submissionFormats).default("FILE_UPLOAD"),
        pointsPossible: z.number().min(0).max(1000),
        dueAt: z.date(),
        availableFrom: z.date().optional(),
        closesAt: z.date().optional(),
        allowLate: z.boolean().default(true),
        graceMinutes: z.number().int().min(0).max(10_080).default(0),
        unitId: z.string().optional(),
        lessonId: z.string().optional(),
        categoryId: z.string().optional(),
        rubricId: z.string().optional(),
        publish: z.boolean().default(false),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await assertTeachesSection(ctx.db, ctx.session.user, input.sectionId);
      const { publish, ...data } = input;

      const assignment = await ctx.db.assignment.create({
        data: { ...data, publishedAt: publish ? new Date() : null },
      });

      if (publish) {
        await notifySectionOfAssignment(ctx.db, assignment.id);
      }
      return assignment;
    }),

  update: teacherProcedure
    .input(
      z.object({
        assignmentId: z.string(),
        title: z.string().min(1).max(200).optional(),
        description: z.string().max(10_000).optional(),
        type: z.enum(assignmentTypes).optional(),
        format: z.enum(submissionFormats).optional(),
        unitId: z.string().nullable().optional(),
        pointsPossible: z.number().min(0).max(1000).optional(),
        dueAt: z.date().optional(),
        closesAt: z.date().nullable().optional(),
        allowLate: z.boolean().optional(),
        graceMinutes: z.number().int().min(0).max(10_080).optional(),
        categoryId: z.string().nullable().optional(),
        rubricId: z.string().nullable().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { assignmentId, ...data } = input;
      const assignment = await ctx.db.assignment.findUnique({
        where: { id: assignmentId },
        select: {
          sectionId: true,
          format: true,
          pointsPossible: true,
          section: { select: { courseId: true } },
          _count: {
            select: { submissions: { where: { submittedAt: { not: null } } } },
          },
        },
      });
      if (!assignment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Assignment not found.",
        });
      }
      await assertTeachesSection(
        ctx.db,
        ctx.session.user,
        assignment.sectionId,
      );

      // Work already handed in one way can't be moved to another.
      if (
        data.format &&
        data.format !== assignment.format &&
        assignment._count.submissions > 0
      ) {
        throw new TRPCError({
          code: "CONFLICT",
          message:
            "Students have already submitted, so the hand-in method can't change.",
        });
      }
      if (data.unitId) {
        const unit = await ctx.db.unit.findFirst({
          where: { id: data.unitId, courseId: assignment.section.courseId },
          select: { id: true },
        });
        if (!unit) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "That unit isn't part of this class.",
          });
        }
      }

      const updated = await ctx.db.assignment.update({
        where: { id: assignmentId },
        data,
      });

      // Scores are out of the points, so running grades move with them.
      if (
        data.pointsPossible !== undefined &&
        data.pointsPossible !== assignment.pointsPossible
      ) {
        const submitted = await ctx.db.submission.findMany({
          where: { assignmentId, grade: { isNot: null } },
          distinct: ["studentId"],
          select: { studentId: true },
        });
        for (const { studentId } of submitted) {
          await refreshEnrollmentGrade(
            ctx.db,
            assignment.sectionId,
            studentId,
            "Assignment points changed",
          );
        }
      }
      return updated;
    }),

  publish: teacherProcedure
    .input(z.object({ assignmentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const assignment = await ctx.db.assignment.findUnique({
        where: { id: input.assignmentId },
        select: { sectionId: true, publishedAt: true },
      });
      if (!assignment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Assignment not found.",
        });
      }
      await assertTeachesSection(
        ctx.db,
        ctx.session.user,
        assignment.sectionId,
      );

      const updated = await ctx.db.assignment.update({
        where: { id: input.assignmentId },
        data: { publishedAt: assignment.publishedAt ?? new Date() },
      });
      await notifySectionOfAssignment(ctx.db, updated.id);
      return updated;
    }),

  delete: teacherProcedure
    .input(z.object({ assignmentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const assignment = await ctx.db.assignment.findUnique({
        where: { id: input.assignmentId },
        select: { sectionId: true, _count: { select: { submissions: true } } },
      });
      if (!assignment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Assignment not found.",
        });
      }
      await assertTeachesSection(
        ctx.db,
        ctx.session.user,
        assignment.sectionId,
      );
      if (assignment._count.submissions > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message:
            "Unpublish instead: this assignment already has submissions.",
        });
      }
      return ctx.db.assignment.delete({ where: { id: input.assignmentId } });
    }),

  /** Creates a reusable criterion rubric. */
  createRubric: teacherProcedure
    .input(
      z.object({
        title: z.string().min(1).max(200),
        description: z.string().max(2000).optional(),
        type: z.enum(["STANDARD", "MANUAL"]).default("STANDARD"),
        criteria: z
          .array(
            z.object({
              title: z.string().min(1).max(200),
              description: z.string().max(2000).optional(),
              maxPoints: z.number().min(0).max(1000),
              levels: z
                .array(
                  z.object({
                    label: z.string().min(1).max(60),
                    points: z.number().min(0).max(1000),
                    description: z.string().max(1000).optional(),
                  }),
                )
                .default([]),
            }),
          )
          .min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const totalPoints = input.criteria.reduce(
        (sum, c) => sum + c.maxPoints,
        0,
      );

      return ctx.db.rubric.create({
        data: {
          title: input.title,
          description: input.description,
          type: input.type,
          totalPoints,
          criteria: {
            create: input.criteria.map((criterion, index) => ({
              title: criterion.title,
              description: criterion.description,
              maxPoints: criterion.maxPoints,
              order: index,
              levels: {
                create: criterion.levels.map((level, levelIndex) => ({
                  ...level,
                  order: levelIndex,
                })),
              },
            })),
          },
        },
        include: { criteria: { include: { levels: true } } },
      });
    }),
});

/** Fans out an ASSIGNMENT_DUE notification to the section's active roster. */
async function notifySectionOfAssignment(
  db: PrismaClient,
  assignmentId: string,
) {
  const assignment = await db.assignment.findUnique({
    where: { id: assignmentId },
    select: {
      title: true,
      dueAt: true,
      section: {
        select: {
          course: { select: { name: true } },
          enrollments: {
            where: { status: "ACTIVE" },
            select: { student: { select: { userId: true } } },
          },
        },
      },
    },
  });
  if (!assignment) return;

  await db.notification.createMany({
    data: assignment.section.enrollments.map((enrollment) => ({
      userId: enrollment.student.userId,
      type: "ASSIGNMENT_DUE" as const,
      title: `New assignment: ${assignment.title}`,
      body: `${assignment.section.course.name} — due ${assignment.dueAt.toLocaleString()}`,
      linkUrl: `/assignments/${assignmentId}`,
    })),
  });
}
