import { TRPCError } from "@trpc/server";
import { type Metadata } from "next";
import { notFound } from "next/navigation";

import { humanise, longDate } from "~/app/_components/format";
import {
  AlertIcon,
  BookOpenIcon,
  CalendarCheckIcon,
  UsersIcon,
} from "~/app/_components/icons";
import { NewMessage } from "~/app/_components/messaging/new-message";
import { PageHeader } from "~/app/_components/page-header";
import {
  Avatar,
  Card,
  CardHeader,
  EmptyState,
  Pill,
} from "~/app/_components/ui";
import { api } from "~/trpc/server";

export const metadata: Metadata = { title: "Student · Momo Smart" };
export const dynamic = "force-dynamic";

const ATTENDANCE_ORDER = ["PRESENT", "LATE", "EXCUSED", "ABSENT"];

/** A student's profile for their teacher: grades, attendance, alerts, family. */
export default async function StudentProfilePage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  const student = await loadStudent(studentId);
  const name = student.user.name ?? "Student";
  const attendanceTotal = Object.values(student.attendance).reduce(
    (sum, n) => sum + n,
    0,
  );

  return (
    <div className="mx-auto max-w-[1100px] space-y-6">
      <PageHeader
        title={name}
        subtitle={`${student.studentNumber} · Grade ${student.gradeLevel}${student.cumulativeGpa != null ? ` · GPA ${student.cumulativeGpa.toFixed(2)}` : ""}`}
        action={
          <NewMessage
            contacts={[{ id: student.user.id, name }]}
            basePath="/teacher/messages"
            label={`Message ${name.split(" ")[0]}`}
          />
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            icon={<BookOpenIcon className="size-[18px]" />}
            title="Courses"
            subtitle="Current grade in each enrolled course"
          />
          {student.enrollments.length === 0 ? (
            <EmptyState>Not enrolled in any course.</EmptyState>
          ) : (
            <ul className="divide-line divide-y">
              {student.enrollments.map((enrollment) => (
                <li
                  key={enrollment.id}
                  className="flex items-center justify-between gap-3 px-5 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-ink truncate text-sm font-semibold">
                      {enrollment.section.course.name}
                    </p>
                    <p className="text-muted text-xs">
                      {enrollment.section.code} · Period{" "}
                      {enrollment.section.period}
                    </p>
                  </div>
                  <span className="text-ink text-sm font-bold tabular-nums">
                    {enrollment.currentPercent != null
                      ? `${Math.round(enrollment.currentPercent * 10) / 10}%`
                      : "—"}
                    {enrollment.currentLetter && (
                      <span className="text-muted ml-1.5 font-semibold">
                        {enrollment.currentLetter}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader
              icon={<CalendarCheckIcon className="size-[18px]" />}
              title="Attendance and work"
            />
            <div className="flex flex-wrap gap-2 p-5">
              {ATTENDANCE_ORDER.map((status) => (
                <span
                  key={status}
                  className="bg-canvas text-ink rounded-lg px-3 py-1.5 text-xs font-semibold"
                >
                  {humanise(status)}: {student.attendance[status] ?? 0}
                </span>
              ))}
              <span className="bg-canvas text-ink rounded-lg px-3 py-1.5 text-xs font-semibold">
                Days recorded: {attendanceTotal}
              </span>
              <span
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${student.missingCount > 0 ? "bg-rose-50 text-rose-700" : "bg-canvas text-ink"}`}
              >
                Missing work: {student.missingCount}
              </span>
            </div>
          </Card>

          <Card>
            <CardHeader
              icon={<UsersIcon className="size-[18px]" />}
              title="Parents and guardians"
            />
            {student.guardians.length === 0 ? (
              <EmptyState>No guardian on file.</EmptyState>
            ) : (
              <ul className="divide-line divide-y">
                {student.guardians.map(({ guardian, isPrimary }) => (
                  <li
                    key={guardian.id}
                    className="flex items-center gap-3 px-5 py-3"
                  >
                    <Avatar name={guardian.name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="text-ink text-sm font-semibold">
                        {guardian.name}{" "}
                        <span className="text-muted font-normal">
                          ({humanise(guardian.relationship)}
                          {isPrimary ? ", primary" : ""})
                        </span>
                      </p>
                      <p className="text-muted text-xs">
                        {[guardian.phone, guardian.email]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>
                    {guardian.phone && (
                      <a
                        href={`tel:${guardian.phone.replace(/\s+/g, "")}`}
                        className="text-brand text-xs font-bold hover:underline"
                      >
                        Call
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader
          icon={<AlertIcon className="size-[18px]" />}
          title="Open alerts"
          subtitle="Early-warning flags that still need follow-up"
        />
        {student.alerts.length === 0 ? (
          <EmptyState>No open alerts.</EmptyState>
        ) : (
          <ul className="divide-line divide-y">
            {student.alerts.map((alert) => (
              <li key={alert.id} className="px-5 py-3.5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-ink text-sm font-bold">{alert.title}</p>
                  <Pill tone={alert.severity === "CRITICAL" ? "rose" : "amber"}>
                    {humanise(alert.severity)}
                  </Pill>
                </div>
                <p className="text-muted mt-1 text-xs">{alert.message}</p>
                <p className="text-muted mt-1 text-[11px]">
                  Raised {longDate(alert.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

async function loadStudent(studentId: string) {
  try {
    return await api.user.studentSnapshot({ studentId });
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
