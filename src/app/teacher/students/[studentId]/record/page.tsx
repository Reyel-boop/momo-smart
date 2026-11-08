import { TRPCError } from "@trpc/server";
import { type Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { humanise } from "~/app/_components/format";
import { Card, EmptyState, Pill } from "~/app/_components/ui";
import { api } from "~/trpc/server";
import { PrintButton } from "~/app/teacher/grades/student/[studentId]/print-button";

export const metadata: Metadata = { title: "Student Record · Momo Smart" };
export const dynamic = "force-dynamic";

type StudentRecord = Awaited<ReturnType<typeof api.grading.studentRecord>>;
type Course = StudentRecord["courses"][number];
type Quiz = Course["quizzes"][number];

const day = (date: Date) =>
  date.toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "Asia/Manila",
  });

const KIND_LABEL: Record<Quiz["kind"], string> = {
  UNIT: "Unit Questions",
  QUIZ: "Quiz",
  EXAM: "Exam",
  LIVE: "Live Quiz",
};

const KIND_TONE = {
  UNIT: "blue",
  QUIZ: "violet",
  EXAM: "rose",
  LIVE: "amber",
} as const;

const STATUS_TONE = {
  ACTIVE: "green",
  COMPLETED: "blue",
  DROPPED: "slate",
  WITHDRAWN: "slate",
} as const;

const pct = (score: number, possible: number) =>
  Math.round((score / possible) * 1000) / 10;

/** Green 85+, amber 75+, rose below — the DepEd passing line is 75. */
const scoreTone = (percent: number) =>
  percent >= 85
    ? "text-emerald-700"
    : percent >= 75
      ? "text-amber-700"
      : "text-rose-700";

const PRINT_CSS = `@media print {
  body * { visibility: hidden !important; }
  #student-record, #student-record * { visibility: visible !important; }
  #student-record { position: absolute; left: 0; top: 0; width: 100%; }
  @page { margin: 12mm; }
}`;

/** Every course a student has taken, with the quizzes they took in each. */
export default async function StudentRecordPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  const record = await load(studentId);
  const { student, courses, nat } = record;

  // Group the courses by school year (newest first, as the server sorts).
  const years: { label: string; current: boolean; courses: Course[] }[] = [];
  for (const course of courses) {
    const label = course.term.schoolYear
      ? `S.Y. ${course.term.schoolYear.replace("-", "–")}`
      : course.term.name;
    let year = years.find((y) => y.label === label);
    if (!year) {
      year = { label, current: course.term.isCurrent, courses: [] };
      years.push(year);
    }
    year.courses.push(course);
  }

  const allQuizzes = courses.flatMap((c) => c.quizzes);
  const taken = allQuizzes.filter((q) => q.state === "DONE").length;
  const scored = allQuizzes.filter(
    (q) => q.score !== null && q.possible && q.possible > 0,
  );
  const overall =
    scored.length > 0
      ? Math.round(
          (scored.reduce((sum, q) => sum + q.score! / q.possible!, 0) /
            scored.length) *
            1000,
        ) / 10
      : null;

  return (
    <div className="mx-auto max-w-[1100px] space-y-5">
      <style dangerouslySetInnerHTML={{ __html: PRINT_CSS }} />
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link
          href={`/teacher/students/${student.id}`}
          className="text-brand text-sm font-semibold hover:underline"
        >
          ← Student profile
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/teacher/grades/student/${student.id}`}
            className="border-line bg-surface text-ink hover:bg-canvas rounded-xl border px-4 py-2 text-sm font-bold transition"
          >
            Report card
          </Link>
          <PrintButton />
        </div>
      </div>

      <div id="student-record" className="space-y-5">
        <header>
          <p className="text-muted text-xs font-bold tracking-wide uppercase">
            Student Record
          </p>
          <h1 className="text-ink text-2xl font-extrabold">{student.name}</h1>
          <p className="text-muted text-sm">
            {[
              `#${student.studentNumber}`,
              `Grade ${student.gradeLevel}`,
              student.section,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </header>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Courses taken" value={courses.length} />
          <Stat label="Quizzes taken" value={taken} />
          <Stat
            label="Average quiz score"
            value={overall === null ? "—" : `${overall}%`}
          />
          <Stat label="CB-NAT tries" value={nat.length} />
        </div>

        {years.length === 0 && (
          <Card>
            <EmptyState>Not enrolled in any course yet.</EmptyState>
          </Card>
        )}

        {years.map((year) => (
          <section key={year.label} className="space-y-3">
            <h2 className="text-ink flex items-center gap-2 text-base font-extrabold">
              {year.label}
              {year.current && <Pill tone="green">This school year</Pill>}
            </h2>
            {year.courses.map((course) => (
              <CourseCard key={course.enrollmentId} course={course} />
            ))}
          </section>
        ))}

        {nat.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-ink text-base font-extrabold">
              CB-NAT Review tries
            </h2>
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-sm">
                  <thead className="bg-canvas text-muted text-left text-xs font-bold">
                    <tr>
                      <th className="px-4 py-2.5">Test</th>
                      <th className="px-4 py-2.5">Subject</th>
                      <th className="px-4 py-2.5">Date</th>
                      <th className="px-4 py-2.5 text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-line divide-y">
                    {nat.map((n) => (
                      <tr key={n.id}>
                        <td className="text-ink px-4 py-2.5 font-semibold">
                          {n.test}
                          {n.attempt > 1 && (
                            <span className="text-muted ml-1.5 text-xs font-normal">
                              try {n.attempt}
                            </span>
                          )}
                        </td>
                        <td className="text-muted px-4 py-2.5">
                          {humanise(n.subject)}
                        </td>
                        <td className="text-muted px-4 py-2.5 whitespace-nowrap">
                          {day(n.date)}
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <ScoreCell score={n.score} possible={n.possible} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </section>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border-line bg-surface rounded-2xl border px-4 py-3">
      <p className="text-muted text-xs font-semibold">{label}</p>
      <p className="text-ink mt-0.5 text-xl font-extrabold tabular-nums">
        {value}
      </p>
    </div>
  );
}

function ScoreCell({
  score,
  possible,
}: {
  score: number | null;
  possible: number | null;
}) {
  if (score === null) return <span className="text-muted">—</span>;
  if (!possible) {
    return <span className="text-ink font-bold tabular-nums">{score} pts</span>;
  }
  const percent = pct(score, possible);
  return (
    <span className="whitespace-nowrap tabular-nums">
      <span className="text-ink font-bold">
        {score}/{possible}
      </span>
      <span className={`ml-1.5 text-xs font-bold ${scoreTone(percent)}`}>
        {percent}%
      </span>
    </span>
  );
}

function CourseCard({ course }: { course: Course }) {
  return (
    <Card className="break-inside-avoid overflow-hidden">
      <div className="border-line flex flex-wrap items-start justify-between gap-3 border-b px-5 py-4">
        <div className="min-w-0">
          <p className="text-ink text-base font-extrabold">
            {course.subject}
            <span className="text-muted ml-2 text-sm font-semibold">
              {course.courseName !== course.subject &&
                `${course.courseName} · `}
              {course.sectionCode}
            </span>
          </p>
          <p className="text-muted mt-0.5 text-xs">
            {course.teacher} · Enrolled {day(course.enrolledAt)}
            {course.droppedAt && ` · Dropped ${day(course.droppedAt)}`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {course.quizAverage !== null && (
            <span className="bg-canvas text-ink rounded-lg px-2.5 py-1 text-xs font-bold">
              Quiz average{" "}
              <span className={scoreTone(course.quizAverage)}>
                {course.quizAverage}%
              </span>
            </span>
          )}
          <Pill tone={STATUS_TONE[course.status]}>
            {humanise(course.status)}
          </Pill>
        </div>
      </div>

      {course.unitSets > 0 && (
        <p className="text-muted bg-canvas/60 px-5 py-2 text-xs">
          Unit Questions answered:{" "}
          <span className="text-ink font-bold">
            {course.unitSetsTaken} of {course.unitSets}
          </span>{" "}
          unit{course.unitSets === 1 ? "" : "s"}
        </p>
      )}

      {course.quizzes.length === 0 ? (
        <p className="text-muted px-5 py-4 text-sm">No quizzes taken yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-muted text-left text-xs font-bold">
              <tr>
                <th className="px-5 py-2">Quiz</th>
                <th className="hidden px-3 py-2 sm:table-cell">Type</th>
                <th className="hidden px-3 py-2 sm:table-cell">Date</th>
                <th className="px-5 py-2 text-right">Score</th>
              </tr>
            </thead>
            <tbody className="divide-line divide-y">
              {course.quizzes.map((quiz) => (
                <tr key={quiz.key}>
                  <td className="text-ink px-5 py-2.5">
                    <p className="font-semibold">{quiz.title}</p>
                    <p className="text-muted mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:hidden">
                      <Pill tone={KIND_TONE[quiz.kind]}>
                        {KIND_LABEL[quiz.kind]}
                      </Pill>
                      {day(quiz.date)}
                    </p>
                    {quiz.note && (
                      <p className="text-muted text-xs">{quiz.note}</p>
                    )}
                  </td>
                  <td className="hidden px-3 py-2.5 sm:table-cell">
                    <Pill tone={KIND_TONE[quiz.kind]}>
                      {KIND_LABEL[quiz.kind]}
                    </Pill>
                  </td>
                  <td className="text-muted hidden px-3 py-2.5 whitespace-nowrap sm:table-cell">
                    {day(quiz.date)}
                  </td>
                  <td className="px-5 py-2.5 text-right">
                    {quiz.state === "MISSING" ? (
                      <Pill tone="rose">Missing · 0</Pill>
                    ) : quiz.state === "EXCUSED" ? (
                      <Pill tone="slate">Excused</Pill>
                    ) : quiz.state === "IN_PROGRESS" ? (
                      <Pill tone="amber">Not finished</Pill>
                    ) : quiz.state === "PENDING" ? (
                      <Pill tone="slate">Pending</Pill>
                    ) : (
                      <ScoreCell score={quiz.score} possible={quiz.possible} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

async function load(studentId: string) {
  try {
    return await api.grading.studentRecord({ studentId });
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
