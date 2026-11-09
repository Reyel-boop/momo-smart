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
            <Pill tone="blue">
              {quiz.questionCount} questions · {quiz.questionSeconds / 60} min
              each
            </Pill>
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
        quiz={quiz}
        courseHref={`/student/courses?course=${unit.course.id}`}
      />

      {quiz.activity && (
        <Card className="overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-5 text-white">
            <div className="min-w-0">
              <p className="text-xs font-black tracking-wide text-white/80 uppercase">
                🧩 Next: Unit Activity
              </p>
              <h2 className="mt-0.5 text-xl font-extrabold">
                {quiz.activity.title}
              </h2>
              <p className="mt-1 text-sm text-white/90">
                {quiz.activity.state === "CHECKED"
                  ? `✅ Checked by your teacher: ${quiz.activity.score ?? 0}/${quiz.activity.points}`
                  : quiz.activity.state === "SUBMITTED"
                    ? "📤 Submitted — waiting for your teacher to check."
                    : `A short, easy task about this unit — about 10–15 minutes. Worth ${quiz.activity.points} points.`}
              </p>
            </div>
            <Link
              href={`/student/assignments?${quiz.activity.state === "TODO" ? `assignment=${quiz.activity.id}` : "tab=" + (quiz.activity.state === "CHECKED" ? "completed" : "submitted")}`}
              className="text-navy shrink-0 rounded-xl bg-white px-5 py-2.5 text-sm font-black shadow hover:bg-white/90"
            >
              {quiz.activity.state === "TODO"
                ? "Start the activity →"
                : "View →"}
            </Link>
          </div>
        </Card>
      )}
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
