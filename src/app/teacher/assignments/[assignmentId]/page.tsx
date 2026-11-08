import { type Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TRPCError } from "@trpc/server";

import { ClipboardIcon, UsersIcon } from "~/app/_components/icons";
import { PageHeader } from "~/app/_components/page-header";
import { Card, CardHeader, EmptyState, Pill } from "~/app/_components/ui";
import { api } from "~/trpc/server";

export const metadata: Metadata = { title: "Submissions · Momo Smart" };
export const dynamic = "force-dynamic";

const dateLabel = (date: Date) =>
  date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Manila",
  });

const TIMELINESS = {
  ON_TIME: { label: "On time", tone: "green" },
  GRACE_PERIOD: { label: "Grace period", tone: "amber" },
  LATE: { label: "Late", tone: "rose" },
} as const;

async function load(assignmentId: string) {
  try {
    return await api.assignment.submissionStatus({ assignmentId });
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

/** Who has handed in an assignment, and who still hasn't. */
export default async function AssignmentSubmissionsPage({
  params,
}: {
  params: Promise<{ assignmentId: string }>;
}) {
  const { assignmentId } = await params;
  const { assignment, submitted, notSubmitted, excused } =
    await load(assignmentId);
  const pastDue = assignment.dueAt.getTime() < Date.now();
  const total = submitted.length + notSubmitted.length;

  return (
    <div className="mx-auto max-w-[1000px] space-y-6">
      <Link
        href={`/teacher/assignments?section=${assignment.sectionId}`}
        className="text-brand text-sm font-semibold hover:underline"
      >
        ← Assignments
      </Link>
      <PageHeader
        title={assignment.title}
        subtitle={`${assignment.classLabel} • Due ${dateLabel(assignment.dueAt)} • ${assignment.pointsPossible} points`}
        action={
          <Link
            href={`/teacher/assignments/${assignment.id}/edit`}
            className="border-line text-ink hover:bg-canvas rounded-lg border px-4 py-2 text-sm font-semibold"
          >
            Edit
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-muted text-xs font-bold">Submitted</p>
          <p className="mt-1 text-3xl font-extrabold text-emerald-600">
            {submitted.length}
            <span className="text-muted text-base"> / {total}</span>
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-muted text-xs font-bold">Not submitted</p>
          <p className="mt-1 text-3xl font-extrabold text-rose-600">
            {notSubmitted.length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-muted text-xs font-bold">Waiting for a grade</p>
          <p className="text-ink mt-1 text-3xl font-extrabold">
            {submitted.filter((s) => !s.graded).length}
          </p>
        </Card>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            icon={<ClipboardIcon className="size-[18px]" />}
            title={`Submitted (${submitted.length})`}
          />
          {submitted.length === 0 ? (
            <EmptyState>No one has submitted yet.</EmptyState>
          ) : (
            <ol className="divide-line divide-y">
              {submitted.map((student) => {
                const timing = student.timeliness
                  ? TIMELINESS[student.timeliness]
                  : null;
                return (
                  <li key={student.studentId}>
                    <Link
                      href={`/teacher/grading/${student.submissionId}`}
                      className="hover:bg-canvas flex items-center justify-between gap-3 px-5 py-3 transition"
                    >
                      <span className="min-w-0">
                        <span className="text-ink block truncate text-sm font-bold">
                          {student.name}
                        </span>
                        <span className="text-muted block text-xs">
                          {student.submittedAt
                            ? dateLabel(student.submittedAt)
                            : ""}
                        </span>
                      </span>
                      <span className="flex shrink-0 flex-wrap justify-end gap-1.5">
                        {timing && (
                          <Pill tone={timing.tone}>{timing.label}</Pill>
                        )}
                        {student.graded ? (
                          <Pill tone="green">
                            ✓ Released · {student.score ?? "–"}/
                            {assignment.pointsPossible}
                          </Pill>
                        ) : student.gradedNotReleased ? (
                          <Pill tone="amber">Graded · not released</Pill>
                        ) : (
                          <Pill tone="slate">Not checked yet</Pill>
                        )}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          )}
        </Card>

        <Card>
          <CardHeader
            icon={<UsersIcon className="size-[18px]" />}
            title={`Not submitted (${notSubmitted.length})`}
          />
          {notSubmitted.length === 0 ? (
            <EmptyState>Everyone has submitted.</EmptyState>
          ) : (
            <ol className="divide-line divide-y">
              {notSubmitted.map((student) => (
                <li
                  key={student.studentId}
                  className="flex items-center justify-between gap-3 px-5 py-3"
                >
                  <span className="text-ink min-w-0 truncate text-sm font-bold">
                    {student.name}
                  </span>
                  {student.started ? (
                    <Pill tone="amber">Started, not sent</Pill>
                  ) : (
                    pastDue && <Pill tone="rose">Missing</Pill>
                  )}
                </li>
              ))}
            </ol>
          )}
        </Card>
      </div>

      {excused.length > 0 && (
        <p className="text-muted text-sm">
          Excused: {excused.map((student) => student.name).join(", ")}
        </p>
      )}
    </div>
  );
}
