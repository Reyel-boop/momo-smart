import Link from "next/link";

import {
  ArrowRightIcon,
  CheckIcon,
  ClipboardIcon,
  ListIcon,
} from "~/app/_components/icons";
import { Card, CardHeader, Pill } from "~/app/_components/ui";
import type { RouterOutputs } from "~/trpc/react";

type UnitQuiz = RouterOutputs["assessment"]["unitQuizzes"][number];
type SyllabusUnit = RouterOutputs["course"]["syllabus"][number];

/** Shown under a lesson: the unit's questions to answer after the discussion. */
export function UnitQuestionsCallout({
  unitTitle,
  quiz,
}: {
  unitTitle: string;
  quiz: UnitQuiz;
}) {
  const done = quiz.bestScore !== null;
  return (
    <Card className="flex flex-wrap items-center justify-between gap-4 p-5">
      <div className="flex min-w-0 items-start gap-3">
        <span className="bg-brand-soft text-brand flex size-10 shrink-0 items-center justify-center rounded-xl">
          <ClipboardIcon className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="text-ink font-bold">
            Done with the discussion? Answer the Unit Questions.
          </p>
          <p className="text-muted mt-0.5 text-sm">
            {unitTitle} · {quiz.questionCount} questions
            {done
              ? ` · your best score: ${quiz.bestScore}/${quiz.totalPoints}`
              : ` · ${quiz.maxAttempts} tries`}
          </p>
        </div>
      </div>
      <Link
        href={`/student/courses/questions/${quiz.id}`}
        className="bg-brand inline-flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold text-white hover:opacity-90"
      >
        {done ? "View results" : "Answer questions"}
        <ArrowRightIcon className="size-4" />
      </Link>
    </Card>
  );
}

/** Every unit in the course: open its discussion or its questions. */
export function AllUnits({
  units,
  quizzes,
  currentUnitId,
}: {
  units: SyllabusUnit[];
  quizzes: UnitQuiz[];
  currentUnitId: string;
}) {
  const quizFor = new Map(quizzes.map((quiz) => [quiz.unitId, quiz]));
  return (
    <Card>
      <CardHeader icon={<ListIcon className="size-4" />} title="All Units" />
      <ol className="divide-line divide-y">
        {units.map((unit) => {
          const quiz = quizFor.get(unit.id);
          const firstLesson = unit.lessons[0];
          const isCurrent = unit.id === currentUnitId;
          return (
            <li
              key={unit.id}
              className={`px-5 py-3 ${isCurrent ? "bg-brand-soft/40" : ""}`}
            >
              {firstLesson ? (
                <Link
                  href={`/student/courses?lesson=${firstLesson.id}`}
                  className="text-ink hover:text-brand block text-sm font-semibold"
                >
                  {unit.title}
                </Link>
              ) : (
                <p className="text-ink text-sm font-semibold">{unit.title}</p>
              )}
              <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px]">
                <span className="text-muted font-semibold">
                  {unit.lessons.length} lesson
                  {unit.lessons.length === 1 ? "" : "s"}
                </span>
                {quiz && (
                  <Link
                    href={`/student/courses/questions/${quiz.id}`}
                    className="inline-flex"
                  >
                    {quiz.bestScore !== null ? (
                      <Pill tone="green">
                        <CheckIcon className="size-3" />
                        Questions {quiz.bestScore}/{quiz.totalPoints}
                      </Pill>
                    ) : (
                      <Pill tone="blue">Answer questions</Pill>
                    )}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
