import type {
  AssignmentType,
  Prisma,
  PrismaClient,
} from "../../../generated/prisma";

/**
 * Star Points: a student earns one star for every Unit Question answered
 * correctly (each question counts once, so retries can't farm stars) and
 * one star per point scored on graded work, once the grade is released.
 * Stars are derived from the answers and the gradebook rather than stored,
 * so a total can never drift from the work behind it.
 */
export const STAR_ASSIGNMENT_TYPES: AssignmentType[] = [
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
];

/** Stars an assignment is worth when scored in full. */
export function starsAvailable(assignment: {
  type: AssignmentType;
  pointsPossible: number;
}): number {
  return STAR_ASSIGNMENT_TYPES.includes(assignment.type)
    ? starsFor(assignment.pointsPossible)
    : 0;
}

/** Rewards a student unlocks as their star total grows, lowest first. */
export const STAR_REWARDS = [
  { stars: 250, reward: "Late Pass" },
  { stars: 750, reward: "Seat Choice for a Week" },
  { stars: 1500, reward: "Homework Pass" },
  { stars: 2500, reward: "Free Period Pass" },
] as const;

export function starsFor(score: number | null): number {
  return Math.max(0, Math.round(score ?? 0));
}

/** Where a star total sits against the next reward tier. */
export function rewardProgress(total: number) {
  const next = STAR_REWARDS.find((tier) => tier.stars > total) ?? null;

  return {
    nextReward: next,
    rewardsEarned: STAR_REWARDS.filter((tier) => tier.stars <= total).map(
      (tier) => tier.reward,
    ),
    starsToNext: next ? next.stars - total : 0,
    percentToNext: next
      ? Math.min(100, Math.round((total / next.stars) * 100))
      : 100,
  };
}

type Db = PrismaClient | Prisma.TransactionClient;
export type StarTotal = { questions: number; graded: number; total: number };

/**
 * Every student's stars: one per Unit Question answered correctly (each
 * question once) plus one per point of released graded work.
 */
export async function starTotals(db: Db): Promise<Map<string, StarTotal>> {
  const [answers, grades] = await Promise.all([
    db.$queryRaw<Array<{ studentId: string; stars: bigint }>>`
      SELECT a."studentId", COUNT(DISTINCT r."questionId") AS stars
      FROM "QuestionResponse" r
      JOIN "AssessmentAttempt" a ON a."id" = r."attemptId"
      JOIN "Assessment" q ON q."id" = a."assessmentId"
      WHERE r."isCorrect" = true AND q."assignmentId" IS NULL
      GROUP BY a."studentId"`,
    db.grade.findMany({
      where: {
        status: "RELEASED",
        submission: { assignment: { type: { in: STAR_ASSIGNMENT_TYPES } } },
      },
      select: { score: true, submission: { select: { studentId: true } } },
    }),
  ]);

  const totals = new Map<string, StarTotal>();
  const entry = (id: string) => {
    let row = totals.get(id);
    if (!row) {
      row = { questions: 0, graded: 0, total: 0 };
      totals.set(id, row);
    }
    return row;
  };
  for (const row of answers) {
    const stars = Number(row.stars);
    const t = entry(row.studentId);
    t.questions += stars;
    t.total += stars;
  }
  for (const grade of grades) {
    const stars = starsFor(grade.score);
    const t = entry(grade.submission.studentId);
    t.graded += stars;
    t.total += stars;
  }
  return totals;
}

/** One student's Unit Question stars, per set of questions, newest first. */
export async function questionStarLedger(db: Db, studentId: string) {
  const rows = await db.$queryRaw<
    Array<{
      id: string;
      title: string;
      courseName: string;
      totalPoints: number;
      stars: bigint;
      lastAnsweredAt: Date | null;
    }>
  >`
    SELECT q."id", q."title", c."name" AS "courseName", q."totalPoints",
           COUNT(DISTINCT r."questionId") AS stars,
           MAX(r."answeredAt") AS "lastAnsweredAt"
    FROM "QuestionResponse" r
    JOIN "AssessmentAttempt" a ON a."id" = r."attemptId"
    JOIN "Assessment" q ON q."id" = a."assessmentId"
    JOIN "Section" s ON s."id" = q."sectionId"
    JOIN "Course" c ON c."id" = s."courseId"
    WHERE a."studentId" = ${studentId}
      AND r."isCorrect" = true
      AND q."assignmentId" IS NULL
    GROUP BY q."id", q."title", c."name", q."totalPoints"
    ORDER BY MAX(r."answeredAt") DESC NULLS LAST`;
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    courseName: row.courseName,
    stars: Number(row.stars),
    totalPoints: Number(row.totalPoints),
    answeredAt: row.lastAnsweredAt,
  }));
}
