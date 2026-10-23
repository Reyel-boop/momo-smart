import { randomInt } from "node:crypto";

import { TRPCError } from "@trpc/server";
import { hash } from "bcryptjs";
import { z } from "zod";

import { adminProcedure, createTRPCRouter } from "~/server/api/trpc";
import { createUnitQuizzesForSection } from "~/server/curriculum";
import { importRoster, rosterRow } from "~/server/lib/import-roster";
import type { PrismaClient } from "../../../../generated/prisma";

/**
 * A unique-constraint violation. Checked by its code rather than its class:
 * the client can come from a different copy of the Prisma runtime.
 */
const isUniqueViolation = (
  error: unknown,
): error is { code: "P2002"; meta?: { target?: unknown } } =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  error.code === "P2002";

/** An empty form field means "none". */
const orNull = (value: string | undefined) =>
  value === undefined || value === "" ? null : value;

/** Letters and digits that can't be confused when read aloud or copied. */
const ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";

/** A temporary password like "kq7m-x4tp-9wer", shown to the registrar once. */
function temporaryPassword() {
  const group = () =>
    Array.from({ length: 4 }, () => ALPHABET[randomInt(ALPHABET.length)]).join(
      "",
    );
  return `${group()}-${group()}-${group()}`;
}

const personInput = z.discriminatedUnion("role", [
  z.object({
    role: z.literal("STUDENT"),
    name: z.string().trim().min(1).max(120),
    email: z.string().trim().toLowerCase().email(),
    studentNumber: z.string().trim().min(1).max(40),
    gradeLevel: z.number().int().min(1).max(12),
  }),
  z.object({
    role: z.literal("TEACHER"),
    name: z.string().trim().min(1).max(120),
    email: z.string().trim().toLowerCase().email(),
    title: z.string().trim().max(20).optional(),
    employeeNumber: z.string().trim().min(1).max(40),
    departmentId: z.string().optional(),
  }),
]);
type PersonInput = z.infer<typeof personInput>;

/** The school year a student in this grade is expected to graduate. */
function graduationYear(gradeLevel: number, now = new Date()) {
  // The school year starts in June; Grade 12 finishes the following year.
  const schoolYearEnd =
    now.getMonth() >= 5 ? now.getFullYear() + 1 : now.getFullYear();
  return schoolYearEnd + (12 - gradeLevel);
}

/** Creates one account with a temporary password; returns the password. */
async function createPerson(db: PrismaClient, input: PersonInput) {
  const password = temporaryPassword();
  const passwordHash = await hash(password, 10);
  try {
    const user = await db.user.create({
      data: {
        name: input.name,
        email: input.email,
        role: input.role,
        passwordHash,
        mustChangePassword: true,
        ...(input.role === "TEACHER"
          ? {
              title: orNull(input.title),
              teacherProfile: {
                create: {
                  employeeNumber: input.employeeNumber,
                  departmentId: orNull(input.departmentId),
                },
              },
            }
          : {
              studentProfile: {
                create: {
                  studentNumber: input.studentNumber,
                  gradeLevel: input.gradeLevel,
                  graduationYear: graduationYear(input.gradeLevel),
                },
              },
            }),
      },
      select: { id: true },
    });
    return { userId: user.id, password };
  } catch (error) {
    if (isUniqueViolation(error)) {
      const target = error.meta?.target;
      const field = Array.isArray(target)
        ? target.join(",")
        : typeof target === "string"
          ? target
          : "";
      throw new TRPCError({
        code: "CONFLICT",
        message: field.includes("email")
          ? `An account with the email ${input.email} already exists.`
          : input.role === "STUDENT"
            ? `Student number ${input.studentNumber} is already used.`
            : `Employee number ${input.employeeNumber} is already used.`,
      });
    }
    throw error;
  }
}

export const adminRouter = createTRPCRouter({
  /** Counts for the admin home page. */
  overview: adminProcedure.query(async ({ ctx }) => {
    const [teachers, students, classes, courses, term, pendingFirstLogin] =
      await Promise.all([
        ctx.db.user.count({ where: { role: "TEACHER", isActive: true } }),
        ctx.db.user.count({ where: { role: "STUDENT", isActive: true } }),
        ctx.db.section.count({ where: { term: { isCurrent: true } } }),
        ctx.db.course.count(),
        ctx.db.term.findFirst({
          where: { isCurrent: true },
          select: { id: true, name: true, startDate: true, endDate: true },
        }),
        ctx.db.user.count({
          where: { mustChangePassword: true, isActive: true },
        }),
      ]);
    return { teachers, students, classes, courses, term, pendingFirstLogin };
  }),

  /** Teachers or students, optionally filtered by name, email or number. */
  people: adminProcedure
    .input(
      z.object({
        role: z.enum(["TEACHER", "STUDENT"]),
        query: z.string().trim().max(80).optional(),
        /** A section name such as "Rizal", or "none" for students in no class. */
        section: z.string().trim().max(80).optional(),
      }),
    )
    .query(({ ctx, input }) => {
      const q = input.query;
      const inSection = (code?: string) => ({
        enrollments: {
          some: {
            status: "ACTIVE" as const,
            section: { term: { isCurrent: true }, ...(code ? { code } : {}) },
          },
        },
      });
      return ctx.db.user.findMany({
        where: {
          role: input.role,
          ...(input.role === "STUDENT" && input.section
            ? {
                studentProfile:
                  input.section === "none"
                    ? { NOT: inSection() }
                    : inSection(input.section),
              }
            : {}),
          ...(q
            ? {
                OR: [
                  { name: { contains: q, mode: "insensitive" } },
                  { email: { contains: q, mode: "insensitive" } },
                  {
                    studentProfile: {
                      studentNumber: { contains: q, mode: "insensitive" },
                    },
                  },
                  {
                    teacherProfile: {
                      employeeNumber: { contains: q, mode: "insensitive" },
                    },
                  },
                ],
              }
            : {}),
        },
        orderBy: [{ isActive: "desc" }, { name: "asc" }],
        take: 500,
        select: {
          id: true,
          name: true,
          title: true,
          email: true,
          isActive: true,
          mustChangePassword: true,
          lastLoginAt: true,
          studentProfile: {
            select: {
              id: true,
              studentNumber: true,
              gradeLevel: true,
              _count: {
                select: { enrollments: { where: { status: "ACTIVE" } } },
              },
              enrollments: {
                where: {
                  status: "ACTIVE",
                  section: { term: { isCurrent: true } },
                },
                select: { section: { select: { code: true } } },
              },
            },
          },
          teacherProfile: {
            select: {
              id: true,
              employeeNumber: true,
              department: { select: { name: true } },
              _count: { select: { sections: true } },
            },
          },
        },
      });
    }),

  /** Adds one teacher or student; the result carries the temporary password. */
  addPerson: adminProcedure
    .input(personInput)
    .mutation(({ ctx, input }) => createPerson(ctx.db, input)),

  /**
   * Adds many students at once (from a CSV). Each row succeeds or fails on
   * its own; the results carry the temporary passwords to hand out.
   */
  importStudents: adminProcedure
    .input(
      z.object({
        rows: z
          .array(
            z.object({
              name: z.string(),
              email: z.string(),
              studentNumber: z.string(),
              gradeLevel: z.number().int(),
              /** Optional class to enroll the student in. */
              sectionId: z.string().optional(),
            }),
          )
          .min(1)
          .max(200),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const results: Array<
        | {
            line: number;
            ok: true;
            name: string;
            email: string;
            password: string;
          }
        | { line: number; ok: false; name: string; error: string }
      > = [];
      for (const [index, row] of input.rows.entries()) {
        const parsed = personInput.safeParse({ ...row, role: "STUDENT" });
        if (!parsed.success) {
          results.push({
            line: index + 1,
            ok: false,
            name: row.name,
            error: parsed.error.issues
              .map((i) => `${i.path.join(".")}: ${i.message}`)
              .join("; "),
          });
          continue;
        }
        try {
          const created = await createPerson(ctx.db, parsed.data);
          if (row.sectionId) {
            const profile = await ctx.db.studentProfile.findUniqueOrThrow({
              where: { userId: created.userId },
              select: { id: true },
            });
            await ctx.db.enrollment.create({
              data: { sectionId: row.sectionId, studentId: profile.id },
            });
          }
          results.push({
            line: index + 1,
            ok: true,
            name: parsed.data.name,
            email: parsed.data.email,
            password: created.password,
          });
        } catch (error) {
          results.push({
            line: index + 1,
            ok: false,
            name: row.name,
            error: error instanceof Error ? error.message : "Not created.",
          });
        }
      }
      return results;
    }),

  /**
   * Adds the students of a School Form 1 (or class list): new students get an
   * account signing in with their LRN; everyone is enrolled in the class.
   */
  importRoster: adminProcedure
    .input(
      z.object({
        rows: z.array(rosterRow).min(1).max(200),
        sectionId: z.string().nullable(),
      }),
    )
    .mutation(({ ctx, input }) =>
      importRoster(ctx.db, input.rows, input.sectionId),
    ),

  /** Issues a new temporary password, to be changed at next sign-in. */
  resetPassword: adminProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (input.userId === ctx.session.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Change your own password in Settings.",
        });
      }
      const password = temporaryPassword();
      await ctx.db.user.update({
        where: { id: input.userId },
        data: {
          passwordHash: await hash(password, 10),
          mustChangePassword: true,
        },
      });
      return { password };
    }),

  /** Turns an account off (it can't sign in) or back on. */
  setActive: adminProcedure
    .input(z.object({ userId: z.string(), active: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      if (input.userId === ctx.session.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You can't turn off your own account.",
        });
      }
      await ctx.db.user.update({
        where: { id: input.userId },
        data: { isActive: input.active },
      });
      return { ok: true };
    }),

  /** Lists for the forms: departments, courses, active teachers, the term. */
  options: adminProcedure.query(async ({ ctx }) => {
    const [departments, courses, teachers, term] = await Promise.all([
      ctx.db.department.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true },
      }),
      ctx.db.course.findMany({
        orderBy: { code: "asc" },
        select: { id: true, code: true, name: true },
      }),
      ctx.db.teacherProfile.findMany({
        where: { user: { isActive: true } },
        orderBy: { user: { name: "asc" } },
        select: { id: true, user: { select: { name: true, title: true } } },
      }),
      ctx.db.term.findFirst({
        where: { isCurrent: true },
        select: { id: true, name: true },
      }),
    ]);
    return { departments, courses, teachers, term };
  }),

  /** This term's classes with their teacher and enrollment. */
  classes: adminProcedure.query(({ ctx }) =>
    ctx.db.section.findMany({
      where: { term: { isCurrent: true } },
      orderBy: [{ course: { code: "asc" } }, { code: "asc" }],
      select: {
        id: true,
        code: true,
        joinCode: true,
        period: true,
        room: true,
        capacity: true,
        course: { select: { id: true, code: true, name: true } },
        teacher: {
          select: { id: true, user: { select: { name: true, title: true } } },
        },
        _count: { select: { enrollments: { where: { status: "ACTIVE" } } } },
      },
    }),
  ),

  /** One class with its roster, for enrolling and removing students. */
  classDetail: adminProcedure
    .input(z.object({ sectionId: z.string() }))
    .query(async ({ ctx, input }) => {
      const section = await ctx.db.section.findUnique({
        where: { id: input.sectionId },
        select: {
          id: true,
          code: true,
          joinCode: true,
          period: true,
          room: true,
          capacity: true,
          course: { select: { code: true, name: true } },
          teacher: {
            select: { user: { select: { name: true, title: true } } },
          },
          enrollments: {
            where: { status: "ACTIVE" },
            orderBy: { student: { user: { name: "asc" } } },
            select: {
              student: {
                select: {
                  id: true,
                  studentNumber: true,
                  gradeLevel: true,
                  user: { select: { name: true, email: true } },
                },
              },
            },
          },
        },
      });
      if (!section) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Class not found." });
      }
      const enrolled = new Set(section.enrollments.map((e) => e.student.id));
      const available = await ctx.db.studentProfile.findMany({
        where: { user: { isActive: true } },
        orderBy: [{ gradeLevel: "asc" }, { user: { name: "asc" } }],
        select: {
          id: true,
          studentNumber: true,
          gradeLevel: true,
          user: { select: { name: true } },
        },
      });
      return {
        ...section,
        available: available.filter((s) => !enrolled.has(s.id)),
      };
    }),

  /** Creates a class this term, with its own copy of the Unit Questions. */
  createClass: adminProcedure
    .input(
      z.object({
        courseId: z.string(),
        teacherId: z.string(),
        code: z.string().trim().min(1).max(20),
        period: z.number().int().min(0).max(12),
        room: z.string().trim().max(40).optional(),
        capacity: z.number().int().min(1).max(200).default(45),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const term = await ctx.db.term.findFirst({
        where: { isCurrent: true },
        select: { id: true },
      });
      if (!term) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "There is no current school term set up.",
        });
      }
      const section = await ctx.db.section.create({
        data: { ...input, room: orNull(input.room), termId: term.id },
        select: { id: true },
      });
      const quizzes = await createUnitQuizzesForSection(ctx.db, section.id);
      return { sectionId: section.id, quizzes };
    }),

  /** Enrolls several students in a class at once. */
  enroll: adminProcedure
    .input(
      z.object({
        sectionId: z.string(),
        studentIds: z.array(z.string()).min(1).max(200),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      for (const studentId of input.studentIds) {
        await ctx.db.enrollment.upsert({
          where: {
            sectionId_studentId: { sectionId: input.sectionId, studentId },
          },
          create: { sectionId: input.sectionId, studentId },
          update: { status: "ACTIVE", droppedAt: null },
        });
      }
      return { enrolled: input.studentIds.length };
    }),

  /** Removes a student from a class (their past work is kept). */
  unenroll: adminProcedure
    .input(z.object({ sectionId: z.string(), studentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.enrollment.update({
        where: {
          sectionId_studentId: {
            sectionId: input.sectionId,
            studentId: input.studentId,
          },
        },
        data: { status: "DROPPED", droppedAt: new Date() },
      });
      return { ok: true };
    }),
});
