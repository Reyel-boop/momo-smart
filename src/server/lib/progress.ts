import { round } from "~/server/lib/grading";
import { examIdFor } from "~/server/lib/exam";
import { starTotals } from "~/server/lib/stars";
import { autoCheckWaitingSubmissions } from "~/server/lib/unit-activity";
import type { PrismaClient } from "../../../generated/prisma";

/**
 * Every student of one class with their progress: grade, lessons, Unit
 * Questions, assignments handed in / missing, attendance, stars and last
 * sign-in, and an "On track / Watch / Needs help" status. Used by the
 * teacher's Class Progress page and the student's own profile, so both see
 * the same thing. `totals` (star totals) can be passed in when reused.
 */
export async function sectionProgressOf(
  db: PrismaClient,
  section: { id: string; courseId: string },
  totalsIn?: Awaited<ReturnType<typeof starTotals>>,
) {
  // Hand-ins check themselves; clear any still waiting first.
  await autoCheckWaitingSubmissions(db, {
    assignment: { sectionId: section.id },
  });
  const now = new Date();

  const [
    enrollments,
    unitCount,
    assignments,
    attempts,
    attendance,
    totals,
    exam,
  ] = await Promise.all([
      db.enrollment.findMany({
        where: { sectionId: section.id, status: "ACTIVE" },
        orderBy: { student: { user: { name: "asc" } } },
        select: {
          currentPercent: true,
          currentLetter: true,
          syllabusPercent: true,
          student: {
            select: {
              id: true,
              studentNumber: true,
              user: {
                select: { name: true, image: true, lastLoginAt: true },
              },
            },
          },
        },
      }),
      db.unit.count({ where: { courseId: section.courseId } }),
      // Work that is already due (past its due date).
      db.assignment.findMany({
        where: {
          sectionId: section.id,
          publishedAt: { not: null },
          dueAt: { lte: now },
        },
        select: {
          id: true,
          submissions: { select: { studentId: true, status: true } },
        },
      }),
      // Unit Questions finished in this class.
      db.assessmentAttempt.findMany({
        where: {
          status: "GRADED",
          assessment: {
            sectionId: section.id,
            unitId: { not: null },
            assignmentId: null,
          },
        },
        distinct: ["studentId", "assessmentId"],
        select: {
          studentId: true,
          assessment: { select: { unitId: true } },
        },
      }),
      db.attendanceRecord.groupBy({
        by: ["studentId", "status"],
        where: { session: { sectionId: section.id } },
        _count: { _all: true },
      }),
      totalsIn ?? starTotals(db),
      // The course Exam (Telecommunications, Computer Programming), once made.
      db.assessment.findUnique({
        where: { id: examIdFor(section.id) },
        select: {
          totalPoints: true,
          attempts: {
            where: { status: "GRADED" },
            select: { studentId: true, totalScore: true },
          },
        },
      }),
    ]);

  const unitsDone = new Map<string, Set<string>>();
  for (const a of attempts) {
    if (!a.assessment.unitId) continue;
    const set = unitsDone.get(a.studentId) ?? new Set<string>();
    set.add(a.assessment.unitId);
    unitsDone.set(a.studentId, set);
  }
  const attendanceOf = new Map<string, { attended: number; total: number }>();
  for (const row of attendance) {
    const cur = attendanceOf.get(row.studentId) ?? {
      attended: 0,
      total: 0,
    };
    cur.total += row._count._all;
    if (row.status !== "ABSENT" && row.status !== "EXCUSED") {
      cur.attended += row._count._all;
    }
    attendanceOf.set(row.studentId, cur);
  }

  const examScore = new Map<string, number>();
  for (const a of exam?.attempts ?? []) {
    const score = a.totalScore ?? 0;
    examScore.set(a.studentId, Math.max(score, examScore.get(a.studentId) ?? 0));
  }

  const HANDED_IN = new Set(["SUBMITTED", "GRADED", "RETURNED"]);
  const students = enrollments.map((e) => {
    const id = e.student.id;
    let due = 0;
    let handedIn = 0;
    for (const a of assignments) {
      const mine = a.submissions.find((sub) => sub.studentId === id);
      if (mine?.status === "EXCUSED") continue;
      due += 1;
      if (mine && HANDED_IN.has(mine.status)) handedIn += 1;
    }
    const att = attendanceOf.get(id);
    const attendanceRate =
      att && att.total > 0 ? round((att.attended / att.total) * 100) : null;
    const grade = e.currentPercent;
    const missing = due - handedIn;
    // Needs help: failing, 2+ missing, or attending under 80%.
    // Watch: close to failing, 1 missing, or attending under 90%.
    // Nothing to judge yet: no grade, no work due and no attendance taken.
    const status =
      grade === null && due === 0 && attendanceRate === null
        ? ("NEW" as const)
        : (grade !== null && grade < 75) ||
            missing >= 2 ||
            (attendanceRate !== null && attendanceRate < 80)
          ? ("NEEDS_HELP" as const)
          : (grade !== null && grade < 80) ||
              missing === 1 ||
              (attendanceRate !== null && attendanceRate < 90)
            ? ("WATCH" as const)
            : ("ON_TRACK" as const);
    return {
      studentId: id,
      name: e.student.user.name ?? "Student",
      image: e.student.user.image,
      studentNumber: e.student.studentNumber,
      grade,
      letter: e.currentLetter,
      lessonsPercent: Math.round(e.syllabusPercent ?? 0),
      unitsDone: unitsDone.get(id)?.size ?? 0,
      examScore: examScore.get(id) ?? null,
      due,
      handedIn,
      missing,
      attendanceRate,
      stars: totals.get(id)?.total ?? 0,
      lastLoginAt: e.student.user.lastLoginAt,
      status,
    };
  });

  const graded = students.filter((s) => s.grade !== null);
  return {
    unitCount,
    examPoints: exam?.totalPoints ?? null,
    dueCount: assignments.length,
    students,
    summary: {
      count: students.length,
      average:
        graded.length > 0
          ? round(graded.reduce((sum, s) => sum + s.grade!, 0) / graded.length)
          : null,
      lessonsAverage:
        students.length > 0
          ? Math.round(
              students.reduce((sum, s) => sum + s.lessonsPercent, 0) /
                students.length,
            )
          : 0,
      needsHelp: students.filter((s) => s.status === "NEEDS_HELP").length,
      watch: students.filter((s) => s.status === "WATCH").length,
      onTrack: students.filter((s) => s.status === "ON_TRACK").length,
      missingTotal: students.reduce((sum, s) => sum + s.missing, 0),
    },
  };
}
