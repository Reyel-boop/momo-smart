/**
 * The school's built-in curriculum — Grade 10 core subjects and TLE 7–10 —
 * for a real (non-demo) school: courses, units, lessons with their lectures,
 * and the Unit Questions bank.
 *
 * `createCurriculum` fills an empty database once (scripts/setup-school.ts).
 * `createUnitQuizzesForSection` gives each new class its own copy of the Unit
 * Questions, so students' tries and results are kept per class.
 */
import { randomUUID } from "node:crypto";

import type { Prisma, PrismaClient } from "../../generated/prisma";
import { LECTURE_SECTION_TITLE } from "../lib/video";
import {
  GRADE10_SUBJECTS,
  type DemoLesson,
  type DemoSubject,
} from "./demo/grade10";
import { UNIT_QUIZZES, type QuizItem } from "./demo/grade10-quiz";
import { GRADE10_LECTURES, lectureVideoUrl } from "./demo/lectures";
import { TLE_SUBJECTS } from "./demo/tle";

export const ALL_SUBJECTS: DemoSubject[] = [
  ...GRADE10_SUBJECTS,
  ...TLE_SUBJECTS,
];

/**
 * Science 10 unit 4 is written out by hand in the demo seed; for a real
 * school its three lessons carry their lectures like every other lesson.
 */
const SCIENCE_UNIT4_LESSONS = [
  {
    title: "Intro to Energetics",
    summary: "Biomolecules, ATP and enzymes.",
  },
  {
    title: "Glycolysis and the Citric Acid Cycle",
    summary: "Breaking down glucose to capture its energy.",
  },
  {
    title: "Electron Transport Chain",
    summary: "Chemiosmosis and oxidative phosphorylation.",
  },
];

const QUIZ_INSTRUCTIONS =
  "Read the unit discussion first. The five questions come one at a time, 2 minutes each, and you see the rationale after every answer. You have two tries; your best score counts.";
const LABELS = ["A", "B", "C", "D"];

/** The Unit Questions for a course's unit (1-based), if it has any. */
export function quizFor(
  courseCode: string,
  unitOrder: number,
): QuizItem[] | null {
  const subject = ALL_SUBJECTS.find((s) => s.code === courseCode);
  if (!subject) return null;
  const index = unitOrder - 1;
  return (
    subject.units[index]?.quiz ?? UNIT_QUIZZES[subject.key]?.[index] ?? null
  );
}

/**
 * Creates departments, courses, units and lessons (with lecture, reading and
 * self-check tabs). Meant for an empty database; inserts in bulk.
 */
export async function createCurriculum(db: PrismaClient) {
  const departments = new Map<string, string>();
  for (const subject of ALL_SUBJECTS) {
    if (departments.has(subject.department)) continue;
    const department = await db.department.create({
      data: {
        name: subject.department,
        code: subject.key.startsWith("TLE") ? "TLE" : subject.key,
      },
    });
    departments.set(subject.department, department.id);
  }

  const courseRows: Prisma.CourseCreateManyInput[] = [];
  const unitRows: Prisma.UnitCreateManyInput[] = [];
  const lessonRows: Prisma.LessonCreateManyInput[] = [];
  const sectionRows: Prisma.LessonSectionCreateManyInput[] = [];

  for (const subject of ALL_SUBJECTS) {
    const courseId = randomUUID();
    courseRows.push({
      id: courseId,
      code: subject.code,
      name: subject.name,
      description: subject.description,
      level: "REGULAR",
      credits: 1,
      departmentId: departments.get(subject.department)!,
      colorToken: subject.colorToken,
    });

    for (const [index, plan] of subject.units.entries()) {
      const unitId = randomUUID();
      unitRows.push({
        id: unitId,
        courseId,
        order: index + 1,
        title: `Unit ${index + 1}: ${plan.title}`,
        description: plan.description,
      });

      const lessons: DemoLesson[] =
        plan.lessons.length > 0
          ? plan.lessons
          : subject.key === "SCI" && index === 3
            ? SCIENCE_UNIT4_LESSONS.map((l) => ({
                ...l,
                reading: "",
                questions: [],
              }))
            : [];

      for (const [lessonIndex, item] of lessons.entries()) {
        const lessonId = randomUUID();
        const lecture = item.lecture ?? GRADE10_LECTURES[item.title];
        lessonRows.push({
          id: lessonId,
          unitId,
          order: lessonIndex + 1,
          title: item.title,
          summary: item.summary,
          estimatedMinutes: 40,
          videoUrl: lecture ? lectureVideoUrl(lecture) : null,
        });
        if (lecture) {
          sectionRows.push({
            lessonId,
            kind: "READING",
            order: 0,
            title: LECTURE_SECTION_TITLE,
            body: lecture.lecture,
          });
        }
        if (item.reading) {
          sectionRows.push({
            lessonId,
            kind: "READING",
            order: 1,
            title: "Reading",
            body: item.reading,
          });
        }
        if (item.questions.length > 0) {
          sectionRows.push({
            lessonId,
            kind: "SELF_CHECK",
            order: 2,
            title: "Self-Check",
            body: item.questions.map((q, n) => `${n + 1}. ${q}`).join("\n"),
          });
        }
      }
    }
  }

  await db.course.createMany({ data: courseRows });
  await db.unit.createMany({ data: unitRows });
  await db.lesson.createMany({ data: lessonRows });
  await db.lessonSection.createMany({ data: sectionRows });
  return {
    courses: courseRows.length,
    units: unitRows.length,
    lessons: lessonRows.length,
  };
}

/**
 * Gives a class its own published Unit Questions for every unit of its
 * course that has some. Units that already have them are skipped, so this is
 * safe to run again.
 */
export async function createUnitQuizzesForSection(
  db: PrismaClient | Prisma.TransactionClient,
  sectionId: string,
) {
  const section = await db.section.findUniqueOrThrow({
    where: { id: sectionId },
    select: {
      course: {
        select: {
          code: true,
          units: {
            orderBy: { order: "asc" },
            select: { id: true, order: true },
          },
        },
      },
      assessments: {
        where: { unitId: { not: null }, assignmentId: null },
        select: { unitId: true },
      },
    },
  });
  const done = new Set(section.assessments.map((a) => a.unitId));

  const quizRows: Prisma.AssessmentCreateManyInput[] = [];
  const questionRows: Prisma.QuestionCreateManyInput[] = [];
  const optionRows: Prisma.QuestionOptionCreateManyInput[] = [];
  const now = new Date();

  for (const unit of section.course.units) {
    if (done.has(unit.id)) continue;
    const quiz = quizFor(section.course.code, unit.order);
    if (!quiz) continue;

    const assessmentId = randomUUID();
    quizRows.push({
      id: assessmentId,
      sectionId,
      unitId: unit.id,
      title: `Unit ${unit.order} Questions`,
      instructions: QUIZ_INSTRUCTIONS,
      totalPoints: quiz.length,
      maxAttempts: 2,
      allowScratchpad: false,
      publishedAt: now,
    });
    for (const [n, item] of quiz.entries()) {
      const questionId = randomUUID();
      questionRows.push({
        id: questionId,
        assessmentId,
        order: n + 1,
        type: "MULTIPLE_CHOICE",
        prompt: item.q,
        points: 1,
        explanation: item.why,
      });
      // Spread the right answer across A–D instead of always the same letter.
      const correctAt = (unit.order - 1 + n * 3) % 4;
      const choices = item.choices.filter((_, k) => k !== item.answer);
      choices.splice(correctAt, 0, item.choices[item.answer]);
      choices.forEach((text, k) =>
        optionRows.push({
          questionId,
          label: LABELS[k]!,
          text,
          isCorrect: k === correctAt,
          order: k,
        }),
      );
    }
  }

  if (quizRows.length === 0) return 0;
  await db.assessment.createMany({ data: quizRows });
  await db.question.createMany({ data: questionRows });
  await db.questionOption.createMany({ data: optionRows });
  return quizRows.length;
}
