import Link from "next/link";

import {
  AlertIcon,
  ArrowRightIcon,
  CalendarIcon,
  MailIcon,
  UsersIcon,
} from "~/app/_components/icons";
import { Avatar, Pill } from "~/app/_components/ui";
import { AlertAction, type Tutor } from "./alert-action";
import type { InterventionType } from "./alert-actions";

type Alert = {
  id: string;
  type: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
  title: string;
  message: string;
  dueBy: Date | null;
  metadata: unknown;
  currentPercent: number | null;
  currentLetter: string | null;
  section: { id: string; code: string; course: { name: string } } | null;
  student: { id: string; studentNumber: string; user: { name: string | null } };
};

/** The primary action offered for each kind of alert. */
const ACTION: Record<
  string,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    type: InterventionType;
  }
> = {
  MISSING_WORK: {
    label: "Contact Parent & Counselor",
    icon: MailIcon,
    type: "CONTACT_GUARDIAN",
  },
  MISSED_ASSESSMENT: {
    label: "Schedule Exam Slot",
    icon: CalendarIcon,
    type: "SCHEDULE_MAKEUP",
  },
  GRADE_DROP: {
    label: "Assign Peer Tutor",
    icon: UsersIcon,
    type: "ASSIGN_PEER_TUTOR",
  },
  ATTENDANCE: {
    label: "Contact Parent & Counselor",
    icon: MailIcon,
    type: "CONTACT_GUARDIAN",
  },
  INACTIVITY: { label: "Log Follow-up", icon: MailIcon, type: "NOTE" },
  BEHAVIOR: {
    label: "Log Conference",
    icon: UsersIcon,
    type: "STUDENT_CONFERENCE",
  },
};

function badgeFor(alert: Alert) {
  const count =
    alert.metadata &&
    typeof alert.metadata === "object" &&
    "count" in alert.metadata &&
    typeof alert.metadata.count === "number"
      ? alert.metadata.count
      : null;

  if (alert.type === "MISSING_WORK" && count !== null) {
    return { label: `${count} Missing`, tone: "rose" as const };
  }
  if (alert.type === "GRADE_DROP")
    return { label: "Grade Drop", tone: "amber" as const };
  if (alert.type === "MISSED_ASSESSMENT")
    return { label: "Missed Exam", tone: "rose" as const };
  return {
    label: alert.severity === "CRITICAL" ? "Critical" : "Notice",
    tone: "slate" as const,
  };
}

export function AlertsPanel({
  alerts,
  total,
  tutors = {},
  showPortalLink = true,
}: {
  alerts: Alert[];
  total: number;
  /** Possible peer tutors for each section, by section id. */
  tutors?: Record<string, Tutor[]>;
  showPortalLink?: boolean;
}) {
  return (
    <section className="shadow-card overflow-hidden rounded-2xl border border-rose-200 bg-rose-50/40">
      <div className="flex items-start justify-between gap-3 border-b border-rose-200/70 px-5 py-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-600">
            <AlertIcon className="size-[18px]" />
          </span>
          <h2 className="text-[15px] font-bold text-rose-700">
            Student Attention Alerts
          </h2>
        </div>
        {total > 0 && (
          <span className="shrink-0 rounded-full bg-rose-100 px-2.5 py-1 text-[11px] font-bold text-rose-700">
            {total} Requires Action
          </span>
        )}
      </div>

      {alerts.length === 0 ? (
        <p className="text-muted px-5 py-8 text-center text-sm">
          No open alerts. Every student is on track.
        </p>
      ) : (
        <div className="divide-y divide-rose-200/60">
          {alerts.map((alert) => {
            const badge = badgeFor(alert);
            const action = ACTION[alert.type] ?? ACTION.MISSING_WORK!;

            return (
              <article key={alert.id} className="px-5 py-4">
                <div className="flex items-start gap-3">
                  <Avatar name={alert.student.user.name} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-ink truncate text-sm font-bold">
                          {alert.student.user.name}
                        </p>
                        <p className="text-muted text-xs leading-snug">
                          {alert.section
                            ? `${alert.section.course.name} — ${alert.section.code}`
                            : "School-wide"}
                          {alert.currentPercent !== null && (
                            <>
                              {" • Current grade: "}
                              <span className="text-ink font-semibold">
                                {alert.currentPercent}%
                                {alert.currentLetter
                                  ? ` (${alert.currentLetter})`
                                  : ""}
                              </span>
                            </>
                          )}
                        </p>
                      </div>
                      <Pill tone={badge.tone}>{badge.label}</Pill>
                    </div>

                    <p className="mt-2.5 rounded-xl bg-rose-100/70 px-3 py-2 text-xs leading-relaxed text-rose-900">
                      <span className="font-bold">
                        {alert.severity === "CRITICAL" ? "Alert: " : "Notice: "}
                      </span>
                      {alert.message}
                      {alert.dueBy &&
                        ` Window closes ${alert.dueBy.toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          },
                        )}.`}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <AlertAction
                        alertId={alert.id}
                        studentName={alert.student.user.name ?? "the student"}
                        defaultType={action.type}
                        tutors={(alert.section
                          ? (tutors[alert.section.id] ?? [])
                          : []
                        ).filter((tutor) => tutor.id !== alert.student.id)}
                      >
                        <action.icon className="size-3.5" />
                        {action.label}
                      </AlertAction>
                      <Link
                        href={`/teacher/students/${alert.student.id}`}
                        className="border-line bg-surface text-ink hover:bg-canvas rounded-lg border px-3 py-2 text-xs font-semibold transition"
                      >
                        Profile
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {showPortalLink && (
        <div className="border-t border-rose-200/70 px-5 py-3">
          <Link
            href="/teacher/alerts"
            className="text-brand inline-flex items-center gap-1 text-xs font-bold hover:underline"
          >
            Launch Early Intervention Portal (MomoCare)
            <ArrowRightIcon className="size-3.5" />
          </Link>
        </div>
      )}
    </section>
  );
}
