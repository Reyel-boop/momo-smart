import { TRPCError } from "@trpc/server";

import type { Prisma, PrismaClient } from "../../../generated/prisma";

type Db = PrismaClient | Prisma.TransactionClient;

/** Codes are shown in capitals; accept them however they're typed. */
export const normaliseJoinCode = (code: string) =>
  code.replace(/[^0-9a-z]/gi, "").toUpperCase();

const sectionSelect = {
  id: true,
  code: true,
  capacity: true,
  course: { select: { name: true } },
  _count: { select: { enrollments: { where: { status: "ACTIVE" } } } },
} satisfies Prisma.SectionSelect;
type JoinableSection = Prisma.SectionGetPayload<{
  select: typeof sectionSelect;
}>;

/**
 * The class a code points to: a class code ("7F3A2C"), or a course code
 * ("MATH 10") meaning that course's class for the student's own section.
 */
async function findClass(
  db: Db,
  studentId: string,
  rawCode: string,
): Promise<JoinableSection> {
  const code = normaliseJoinCode(rawCode);
  const byClassCode = await db.section.findFirst({
    where: { joinCode: code, term: { isCurrent: true } },
    select: sectionSelect,
  });
  if (byClassCode) return byClassCode;

  const courses = await db.course.findMany({
    select: { id: true, code: true, name: true },
  });
  const course = courses.find((c) => normaliseJoinCode(c.code) === code);
  if (!course) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `No class or course has the code ${code || rawCode}. Check it with your teacher.`,
    });
  }

  const [student, classes] = await Promise.all([
    db.studentProfile.findUnique({
      where: { id: studentId },
      select: { section: { select: { name: true } } },
    }),
    db.section.findMany({
      where: { courseId: course.id, term: { isCurrent: true } },
      select: sectionSelect,
    }),
  ]);
  if (classes.length === 0) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `${course.name} has no class yet. Ask your teacher.`,
    });
  }
  const section = student?.section?.name;
  if (section) {
    const mine = classes.find(
      (c) => c.code.trim().toLowerCase() === section.trim().toLowerCase(),
    );
    if (mine) return mine;
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `There is no ${course.name} class for your section ${section} yet. Ask your teacher for the class code.`,
    });
  }
  if (classes.length === 1) return classes[0]!;
  throw new TRPCError({
    code: "BAD_REQUEST",
    message: `${course.name} has several classes. Enter the class code from your teacher.`,
  });
}

/**
 * Enrolls a student in the current-term class a class or course code points
 * to. Joining a class twice is harmless; a dropped student is re-enrolled.
 */
export async function joinClassByCode(
  db: Db,
  studentId: string,
  rawCode: string,
) {
  const section = await findClass(db, studentId, rawCode);
  const existing = await db.enrollment.findUnique({
    where: { sectionId_studentId: { sectionId: section.id, studentId } },
    select: { status: true },
  });
  if (
    existing?.status !== "ACTIVE" &&
    section._count.enrollments >= section.capacity
  ) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "This class is full. Ask your teacher or the registrar.",
    });
  }
  await db.enrollment.upsert({
    where: { sectionId_studentId: { sectionId: section.id, studentId } },
    create: { sectionId: section.id, studentId },
    update: { status: "ACTIVE", droppedAt: null },
  });
  return {
    sectionId: section.id,
    name: `${section.course.name} — ${section.code}`,
  };
}
