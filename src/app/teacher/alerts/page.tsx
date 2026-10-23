import { type Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "~/app/_components/page-header";
import { api } from "~/trpc/server";
import { AlertsPanel } from "../_components/alerts-panel";
import { tutorsFor } from "../_components/tutors";

export const metadata: Metadata = { title: "Student Alerts · Momo Smart" };
export const dynamic = "force-dynamic";

const STATUSES = [
  { id: "OPEN", label: "Needs action" },
  { id: "ACKNOWLEDGED", label: "Followed up" },
  { id: "RESOLVED", label: "Resolved" },
] as const;
type Status = (typeof STATUSES)[number]["id"];

/** The early-intervention portal: every student alert, by status. */
export default async function AlertsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const requested = (await searchParams).status;
  const status: Status = STATUSES.find((s) => s.id === requested)?.id ?? "OPEN";
  const alerts = await api.alert.list({ status, limit: 50 });
  const tutors = await tutorsFor(alerts.items);

  return (
    <div className="mx-auto max-w-[1100px] space-y-6">
      <PageHeader
        title="Early Intervention Portal"
        subtitle="Students flagged for missing work, grade drops, missed exams and attendance. Record each follow-up so the whole team can see it."
      />
      <nav aria-label="Alert status" className="flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <Link
            key={s.id}
            href={`/teacher/alerts?status=${s.id}`}
            aria-current={s.id === status ? "page" : undefined}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
              s.id === status
                ? "bg-navy text-white"
                : "border-line bg-surface text-ink hover:bg-canvas border"
            }`}
          >
            {s.label}
          </Link>
        ))}
      </nav>
      <AlertsPanel
        alerts={alerts.items}
        total={status === "OPEN" ? alerts.total : 0}
        tutors={tutors}
        showPortalLink={false}
      />
    </div>
  );
}
