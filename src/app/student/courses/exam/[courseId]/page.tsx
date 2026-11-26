import { type Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ChevronRightIcon } from "~/app/_components/icons";
import { Card, Pill } from "~/app/_components/ui";
import { api } from "~/trpc/server";
import { UnitQuestionsForm } from "../../_components/unit-questions-form";

export const metadata: Metadata = { title: "Exam · Momo Smart" };
export const dynamic = "force-dynamic";

/** A course's Exam (Telecommunications, Computer Programming). */
export default async function ExamPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const exam = await api.assessment.exam({ courseId });
  if (!exam) notFound();
  const courseHref = `/student/courses?course=${exam.course.id}`;

  return (
    <div className="mx-auto max-w-[900px] space-y-5">
      <nav aria-label="Breadcrumb">
        <ol className="text-muted flex flex-wrap items-center gap-1.5 text-xs font-semibold">
          <li>
            <Link href="/student/courses" className="hover:text-ink">
              Courses
            </Link>
          </li>
          <li className="flex items-center gap-1.5">
            <ChevronRightIcon className="size-3.5" />
            <Link href={courseHref} className="hover:text-ink">
              {exam.course.name}
            </Link>
          </li>
          <li className="flex items-center gap-1.5">
            <ChevronRightIcon className="size-3.5" />
            <span className="text-brand" aria-current="page">
              Exam
            </span>
          </li>
        </ol>
      </nav>

      <Card className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-brand text-[11px] font-bold tracking-wide uppercase">
              {exam.course.name}
            </p>
            <h1 className="text-ink mt-1 text-2xl font-extrabold">
              📝 {exam.course.name}: Exam
            </h1>
            {exam.instructions && (
              <p className="text-muted mt-2 text-sm">{exam.instructions}</p>
            )}
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Pill tone="blue">
              {exam.questionCount} questions · 1 min each
            </Pill>
            {exam.bestScore !== null ? (
              <Pill tone="green">
                Score: {exam.bestScore}/{exam.totalPoints}
              </Pill>
            ) : (
              <Pill tone={exam.triesLeft > 0 ? "slate" : "amber"}>
                {exam.triesLeft > 0 ? "1 try" : "No tries left"}
              </Pill>
            )}
          </div>
        </div>
        <p className="border-line bg-canvas text-muted mt-5 rounded-xl border px-4 py-3 text-sm">
          The questions start easy and get a little harder: first{" "}
          <b className="text-ink">remembering</b> facts, then{" "}
          <b className="text-ink">understanding</b>,{" "}
          <b className="text-ink">applying</b>,{" "}
          <b className="text-ink">analyzing</b> and{" "}
          <b className="text-ink">evaluating</b>. You can do it! 💪
        </p>
      </Card>

      <UnitQuestionsForm quiz={exam} courseHref={courseHref} />
    </div>
  );
}
