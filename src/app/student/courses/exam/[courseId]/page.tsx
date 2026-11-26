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
            <Pill tone="blue">{exam.questionCount} questions · 1 min each</Pill>
            {exam.locked ? (
              <Pill tone="amber">🔒 Locked</Pill>
            ) : exam.bestScore !== null ? (
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

      {exam.locked ? (
        <ExamLocked progress={exam.progress} courseHref={courseHref} />
      ) : (
        <UnitQuestionsForm quiz={exam} courseHref={courseHref} />
      )}
    </div>
  );
}

/** Shown until the student has finished every lesson and Unit Questions. */
function ExamLocked({
  progress,
  courseHref,
}: {
  progress: {
    lessonsDone: number;
    lessonsTotal: number;
    unitsDone: number;
    unitsTotal: number;
  };
  courseHref: string;
}) {
  const rows = [
    {
      label: "Lessons completed",
      done: progress.lessonsDone,
      total: progress.lessonsTotal,
    },
    {
      label: "Unit Questions answered",
      done: progress.unitsDone,
      total: progress.unitsTotal,
    },
  ];
  return (
    <Card className="p-6">
      <p className="text-3xl" aria-hidden="true">
        🔒
      </p>
      <h2 className="text-ink mt-2 text-lg font-extrabold">
        Finish the course first
      </h2>
      <p className="text-muted mt-1 text-sm">
        The Exam opens when you finish <b>every lesson</b> and answer{" "}
        <b>every unit&apos;s Unit Questions</b>. Keep going, you&apos;re getting
        there!
      </p>
      <div className="mt-5 space-y-4">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink font-semibold">{row.label}</span>
              <span
                className={`font-bold tabular-nums ${row.done >= row.total ? "text-emerald-700" : "text-ink"}`}
              >
                {row.done >= row.total ? "✓ " : ""}
                {Math.min(row.done, row.total)} / {row.total}
              </span>
            </div>
            <div className="bg-line mt-1.5 h-2 overflow-hidden rounded-full">
              <div
                className={`h-full rounded-full ${row.done >= row.total ? "bg-emerald-500" : "bg-brand"}`}
                style={{
                  width: `${row.total ? Math.min(100, Math.round((row.done / row.total) * 100)) : 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <Link
        href={courseHref}
        className="bg-brand mt-6 inline-flex rounded-xl px-5 py-3 text-sm font-bold text-white hover:opacity-90"
      >
        Continue the course →
      </Link>
    </Card>
  );
}
