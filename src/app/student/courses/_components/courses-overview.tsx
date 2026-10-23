import Link from "next/link";

import {
  BookOpenIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ClipboardIcon,
  PlayFillIcon,
} from "~/app/_components/icons";
import { Card, EmptyState } from "~/app/_components/ui";
import { courseTone, teacherFullName } from "~/app/student/_components/format";
import { api } from "~/trpc/server";
import type { RouterOutputs } from "~/trpc/react";
import { JoinClass } from "./join-class";

type Section = RouterOutputs["course"]["mySections"][number];
type Units = RouterOutputs["course"]["syllabus"];
type Quizzes = RouterOutputs["assessment"]["unitQuizzes"];

/**
 * The student's Courses page: every enrolled course with its progress, the
 * lesson to continue, and its units — each opening its first lesson, with
 * the unit's questions and best score.
 */
export async function CoursesOverview({ sections }: { sections: Section[] }) {
  const [resume, details] = await Promise.all([
    api.lesson.resumePoint(),
    Promise.all(
      sections.map(async (section) => {
        const [units, quizzes] = await Promise.all([
          api.course.syllabus({ courseId: section.course.id }),
          api.assessment.unitQuizzes({ courseId: section.course.id }),
        ]);
        return { section, units, quizzes };
      }),
    ),
  ]);

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <div>
        <h1 className="text-ink text-2xl font-extrabold tracking-tight">
          Courses
        </h1>
        <p className="text-muted mt-1 text-sm">
          {sections.length} enrolled course{sections.length === 1 ? "" : "s"}{" "}
          this term. Open a course to continue its lessons, or pick a unit.
        </p>
      </div>

      <JoinClass />

      {resume && (
        <Link
          href={`/student/courses?lesson=${resume.lesson.id}`}
          className="bg-navy-deep hover:bg-navy group flex items-center gap-4 rounded-2xl px-5 py-4 text-white transition"
        >
          <span className="bg-brand flex size-11 shrink-0 items-center justify-center rounded-full">
            <PlayFillIcon className="ml-0.5 size-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] font-bold tracking-wide text-white/60 uppercase">
              Continue where you left off
            </span>
            <span className="block truncate font-bold">
              {resume.lesson.unit.course.name} · Lesson{" "}
              {resume.lesson.unit.order}.{resume.lesson.order}:{" "}
              {resume.lesson.title}
            </span>
          </span>
          <ChevronRightIcon className="size-5 shrink-0 transition group-hover:translate-x-0.5" />
        </Link>
      )}

      {sections.length === 0 ? (
        <Card>
          <EmptyState>
            You are not in any class yet. Enter the class code your teacher gave
            you above.
          </EmptyState>
        </Card>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {details.map(({ section, units, quizzes }) => (
            <CourseCard
              key={section.id}
              section={section}
              units={units}
              quizzes={quizzes}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CourseCard({
  section,
  units,
  quizzes,
}: {
  section: Section;
  units: Units;
  quizzes: Quizzes;
}) {
  const tone = courseTone(section.course.colorToken);
  const lessons = units.flatMap((unit) =>
    unit.lessons.map((lesson) => ({ ...lesson, unitOrder: unit.order })),
  );
  const done = lessons.filter(
    (l) => l.myProgress?.status === "COMPLETED",
  ).length;
  const next =
    lessons.find((l) => l.myProgress?.status === "IN_PROGRESS") ??
    lessons.find((l) => l.myProgress?.status !== "COMPLETED") ??
    lessons[0];
  const answered = quizzes.filter((q) => q.attemptsUsed > 0).length;
  const percent = lessons.length
    ? Math.round((done / lessons.length) * 100)
    : 0;
  const grade = section.myGrade?.currentPercent;

  return (
    <Card className="flex flex-col overflow-hidden">
      <div className={`h-1.5 ${tone.bar}`} />
      <div className="flex-1 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p
              className={`text-[11px] font-bold tracking-wide uppercase ${tone.text}`}
            >
              {section.course.code} · {section.course.department.name}
            </p>
            <h2 className="text-ink mt-1 text-lg leading-snug font-extrabold">
              <Link
                href={`/student/courses?course=${section.course.id}`}
                className="hover:underline"
              >
                {section.course.name}
              </Link>
            </h2>
            <p className="text-muted mt-0.5 text-xs">
              {teacherFullName(section.teacher.user)} · Period {section.period}
              {section.room ? ` · ${section.room}` : ""}
            </p>
          </div>
          {grade != null && (
            <span
              className={`shrink-0 rounded-lg px-2.5 py-1 text-sm font-extrabold ${tone.badge}`}
            >
              {Math.round(grade)}%
            </span>
          )}
        </div>

        <div className="text-muted mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold">
          <span className="inline-flex items-center gap-1">
            <BookOpenIcon className="size-3.5" />
            {done}/{lessons.length} lessons done
          </span>
          <span className="inline-flex items-center gap-1">
            <ClipboardIcon className="size-3.5" />
            {answered}/{quizzes.length} unit questions answered
          </span>
        </div>
        <div className="bg-line mt-2 h-1.5 overflow-hidden rounded-full">
          <div
            className={`h-full rounded-full ${tone.bar}`}
            style={{ width: `${percent}%` }}
          />
        </div>

        {next && (
          <Link
            href={`/student/courses?lesson=${next.id}`}
            className="border-line hover:border-brand hover:bg-canvas mt-4 flex items-center gap-3 rounded-xl border px-4 py-3 transition"
          >
            <PlayFillIcon className="text-brand size-4 shrink-0" />
            <span className="min-w-0 flex-1">
              <span className="text-muted block text-[10px] font-bold tracking-wide uppercase">
                {done === 0 ? "Start" : "Continue"}
              </span>
              <span className="text-ink block truncate text-sm font-bold">
                Lesson {next.unitOrder}.{next.order}: {next.title}
              </span>
            </span>
            <ChevronRightIcon className="text-muted size-4 shrink-0" />
          </Link>
        )}
      </div>

      <details className="group border-line border-t">
        <summary className="text-ink hover:bg-canvas flex cursor-pointer list-none items-center justify-between px-5 py-3 text-sm font-bold [&::-webkit-details-marker]:hidden">
          Units ({units.length})
          <ChevronDownIcon className="text-muted size-4 transition group-open:rotate-180" />
        </summary>
        <ol className="divide-line divide-y px-5 pb-3">
          {units.map((unit) => {
            const quiz = quizzes.find((q) => q.unitId === unit.id);
            const first = unit.lessons[0];
            return (
              <li
                key={unit.id}
                className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5"
              >
                {first ? (
                  <Link
                    href={`/student/courses?lesson=${first.id}`}
                    className="text-ink min-w-0 flex-1 text-sm font-semibold hover:underline"
                  >
                    {unit.title}
                  </Link>
                ) : (
                  <span className="text-ink min-w-0 flex-1 text-sm font-semibold">
                    {unit.title}
                  </span>
                )}
                <span className="text-muted text-xs">
                  {unit.completedLessons}/{unit.lessons.length} lessons
                </span>
                {quiz && (
                  <Link
                    href={`/student/courses/questions/${quiz.id}`}
                    className="text-brand text-xs font-bold hover:underline"
                  >
                    {quiz.bestScore !== null
                      ? `Questions ${quiz.bestScore}/${quiz.totalPoints}`
                      : "Answer questions"}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </details>
    </Card>
  );
}
