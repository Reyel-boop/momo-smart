import { TRPCError } from "@trpc/server";

import type { PrismaClient, UserRole } from "../../../generated/prisma";

/**
 * The subset of the session used for authorisation decisions. Admins pass
 * the checks below only for records in their own school.
 */
export type Actor = {
  id: string;
  role: UserRole;
  studentId: string | null;
  teacherId: string | null;
  schoolId: string | null;
};

const forbidden = (message: string) =>
  new TRPCError({ code: "FORBIDDEN", message });

const notFound = (what: string) =>
  new TRPCError({ code: "NOT_FOUND", message: `${what} not found.` });

/** Whether an admin may act on a record of the given school. */
const adminOf = (actor: Actor, schoolId: string | null | undefined) =>
  actor.role === "ADMIN" && !!actor.schoolId && actor.schoolId === schoolId;

/**
 * Asserts the actor teaches the section (admins of its school pass). Returns
 * the section so callers can reuse it instead of issuing a second read.
 */
export async function assertTeachesSection(
  db: PrismaClient,
  actor: Actor,
  sectionId: string,
) {
  const section = await db.section.findUnique({
    where: { id: sectionId },
    select: {
      id: true,
      teacherId: true,
      courseId: true,
      termId: true,
      schoolId: true,
    },
  });
  if (!section) throw notFound("Section");
  if (actor.role === "ADMIN") {
    if (adminOf(actor, section.schoolId)) return section;
    throw notFound("Section");
  }
  if (!actor.teacherId || section.teacherId !== actor.teacherId) {
    throw forbidden("You do not teach this section.");
  }
  return section;
}

/** Asserts the actor is actively enrolled in the section (admins of its school pass). */
export async function assertEnrolled(
  db: PrismaClient,
  actor: Actor,
  sectionId: string,
) {
  if (actor.role === "ADMIN") {
    await assertTeachesSection(db, actor, sectionId);
    return;
  }
  if (!actor.studentId) throw forbidden("No student profile on this account.");

  const enrollment = await db.enrollment.findUnique({
    where: {
      sectionId_studentId: { sectionId, studentId: actor.studentId },
    },
    select: { status: true },
  });
  if (enrollment?.status !== "ACTIVE") {
    throw forbidden("You are not enrolled in this section.");
  }
}

/**
 * Read access to a section: its teacher, an actively enrolled student, or an
 * admin of its school. Use for shared reads such as the roster header or
 * announcements.
 */
export async function assertSectionAccess(
  db: PrismaClient,
  actor: Actor,
  sectionId: string,
) {
  if (actor.role === "TEACHER" || actor.role === "ADMIN") {
    await assertTeachesSection(db, actor, sectionId);
    return;
  }
  await assertEnrolled(db, actor, sectionId);
}

/**
 * Asserts the actor may act on a student's record: the student themselves, a
 * teacher who has that student in one of their sections, or an admin of
 * the student's school.
 */
export async function assertStudentAccess(
  db: PrismaClient,
  actor: Actor,
  studentId: string,
) {
  if (actor.role === "ADMIN") {
    const student = await db.studentProfile.findUnique({
      where: { id: studentId },
      select: { user: { select: { schoolId: true } } },
    });
    if (adminOf(actor, student?.user.schoolId)) return;
    throw forbidden("You do not have access to this student's record.");
  }
  if (actor.studentId === studentId) return;
  if (actor.teacherId) {
    const shared = await db.enrollment.findFirst({
      where: {
        studentId,
        status: "ACTIVE",
        section: { teacherId: actor.teacherId },
      },
      select: { id: true },
    });
    if (shared) return;
  }
  throw forbidden("You do not have access to this student's record.");
}

/**
 * Resolves the section a lesson belongs to for the given student, ensuring the
 * lesson is part of a course they are enrolled in.
 */
export async function assertLessonAccess(
  db: PrismaClient,
  actor: Actor,
  lessonId: string,
) {
  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    select: {
      id: true,
      isPublished: true,
      unit: { select: { courseId: true } },
    },
  });
  if (!lesson) throw notFound("Lesson");
  if (actor.role === "ADMIN") return lesson;

  if (actor.role === "TEACHER") {
    const teaches = await db.section.findFirst({
      where: {
        courseId: lesson.unit.courseId,
        teacherId: actor.teacherId ?? "",
      },
      select: { id: true },
    });
    if (!teaches) throw forbidden("You do not teach this course.");
    return lesson;
  }

  if (!lesson.isPublished) throw notFound("Lesson");
  const enrolled = await db.enrollment.findFirst({
    where: {
      studentId: actor.studentId ?? "",
      status: "ACTIVE",
      section: { courseId: lesson.unit.courseId },
    },
    select: { id: true },
  });
  if (!enrolled) throw forbidden("You are not enrolled in this course.");
  return lesson;
}

/** Asserts the actor owns (or supervises) a submission. */
export async function assertSubmissionAccess(
  db: PrismaClient,
  actor: Actor,
  submissionId: string,
) {
  const submission = await db.submission.findUnique({
    where: { id: submissionId },
    select: {
      id: true,
      studentId: true,
      status: true,
      assignment: {
        select: {
          id: true,
          sectionId: true,
          pointsPossible: true,
          dueAt: true,
          graceMinutes: true,
          allowLate: true,
          closesAt: true,
          rubricId: true,
          section: { select: { teacherId: true, schoolId: true } },
        },
      },
    },
  });
  if (!submission) throw notFound("Submission");

  if (adminOf(actor, submission.assignment.section.schoolId)) {
    return submission;
  }
  if (actor.studentId && submission.studentId === actor.studentId) {
    return submission;
  }
  if (
    actor.teacherId &&
    submission.assignment.section.teacherId === actor.teacherId
  ) {
    return submission;
  }
  throw forbidden("You do not have access to this submission.");
}
