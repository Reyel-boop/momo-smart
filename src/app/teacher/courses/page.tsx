import { type Metadata } from "next";
import Link from "next/link";

import {
  ArrowRightIcon,
  BookOpenIcon,
  CalendarIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ClipboardIcon,
  ClockIcon,
  UsersIcon,
} from "~/app/_components/icons";
import { api } from "~/trpc/server";
import { humanise, longDate } from "~/app/_components/format";
import { PageHeader } from "~/app/_components/page-header";
import { Card, EmptyState, Pill } from "~/app/_components/ui";
import { LectureEditor } from "./_components/lecture-editor";
import { TeachCourse } from "./_components/teach-course";
import { UnitStatusSelect } from "./unit-status";

export const metadata: Metadata = { title: "Courses · Momo Smart" };
export const dynamic = "force-dynamic";

type SearchParams = Record<string, string | string[] | undefined>;

const STATUS = {
  COMPLETED: { label: "Completed", tone: "green" },
  IN_PROGRESS: { label: "In progress", tone: "blue" },
  NOT_STARTED: { label: "Upcoming", tone: "slate" },
} as const;

/**
 * Core subjects in the order the school lists them, then TLE by grade and
 * major ("TLE 7", "TLE 9-CP", "TLE 10-EIM"…), then anything else.
 */
const SUBJECT_ORDER = ["MATH", "SCI", "FIL", "ENG", "AP"];
const TLE_MAJORS = ["CP", "TEL", "COOK", "ACP", "EIM"];
const subjectRank = (code: string) => {
  const upper = code.toUpperCase();
  const tle = /^TLE (\d+)(?:-(\w+))?$/.exec(upper);
  if (tle) {
    const major = tle[2] ? TLE_MAJORS.indexOf(tle[2]) + 1 : 0;
    return 100 + Number(tle[1]) * 10 + major;
  }
  const index = SUBJECT_ORDER.indexOf(upper.split(" ")[0]!);
  return index === -1 ? 1000 : index;
};

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const requested =
    typeof params.subject === "string" ? params.subject : undefined;
  const [allSubjects, homerooms, department] = await Promise.all([
    api.course.teachingUnits(),
    api.course.homerooms(),
    api.course.myDepartment(),
  ]);
  // Every course is listed: the ones this teacher has classes in first, then
  // their department’s, then the rest.
  const subjects = allSubjects.sort(
    (a, b) =>
      Number(b.sections.length > 0) - Number(a.sections.length > 0) ||
      Number(b.department.id === department?.id) -
        Number(a.department.id === department?.id) ||
      subjectRank(a.code) - subjectRank(b.code),
  );

  const active =
    subjects.find((subject) => subject.id === requested) ?? subjects[0];
  // With a department set, only that department’s courses can be started.
  const canStart = (subject: { department: { id: string } }) =>
    !department || subject.department.id === department.id;
  const totalUnits = subjects.reduce((sum, s) => sum + s.units.length, 0);
  const sectionCount = new Set(
    subjects.flatMap((s) => s.sections.map((section) => section.id)),
  ).size;

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <PageHeader
        title="Courses"
        subtitle={`${subjects.length} subject${subjects.length === 1 ? "" : "s"} • ${totalUnits} units • You teach ${sectionCount} class${sectionCount === 1 ? "" : "es"} this quarter. Open any course to see its lessons, or start teaching it to a section.`}
      />

      {!active ? (
        <Card>
          <EmptyState>No subjects are assigned to you this term.</EmptyState>
        </Card>
      ) : (
        <>
          <nav
            aria-label="Subjects"
            className="flex gap-2 overflow-x-auto pb-1"
          >
            {subjects.map((subject) => {
              const isActive = subject.id === active.id;
              return (
                <Link
                  key={subject.id}
                  href={`/teacher/courses?subject=${subject.id}`}
                  aria-current={isActive ? "page" : undefined}
                  className={`shrink-0 rounded-xl border px-4 py-2.5 text-left transition ${
                    isActive
                      ? "border-navy-deep bg-navy-deep text-white shadow-sm"
                      : "border-line bg-surface text-ink hover:border-brand"
                  }`}
                >
                  <span className="block text-sm font-extrabold uppercase">
                    {subject.name}
                  </span>
                  <span
                    className={`block text-[11px] font-semibold ${isActive ? "text-white/70" : "text-muted"}`}
                  >
                    {subject.sections.length > 0
                      ? `${subject.units.length} units · ${subject.completedUnits} completed`
                      : `${subject.units.length} units · not teaching yet`}
                  </span>
                </Link>
              );
            })}
          </nav>

          <Card className="overflow-hidden">
            <div className="bg-navy-deep relative overflow-hidden px-6 py-6">
              <div
                aria-hidden="true"
                className="bg-brand/30 absolute -top-16 -right-10 size-48 rounded-full blur-2xl"
              />
              <div className="relative flex flex-wrap items-end justify-between gap-5">
                <div className="max-w-2xl min-w-0">
                  <p className="text-[10px] font-bold tracking-[0.14em] text-white/60 uppercase">
                    {active.code} • {active.department.name}
                  </p>
                  <h2 className="mt-1 text-2xl font-extrabold text-white uppercase">
                    {active.name}
                  </h2>
                  {active.description && (
                    <p className="mt-1.5 text-sm text-white/70">
                      {active.description}
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {active.sections.map((section) => (
                      <span
                        key={section.id}
                        className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white"
                      >
                        <UsersIcon className="size-3.5" />
                        {section.code} · {section.studentCount} students · Class
                        code{" "}
                        <span className="font-mono font-bold tracking-wider">
                          {section.joinCode}
                        </span>
                      </span>
                    ))}
                  </div>
                  {canStart(active) ? (
                    <TeachCourse
                      key={active.id}
                      courseId={active.id}
                      courseName={active.name}
                      sections={homerooms
                        .filter(
                          (room) =>
                            !active.sections.some(
                              (section) =>
                                section.code.toLowerCase() ===
                                room.name.slice(0, 20).toLowerCase(),
                            ),
                        )
                        .map((room) => ({
                          id: room.id,
                          label: `Grade ${room.gradeLevel} — ${room.name}`,
                        }))}
                    />
                  ) : (
                    <p className="mt-3 text-xs text-white/60">
                      This is a {active.department.name} course. You can start
                      classes for {department?.name} courses.
                    </p>
                  )}
                  {homerooms.length === 0 && (
                    <p className="mt-3 text-xs text-white/60">
                      No sections yet — the registrar adds them (Sections, or by
                      uploading a School Form 1).
                    </p>
                  )}
                </div>
                <div className="w-full max-w-60">
                  <p className="text-xs font-semibold text-white/70">
                    {active.completedUnits} of {active.units.length} units
                    completed
                  </p>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/15">
                    <div
                      className="bg-brand h-full rounded-full"
                      style={{
                        width: `${active.units.length ? Math.round((active.completedUnits / active.units.length) * 100) : 0}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {active.units.length === 0 ? (
              <EmptyState>
                No units have been added to this subject yet.
              </EmptyState>
            ) : (
              <ol className="divide-line divide-y">
                {active.units.map((unit) => {
                  const status = STATUS[unit.status];
                  return (
                    <li key={unit.id}>
                      <details
                        className="group"
                        open={unit.status === "IN_PROGRESS"}
                      >
                        <summary className="hover:bg-canvas flex cursor-pointer list-none items-center gap-4 px-6 py-4 [&::-webkit-details-marker]:hidden">
                          <span
                            className={`flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold ${
                              unit.status === "COMPLETED"
                                ? "bg-emerald-50 text-emerald-700"
                                : unit.status === "IN_PROGRESS"
                                  ? "bg-brand-soft text-brand"
                                  : "bg-canvas text-muted"
                            }`}
                          >
                            {unit.status === "COMPLETED" ? (
                              <CheckCircleIcon className="size-5" />
                            ) : (
                              unit.order
                            )}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="text-ink block font-bold">
                              {unit.title}
                            </span>
                            {unit.description && (
                              <span className="text-muted mt-0.5 block truncate text-xs">
                                {unit.description}
                              </span>
                            )}
                          </span>
                          <span className="text-muted hidden shrink-0 items-center gap-3 text-xs font-semibold sm:flex">
                            <span className="inline-flex items-center gap-1">
                              <BookOpenIcon className="size-3.5" />
                              {unit.lessons.length} lesson
                              {unit.lessons.length === 1 ? "" : "s"}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <ClipboardIcon className="size-3.5" />
                              {unit.assignments.length} activit
                              {unit.assignments.length === 1 ? "y" : "ies"}
                            </span>
                          </span>
                          <Pill tone={status.tone}>{status.label}</Pill>
                          <ChevronDownIcon className="text-muted size-4 shrink-0 transition group-open:rotate-180" />
                        </summary>

                        <div className="bg-canvas/60 grid gap-5 px-6 pt-1 pb-5 lg:grid-cols-[3fr_2fr]">
                          <div className="lg:col-span-2">
                            <UnitStatusSelect
                              unitId={unit.id}
                              sectionIds={active.sections.map((s) => s.id)}
                              status={unit.status}
                            />
                          </div>
                          <div>
                            <p className="text-muted text-[10px] font-bold tracking-wider uppercase">
                              Lessons
                            </p>
                            {unit.lessons.length === 0 ? (
                              <p className="text-muted mt-2 text-sm">
                                No lessons yet.
                              </p>
                            ) : (
                              <ul className="mt-2 space-y-2">
                                {unit.lessons.map((lesson) => (
                                  <li
                                    key={lesson.id}
                                    className="border-line bg-surface rounded-xl border px-4 py-3"
                                  >
                                    <div className="flex items-start justify-between gap-3">
                                      <p className="text-ink text-sm font-bold">
                                        {unit.order}.{lesson.order}{" "}
                                        {lesson.title}
                                      </p>
                                      {!lesson.isPublished && (
                                        <Pill tone="amber">Draft</Pill>
                                      )}
                                    </div>
                                    {lesson.summary && (
                                      <p className="text-muted mt-0.5 text-xs">
                                        {lesson.summary}
                                      </p>
                                    )}
                                    <p className="text-muted mt-1.5 flex items-center gap-3 text-[11px] font-semibold">
                                      <span className="inline-flex items-center gap-1">
                                        <ClockIcon className="size-3" />
                                        {lesson.estimatedMinutes} min
                                      </span>
                                      {lesson._count.sections > 0 && (
                                        <span>
                                          Reading + self-check questions
                                        </span>
                                      )}
                                    </p>
                                    <LectureEditor
                                      lessonId={lesson.id}
                                      videoUrl={lesson.videoUrl}
                                      lecture={lesson.sections[0]?.body ?? null}
                                    />
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>

                          <div>
                            <p className="text-muted text-[10px] font-bold tracking-wider uppercase">
                              Activities to answer
                            </p>
                            {unit.assignments.length === 0 ? (
                              <p className="text-muted mt-2 text-sm">
                                {unit.status === "NOT_STARTED"
                                  ? "Activities open when the unit starts."
                                  : "Students answer the self-check in each lesson."}
                              </p>
                            ) : (
                              <ul className="mt-2 space-y-2">
                                {unit.assignments.map((assignment) => (
                                  <li key={assignment.id}>
                                    <Link
                                      href={`/teacher/assignments?section=${assignment.sectionId}`}
                                      className="border-line bg-surface hover:border-brand block rounded-xl border px-4 py-3 transition"
                                    >
                                      <p className="text-ink text-sm font-bold">
                                        {assignment.title}
                                      </p>
                                      <p className="text-muted mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold">
                                        <span>{humanise(assignment.type)}</span>
                                        <span>
                                          {assignment.pointsPossible} pts
                                        </span>
                                        {assignment.dueAt && (
                                          <span className="inline-flex items-center gap-1">
                                            <CalendarIcon className="size-3" />
                                            Due {longDate(assignment.dueAt)}
                                          </span>
                                        )}
                                      </p>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                            {unit.examDate && (
                              <p className="text-muted mt-3 inline-flex items-center gap-1.5 text-xs font-semibold">
                                <CalendarIcon className="size-3.5" />
                                Unit exam: {longDate(unit.examDate)}
                              </p>
                            )}
                          </div>

                          {unit.questions.length > 0 && (
                            <UnitQuestions
                              questions={unit.questions}
                              results={unit.results}
                            />
                          )}
                        </div>
                      </details>
                    </li>
                  );
                })}
              </ol>
            )}

            <div className="border-line flex flex-wrap items-center gap-4 border-t px-6 py-4">
              {active.sections.map((section) => (
                <span key={section.id} className="flex items-center gap-3">
                  <Link
                    href={`/teacher/grades?section=${section.id}`}
                    className="text-brand inline-flex items-center gap-1 text-xs font-bold hover:underline"
                  >
                    {section.code} gradebook
                    <ArrowRightIcon className="size-3.5" />
                  </Link>
                </span>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

type Unit = Awaited<
  ReturnType<typeof api.course.teachingUnits>
>[number]["units"][number];

/** The unit's closing questions, each section's results and the answer key. */
function UnitQuestions({
  questions,
  results,
}: {
  questions: Unit["questions"];
  results: Unit["results"];
}) {
  return (
    <div className="border-line bg-surface rounded-xl border lg:col-span-2">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div>
          <p className="text-ink flex items-center gap-1.5 text-sm font-bold">
            <ClipboardIcon className="text-brand size-4" />
            Unit Questions · {questions.length} items
          </p>
          <p className="text-muted mt-0.5 text-xs">
            Students answer these after the discussion, one at a time with 2
            minutes each, and see the rationale after every answer. Two tries,
            best score counts.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {results.map((result) => (
            <span
              key={result.assessmentId}
              className="bg-canvas text-ink rounded-lg px-3 py-1.5 text-xs font-semibold"
            >
              {result.sectionCode}: {result.answered}/{result.studentCount}{" "}
              answered
              {result.average !== null &&
                ` · avg ${result.average}/${result.totalPoints}`}
              {result.focusLosses > 0 && (
                <span className="ml-1 text-amber-700">
                  · left the screen {result.focusLosses}×
                </span>
              )}
            </span>
          ))}
        </div>
      </div>
      <details className="group/questions border-line border-t">
        <summary className="text-brand flex cursor-pointer list-none items-center gap-1 px-4 py-2.5 text-xs font-bold [&::-webkit-details-marker]:hidden">
          Show questions and answer key
          <ChevronDownIcon className="size-3.5 transition group-open/questions:rotate-180" />
        </summary>
        <ol className="space-y-3 px-4 pb-4">
          {questions.map((question) => (
            <li key={question.id} className="text-sm">
              <p className="text-ink font-semibold">
                {question.order}. {question.prompt}
              </p>
              <ul className="mt-1.5 grid gap-1 sm:grid-cols-2">
                {question.options.map((option) => (
                  <li
                    key={option.label}
                    className={`rounded-lg px-2.5 py-1.5 text-xs ${
                      option.isCorrect
                        ? "bg-emerald-50 font-bold text-emerald-700"
                        : "text-muted"
                    }`}
                  >
                    {option.label}. {option.text}
                    {option.isCorrect && " ✓"}
                  </li>
                ))}
              </ul>
              {question.explanation && (
                <p className="text-muted mt-1 text-xs italic">
                  {question.explanation}
                </p>
              )}
            </li>
          ))}
        </ol>
      </details>
    </div>
  );
}
