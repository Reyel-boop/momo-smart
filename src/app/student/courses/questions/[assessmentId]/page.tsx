import { type Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TRPCError } from "@trpc/server";

import { BookOpenIcon, ChevronRightIcon } from "~/app/_components/icons";
import { Card, Pill } from "~/app/_components/ui";
import { api } from "~/trpc/server";
import { UnitQuestionsForm } from "../../_components/unit-questions-form";

export const metadata: Metadata = { title: "Unit Questions · Momo Smart" };
export const dynamic = "force-dynamic";

export default async function UnitQuestionsPage({
  params,
}: {
  params: Promise<{ assessmentId: string }>;
}) {
  const { assessmentId } = await params;
  const quiz = await loadQuiz(assessmentId);
  const { unit } = quiz;

  return (
    <div className="mx-auto max-w-[900px] space-y-5">
      <nav aria-label="Breadcrumb">
        <ol className="text-muted flex flex-wrap items-center gap-1.5 text-xs font-semibold">
          <li>
            <Link href="/student/courses" className="hover:text-ink">
              Courses
            </Link>
          </li>
          <Crumb>
            <Link
              href={`/student/courses?course=${unit.course.id}`}
              className="hover:text-ink"
            >
              {unit.course.name}
            </Link>
          </Crumb>
          <Crumb>{unit.title}</Crumb>
          <Crumb>
            <span className="text-brand" aria-current="page">
              Unit Questions
            </span>
          </Crumb>
        </ol>
      </nav>

      <Card className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-brand text-[11px] font-bold tracking-wide uppercase">
              {unit.course.name}
            </p>
            <h1 className="text-ink mt-1 text-2xl font-extrabold">
              {unit.title}: Unit Questions
            </h1>
            {quiz.instructions && (
              <p className="text-muted mt-2 text-sm">{quiz.instructions}</p>
            )}
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Pill tone="blue">{quiz.questions.length} questions</Pill>
            <Pill tone={quiz.triesLeft > 0 ? "slate" : "amber"}>
              {quiz.triesLeft} of {quiz.maxAttempts} tries left
            </Pill>
            {quiz.bestScore !== null && (
              <Pill tone="green">
                Best: {quiz.bestScore}/{quiz.totalPoints}
              </Pill>
            )}
          </div>
        </div>

        {unit.lessons.length > 0 && (
          <div className="border-line bg-canvas mt-5 rounded-xl border px-4 py-3">
            <p className="text-muted flex items-center gap-1.5 text-[11px] font-bold tracking-wide uppercase">
              <BookOpenIcon className="size-3.5" />
              Read the discussion first
            </p>
            <ul className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
              {unit.lessons.map((lesson) => (
                <li key={lesson.id}>
                  <Link
                    href={`/student/courses?lesson=${lesson.id}`}
                    className="text-brand text-sm font-semibold hover:underline"
                  >
                    {unit.order}.{lesson.order} {lesson.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      <UnitQuestionsForm
        key={quiz.latest?.id ?? "new"}
        assessmentId={quiz.id}
        questions={quiz.questions}
        latest={quiz.latest}
        totalPoints={quiz.totalPoints}
        triesLeft={quiz.triesLeft}
        maxAttempts={quiz.maxAttempts}
        revealed={quiz.revealed}
        courseHref={`/student/courses?course=${unit.course.id}`}
      />
    </div>
  );
}

function Crumb({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-1.5">
      <ChevronRightIcon className="size-3.5" />
      {children}
    </li>
  );
}

async function loadQuiz(assessmentId: string) {
  try {
    return await api.assessment.unitQuiz({ assessmentId });
  } catch (error) {
    if (
      error instanceof TRPCError &&
      (error.code === "NOT_FOUND" || error.code === "FORBIDDEN")
    ) {
      notFound();
    }
    throw error;
  }
}
