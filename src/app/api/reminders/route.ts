import { timingSafeEqual } from "node:crypto";

import { NextResponse } from "next/server";

import { env } from "~/env";
import { db } from "~/server/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * The day's email reminders, by email address, for the School Hub. The Hub
 * calls this once a morning with `Authorization: Bearer $REMINDER_SECRET`,
 * matches each address to a Hub account and sends one digest per person.
 *
 * Students: work due tomorrow, work past due and not handed in (this term),
 * and grades released in the last day. Teachers: for each class this term,
 * who needs help, missing work, hand-ins waiting for a grade and yesterday's
 * attendance not yet submitted. People with nothing to report are left out.
 */
export async function GET(request: Request) {
  if (
    !env.REMINDER_SECRET ||
    !matches(
      request.headers.get("authorization"),
      `Bearer ${env.REMINDER_SECRET}`,
    )
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // The server runs on Philippine time (see instrumentation.ts).
  const now = new Date();
  const startOf = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const tomorrow = startOf(new Date(now.getTime() + 86_400_000));
  const dayAfter = startOf(new Date(tomorrow.getTime() + 36 * 3_600_000));
  const yesterday = startOf(new Date(now.getTime() - 86_400_000));
  const gradesSince = new Date(now.getTime() - 26 * 3_600_000);
  const HANDED_IN = new Set(["SUBMITTED", "GRADED", "RETURNED", "EXCUSED"]);

  const [assignments, grades, sections, waiting, openAttendance] =
    await Promise.all([
      // This term's work that is due tomorrow or already past due.
      db.assignment.findMany({
        where: {
          publishedAt: { not: null },
          section: { term: { isCurrent: true } },
          OR: [
            { dueAt: { gte: tomorrow, lt: dayAfter } },
            { dueAt: { lt: now } },
          ],
        },
        select: {
          title: true,
          dueAt: true,
          sectionId: true,
          section: {
            select: {
              course: { select: { name: true } },
              enrollments: {
                where: { status: "ACTIVE" },
                select: { studentId: true },
              },
            },
          },
          submissions: { select: { studentId: true, status: true } },
        },
      }),
      db.grade.findMany({
        where: { status: "RELEASED", releasedAt: { gte: gradesSince } },
        select: {
          score: true,
          submission: {
            select: {
              studentId: true,
              assignment: {
                select: {
                  title: true,
                  pointsPossible: true,
                  section: { select: { course: { select: { name: true } } } },
                },
              },
            },
          },
        },
      }),
      db.section.findMany({
        where: { term: { isCurrent: true } },
        select: {
          id: true,
          code: true,
          course: { select: { name: true } },
          teacher: {
            select: {
              user: { select: { name: true, email: true, isActive: true } },
            },
          },
          enrollments: {
            where: { status: "ACTIVE" },
            select: {
              currentPercent: true,
              student: { select: { user: { select: { name: true } } } },
            },
          },
        },
      }),
      db.submission.groupBy({
        by: ["assignmentId"],
        where: {
          status: "SUBMITTED",
          grade: { status: { in: ["PENDING", "IN_PROGRESS"] } },
          assignment: { section: { term: { isCurrent: true } } },
        },
        _count: { _all: true },
      }),
      db.attendanceSession.findMany({
        where: {
          date: {
            gte: new Date(
              Date.UTC(
                yesterday.getFullYear(),
                yesterday.getMonth(),
                yesterday.getDate(),
              ),
            ),
            lt: new Date(
              Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()),
            ),
          },
          status: { not: "SUBMITTED" },
        },
        select: { sectionId: true },
      }),
    ]);

  type Item = { title: string; course: string; dueAt?: Date };
  type Student = {
    dueTomorrow: Item[];
    missing: Item[];
    newGrades: {
      title: string;
      course: string;
      score: number;
      points: number;
    }[];
  };
  const byStudent = new Map<string, Student>();
  const studentOf = (id: string) => {
    let s = byStudent.get(id);
    if (!s)
      byStudent.set(id, (s = { dueTomorrow: [], missing: [], newGrades: [] }));
    return s;
  };
  const missingBySection = new Map<string, number>();

  for (const a of assignments) {
    const isTomorrow = a.dueAt >= tomorrow && a.dueAt < dayAfter;
    for (const { studentId } of a.section.enrollments) {
      const sub = a.submissions.find((x) => x.studentId === studentId);
      if (sub && HANDED_IN.has(sub.status)) continue;
      const item = {
        title: a.title,
        course: a.section.course.name,
        dueAt: a.dueAt,
      };
      if (isTomorrow) studentOf(studentId).dueTomorrow.push(item);
      else {
        studentOf(studentId).missing.push(item);
        missingBySection.set(
          a.sectionId,
          (missingBySection.get(a.sectionId) ?? 0) + 1,
        );
      }
    }
  }
  for (const g of grades) {
    const { assignment } = g.submission;
    studentOf(g.submission.studentId).newGrades.push({
      title: assignment.title,
      course: assignment.section.course.name,
      score: g.score ?? 0,
      points: assignment.pointsPossible,
    });
  }

  const profiles = await db.studentProfile.findMany({
    where: {
      id: { in: [...byStudent.keys()] },
      user: { isActive: true, email: { not: null } },
    },
    select: { id: true, user: { select: { name: true, email: true } } },
  });
  const students = profiles.map((p) => ({
    email: p.user.email!.toLowerCase(),
    name: p.user.name,
    ...byStudent.get(p.id)!,
  }));

  // Teachers: one entry per teacher, with their classes that need anything.
  const waitingByAssignment = new Map(
    waiting.map((w) => [w.assignmentId, w._count._all]),
  );
  const ungradedBySection = new Map<string, number>();
  if (waiting.length > 0) {
    const owners = await db.assignment.findMany({
      where: { id: { in: [...waitingByAssignment.keys()] } },
      select: { id: true, sectionId: true },
    });
    for (const o of owners) {
      ungradedBySection.set(
        o.sectionId,
        (ungradedBySection.get(o.sectionId) ?? 0) +
          (waitingByAssignment.get(o.id) ?? 0),
      );
    }
  }
  const attendancePending = new Set(openAttendance.map((s) => s.sectionId));
  const teachers = new Map<
    string,
    {
      email: string;
      name: string | null;
      sections: {
        name: string;
        students: number;
        needsHelp: string[];
        missing: number;
        ungraded: number;
        attendancePending: boolean;
      }[];
    }
  >();
  for (const s of sections) {
    const user = s.teacher.user;
    if (!user.email || !user.isActive) continue;
    const needsHelp = s.enrollments
      .filter((e) => e.currentPercent !== null && e.currentPercent < 75)
      .map((e) => e.student.user.name ?? "Student");
    const entry = {
      name: `${s.course.name} — ${s.code}`,
      students: s.enrollments.length,
      needsHelp,
      missing: missingBySection.get(s.id) ?? 0,
      ungraded: ungradedBySection.get(s.id) ?? 0,
      attendancePending: attendancePending.has(s.id),
    };
    if (
      !entry.needsHelp.length &&
      !entry.missing &&
      !entry.ungraded &&
      !entry.attendancePending
    )
      continue;
    const key = user.email.toLowerCase();
    const t = teachers.get(key) ?? {
      email: key,
      name: user.name,
      sections: [],
    };
    t.sections.push(entry);
    teachers.set(key, t);
  }

  return NextResponse.json({
    generatedAt: now.toISOString(),
    students,
    teachers: [...teachers.values()],
  });
}

function matches(actual: string | null, expected: string) {
  if (!actual) return false;
  const a = Buffer.from(actual);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
