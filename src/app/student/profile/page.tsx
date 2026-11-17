import { type Metadata } from "next";
import Link from "next/link";

import { initials, avatarTone } from "~/app/_components/format";
import { PageHeader } from "~/app/_components/page-header";
import { Card, EmptyState, Pill } from "~/app/_components/ui";
import { type RouterOutputs } from "~/trpc/react";
import { api } from "~/trpc/server";
import { gradeLevelName } from "../_components/format";

export const metadata: Metadata = { title: "My Profile · Momo Smart" };
export const dynamic = "force-dynamic";

type Status = NonNullable<RouterOutputs["dashboard"]["myProfile"]["overall"]>;
const STATUS: Record<
  Status,
  { label: string; tone: "green" | "amber" | "rose"; note: string }
> = {
  ON_TRACK: {
    label: "On track",
    tone: "green",
    note: "Great work! Keep it up.",
  },
  WATCH: {
    label: "Watch",
    tone: "amber",
    note: "Almost there: a little more effort keeps you on track.",
  },
  NEEDS_HELP: {
    label: "Needs help",
    tone: "rose",
    note: "Talk to your teacher and catch up on missing work.",
  },
};

const tone = (p: number | null, good: number, ok: number) =>
  p == null
    ? "text-muted"
    : p >= good
      ? "text-emerald-700"
      : p >= ok
        ? "text-amber-700"
        : "text-rose-700";

/** The student's profile: who they are, and how they're doing in each class. */
export default async function ProfilePage() {
  const p = await api.dashboard.myProfile();
  const facts: [string, string][] = [
    ["Student ID", p.studentNumber],
    ["Grade", gradeLevelName(p.gradeLevel)],
    ...(p.homeroom ? ([["Section", p.homeroom]] as [string, string][]) : []),
    ...(p.school ? ([["School", p.school]] as [string, string][]) : []),
    ["Email", p.email ?? "Not added yet"],
  ];

  return (
    <div className="mx-auto max-w-[1100px] space-y-6">
      <PageHeader
        title="My Profile"
        subtitle="Who you are, and how you're doing in each class this term."
      />

      <Card className="overflow-hidden">
        <div className="from-navy to-brand h-24 bg-gradient-to-r sm:h-28" />
        <div className="flex flex-wrap items-end gap-6 px-6 pb-6">
          {p.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={p.image}
              alt={`${p.name}'s profile picture`}
              className="-mt-16 size-36 rounded-full border-4 border-white object-cover shadow-lg sm:-mt-20 sm:size-44"
            />
          ) : (
            <span
              className={`${avatarTone(p.name)} -mt-16 flex size-36 items-center justify-center rounded-full border-4 border-white text-5xl font-extrabold shadow-lg sm:-mt-20 sm:size-44`}
              aria-hidden="true"
            >
              {initials(p.name)}
            </span>
          )}
          <div className="min-w-0 flex-1 pt-3">
            <h2 className="text-ink text-3xl font-extrabold tracking-tight">
              {p.name}
            </h2>
            <p className="text-muted mt-1 text-sm">
              {/* the section name often already says the grade */}
              {p.homeroom?.includes(String(p.gradeLevel))
                ? p.homeroom
                : [gradeLevelName(p.gradeLevel), p.homeroom]
                    .filter(Boolean)
                    .join(" · ")}{" "}
              · ID #{p.studentNumber}
            </p>
            {p.overall && (
              <p className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                <Pill tone={STATUS[p.overall].tone}>
                  {STATUS[p.overall].label}
                </Pill>
                <span className="text-muted">{STATUS[p.overall].note}</span>
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/student/settings#photo"
              className="bg-navy hover:bg-navy-deep rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition"
            >
              {p.image ? "Change picture" : "Add a picture"}
            </Link>
            <Link
              href="/student/settings#email"
              className="border-line text-ink hover:bg-canvas rounded-xl border px-4 py-2.5 text-sm font-semibold transition"
            >
              {p.email ? "Change email" : "Add email"}
            </Link>
          </div>
        </div>

        <div className="border-line divide-line grid divide-y border-t sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {[
            ["GPA", p.gpa === null ? "—" : p.gpa.toFixed(2)],
            ["Stars", `⭐ ${p.stars.toLocaleString()}`],
            [
              "Missing work",
              p.missingTotal === 0 ? "None 🎉" : String(p.missingTotal),
            ],
          ].map(([label, value]) => (
            <div key={label} className="bg-surface px-6 py-4">
              <p className="text-muted text-[11px] font-bold tracking-wide uppercase">
                {label}
              </p>
              <p className="text-ink mt-1 text-2xl font-extrabold">{value}</p>
            </div>
          ))}
        </div>

        <dl className="border-line divide-line grid divide-y border-t sm:grid-cols-2 sm:divide-y-0">
          {facts.map(([term, value]) => (
            <div key={term} className="flex justify-between gap-4 px-6 py-3">
              <dt className="text-muted text-sm">{term}</dt>
              <dd className="text-ink truncate text-sm font-semibold">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </Card>

      <h2 className="text-ink text-lg font-extrabold">
        My status in each class
      </h2>
      {p.classes.length === 0 ? (
        <Card>
          <EmptyState>You&apos;re not in any class this term yet.</EmptyState>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {p.classes.map((c) => (
            <Card key={c.sectionId} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-ink text-base font-extrabold">
                    {c.course}
                  </h3>
                  <p className="text-muted text-xs">
                    {c.code} · Period {c.period} · {c.teacher}
                  </p>
                </div>
                <Pill tone={STATUS[c.status].tone}>
                  {STATUS[c.status].label}
                </Pill>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Stat
                  label="Grade"
                  value={
                    c.grade === null ? "—" : `${Math.round(c.grade * 10) / 10}%`
                  }
                  extra={c.letter ?? undefined}
                  className={tone(c.grade, 80, 75)}
                />
                <Stat
                  label="Attendance"
                  value={
                    c.attendanceRate === null ? "—" : `${c.attendanceRate}%`
                  }
                  className={tone(c.attendanceRate, 90, 80)}
                />
                <Stat
                  label="Unit Questions"
                  value={
                    c.unitCount > 0 ? `${c.unitsDone}/${c.unitCount}` : "—"
                  }
                />
                <Stat
                  label="Assignments"
                  value={c.due === 0 ? "—" : `${c.handedIn}/${c.due}`}
                  className={c.missing > 0 ? "text-rose-700" : undefined}
                />
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-xs">
                  <span className="text-muted font-semibold">Lessons done</span>
                  <span className="text-ink font-bold">
                    {c.lessonsPercent}%
                  </span>
                </div>
                <div className="bg-line mt-1 h-2 overflow-hidden rounded-full">
                  <div
                    className="bg-brand h-full rounded-full"
                    style={{ width: `${c.lessonsPercent}%` }}
                  />
                </div>
              </div>

              {c.missing > 0 && (
                <Link
                  href="/student/assignments"
                  className="mt-4 block rounded-xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100"
                >
                  {c.missing} missing assignment{c.missing === 1 ? "" : "s"} —
                  hand {c.missing === 1 ? "it" : "them"} in now →
                </Link>
              )}
            </Card>
          ))}
        </div>
      )}
      <p className="text-muted text-xs">
        Needs help: grade under 75%, 2 or more missing, or attendance under 80%.
        Watch: grade under 80%, 1 missing, or attendance under 90%.
      </p>
    </div>
  );
}

function Stat({
  label,
  value,
  extra,
  className,
}: {
  label: string;
  value: string;
  extra?: string;
  className?: string;
}) {
  return (
    <div className="border-line bg-canvas/60 rounded-xl border px-3 py-2">
      <p className="text-muted text-[10px] font-bold tracking-wide uppercase">
        {label}
      </p>
      <p className={`text-lg font-extrabold ${className ?? "text-ink"}`}>
        {value}
        {extra && (
          <span className="text-muted ml-1 text-xs font-semibold">{extra}</span>
        )}
      </p>
    </div>
  );
}
