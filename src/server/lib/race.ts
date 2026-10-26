import type { Prisma, PrismaClient } from "../../../generated/prisma";
import { STAR_ASSIGNMENT_TYPES, starsFor } from "./stars";

/**
 * Group Race: each class is split into five teams, and a team's score is the
 * stars its members have earned in that class — Unit Questions and Live
 * Quiz answers (each question once), released graded work, and, in
 * Computer Programming or Telecommunications, the course game.
 */
type Db = PrismaClient | Prisma.TransactionClient;

export const TEAM_COUNT = 5;
export const TEAM_NAMES = [
  "Blue Comets",
  "Orange Rockets",
  "Aqua Sharks",
  "Yellow Lightning",
  "Pink Panthers",
] as const;

const shuffle = <T>(items: T[]) => {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
};

async function activeStudents(db: Db, sectionId: string) {
  const rows = await db.enrollment.findMany({
    where: { sectionId, status: "ACTIVE" },
    select: { studentId: true },
  });
  return rows.map((r) => r.studentId);
}

/**
 * Makes sure the class has its five teams and every enrolled student is on
 * one: students who joined later go to the smallest team, and students who
 * left the class are taken off.
 */
export async function ensureTeams(db: Db, sectionId: string) {
  let teams = await db.raceTeam.findMany({
    where: { sectionId },
    orderBy: { number: "asc" },
    select: {
      id: true,
      number: true,
      members: { select: { studentId: true } },
    },
  });
  if (teams.length < TEAM_COUNT) {
    const have = new Set(teams.map((t) => t.number));
    for (let n = 0; n < TEAM_COUNT; n++) {
      if (have.has(n)) continue;
      await db.raceTeam.create({
        data: { sectionId, number: n, name: TEAM_NAMES[n]! },
      });
    }
    teams = await db.raceTeam.findMany({
      where: { sectionId },
      orderBy: { number: "asc" },
      select: {
        id: true,
        number: true,
        members: { select: { studentId: true } },
      },
    });
  }

  const enrolled = new Set(await activeStudents(db, sectionId));
  const placed = new Set(
    teams.flatMap((t) => t.members.map((m) => m.studentId)),
  );
  const gone = [...placed].filter((id) => !enrolled.has(id));
  if (gone.length > 0) {
    await db.raceMember.deleteMany({
      where: { sectionId, studentId: { in: gone } },
    });
  }
  const sizes = teams.map((t) => ({
    id: t.id,
    size: t.members.filter((m) => enrolled.has(m.studentId)).length,
  }));
  const newcomers = shuffle([...enrolled].filter((id) => !placed.has(id)));
  for (const studentId of newcomers) {
    const smallest = sizes.reduce((a, b) => (b.size < a.size ? b : a));
    smallest.size++;
    await db.raceMember.create({
      data: { teamId: smallest.id, sectionId, studentId },
    });
  }
}

/** Shuffles the whole class into five teams of near-equal size. */
export async function reshuffleTeams(db: Db, sectionId: string) {
  await ensureTeams(db, sectionId);
  const teams = await db.raceTeam.findMany({
    where: { sectionId },
    orderBy: { number: "asc" },
    select: { id: true },
  });
  const students = shuffle(await activeStudents(db, sectionId));
  await db.raceMember.deleteMany({ where: { sectionId } });
  await db.raceMember.createMany({
    data: students.map((studentId, i) => ({
      sectionId,
      studentId,
      teamId: teams[i % teams.length]!.id,
    })),
  });
}

/** Every star a student earned in the class, with when it was earned. */
async function starEvents(db: Db, sectionId: string, courseCode: string) {
  const [answers, grades] = await Promise.all([
    db.$queryRaw<Array<{ studentId: string; at: Date | null }>>`
      SELECT x."studentId", MIN(x.at) AS at
      FROM (
        SELECT a."studentId", r."questionId", r."answeredAt" AS at
        FROM "QuestionResponse" r
        JOIN "AssessmentAttempt" a ON a."id" = r."attemptId"
        JOIN "Assessment" q ON q."id" = a."assessmentId"
        WHERE r."isCorrect" = true AND q."assignmentId" IS NULL
          AND q."sectionId" = ${sectionId}
        UNION ALL
        SELECT p."studentId", l."questionId", l."answeredAt" AS at
        FROM "LiveAnswer" l
        JOIN "LivePlayer" p ON p."id" = l."playerId"
        JOIN "LiveGame" g ON g."id" = p."gameId"
        WHERE l."isCorrect" = true AND g."sectionId" = ${sectionId}
      ) x
      GROUP BY x."studentId", x."questionId"`,
    db.grade.findMany({
      where: {
        status: "RELEASED",
        submission: {
          assignment: { sectionId, type: { in: STAR_ASSIGNMENT_TYPES } },
        },
      },
      select: {
        score: true,
        releasedAt: true,
        submission: { select: { studentId: true } },
      },
    }),
  ]);
  const events: Array<{ studentId: string; at: Date; stars: number }> = [];
  for (const a of answers) {
    events.push({ studentId: a.studentId, at: a.at ?? new Date(0), stars: 1 });
  }
  for (const g of grades) {
    const stars = starsFor(g.score);
    if (stars > 0) {
      events.push({
        studentId: g.submission.studentId,
        at: g.releasedAt ?? new Date(0),
        stars,
      });
    }
  }
  // Course games, and Momo's Quest on this class's units (best result).
  const game = courseCode.endsWith("-CP")
    ? "code"
    : courseCode.endsWith("-TEL")
      ? "call"
      : null;
  const units = await db.assessment.findMany({
    where: { sectionId, unitId: { not: null }, assignmentId: null },
    select: { id: true },
  });
  const played = await db.gameProgress.findMany({
    where: {
      student: { enrollments: { some: { sectionId, status: "ACTIVE" } } },
      OR: [
        ...(game ? [{ game }] : []),
        { game: "quest", levelId: { in: units.map((u) => u.id) } },
      ],
    },
    select: { studentId: true, stars: true, updatedAt: true },
  });
  for (const p of played) {
    events.push({ studentId: p.studentId, at: p.updatedAt, stars: p.stars });
  }
  return events;
}

const DAY = 24 * 60 * 60 * 1000;
const dayKey = (d: Date) => d.toISOString().slice(0, 10);

/** Race lengths a teacher can pick, in minutes. */
export const RACE_MINUTES = [5, 10, 15, 30, 60, 24 * 60, 7 * 24 * 60] as const;

/**
 * The race for one class: teams ranked by stars, each member's stars, and
 * each team's running total over time. During or after a timed race only
 * the stars earned inside it count; with no race yet, all stars do.
 */
export async function raceFor(db: Db, sectionId: string) {
  await ensureTeams(db, sectionId);
  const section = await db.section.findUniqueOrThrow({
    where: { id: sectionId },
    select: {
      id: true,
      code: true,
      course: { select: { name: true, code: true } },
      raceSessions: {
        orderBy: { startsAt: "desc" },
        take: 1,
        select: { id: true, startsAt: true, endsAt: true },
      },
      raceTeams: {
        orderBy: { number: "asc" },
        select: {
          id: true,
          number: true,
          name: true,
          members: {
            select: {
              studentId: true,
              student: { select: { user: { select: { name: true } } } },
            },
          },
        },
      },
    },
  });
  const now = new Date();
  const session = section.raceSessions[0] ?? null;
  const all = await starEvents(db, sectionId, section.course.code);
  const until = session && session.endsAt < now ? session.endsAt : now;
  const events = session
    ? all.filter((e) => e.at >= session.startsAt && e.at <= until)
    : all;

  const teamOf = new Map<string, number>();
  for (const t of section.raceTeams) {
    for (const m of t.members) teamOf.set(m.studentId, t.number);
  }
  const perStudent = new Map<string, number>();
  for (const e of events) {
    perStudent.set(e.studentId, (perStudent.get(e.studentId) ?? 0) + e.stars);
  }

  // Running totals: 12 steps across a timed race, or the last 14 days.
  const buckets: Array<{ end: number; label: string }> = [];
  if (session) {
    const start = session.startsAt.getTime();
    const span = Math.max(60_000, until.getTime() - start);
    const short = span < 2 * DAY;
    for (let i = 1; i <= 12; i++) {
      const end = start + (span * i) / 12;
      const d = new Date(end);
      buckets.push({
        end,
        label: short
          ? d.toLocaleTimeString("en-PH", {
              hour: "numeric",
              minute: "2-digit",
              timeZone: "Asia/Manila",
            })
          : d.toLocaleDateString("en-PH", {
              month: "short",
              day: "numeric",
              timeZone: "Asia/Manila",
            }),
      });
    }
  } else {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    for (let i = 13; i >= 0; i--) {
      const day = new Date(today.getTime() - i * DAY);
      buckets.push({
        end: day.getTime() + DAY - 1,
        label: new Date(`${dayKey(day)}T00:00:00`).toLocaleDateString("en-PH", {
          month: "short",
          day: "numeric",
        }),
      });
    }
  }
  const history = section.raceTeams.map((t) =>
    buckets.map((b) =>
      events
        .filter(
          (e) =>
            teamOf.get(e.studentId) === t.number && e.at.getTime() <= b.end,
        )
        .reduce((sum, e) => sum + e.stars, 0),
    ),
  );

  const teams = section.raceTeams
    .map((t) => {
      const members = t.members
        .map((m) => ({
          studentId: m.studentId,
          name: m.student.user.name ?? "Student",
          stars: perStudent.get(m.studentId) ?? 0,
        }))
        .sort((a, b) => b.stars - a.stars || a.name.localeCompare(b.name));
      const stars = members.reduce((sum, m) => sum + m.stars, 0);
      return {
        id: t.id,
        number: t.number,
        name: t.name,
        stars,
        average: members.length
          ? Math.round((stars / members.length) * 10) / 10
          : 0,
        members,
      };
    })
    .sort((a, b) => b.stars - a.stars || a.number - b.number);
  const ranked = teams.map((t, i) => ({
    ...t,
    rank:
      i > 0 && teams[i - 1]!.stars === t.stars
        ? teams.findIndex((x) => x.stars === t.stars) + 1
        : i + 1,
  }));

  return {
    sectionId: section.id,
    className: `${section.course.name} — ${section.code}`,
    now: now.toISOString(),
    session: session
      ? {
          id: session.id,
          startsAt: session.startsAt.toISOString(),
          endsAt: session.endsAt.toISOString(),
          running: session.endsAt > now,
        }
      : null,
    teams: ranked,
    labels: buckets.map((b) => b.label),
    history: section.raceTeams.map((t, i) => ({
      number: t.number,
      name: t.name,
      totals: history[i]!,
    })),
  };
}
