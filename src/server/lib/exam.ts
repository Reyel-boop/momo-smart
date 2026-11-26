/**
 * The course Exam: one per class, for the courses that have one (TLE – ICT
 * Telecommunications and Computer Programming). It is an Assessment taken
 * like the Unit Questions (one question at a time, in focus mode) but with
 * 50 questions on Bloom's Taxonomy, a minute each, and one try.
 *
 * A class's Exam is made the first time someone opens it. Its id is fixed
 * (`exam-<section id>`), so it is easy to find and can never be made twice.
 */
import { randomUUID } from "node:crypto";

import type { Prisma, PrismaClient } from "../../../generated/prisma";
import { examForCourse } from "../demo/tle/exams";

export const EXAM_PREFIX = "exam-";
/** Prisma filter for Exams only. */
export const EXAM_WHERE = { id: { startsWith: EXAM_PREFIX } } as const;
export const EXAM_SECONDS = 60;
export const EXAM_TRIES = 1;
export const examIdFor = (sectionId: string) => `${EXAM_PREFIX}${sectionId}`;
export const isExamId = (id: string) => id.startsWith(EXAM_PREFIX);

const LABELS = ["A", "B", "C", "D"];

export const EXAM_INSTRUCTIONS =
  "50 easy questions about the whole course, one at a time. Each question has 1 minute. Read each question carefully and pick the best answer. You have one try.";

/**
 * The class's Exam id, making the Exam first if the course has one and the
 * class doesn't yet. Null when the course has no Exam.
 */
export async function ensureExam(
  db: PrismaClient,
  section: { id: string; courseCode: string },
): Promise<string | null> {
  const items = examForCourse(section.courseCode);
  if (!items) return null;
  const id = examIdFor(section.id);
  const found = await db.assessment.findUnique({
    where: { id },
    select: { id: true },
  });
  if (found) return id;

  const questions: Prisma.QuestionCreateWithoutAssessmentInput[] = items.map(
    (item, n) => ({
      id: randomUUID(),
      order: n + 1,
      type: "MULTIPLE_CHOICE",
      prompt: item.q,
      // The Bloom's level, for the teacher's results.
      helperText: item.level,
      points: 1,
      explanation: item.why,
      options: {
        create: item.choices.map((text, k) => ({
          label: LABELS[k]!,
          text,
          isCorrect: k === item.answer,
          order: k,
        })),
      },
    }),
  );
  try {
    await db.assessment.create({
      data: {
        id,
        sectionId: section.id,
        title: "Exam",
        instructions: EXAM_INSTRUCTIONS,
        standards: "Bloom's Taxonomy",
        totalPoints: items.length,
        maxAttempts: EXAM_TRIES,
        allowScratchpad: false,
        publishedAt: new Date(),
        questions: { create: questions },
      },
    });
  } catch (error) {
    // Made at the same moment by another request: that one is the Exam.
    const again = await db.assessment.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!again) throw error;
  }
  return id;
}
