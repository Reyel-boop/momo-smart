"use client";

import { useState } from "react";

import { Card, EmptyState, Pill } from "~/app/_components/ui";
import { NatUploader } from "~/app/_components/nat-uploader";
import { NAT_SUBJECT_INFO, NAT_SUBJECT_ORDER } from "~/lib/nat";
import { api } from "~/trpc/react";

/**
 * The owner's CB-NAT question sets: add questions from any file (read by
 * the AI, with a preview first), then publish, set tries, or delete.
 */
export function NatManager() {
  const utils = api.useUtils();
  const tests = api.nat.adminList.useQuery();
  const refresh = () => void utils.nat.adminList.invalidate();
  const setPublished = api.nat.setPublished.useMutation({ onSuccess: refresh });
  const setMaxAttempts = api.nat.setMaxAttempts.useMutation({
    onSuccess: refresh,
  });
  const remove = api.nat.remove.useMutation({ onSuccess: refresh });

  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <NatUploader onSaved={refresh} />

      {tests.isLoading ? (
        <p className="text-muted text-sm">Loading tests…</p>
      ) : !tests.data?.length ? (
        <Card>
          <EmptyState>
            No practice tests yet. Upload the questions above.
          </EmptyState>
        </Card>
      ) : (
        NAT_SUBJECT_ORDER.map((subject) => {
          const list = tests.data.filter((t) => t.subject === subject);
          if (!list.length) return null;
          const info = NAT_SUBJECT_INFO[subject];
          return (
            <section key={subject} className="space-y-2">
              <h2 className="text-ink text-base font-extrabold">
                {info.icon} {info.label}
              </h2>
              {list.map((t) => (
                <Card key={t.id} className="p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-ink font-bold">{t.title}</p>
                      <p className="text-muted text-xs">
                        {t.questions.length} questions · {t.tries} tr
                        {t.tries === 1 ? "y" : "ies"} by students
                        {t.finished > 0 &&
                          ` · average ${(t.averageScore ?? 0).toFixed(1)}/${t.questions.length}`}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {t.publishedAt ? (
                        <Pill tone="green">Published</Pill>
                      ) : (
                        <Pill tone="amber">Hidden</Pill>
                      )}
                      <label className="text-muted flex items-center gap-1 text-xs font-semibold">
                        Tries
                        <select
                          value={t.maxAttempts}
                          onChange={(e) =>
                            setMaxAttempts.mutate({
                              testId: t.id,
                              maxAttempts: Number(e.target.value),
                            })
                          }
                          className="border-line bg-surface rounded-lg border px-1.5 py-1 text-xs"
                        >
                          {[1, 2, 3, 4, 5].map((n) => (
                            <option key={n} value={n}>
                              {n}
                            </option>
                          ))}
                        </select>
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setPublished.mutate({
                            testId: t.id,
                            published: !t.publishedAt,
                          })
                        }
                        disabled={setPublished.isPending}
                        className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
                          t.publishedAt
                            ? "border-line text-ink hover:bg-canvas border"
                            : "bg-brand text-white hover:opacity-90"
                        }`}
                      >
                        {t.publishedAt ? "Hide" : "Publish"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setOpen(open === t.id ? null : t.id)}
                        className="border-line text-ink hover:bg-canvas rounded-lg border px-3 py-1.5 text-xs font-semibold"
                      >
                        {open === t.id ? "Hide questions" : "View questions"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (
                            window.confirm(
                              `Delete “${t.title}”? Its questions and every student's tries are deleted too.`,
                            )
                          ) {
                            remove.mutate({ testId: t.id });
                          }
                        }}
                        className="rounded-lg px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  {open === t.id && (
                    <ol className="border-line mt-3 space-y-3 border-t pt-3">
                      {t.questions.map((q) => (
                        <li key={q.id} className="text-sm">
                          <p className="text-ink font-semibold whitespace-pre-line">
                            {q.order}. {q.prompt}
                          </p>
                          <ul className="mt-1 grid gap-1 sm:grid-cols-2">
                            {q.options.map((o) => (
                              <li
                                key={o.label}
                                className={`rounded-lg px-2.5 py-1 text-xs ${
                                  o.isCorrect
                                    ? "bg-emerald-50 font-bold text-emerald-700"
                                    : "text-muted"
                                }`}
                              >
                                {o.label}. {o.text}
                                {o.isCorrect && " ✓"}
                              </li>
                            ))}
                          </ul>
                          {q.explanation && (
                            <p className="text-muted mt-1 text-xs italic">
                              {q.explanation}
                            </p>
                          )}
                        </li>
                      ))}
                    </ol>
                  )}
                </Card>
              ))}
            </section>
          );
        })
      )}
    </div>
  );
}
