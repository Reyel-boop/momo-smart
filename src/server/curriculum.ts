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
import { QUESTION_BANKS } from "./demo/banks";
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
 * Extra questions for a unit's Live Quiz (beyond its Unit Questions), so a
 * single unit can fill a 10-, 15- or 20-question game.
 */
export function bankFor(
  courseCode: string,
  unitOrder: number,
): QuizItem[] | null {
  const subject = ALL_SUBJECTS.find((s) => s.code === courseCode);
  if (!subject) return null;
  const index = unitOrder - 1;
  return (
    subject.units[index]?.bank ?? QUESTION_BANKS[subject.key]?.[index] ?? null
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
  const rows: ContentRows = { units: [], lessons: [], sections: [] };

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
    addCourseContent(rows, subject, courseId);
  }

  await db.course.createMany({ data: courseRows });
  await db.unit.createMany({ data: rows.units });
  await db.lesson.createMany({ data: rows.lessons });
  await db.lessonSection.createMany({ data: rows.sections });
  return {
    courses: courseRows.length,
    units: rows.units.length,
    lessons: rows.lessons.length,
  };
}

type ContentRows = {
  units: Prisma.UnitCreateManyInput[];
  lessons: Prisma.LessonCreateManyInput[];
  sections: Prisma.LessonSectionCreateManyInput[];
};

/** A subject's units, lessons and lesson tabs, as rows for one course. */
function addCourseContent(
  rows: ContentRows,
  subject: DemoSubject,
  courseId: string,
) {
  const unitRows = rows.units;
  const lessonRows = rows.lessons;
  const sectionRows = rows.sections;
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
        // A lecture may be text only; teachers can attach a video later.
        videoUrl: lecture?.videoId ? lectureVideoUrl(lecture) : null,
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

/**
 * Adds one curriculum subject as a new course to a running school (e.g.
 * TLE 9 Telecommunications). Does nothing if its code already exists.
 */
export async function addCourse(db: PrismaClient, subject: DemoSubject) {
  const existing = await db.course.findUnique({
    where: { code: subject.code },
    select: { id: true },
  });
  if (existing) return { created: false, units: 0, lessons: 0 };
  const department = await db.department.findUniqueOrThrow({
    where: { name: subject.department },
    select: { id: true },
  });
  const courseId = randomUUID();
  const rows: ContentRows = { units: [], lessons: [], sections: [] };
  addCourseContent(rows, subject, courseId);
  await db.$transaction([
    db.course.create({
      data: {
        id: courseId,
        code: subject.code,
        name: subject.name,
        description: subject.description,
        level: "REGULAR",
        credits: 1,
        departmentId: department.id,
        colorToken: subject.colorToken,
      },
    }),
    db.unit.createMany({ data: rows.units }),
    db.lesson.createMany({ data: rows.lessons }),
    db.lessonSection.createMany({ data: rows.sections }),
  ]);
  return {
    created: true,
    units: rows.units.length,
    lessons: rows.lessons.length,
  };
}

/**
 * Replaces an existing course's content with a subject from the curriculum
 * (e.g. TLE 10-CSS becoming TLE 10 Computer Programming): the course keeps
 * its id and classes, gets the subject's code, name and description, its
 * units and lessons are rebuilt, and every class gets the new Unit
 * Questions. The old units' quizzes, pacing and lessons go with them.
 */
export async function replaceCourseContent(
  db: PrismaClient,
  oldCode: string,
  subject: DemoSubject,
) {
  const course = await db.course.findUniqueOrThrow({
    where: { code: oldCode },
    select: { id: true, units: { select: { id: true } } },
  });
  const unitIds = course.units.map((u) => u.id);
  const rows: ContentRows = { units: [], lessons: [], sections: [] };
  addCourseContent(rows, subject, course.id);

  await db.$transaction([
    // Unit Questions only point at their unit, so remove them explicitly.
    db.assessment.deleteMany({
      where: { unitId: { in: unitIds }, assignmentId: null },
    }),
    db.unit.deleteMany({ where: { id: { in: unitIds } } }),
    db.course.update({
      where: { id: course.id },
      data: {
        code: subject.code,
        name: subject.name,
        description: subject.description,
      },
    }),
    db.unit.createMany({ data: rows.units }),
    db.lesson.createMany({ data: rows.lessons }),
    db.lessonSection.createMany({ data: rows.sections }),
  ]);

  const classes = await db.section.findMany({
    where: { courseId: course.id },
    select: { id: true },
  });
  for (const section of classes) {
    await createUnitQuizzesForSection(db, section.id);
  }
  return {
    units: rows.units.length,
    lessons: rows.lessons.length,
    classes: classes.length,
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
        where: {
          assignmentId: null,
          OR: [{ unitId: { not: null } }, { bankForUnitId: { not: null } }],
        },
        select: { unitId: true, bankForUnitId: true },
      },
    },
  });
  const done = new Set(section.assessments.map((a) => a.unitId));
  const banked = new Set(section.assessments.map((a) => a.bankForUnitId));

  const rows: QuizRows = { quizzes: [], questions: [], options: [] };
  const now = new Date();
  let quizzes = 0;

  for (const unit of section.course.units) {
    const quiz = done.has(unit.id)
      ? null
      : quizFor(section.course.code, unit.order);
    if (quiz) {
      const assessmentId = randomUUID();
      rows.quizzes.push({
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
      addQuestions(rows, assessmentId, unit.order, quiz, 1);
      quizzes++;
    }

    // The Live Quiz question bank: never published, not a Unit Question.
    const bank = banked.has(unit.id)
      ? null
      : bankFor(section.course.code, unit.order);
    if (bank?.length) {
      const assessmentId = randomUUID();
      rows.quizzes.push({
        id: assessmentId,
        sectionId,
        bankForUnitId: unit.id,
        title: `Unit ${unit.order} Live Quiz Questions`,
        totalPoints: bank.length,
        maxAttempts: 1,
        allowScratchpad: false,
      });
      addQuestions(rows, assessmentId, unit.order, bank, 1);
    }
  }

  if (rows.quizzes.length === 0) return 0;
  await db.assessment.createMany({ data: rows.quizzes });
  await db.question.createMany({ data: rows.questions });
  await db.questionOption.createMany({ data: rows.options });
  return quizzes;
}

type QuizRows = {
  quizzes: Prisma.AssessmentCreateManyInput[];
  questions: Prisma.QuestionCreateManyInput[];
  options: Prisma.QuestionOptionCreateManyInput[];
};

/** Multiple-choice questions with options A–D, numbered from `firstOrder`. */
function addQuestions(
  rows: QuizRows,
  assessmentId: string,
  unitOrder: number,
  items: QuizItem[],
  firstOrder: number,
) {
  for (const [n, item] of items.entries()) {
    const questionId = randomUUID();
    rows.questions.push({
      id: questionId,
      assessmentId,
      order: firstOrder + n,
      type: "MULTIPLE_CHOICE",
      prompt: item.q,
      points: 1,
      explanation: item.why,
    });
    // Spread the right answer across A–D instead of always the same letter.
    const correctAt = (unitOrder - 1 + n * 3) % 4;
    const choices = item.choices.filter((_, k) => k !== item.answer);
    choices.splice(correctAt, 0, item.choices[item.answer]);
    choices.forEach((text, k) =>
      rows.options.push({
        questionId,
        label: LABELS[k]!,
        text,
        isCorrect: k === correctAt,
        order: k,
      }),
    );
  }
}
