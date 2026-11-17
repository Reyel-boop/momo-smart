import { type Metadata } from "next";
import Link from "next/link";

import { timeAgo } from "~/app/_components/format";
import { TrendUpIcon } from "~/app/_components/icons";
import { PageHeader, SectionTabs } from "~/app/_components/page-header";
import {
  Avatar,
  Card,
  CardHeader,
  EmptyState,
  Pill,
} from "~/app/_components/ui";
import { subjectLabel } from "~/server/lib/deped";
import { type RouterOutputs } from "~/trpc/react";
import { api } from "~/trpc/server";

export const metadata: Metadata = { title: "Class Progress · Momo Smart" };
export const dynamic = "force-dynamic";

type Row = RouterOutputs["dashboard"]["sectionProgress"]["students"][number];
type Status = Row["status"];

const STATUS: Record<
  Status,
  { label: string; tone: "green" | "amber" | "rose"; order: number }
> = {
  NEEDS_HELP: { label: "Needs help", tone: "rose", order: 0 },
  WATCH: { label: "Watch", tone: "amber", order: 1 },
  ON_TRACK: { label: "On track", tone: "green", order: 2 },
};
const FILTERS = [
  ["all", "Everyone"],
  ["NEEDS_HELP", "Needs help"],
  ["WATCH", "Watch"],
  ["ON_TRACK", "On track"],
] as const;

const gradeTone = (p: number | null) =>
  p == null
    ? "text-muted"
    : p >= 80
      ? "text-emerald-700"
      : p >= 75
        ? "text-amber-700"
        : "text-rose-700";
const attendanceTone = (p: number | null) =>
  p == null
    ? "text-muted"
    : p >= 90
      ? "text-emerald-700"
      : p >= 80
        ? "text-amber-700"
        : "text-rose-700";

/**
 * Class Progress: every student of one section at a glance, with who needs
 * help first. One row per student; open a row for the full student page.
 */
export default async function ProgressPage({
  searchParams,
}: {
  searchParams: Promise<{ section?: string; show?: string; sort?: string }>;
}) {
  const {
    section: sectionParam,
    show = "all",
    sort = "status",
  } = await searchParams;
  const sections = await api.course.mySections();
  const section =
    sections.find((s) => s.id === sectionParam) ?? sections[0] ?? null;

  if (!section) {
    return (
      <div className="mx-auto max-w-[1400px] space-y-6">
        <PageHeader
          title="Class Progress"
          subtitle="Every student's progress, per section."
        />
        <Card>
          <EmptyState>You have no class sections this term.</EmptyState>
        </Card>
      </div>
    );
  }

  const data = await api.dashboard.sectionProgress({ sectionId: section.id });
  const { summary } = data;
  const rows = data.students
    .filter((s) => show === "all" || s.status === show)
    .sort((a, b) =>
      sort === "name"
        ? a.name.localeCompare(b.name)
        : STATUS[a.status].order - STATUS[b.status].order ||
          (a.grade ?? 101) - (b.grade ?? 101) ||
          a.name.localeCompare(b.name),
    );
  const link = (params: Record<string, string>) =>
    `/teacher/progress?${new URLSearchParams({ section: section.id, show, sort, ...params }).toString()}`;

  const tiles: [string, string, string?][] = [
    ["Students", String(summary.count)],
    ["Class average", summary.average === null ? "—" : `${summary.average}%`],
    ["Lessons done (avg)", `${summary.lessonsAverage}%`],
    [
      "Missing work",
      String(summary.missingTotal),
      summary.missingTotal > 0 ? "text-rose-700" : undefined,
    ],
  ];

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <PageHeader
        title="Class Progress"
        subtitle="Every student of a section in one glance. Students who need help are listed first; open a name for the full record."
      />
      <SectionTabs
        sections={sections.map((s) => ({
          id: s.id,
          label: s.code,
          group: subjectLabel({ code: s.course.code, name: s.course.name }),
        }))}
        activeId={section.id}
        basePath="/teacher/progress"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map(([label, value, tone]) => (
          <Card key={label} className="p-5">
            <p className="text-muted text-[11px] font-bold tracking-wide uppercase">
              {label}
            </p>
            <p
              className={`mt-1 text-3xl font-extrabold tabular-nums ${tone ?? "text-ink"}`}
            >
              {value}
            </p>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden">
        <CardHeader
          icon={<TrendUpIcon className="size-[18px]" />}
          title={`${section.course.name} — ${section.code}`}
          subtitle={`${summary.onTrack} on track · ${summary.watch} to watch · ${summary.needsHelp} need help`}
        />
        <div className="border-line flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map(([key, label]) => {
              const n =
                key === "all"
                  ? summary.count
                  : key === "NEEDS_HELP"
                    ? summary.needsHelp
                    : key === "WATCH"
                      ? summary.watch
                      : summary.onTrack;
              return (
                <Link
                  key={key}
                  href={link({ show: key })}
                  className={`rounded-full border px-3 py-1 text-xs font-bold transition ${
                    show === key
                      ? "border-navy bg-navy text-white"
                      : "border-line text-muted hover:bg-canvas"
                  }`}
                >
                  {label} ({n})
                </Link>
              );
            })}
          </div>
          <Link
            href={link({ sort: sort === "name" ? "status" : "name" })}
            className="text-brand text-xs font-bold hover:underline"
          >
            {sort === "name"
              ? "Sort: A–Z · show who needs help first"
              : "Sort: needs help first · sort A–Z"}
          </Link>
        </div>

        {rows.length === 0 ? (
          <EmptyState>
            {summary.count === 0
              ? `No students yet. Share the class code ${section.joinCode} with your students.`
              : "No students in this group."}
          </EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-canvas text-muted text-[11px] font-bold tracking-wide uppercase">
                <tr>
                  <th className="px-5 py-2.5">Student</th>
                  <th className="px-3 py-2.5">Status</th>
                  <th className="px-3 py-2.5 text-right">Grade</th>
                  <th className="px-3 py-2.5">Lessons</th>
                  <th className="px-3 py-2.5 text-center">Unit Questions</th>
                  <th className="px-3 py-2.5 text-center">Assignments</th>
                  <th className="px-3 py-2.5 text-right">Attendance</th>
                  <th className="px-3 py-2.5 text-right">Stars</th>
                  <th className="px-5 py-2.5 text-right">Last sign-in</th>
                </tr>
              </thead>
              <tbody className="divide-line divide-y">
                {rows.map((s) => (
                  <tr key={s.studentId} className="hover:bg-canvas">
                    <td className="px-5 py-3">
                      <Link
                        href={`/teacher/students/${s.studentId}`}
                        className="flex items-center gap-3"
                      >
                        <Avatar name={s.name} size="sm" />
                        <span className="min-w-0">
                          <span className="text-ink block font-semibold hover:underline">
                            {s.name}
                          </span>
                          <span className="text-muted block text-[11px]">
                            {s.studentNumber}
                          </span>
                        </span>
                      </Link>
                    </td>
                    <td className="px-3 py-3">
                      <Pill tone={STATUS[s.status].tone}>
                        {STATUS[s.status].label}
                      </Pill>
                    </td>
                    <td
                      className={`px-3 py-3 text-right font-bold tabular-nums ${gradeTone(s.grade)}`}
                    >
                      {s.grade === null
                        ? "—"
                        : `${Math.round(s.grade * 10) / 10}%`}
                      {s.letter && (
                        <span className="text-muted ml-1 text-[11px] font-semibold">
                          {s.letter}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex min-w-[110px] items-center gap-2">
                        <div
                          className="bg-line h-2 flex-1 overflow-hidden rounded-full"
                          aria-hidden="true"
                        >
                          <div
                            className="bg-brand h-full rounded-full"
                            style={{ width: `${s.lessonsPercent}%` }}
                          />
                        </div>
                        <span className="text-muted w-9 text-right text-xs tabular-nums">
                          {s.lessonsPercent}%
                        </span>
                      </div>
                    </td>
                    <td className="text-ink px-3 py-3 text-center tabular-nums">
                      {data.unitCount > 0
                        ? `${s.unitsDone} / ${data.unitCount}`
                        : "—"}
                    </td>
                    <td className="px-3 py-3 text-center tabular-nums">
                      {s.due === 0 ? (
                        <span className="text-muted">None due</span>
                      ) : (
                        <span>
                          <span className="text-ink">
                            {s.handedIn} / {s.due}
                          </span>
                          {s.missing > 0 && (
                            <span className="ml-1.5 text-xs font-bold text-rose-700">
                              {s.missing} missing
                            </span>
                          )}
                        </span>
                      )}
                    </td>
                    <td
                      className={`px-3 py-3 text-right font-semibold tabular-nums ${attendanceTone(s.attendanceRate)}`}
                    >
                      {s.attendanceRate === null ? "—" : `${s.attendanceRate}%`}
                    </td>
                    <td className="px-3 py-3 text-right font-semibold text-orange-600 tabular-nums">
                      ⭐ {s.stars}
                    </td>
                    <td className="text-muted px-5 py-3 text-right text-xs whitespace-nowrap">
                      {s.lastLoginAt ? timeAgo(s.lastLoginAt) : "Never"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="text-muted border-line border-t px-5 py-3 text-[11px]">
          Needs help: grade under 75%, 2 or more missing, or attendance under
          80%. Watch: grade under 80%, 1 missing, or attendance under 90%.
          Assignments count only work already past its due date.
        </p>
      </Card>
    </div>
  );
}
