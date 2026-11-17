import { activityFor, describe } from "~/lib/unit-activities";
import { letterFor, refreshEnrollmentGrade, round } from "~/server/lib/grading";
import type { Prisma, PrismaClient } from "../../../generated/prisma";

/**
 * Unit Activities: after a student finishes a unit's Unit Questions, the
 * unit's short performance task opens as an assignment in their class. It is
 * created once per class (the first time anyone there finishes), counts as a
 * Performance Task, and is due at the end of the school year. Like every
 * assignment, Momo checks it automatically when it's handed in (see
 * autoCheckSubmission); the teacher can still change the grade.
 */

type Db = PrismaClient | Prisma.TransactionClient;

/**
 * "🧩 Unit 3 Activity" — every unit activity's title starts with this. The
 * puzzle piece keeps a teacher's own "Unit 3 Activity …" assignment apart.
 */
export const activityPrefix = (unitOrder: number) =>
  `🧩 Unit ${unitOrder} Activity`;

export const UNIT_ACTIVITY_POINTS = 10;

/** Whether an assignment is a unit activity. */
export function isUnitActivity(assignment: {
  title: string;
  unitId: string | null;
}) {
  return (
    !!assignment.unitId && /^🧩 Unit \d+ Activity: /u.test(assignment.title)
  );
}

/** Whether the student has finished the unit's questions in this class. */
export async function unitQuestionsDone(
  db: Db,
  studentId: string,
  sectionId: string,
  unitId: string,
) {
  const done = await db.assessmentAttempt.findFirst({
    where: {
      studentId,
      status: "GRADED",
      assessment: { sectionId, unitId, assignmentId: null },
    },
    select: { id: true },
  });
  return !!done;
}

/**
 * The class's activity for a unit, created if it doesn't exist yet. Returns
 * null for a unit without a written activity.
 */
export async function ensureUnitActivity(
  db: PrismaClient,
  sectionId: string,
  unit: { id: string; order: number; title: string },
) {
  const activity = activityFor(unit.title);
  if (!activity) return null;
  const prefix = activityPrefix(unit.order);
  const select = { id: true, title: true } as const;

  const existing = await db.assignment.findFirst({
    where: { sectionId, unitId: unit.id, title: { startsWith: prefix } },
    select,
  });
  if (existing) return existing;

  // One at a time per class and unit, so two students finishing together
  // don't create it twice.
  return db.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${`unit-activity:${sectionId}:${unit.id}`}))`;
    const again = await tx.assignment.findFirst({
      where: { sectionId, unitId: unit.id, title: { startsWith: prefix } },
      select,
    });
    if (again) return again;
    const section = await tx.section.findUnique({
      where: { id: sectionId },
      select: { term: { select: { endDate: true } } },
    });
    const yearEnd = section?.term.endDate ?? new Date();
    const due = new Date(
      Math.max(yearEnd.getTime(), Date.now() + 14 * 86_400_000),
    );
    return tx.assignment.create({
      data: {
        sectionId,
        unitId: unit.id,
        title: `${prefix}: ${activity.title}`,
        description: describe(activity),
        // A project counts toward Performance Tasks on the report card.
        type: "PROJECT",
        format: "FILE_UPLOAD",
        pointsPossible: UNIT_ACTIVITY_POINTS,
        dueAt: due,
        allowLate: true,
        publishedAt: new Date(),
      },
      select,
    });
  });
}

/**
 * Opens the activities a student has earned but whose class activity hasn't
 * been created yet (for example, Unit Questions finished before this
 * feature existed).
 */
export async function openEarnedActivities(
  db: PrismaClient,
  studentId: string,
) {
  const finished = await db.assessmentAttempt.findMany({
    where: {
      studentId,
      status: "GRADED",
      assessment: {
        unitId: { not: null },
        assignmentId: null,
        section: {
          enrollments: { some: { studentId, status: "ACTIVE" } },
        },
      },
    },
    distinct: ["assessmentId"],
    select: {
      assessment: {
        select: {
          sectionId: true,
          unit: { select: { id: true, order: true, title: true } },
        },
      },
    },
  });
  const earned = finished.flatMap(({ assessment }) =>
    assessment.unit
      ? [{ sectionId: assessment.sectionId, unit: assessment.unit }]
      : [],
  );
  if (earned.length === 0) return;

  // One query for the ones that already exist; create only the rest.
  const existing = await db.assignment.findMany({
    where: {
      sectionId: { in: [...new Set(earned.map((e) => e.sectionId))] },
      unitId: { in: [...new Set(earned.map((e) => e.unit.id))] },
      title: { startsWith: "🧩 Unit " },
    },
    select: { sectionId: true, unitId: true },
  });
  const have = new Set(existing.map((e) => `${e.sectionId}:${e.unitId}`));
  for (const { sectionId, unit } of earned) {
    if (!have.has(`${sectionId}:${unit.id}`)) {
      await ensureUnitActivity(db, sectionId, unit);
    }
  }
}

/** Points taken off any assignment handed in after its due date. */
export const LATE_PENALTY = 5;

const AUTO_FEEDBACK =
  "Checked automatically by Momo: full points for handing it in on time.";

/**
 * Every assignment is checked automatically when it's handed in: full
 * points on time, minus 5 if it was late. The grade is released right away,
 * and the teacher can still change it like any other grade. Only a grade
 * that is still waiting (PENDING) is touched, so a teacher's own check is
 * never overwritten and running this twice does nothing.
 */
export async function autoCheckSubmission(
  db: PrismaClient,
  submissionId: string,
) {
  const submission = await db.submission.findUnique({
    where: { id: submissionId },
    select: {
      status: true,
      studentId: true,
      timeliness: true,
      grade: { select: { status: true } },
      assignment: {
        select: {
          title: true,
          unitId: true,
          sectionId: true,
          pointsPossible: true,
        },
      },
    },
  });
  if (
    submission?.status !== "SUBMITTED" ||
    submission.grade?.status !== "PENDING"
  ) {
    return null;
  }

  const { assignment } = submission;
  const penalty = submission.timeliness === "LATE" ? LATE_PENALTY : 0;
  const score = Math.max(0, round(assignment.pointsPossible - penalty, 2));
  const percent =
    assignment.pointsPossible > 0
      ? (score / assignment.pointsPossible) * 100
      : 0;
  const now = new Date();

  const checked = await db.$transaction(async (tx) => {
    // Claim the waiting grade; a teacher (or another request) got there
    // first if nothing matches.
    const claimed = await tx.grade.updateMany({
      where: { submissionId, status: "PENDING" },
      data: {
        status: "RELEASED",
        graderId: null,
        score,
        latePenalty: penalty,
        letter: letterFor(percent),
        feedback:
          penalty > 0
            ? `Checked automatically by Momo: full points for handing it in, minus ${penalty} because it was late.`
            : AUTO_FEEDBACK,
        gradedAt: now,
        releasedAt: now,
      },
    });
    if (claimed.count === 0) return false;
    await tx.submission.update({
      where: { id: submissionId },
      data: { status: "GRADED" },
    });
    return true;
  });
  if (!checked) return null;

  await refreshEnrollmentGrade(
    db,
    assignment.sectionId,
    submission.studentId,
    `Graded: ${assignment.title}`,
  );
  const student = await db.studentProfile.findUnique({
    where: { id: submission.studentId },
    select: { userId: true },
  });
  if (student) {
    await db.notification.create({
      data: {
        userId: student.userId,
        type: "GRADE_RELEASED",
        title: `Grade posted: ${assignment.title}`,
        body: `${score} / ${assignment.pointsPossible} (${letterFor(percent)})`,
        linkUrl: `/assignments/submissions/${submissionId}`,
      },
    });
  }
  return { score, penalty };
}

/**
 * Checks hand-ins still waiting for a grade (handed in before automatic
 * checking existed, or whose check didn't finish). `where` scopes the
 * search, e.g. to one student or to a teacher's classes.
 */
export async function autoCheckWaitingSubmissions(
  db: PrismaClient,
  where: { studentId?: string; assignment?: Prisma.AssignmentWhereInput },
) {
  const waiting = await db.submission.findMany({
    where: {
      studentId: where.studentId,
      status: "SUBMITTED",
      grade: { status: "PENDING" },
      assignment: where.assignment,
    },
    select: { id: true },
    take: 200,
  });
  for (const { id } of waiting) await autoCheckSubmission(db, id);
}
