import { TRPCError } from "@trpc/server";

import type { Prisma, PrismaClient } from "../../../generated/prisma";

/** Codes are shown in capitals; accept them however they're typed. */
export const normaliseJoinCode = (code: string) =>
  code.replace(/[^0-9a-z]/gi, "").toUpperCase();

/**
 * Enrolls a student in the current-term class with this join code. Joining
 * a class twice is harmless; a dropped student is re-enrolled.
 */
export async function joinClassByCode(
  db: PrismaClient | Prisma.TransactionClient,
  studentId: string,
  rawCode: string,
) {
  const code = normaliseJoinCode(rawCode);
  const section = await db.section.findFirst({
    where: { joinCode: code, term: { isCurrent: true } },
    select: {
      id: true,
      code: true,
      capacity: true,
      course: { select: { name: true } },
      _count: { select: { enrollments: { where: { status: "ACTIVE" } } } },
    },
  });
  if (!section) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `No class has the code ${code || rawCode}. Check it with your teacher.`,
    });
  }
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
