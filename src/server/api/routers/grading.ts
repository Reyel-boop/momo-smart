import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, teacherProcedure } from "~/server/api/trpc";
import { letterFor, refreshEnrollmentGrade, round } from "~/server/lib/grading";
import {
  LEARNING_AREAS,
  componentOf,
  learningAreaOf,
  isSingleTerm,
  subjectLabel,
  termGrade,
  termOf,
  type LearningArea,
  type ScoredItem,
} from "~/server/lib/deped";
import {
  assertStudentAccess,
  assertTeachesSection,
} from "~/server/lib/permissions";
import type { Prisma } from "../../../../generated/prisma";

/** Scopes a query to the sections the caller may grade (an admin: their school's). */
const gradableSections = (
  user: { role: string; schoolId: string | null },
  teacherId: string | null,
): Prisma.SectionWhereInput =>
  user.role === "ADMIN"
    ? { schoolId: user.schoolId ?? "" }
    : { teacherId: teacherId ?? "" };

export const gradingRouter = createTRPCRouter({
  /**
   * The Priority Grading Queue. Ungraded submissions across the teacher's
   * sections, ordered so the oldest submitted work surfaces first.
   */
  queue: teacherProcedure
    .input(
      z.object({
        sectionId: z.string().optional(),
        sort: z.enum(["OLDEST", "NEWEST", "DUE_DATE"]).default("OLDEST"),
        /** TODO: still to grade. CHECKED: graded already (released or not). */
        view: z.enum(["TODO", "CHECKED"]).default("TODO"),
        cursor: z.string().nullish(),
        limit: z.number().int().min(1).max(50).default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (input.sectionId) {
        await assertTeachesSection(ctx.db, ctx.session.user, input.sectionId);
      }

      const orderBy: Prisma.SubmissionOrderByWithRelationInput =
        input.sort === "NEWEST"
          ? { submittedAt: "desc" }
          : input.sort === "DUE_DATE"
            ? { assignment: { dueAt: "asc" } }
            : { submittedAt: "asc" };

      const items = await ctx.db.submission.findMany({
        where: {
          ...(input.view === "CHECKED"
            ? { grade: { status: { in: ["COMPLETED", "RELEASED"] } } }
            : {
                status: "SUBMITTED",
                OR: [
                  { grade: null },
                  { grade: { status: { in: ["PENDING", "IN_PROGRESS"] } } },
                ],
              }),
          assignment: {
            sectionId: input.sectionId,
            section: gradableSections(ctx.session.user, ctx.teacherId),
          },
        },
        orderBy,
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        select: {
          id: true,
          status: true,
          timeliness: true,
          submittedAt: true,
          wordCount: true,
          externalUrl: true,
          student: {
            select: {
              id: true,
              studentNumber: true,
              user: { select: { name: true, image: true } },
            },
          },
          assignment: {
            select: {
              id: true,
              title: true,
              type: true,
              format: true,
              pointsPossible: true,
              dueAt: true,
              section: {
                select: {
                  id: true,
                  code: true,
                  period: true,
                  course: { select: { name: true, code: true } },
                },
              },
              rubric: {
                select: {
                  id: true,
                  title: true,
                  type: true,
                  totalPoints: true,
                },
              },
            },
          },
          attachments: {
            select: {
              file: {
                select: {
                  fileName: true,
                  mimeType: true,
                  sizeBytes: true,
                  url: true,
                },
              },
            },
          },
          grade: {
            select: { id: true, status: true, score: true, releasedAt: true },
          },
        },
      });

      let nextCursor: string | null = null;
      if (items.length > input.limit) {
        nextCursor = items.pop()!.id;
      }

      return { items, nextCursor };
    }),

  /** Headline counts for the "Ungraded Queue" stat card. */
  queueSummary: teacherProcedure.query(async ({ ctx }) => {
    const sectionScope = gradableSections(ctx.session.user, ctx.teacherId);
    const soon = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const [total, dueWithin24h, sections] = await Promise.all([
      ctx.db.submission.count({
        where: {
          status: "SUBMITTED",
          OR: [
            { grade: null },
            { grade: { status: { in: ["PENDING", "IN_PROGRESS"] } } },
          ],
          assignment: { section: sectionScope },
        },
      }),
      ctx.db.submission.count({
        where: {
          status: "SUBMITTED",
          OR: [
            { grade: null },
            { grade: { status: { in: ["PENDING", "IN_PROGRESS"] } } },
          ],
          assignment: { section: sectionScope, dueAt: { lte: soon } },
        },
      }),
      ctx.db.section.count({ where: sectionScope }),
    ]);

    return { total, dueWithin24h, sections };
  }),

  /** Claims a submission so concurrent graders do not double up. */
  startGrading: teacherProcedure
    .input(z.object({ submissionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const submission = await ctx.db.submission.findUnique({
        where: { id: input.submissionId },
        select: { assignment: { select: { sectionId: true } } },
      });
      if (!submission) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Submission not found.",
        });
      }
      await assertTeachesSection(
        ctx.db,
        ctx.session.user,
        submission.assignment.sectionId,
      );

      return ctx.db.grade.upsert({
        where: { submissionId: input.submissionId },
        create: {
          submissionId: input.submissionId,
          status: "IN_PROGRESS",
          graderId: ctx.session.user.id,
        },
        update: { status: "IN_PROGRESS", graderId: ctx.session.user.id },
      });
    }),

  /**
   * Records a grade. Rubric-backed assignments derive the score from the
   * per-criterion points; manual-scale assignments take the score directly.
   * Releasing the grade refreshes the student's running section average.
   */
  gradeSubmission: teacherProcedure
    .input(
      z.object({
        submissionId: z.string(),
        score: z.number().min(0).optional(),
        rubricScores: z
          .array(
            z.object({
              criterionId: z.string(),
              levelId: z.string().optional(),
              points: z.number().min(0),
              comment: z.string().max(2000).optional(),
            }),
          )
          .default([]),
        latePenalty: z.number().min(0).default(0),
        feedback: z.string().max(20_000).optional(),
        release: z.boolean().default(true),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const submission = await ctx.db.submission.findUnique({
        where: { id: input.submissionId },
        select: {
          id: true,
          studentId: true,
          assignment: {
            select: {
              sectionId: true,
              pointsPossible: true,
              title: true,
              rubric: {
                select: {
                  type: true,
                  criteria: { select: { id: true, maxPoints: true } },
                },
              },
            },
          },
        },
      });
      if (!submission) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Submission not found.",
        });
      }
      const { assignment } = submission;
      await assertTeachesSection(
        ctx.db,
        ctx.session.user,
        assignment.sectionId,
      );

      const usesRubric = assignment.rubric?.type === "STANDARD";

      let rawScore: number;
      if (usesRubric && input.rubricScores.length > 0) {
        const allowed = new Map(
          assignment.rubric!.criteria.map((c) => [c.id, c.maxPoints]),
        );
        for (const entry of input.rubricScores) {
          const max = allowed.get(entry.criterionId);
          if (max === undefined) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Rubric score references an unknown criterion.",
            });
          }
          if (entry.points > max) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: `Criterion score exceeds its maximum of ${max}.`,
            });
          }
        }
        rawScore = input.rubricScores.reduce((sum, e) => sum + e.points, 0);
      } else {
        if (input.score === undefined) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "A score is required for manually graded work.",
          });
        }
        rawScore = input.score;
      }

      if (rawScore > assignment.pointsPossible) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Score exceeds the ${assignment.pointsPossible} points possible.`,
        });
      }

      const finalScore = Math.max(0, round(rawScore - input.latePenalty, 2));
      const percent =
        assignment.pointsPossible > 0
          ? (finalScore / assignment.pointsPossible) * 100
          : 0;
      const now = new Date();

      const grade = await ctx.db.$transaction(async (tx) => {
        const saved = await tx.grade.upsert({
          where: { submissionId: input.submissionId },
          create: {
            submissionId: input.submissionId,
            graderId: ctx.session.user.id,
            status: input.release ? "RELEASED" : "COMPLETED",
            score: finalScore,
            latePenalty: input.latePenalty,
            letter: letterFor(percent),
            feedback: input.feedback,
            gradedAt: now,
            releasedAt: input.release ? now : null,
          },
          update: {
            graderId: ctx.session.user.id,
            status: input.release ? "RELEASED" : "COMPLETED",
            score: finalScore,
            latePenalty: input.latePenalty,
            letter: letterFor(percent),
            feedback: input.feedback,
            gradedAt: now,
            releasedAt: input.release ? now : null,
          },
        });

        if (input.rubricScores.length > 0) {
          await tx.rubricScore.deleteMany({ where: { gradeId: saved.id } });
          await tx.rubricScore.createMany({
            data: input.rubricScores.map((entry) => ({
              gradeId: saved.id,
              ...entry,
            })),
          });
        }

        await tx.submission.update({
          where: { id: input.submissionId },
          data: { status: "GRADED" },
        });

        return saved;
      });

      if (input.release) {
        await refreshEnrollmentGrade(
          ctx.db,
          assignment.sectionId,
          submission.studentId,
          `Graded: ${assignment.title}`,
        );

        const student = await ctx.db.studentProfile.findUnique({
          where: { id: submission.studentId },
          select: { userId: true },
        });
        if (student) {
          await ctx.db.notification.create({
            data: {
              userId: student.userId,
              type: "GRADE_RELEASED",
              title: `Grade posted: ${assignment.title}`,
              body: `${finalScore} / ${assignment.pointsPossible} (${letterFor(percent)})`,
              linkUrl: `/assignments/submissions/${input.submissionId}`,
            },
          });
        }
      }

      return grade;
    }),

  /** Returns work to the student for revision without recording a score. */
  returnForRevision: teacherProcedure
    .input(
      z.object({
        submissionId: z.string(),
        feedback: z.string().min(1).max(20_000),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const submission = await ctx.db.submission.findUnique({
        where: { id: input.submissionId },
        select: {
          studentId: true,
          assignment: { select: { sectionId: true, title: true } },
        },
      });
      if (!submission) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Submission not found.",
        });
      }
      await assertTeachesSection(
        ctx.db,
        ctx.session.user,
        submission.assignment.sectionId,
      );

      await ctx.db.$transaction([
        ctx.db.submission.update({
          where: { id: input.submissionId },
          data: { status: "RETURNED" },
        }),
        ctx.db.grade.upsert({
          where: { submissionId: input.submissionId },
          create: {
            submissionId: input.submissionId,
            graderId: ctx.session.user.id,
            status: "COMPLETED",
            feedback: input.feedback,
          },
          update: { feedback: input.feedback, graderId: ctx.session.user.id },
        }),
      ]);

      return { ok: true };
    }),

  /** Publishes every completed-but-unreleased grade for an assignment. */
  releaseAll: teacherProcedure
    .input(z.object({ assignmentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const assignment = await ctx.db.assignment.findUnique({
        where: { id: input.assignmentId },
        select: { sectionId: true, title: true },
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

      const pending = await ctx.db.grade.findMany({
        where: {
          status: "COMPLETED",
          submission: { assignmentId: input.assignmentId },
        },
        select: { id: true, submission: { select: { studentId: true } } },
      });

      const now = new Date();
      await ctx.db.grade.updateMany({
        where: { id: { in: pending.map((g) => g.id) } },
        data: { status: "RELEASED", releasedAt: now },
      });

      for (const grade of pending) {
        await refreshEnrollmentGrade(
          ctx.db,
          assignment.sectionId,
          grade.submission.studentId,
          `Released: ${assignment.title}`,
        );
      }

      return { released: pending.length };
    }),

  /** Excuses a student from an assignment so it stops counting against them. */
  excuse: teacherProcedure
    .input(z.object({ assignmentId: z.string(), studentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const assignment = await ctx.db.assignment.findUnique({
        where: { id: input.assignmentId },
        select: { sectionId: true },
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

      const existing = await ctx.db.submission.findFirst({
        where: { assignmentId: input.assignmentId, studentId: input.studentId },
        orderBy: { attempt: "desc" },
        select: { id: true },
      });

      return existing
        ? ctx.db.submission.update({
            where: { id: existing.id },
            data: { status: "EXCUSED" },
          })
        : ctx.db.submission.create({
            data: {
              assignmentId: input.assignmentId,
              studentId: input.studentId,
              status: "EXCUSED",
            },
          });
    }),

  /** Gradebook matrix for a section: roster × assignments. */
  gradebook: teacherProcedure
    .input(z.object({ sectionId: z.string() }))
    .query(async ({ ctx, input }) => {
      await assertTeachesSection(ctx.db, ctx.session.user, input.sectionId);

      const [assignments, enrollments] = await Promise.all([
        ctx.db.assignment.findMany({
          where: { sectionId: input.sectionId, publishedAt: { not: null } },
          orderBy: { dueAt: "asc" },
          select: {
            id: true,
            title: true,
            type: true,
            pointsPossible: true,
            dueAt: true,
            category: { select: { id: true, name: true, weightPercent: true } },
          },
        }),
        ctx.db.enrollment.findMany({
          where: { sectionId: input.sectionId, status: "ACTIVE" },
          orderBy: { student: { user: { name: "asc" } } },
          select: {
            id: true,
            currentPercent: true,
            currentLetter: true,
            student: {
              select: {
                id: true,
                studentNumber: true,
                user: { select: { name: true, image: true } },
                submissions: {
                  where: { assignment: { sectionId: input.sectionId } },
                  select: {
                    assignmentId: true,
                    status: true,
                    timeliness: true,
                    grade: {
                      select: { score: true, letter: true, status: true },
                    },
                  },
                },
              },
            },
          },
        }),
      ]);

      return {
        assignments,
        rows: enrollments.map((enrollment) => ({
          enrollmentId: enrollment.id,
          student: {
            id: enrollment.student.id,
            studentNumber: enrollment.student.studentNumber,
            name: enrollment.student.user.name,
            image: enrollment.student.user.image,
          },
          currentPercent: enrollment.currentPercent,
          currentLetter: enrollment.currentLetter,
          cells: Object.fromEntries(
            enrollment.student.submissions.map((submission) => [
              submission.assignmentId,
              {
                status: submission.status,
                timeliness: submission.timeliness,
                score: submission.grade?.score ?? null,
                letter: submission.grade?.letter ?? null,
                released: submission.grade?.status === "RELEASED",
              },
            ]),
          ),
        })),
      };
    }),

  /**
   * A student's DepEd report card (SF9): one row per learning area with the
   * three term grades (one grade for TLE, a one-term subject), final rating and remarks. Classes in the same
   * learning area (two TLE classes, say) count as one subject.
   */
  reportCard: teacherProcedure
    .input(z.object({ studentId: z.string() }))
    .query(async ({ ctx, input }) => {
      await assertStudentAccess(ctx.db, ctx.session.user, input.studentId);

      const term = await ctx.db.term.findFirst({
        where: { isCurrent: true },
        select: { id: true, schoolYear: true, startDate: true, endDate: true },
      });

      const student = await ctx.db.studentProfile.findUnique({
        where: { id: input.studentId },
        select: {
          id: true,
          studentNumber: true,
          gradeLevel: true,
          homeroom: true,
          section: { select: { name: true } },
          user: {
            select: {
              name: true,
              school: { select: { name: true, depedId: true, address: true } },
            },
          },
          enrollments: {
            where: { status: "ACTIVE", section: { termId: term?.id ?? "" } },
            select: {
              section: {
                select: {
                  course: {
                    select: {
                      code: true,
                      name: true,
                      department: { select: { code: true } },
                    },
                  },
                  teacher: {
                    select: { user: { select: { name: true, title: true } } },
                  },
                  assignments: {
                    where: { publishedAt: { not: null } },
                    select: {
                      type: true,
                      pointsPossible: true,
                      dueAt: true,
                      category: { select: { name: true } },
                      submissions: {
                        where: { studentId: input.studentId },
                        orderBy: { attempt: "desc" },
                        take: 1,
                        select: {
                          status: true,
                          grade: { select: { score: true, status: true } },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });
      if (!student || !term) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Student not found.",
        });
      }

      // Group the student's classes into report-card subjects.
      type Subject = {
        key: string;
        area: LearningArea | null;
        name: string;
        classes: string[];
        items: Record<1 | 2 | 3, ScoredItem[]>;
      };
      const subjects = new Map<string, Subject>();
      for (const { section } of student.enrollments) {
        const area = learningAreaOf(section.course);
        const key = area ?? section.course.code;
        let subject = subjects.get(key);
        if (!subject) {
          subject = {
            key,
            area,
            name: area
              ? (LEARNING_AREAS.find((a) => a.id === area)?.name ?? key)
              : section.course.name,
            classes: [],
            items: { 1: [], 2: [], 3: [] },
          };
          subjects.set(key, subject);
        }
        const teacher = section.teacher.user;
        const line = `${section.course.name} — ${[teacher.title, teacher.name].filter(Boolean).join(" ")}`;
        if (!subject.classes.includes(line)) subject.classes.push(line);

        for (const assignment of section.assignments) {
          const submission = assignment.submissions[0];
          let score: number | null = null;
          if (submission?.status === "MISSING") score = 0;
          else if (
            submission?.status !== "EXCUSED" &&
            submission?.grade?.status === "RELEASED" &&
            submission.grade.score !== null
          ) {
            score = submission.grade.score;
          }
          if (score === null || assignment.pointsPossible <= 0) continue;
          // A one-term subject (TLE) puts all its work toward one grade.
          const termNo = isSingleTerm(area)
            ? 1
            : termOf(assignment.dueAt, term.startDate, term.endDate);
          subject.items[termNo].push({
            component: componentOf(assignment),
            score,
            possible: assignment.pointsPossible,
          });
        }
      }

      const toRow = (
        subject: Subject | undefined,
        name: string,
        key: string,
      ) => {
        const area = subject?.area ?? (key as LearningArea);
        const singleTerm = isSingleTerm(area);
        const terms = singleTerm
          ? [subject ? termGrade(subject.area, subject.items[1]) : null]
          : ([1, 2, 3] as const).map((n) =>
              subject ? termGrade(subject.area, subject.items[n]) : null,
            );
        const final = terms.every((g) => g !== null)
          ? Math.round(
              terms.reduce<number>((sum, g) => sum + (g ?? 0), 0) /
                terms.length,
            )
          : null;
        return {
          key,
          name,
          inMomo: !!subject,
          classes: subject?.classes ?? [],
          singleTerm,
          terms,
          final,
          remarks: final === null ? null : final >= 75 ? "Passed" : "Failed",
        };
      };

      // Junior High uses the fixed DepEd learning areas; Senior High lists
      // each subject the student takes.
      const juniorHigh = student.gradeLevel <= 10;
      const rows = juniorHigh
        ? [
            ...LEARNING_AREAS.map((a) =>
              toRow(subjects.get(a.id), a.name, a.id),
            ),
            ...[...subjects.values()]
              .filter((s) => s.area === null)
              .map((s) => toRow(s, s.name, s.key)),
          ]
        : [...subjects.values()].map((s) => toRow(s, s.name, s.key));

      const finals = rows.map((r) => r.final);
      const generalAverage =
        rows.length > 0 && finals.every((f) => f !== null)
          ? round(
              finals.reduce<number>((sum, f) => sum + (f ?? 0), 0) /
                finals.length,
              2,
            )
          : null;

      const span = term.endDate.getTime() - term.startDate.getTime();
      return {
        student: {
          id: student.id,
          name: student.user.name ?? "Student",
          lrn: student.studentNumber,
          gradeLevel: student.gradeLevel,
          section: student.section?.name ?? student.homeroom ?? null,
        },
        school: student.user.school,
        schoolYear: term.schoolYear,
        /** First day of each term, then the last day of the year. */
        termDates: [0, 1, 2, 3].map(
          (i) => new Date(term.startDate.getTime() + (span * i) / 3),
        ),
        juniorHigh,
        rows,
        generalAverage,
      };
    }),

  /**
   * A student's record: every course they have taken, in every school
   * year, with the quizzes they took in each (Unit Questions, quiz and
   * exam assignments, Live Quizzes), plus their CB-NAT Review tries.
   */
  studentRecord: teacherProcedure
    .input(z.object({ studentId: z.string() }))
    .query(async ({ ctx, input }) => {
      await assertStudentAccess(ctx.db, ctx.session.user, input.studentId);
      const studentId = input.studentId;

      const student = await ctx.db.studentProfile.findUnique({
        where: { id: studentId },
        select: {
          id: true,
          studentNumber: true,
          gradeLevel: true,
          homeroom: true,
          section: { select: { name: true } },
          user: { select: { name: true } },
          enrollments: {
            select: {
              id: true,
              status: true,
              enrolledAt: true,
              droppedAt: true,
              section: {
                select: {
                  id: true,
                  code: true,
                  term: {
                    select: {
                      id: true,
                      name: true,
                      schoolYear: true,
                      startDate: true,
                      isCurrent: true,
                    },
                  },
                  course: {
                    select: {
                      code: true,
                      name: true,
                      department: { select: { code: true } },
                    },
                  },
                  teacher: {
                    select: { user: { select: { name: true, title: true } } },
                  },
                  assessments: {
                    where: {
                      unitId: { not: null },
                      assignmentId: null,
                      publishedAt: { not: null },
                    },
                    select: {
                      id: true,
                      title: true,
                      totalPoints: true,
                      unit: { select: { order: true, title: true } },
                      attempts: {
                        where: { studentId },
                        orderBy: { attempt: "asc" },
                        select: {
                          status: true,
                          totalScore: true,
                          autoScore: true,
                          startedAt: true,
                          submittedAt: true,
                        },
                      },
                    },
                  },
                  assignments: {
                    where: {
                      publishedAt: { not: null },
                      OR: [
                        { type: { in: ["QUIZ", "EXAM"] } },
                        { assessment: { isNot: null } },
                      ],
                    },
                    orderBy: { dueAt: "asc" },
                    select: {
                      id: true,
                      title: true,
                      type: true,
                      pointsPossible: true,
                      dueAt: true,
                      submissions: {
                        where: { studentId },
                        orderBy: { attempt: "desc" },
                        take: 1,
                        select: {
                          status: true,
                          submittedAt: true,
                          grade: { select: { score: true, status: true } },
                        },
                      },
                    },
                  },
                  liveGames: {
                    where: { players: { some: { studentId } } },
                    orderBy: { createdAt: "asc" },
                    select: {
                      id: true,
                      createdAt: true,
                      assessment: { select: { title: true } },
                      players: { select: { studentId: true, score: true } },
                    },
                  },
                },
              },
            },
          },
          natAttempts: {
            where: { status: { not: "IN_PROGRESS" } },
            orderBy: { startedAt: "asc" },
            select: {
              id: true,
              attempt: true,
              score: true,
              submittedAt: true,
              startedAt: true,
              test: {
                select: {
                  title: true,
                  subject: true,
                  _count: { select: { questions: true } },
                },
              },
            },
          },
        },
      });
      if (!student) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Student not found.",
        });
      }

      type QuizRow = {
        key: string;
        title: string;
        kind: "UNIT" | "QUIZ" | "EXAM" | "LIVE";
        date: Date;
        score: number | null;
        possible: number | null;
        /** Short note, e.g. "2 tries", "Not checked yet", "Place 3 of 25". */
        note: string | null;
        state: "DONE" | "PENDING" | "MISSING" | "IN_PROGRESS" | "EXCUSED";
      };
      const now = new Date();

      const courses = student.enrollments.map((enrollment) => {
        const { section } = enrollment;
        const quizzes: QuizRow[] = [];

        // Unit Questions: the best finished try counts.
        for (const assessment of section.assessments) {
          const [first] = assessment.attempts;
          if (!first) continue;
          const scoreOf = (a: typeof first) => a.totalScore ?? a.autoScore ?? 0;
          let best: typeof first | null = null;
          for (const a of assessment.attempts) {
            if (a.status !== "GRADED" && a.status !== "SUBMITTED") continue;
            if (!best || scoreOf(a) > scoreOf(best)) best = a;
          }
          const tries = assessment.attempts.length;
          quizzes.push({
            key: `unit-${assessment.id}`,
            title: !assessment.unit
              ? assessment.title
              : /^unit\s/i.test(assessment.unit.title)
                ? assessment.unit.title
                : `Unit ${assessment.unit.order}: ${assessment.unit.title}`,
            kind: "UNIT",
            date: best?.submittedAt ?? first.startedAt,
            score: best ? round(scoreOf(best)) : null,
            possible: assessment.totalPoints,
            note: tries > 1 ? `${tries} tries` : null,
            state: best ? "DONE" : "IN_PROGRESS",
          });
        }

        // Quiz and exam assignments, scored once the grade is released.
        for (const assignment of section.assignments) {
          const submission = assignment.submissions[0];
          const grade = submission?.grade;
          const releasedScore =
            grade?.status === "RELEASED" ? grade.score : null;
          const state: QuizRow["state"] =
            submission?.status === "EXCUSED"
              ? "EXCUSED"
              : releasedScore !== null
                ? "DONE"
                : submission?.status === "MISSING" ||
                    (!submission && assignment.dueAt < now)
                  ? "MISSING"
                  : "PENDING";
          quizzes.push({
            key: `asg-${assignment.id}`,
            title: assignment.title,
            kind: assignment.type === "EXAM" ? "EXAM" : "QUIZ",
            date: submission?.submittedAt ?? assignment.dueAt,
            score: state === "MISSING" ? 0 : releasedScore,
            possible: assignment.pointsPossible,
            note:
              state === "PENDING"
                ? submission
                  ? "Not checked yet"
                  : "Not yet submitted"
                : null,
            state,
          });
        }

        // Live Quizzes: points earned and place in the class.
        for (const game of section.liveGames) {
          const me = game.players.find((p) => p.studentId === studentId);
          if (!me) continue;
          const place =
            game.players.filter((p) => p.score > me.score).length + 1;
          quizzes.push({
            key: `live-${game.id}`,
            title: `Live Quiz — ${game.assessment.title}`,
            kind: "LIVE",
            date: game.createdAt,
            score: me.score,
            possible: null,
            note: `Place ${place} of ${game.players.length}`,
            state: "DONE",
          });
        }

        quizzes.sort((a, b) => a.date.getTime() - b.date.getTime());

        let sum = 0;
        let counted = 0;
        for (const q of quizzes) {
          if (q.score === null || !q.possible) continue;
          sum += q.score / q.possible;
          counted += 1;
        }

        const teacher = section.teacher.user;
        return {
          enrollmentId: enrollment.id,
          subject: subjectLabel(section.course),
          courseName: section.course.name,
          sectionCode: section.code,
          teacher: [teacher.title, teacher.name].filter(Boolean).join(" "),
          term: section.term,
          status: enrollment.status,
          enrolledAt: enrollment.enrolledAt,
          droppedAt: enrollment.droppedAt,
          unitSets: section.assessments.length,
          unitSetsTaken: section.assessments.filter(
            (a) => a.attempts.length > 0,
          ).length,
          quizAverage: counted > 0 ? round((sum / counted) * 100) : null,
          quizzes,
        };
      });

      // Newest school year first; within a year, by subject.
      courses.sort(
        (a, b) =>
          b.term.startDate.getTime() - a.term.startDate.getTime() ||
          a.subject.localeCompare(b.subject) ||
          a.sectionCode.localeCompare(b.sectionCode),
      );

      return {
        student: {
          id: student.id,
          name: student.user.name ?? "Student",
          studentNumber: student.studentNumber,
          gradeLevel: student.gradeLevel,
          section: student.section?.name ?? student.homeroom ?? null,
        },
        courses,
        nat: student.natAttempts.map((a) => ({
          id: a.id,
          test: a.test.title,
          subject: a.test.subject,
          attempt: a.attempt,
          score: a.score,
          possible: a.test._count.questions,
          date: a.submittedAt ?? a.startedAt,
        })),
      };
    }),
});
