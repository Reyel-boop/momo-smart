"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { FileIcon, StarIcon } from "~/app/_components/icons";
import { saveDraft, submitAssignment } from "../actions";
import { FileDropzone, type Attachment } from "./file-dropzone";

export type PanelTask = {
  id: string;
  title: string;
  courseName: string;
  dueText: string;
  format:
    | "FILE_UPLOAD"
    | "TEXT_ENTRY"
    | "EXTERNAL_LINK"
    | "ONLINE_ASSESSMENT"
    | "ON_PAPER";
  stars: number;
  description: string | null;
  instructions: string[];
  rubric: Array<{ id: string; title: string }>;
  submissionId: string | null;
  attachments: Attachment[];
  textBody: string;
  externalUrl: string;
};

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

/**
 * The rubric self-check is a private to-do list for the student, so it lives
 * in this browser only; the teacher never sees it.
 */
function useRubricChecks(taskId: string) {
  const key = `momo:rubric-check:${taskId}`;
  const [checked, setChecked] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored: unknown = JSON.parse(localStorage.getItem(key) ?? "[]");
      if (Array.isArray(stored)) {
        setChecked(stored.filter((id): id is string => typeof id === "string"));
      }
    } catch {
      // Storage can be unavailable (private mode); the checklist still works.
    }
  }, [key]);

  const update = (next: string[]) => {
    setChecked(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // As above: not remembering the ticks is fine.
    }
  };

  return [checked, update] as const;
}

export function SubmitPanel({ task }: { task: PanelTask }) {
  const router = useRouter();
  const [textBody, setTextBody] = useState(task.textBody);
  const [externalUrl, setExternalUrl] = useState(task.externalUrl);
  const [checked, setChecked] = useRubricChecks(task.id);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [saving, startSaving] = useTransition();
  const [submitting, startSubmitting] = useTransition();

  const online =
    task.format === "FILE_UPLOAD" ||
    task.format === "TEXT_ENTRY" ||
    task.format === "EXTERNAL_LINK";

  // Any one of these is enough: a typed answer, a file, or a link. Typing is
  // always offered, whatever the teacher picked, so no one gets stuck.
  const linkOk = isHttpUrl(externalUrl);
  const requirement =
    textBody.trim() || task.attachments.length > 0 || linkOk
      ? null
      : externalUrl.trim()
        ? "That link doesn't look right. Type your answer in the box instead."
        : "Type your answer in the box to submit.";

  const work = {
    textBody: textBody.trim() ? textBody : undefined,
    externalUrl: linkOk ? externalUrl : undefined,
  };

  const save = () =>
    startSaving(async () => {
      setError(null);
      setNotice(null);
      const result = await saveDraft(task.id, work);
      if (result.ok) setNotice("Draft saved.");
      else setError(result.error);
    });

  const submit = () =>
    startSubmitting(async () => {
      setError(null);
      setNotice(null);
      const result = await submitAssignment(task.id, {
        ...work,
        fileIds: task.attachments.map((file) => file.id),
      });
      if (result.ok) router.push("/student/assignments?tab=submitted");
      else setError(result.error);
    });

  const rubricIds = new Set(task.rubric.map((criterion) => criterion.id));
  const checkedCount = checked.filter((id) => rubricIds.has(id)).length;
  const busy = saving || submitting;

  return (
    <section
      id="submit"
      className="border-line bg-surface shadow-card scroll-mt-24 rounded-2xl border"
    >
      <div className="border-line flex items-center gap-3 border-b px-5 py-4">
        <span className="bg-brand-soft text-brand flex size-8 items-center justify-center rounded-lg">
          <FileIcon className="size-4" />
        </span>
        <h2 className="text-ink text-[15px] font-bold">Submit Assignment</h2>
      </div>

      <div className="space-y-5 p-5">
        <div className="border-line bg-canvas/60 rounded-xl border px-4 py-3">
          <p className="text-muted text-[10px] font-bold tracking-[0.1em] uppercase">
            Selected Task
          </p>
          <p className="text-ink mt-1 text-sm font-bold">{task.title}</p>
          <p className="text-brand mt-0.5 text-xs font-semibold">
            {task.courseName} • {task.dueText}
          </p>
        </div>

        {(task.description ?? task.instructions.length > 0) && (
          <div>
            <h3 className="text-ink text-xs font-bold">
              Submission Instructions
            </h3>
            {task.description && (
              <p className="text-muted mt-1.5 text-xs leading-relaxed whitespace-pre-line">
                {task.description}
              </p>
            )}
            {task.instructions.length > 0 && (
              <ul className="text-muted mt-2 list-disc space-y-1 pl-4 text-xs">
                {task.instructions.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {online && (
          <div>
            <label
              htmlFor={`response-${task.id}`}
              className="text-ink text-sm font-bold"
            >
              ✏️ Type your answer here
            </label>
            <textarea
              id={`response-${task.id}`}
              rows={8}
              value={textBody}
              onChange={(event) => setTextBody(event.target.value)}
              maxLength={200_000}
              placeholder="Write your answer, then tap Submit."
              className="border-line bg-canvas text-ink focus:border-brand focus:bg-surface focus:ring-brand/10 mt-2 w-full resize-y rounded-xl border px-3 py-2 text-base transition outline-none focus:ring-4"
            />
            <p className="text-muted mt-1 text-right text-[11px]">
              {textBody.trim() ? textBody.trim().split(/\s+/).length : 0} words
            </p>
          </div>
        )}
        {online && (
          <details
            className="border-line rounded-xl border px-4 py-3"
            open={
              task.format === "FILE_UPLOAD" ||
              task.attachments.length > 0 ||
              !!task.externalUrl
            }
          >
            <summary className="text-ink cursor-pointer text-xs font-bold">
              Optional: attach a file or a link
            </summary>
            <div className="mt-3 space-y-4">
              <FileDropzone
                assignmentId={task.id}
                submissionId={task.submissionId}
                attachments={task.attachments}
              />
              <div>
                <label
                  htmlFor={`link-${task.id}`}
                  className="text-ink text-xs font-bold"
                >
                  Link to your work
                </label>
                <input
                  id={`link-${task.id}`}
                  type="url"
                  inputMode="url"
                  value={externalUrl}
                  onChange={(event) => setExternalUrl(event.target.value)}
                  placeholder="https://"
                  className="border-line bg-canvas text-ink focus:border-brand focus:bg-surface focus:ring-brand/10 mt-2 w-full rounded-xl border px-3 py-2.5 text-sm transition outline-none focus:ring-4"
                />
              </div>
            </div>
          </details>
        )}
        {!online && (
          <p className="border-line bg-canvas/60 text-muted rounded-xl border px-4 py-3 text-xs">
            {task.format === "ONLINE_ASSESSMENT"
              ? "This is a timed online quiz, so it isn't handed in from this page."
              : "This is handed in during class — there's nothing to upload."}
          </p>
        )}

        {task.rubric.length > 0 && (
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-ink text-xs font-bold">Rubric Self-Check</h3>
              <span className="text-brand text-[11px] font-semibold">
                {checkedCount} of {task.rubric.length} Checked
              </span>
            </div>
            <ul className="mt-2 space-y-2">
              {task.rubric.map((criterion) => (
                <li key={criterion.id}>
                  <label className="text-ink flex cursor-pointer items-center gap-2.5 text-sm">
                    <input
                      type="checkbox"
                      className="accent-brand size-4"
                      checked={checked.includes(criterion.id)}
                      onChange={(event) =>
                        setChecked(
                          event.target.checked
                            ? [...checked, criterion.id]
                            : checked.filter((id) => id !== criterion.id),
                        )
                      }
                    />
                    {criterion.title}
                  </label>
                </li>
              ))}
            </ul>
            <p className="text-muted mt-1.5 text-[11px]">
              Just for you — your teacher doesn&apos;t see this checklist.
            </p>
          </div>
        )}

        {online && (
          <div className="space-y-2">
            {error && (
              <p
                role="alert"
                className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700"
              >
                {error}
              </p>
            )}
            {notice && !error && (
              <p role="status" className="text-xs text-emerald-700">
                {notice}
              </p>
            )}
            <button
              type="button"
              onClick={submit}
              disabled={busy || requirement !== null}
              className="bg-navy hover:bg-navy-deep flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              <StarIcon className="size-4 text-amber-300" />
              {submitting
                ? "Submitting…"
                : task.stars > 0
                  ? `Submit for ${task.stars} Stars`
                  : "Submit Assignment"}
            </button>
            <button
              type="button"
              onClick={save}
              disabled={busy}
              className="text-muted hover:text-ink w-full px-4 py-1.5 text-xs font-semibold transition disabled:opacity-60"
            >
              {saving ? "Saving…" : "Not finished? Save it for later"}
            </button>
            <p className="text-muted text-center text-[11px]">
              {requirement ??
                "Submitting timestamps your work and locks edits until your teacher reviews it."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
