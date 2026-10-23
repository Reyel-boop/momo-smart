import { TRPCError } from "@trpc/server";
import { type Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { fileSize, humanise, longDate } from "~/app/_components/format";
import { ClipboardIcon, FileIcon } from "~/app/_components/icons";
import { PageHeader } from "~/app/_components/page-header";
import { Card, CardHeader, EmptyState, Pill } from "~/app/_components/ui";
import { api } from "~/trpc/server";
import { GradeForm } from "./grade-form";

export const metadata: Metadata = { title: "Grade Submission · Momo Smart" };
export const dynamic = "force-dynamic";

const TIMELINESS: Record<
  string,
  { label: string; tone: "green" | "amber" | "rose" }
> = {
  ON_TIME: { label: "On time", tone: "green" },
  GRACE_PERIOD: { label: "Grace period", tone: "amber" },
  LATE: { label: "Late", tone: "rose" },
};

/** One submission: the student's work beside the grading form. */
export default async function GradeSubmissionPage({
  params,
}: {
  params: Promise<{ submissionId: string }>;
}) {
  const { submissionId } = await params;
  const submission = await load(submissionId);
  // Opening the work marks it as being graded (not yet for released grades).
  if (!submission.grade || submission.grade.status === "PENDING") {
    await api.grading.startGrading({ submissionId });
  }

  const { assignment, student, grade } = submission;
  const criteria =
    assignment.rubric?.type === "STANDARD" ? assignment.rubric.criteria : [];
  const timeliness = submission.timeliness
    ? TIMELINESS[submission.timeliness]
    : null;

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <nav aria-label="Breadcrumb" className="text-muted text-xs font-semibold">
        <Link href="/teacher/grading" className="hover:text-ink">
          Grading
        </Link>{" "}
        › {assignment.title}
      </nav>
      <PageHeader
        title={student.user.name ?? "Student"}
        subtitle={`${assignment.title} · ${assignment.section.course.name} — ${assignment.section.code} · ${assignment.pointsPossible} pts`}
        action={
          <Link
            href={`/teacher/students/${student.id}`}
            className="border-line bg-surface text-ink hover:bg-canvas rounded-xl border px-4 py-2.5 text-sm font-semibold transition"
          >
            Student profile
          </Link>
        }
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader
            icon={<FileIcon className="size-[18px]" />}
            title="Submitted work"
            subtitle={
              submission.submittedAt
                ? `Submitted ${longDate(submission.submittedAt)} · try ${submission.attempt}`
                : "Not submitted yet"
            }
            action={
              timeliness && (
                <Pill tone={timeliness.tone}>{timeliness.label}</Pill>
              )
            }
          />
          <div className="space-y-4 p-5">
            <p className="text-muted text-xs">
              {humanise(assignment.type)} · Due {longDate(assignment.dueAt)}
            </p>
            {submission.textBody && (
              <div className="border-line bg-canvas rounded-xl border p-4">
                <p className="text-ink text-sm leading-relaxed whitespace-pre-wrap">
                  {submission.textBody}
                </p>
                {submission.wordCount != null && (
                  <p className="text-muted mt-2 text-xs">
                    {submission.wordCount} words
                  </p>
                )}
              </div>
            )}
            {submission.externalUrl && (
              <a
                href={submission.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand block truncate text-sm font-semibold hover:underline"
              >
                {submission.externalUrl}
              </a>
            )}
            {submission.attachments.length > 0 && (
              <ul className="space-y-2">
                {submission.attachments.map(({ file }) => (
                  <li key={file.id}>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border-line hover:bg-canvas flex items-center gap-3 rounded-xl border px-3 py-2.5 transition"
                    >
                      <FileIcon className="text-brand size-4 shrink-0" />
                      <span className="text-ink min-w-0 flex-1 truncate text-sm font-semibold">
                        {file.fileName}
                      </span>
                      <span className="text-muted text-xs">
                        {fileSize(file.sizeBytes)}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
            {!submission.textBody &&
              !submission.externalUrl &&
              submission.attachments.length === 0 && (
                <EmptyState>
                  Nothing was attached to this submission.
                </EmptyState>
              )}
          </div>
        </Card>

        <Card>
          <CardHeader
            icon={<ClipboardIcon className="size-[18px]" />}
            title={
              criteria.length > 0
                ? `Rubric: ${assignment.rubric!.title}`
                : "Score"
            }
            subtitle={
              grade?.status === "RELEASED"
                ? "Already released — saving again updates the student's grade."
                : "Release when you're ready for the student to see it."
            }
          />
          <GradeForm
            submissionId={submission.id}
            pointsPossible={assignment.pointsPossible}
            criteria={criteria}
            initial={{
              score: grade?.score ?? null,
              latePenalty: grade?.latePenalty ?? 0,
              feedback: grade?.feedback ?? "",
              levels: Object.fromEntries(
                (grade?.rubricScores ?? []).flatMap((entry) =>
                  entry.levelId ? [[entry.criterionId, entry.levelId]] : [],
                ),
              ),
            }}
            nextHref="/teacher/grading"
          />
        </Card>
      </div>
    </div>
  );
}

async function load(submissionId: string) {
  try {
    return await api.submission.get({ submissionId });
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
