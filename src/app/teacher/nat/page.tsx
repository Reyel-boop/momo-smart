import { type Metadata } from "next";

import { ChevronDownIcon } from "~/app/_components/icons";
import { NatUploader } from "~/app/_components/nat-uploader";
import { PageHeader } from "~/app/_components/page-header";
import { Card, EmptyState, Pill } from "~/app/_components/ui";
import { NAT_SUBJECT_INFO, NAT_SUBJECT_ORDER } from "~/lib/nat";
import { api } from "~/trpc/server";
import { PublishToggle } from "./publish-toggle";

export const metadata: Metadata = { title: "CB-NAT Review · Momo Smart" };
export const dynamic = "force-dynamic";

const dateTime = (d: Date) =>
  d.toLocaleString("en-PH", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Manila",
  });

/**
 * CB-NAT Review for teachers: each practice test with how the school's
 * Grade 10 students did, and its questions with the answer key and
 * rationales. Tests not yet shown to students are marked, so teachers can
 * check them first.
 */
export default async function TeacherNatPage() {
  const tests = await api.nat.teacherView();
  const subjects = NAT_SUBJECT_ORDER.map((subject) => ({
    subject,
    ...NAT_SUBJECT_INFO[subject],
    tests: tests.filter((t) => t.subject === subject),
  })).filter((s) => s.tests.length > 0);

  return (
    <div className="mx-auto max-w-[1200px] space-y-6">
      <PageHeader
        title="CB-NAT Review"
        subtitle="Grade 10 practice tests for the Computer-Based National Achievement Test. Students answer one question at a time, 2 minutes each, and read the rationale after every answer. See your students' results and each test's answer key."
      />

      <NatUploader />

      {subjects.length === 0 && (
        <Card>
          <EmptyState>
            No CB-NAT practice tests yet. Upload a reviewer above.
          </EmptyState>
        </Card>
      )}

      {subjects.map((s) => (
        <section key={s.subject} className="space-y-3">
          <h2 className="text-ink text-lg font-extrabold">
            {s.icon} {s.label}
          </h2>
          {s.tests.map((t) => {
            const done = t.students.filter((x) => x.best !== null);
            return (
              <Card key={t.id} className="overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                  <div className="min-w-0">
                    <p className="text-ink font-bold">{t.title}</p>
                    <p className="text-muted text-xs">
                      {t.questions.length} questions · {t.maxAttempts} tries per
                      student
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {t.publishedAt ? (
                      <Pill tone="green">Open to students</Pill>
                    ) : (
                      <Pill tone="amber">Not yet open — being checked</Pill>
                    )}
                    <PublishToggle
                      testId={t.id}
                      published={!!t.publishedAt}
                      aiAnswers
                    />
                    <Pill tone="slate">
                      {done.length} student{done.length === 1 ? "" : "s"}{" "}
                      finished
                    </Pill>
                    {t.averageBest !== null && (
                      <Pill tone="blue">
                        Average best {t.averageBest.toFixed(1)}/
                        {t.questions.length}
                      </Pill>
                    )}
                  </div>
                </div>

                <details className="group border-line border-t">
                  <summary className="text-brand flex cursor-pointer list-none items-center gap-1 px-5 py-2.5 text-sm font-bold [&::-webkit-details-marker]:hidden">
                    Student results ({t.students.length})
                    <ChevronDownIcon className="size-4 transition group-open:rotate-180" />
                  </summary>
                  {t.students.length === 0 ? (
                    <p className="text-muted px-5 pb-4 text-sm">
                      No student from your school has taken this test yet.
                    </p>
                  ) : (
                    <div className="overflow-x-auto px-5 pb-4">
                      <table className="w-full min-w-[560px] text-sm">
                        <thead>
                          <tr className="text-muted text-left text-xs font-bold uppercase">
                            <th className="py-2 pr-3">Student</th>
                            <th className="py-2 pr-3">Section</th>
                            <th className="py-2 pr-3">Tries</th>
                            <th className="py-2 pr-3">Best score</th>
                            <th className="py-2">Last finished</th>
                          </tr>
                        </thead>
                        <tbody className="divide-line divide-y">
                          {t.students.map((st) => (
                            <tr key={st.lrn}>
                              <td className="text-ink py-2 pr-3 font-semibold">
                                {st.name}
                                <span className="text-muted block text-[11px] font-normal">
                                  {st.lrn}
                                </span>
                              </td>
                              <td className="text-muted py-2 pr-3">
                                {st.section ?? "—"}
                              </td>
                              <td className="text-muted py-2 pr-3">
                                {st.tries}
                                {st.inProgress && " (one in progress)"}
                              </td>
                              <td className="py-2 pr-3">
                                {st.best === null ? (
                                  <span className="text-muted">—</span>
                                ) : (
                                  <span
                                    className={`font-bold ${st.best / t.questions.length >= 0.75 ? "text-emerald-700" : st.best / t.questions.length >= 0.5 ? "text-amber-700" : "text-rose-700"}`}
                                  >
                                    {st.best}/{t.questions.length}
                                  </span>
                                )}
                              </td>
                              <td className="text-muted py-2 text-xs">
                                {st.lastAt ? dateTime(st.lastAt) : "—"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </details>

                <details className="group/q border-line border-t">
                  <summary className="text-brand flex cursor-pointer list-none items-center gap-1 px-5 py-2.5 text-sm font-bold [&::-webkit-details-marker]:hidden">
                    Questions and answer key
                    <ChevronDownIcon className="size-4 transition group-open/q:rotate-180" />
                  </summary>
                  <ol className="space-y-4 px-5 pb-5">
                    {t.questions.map((q) => (
                      <li key={q.id} className="text-sm">
                        <p className="text-ink font-semibold whitespace-pre-line">
                          {q.order}. {q.prompt}
                        </p>
                        <ul className="mt-1.5 grid gap-1 sm:grid-cols-2">
                          {q.options.map((o) => (
                            <li
                              key={o.label}
                              className={`rounded-lg px-2.5 py-1.5 text-xs ${
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
                          <p className="text-muted mt-1 text-xs">
                            <span className="font-bold">Rationale: </span>
                            {q.explanation}
                          </p>
                        )}
                      </li>
                    ))}
                  </ol>
                </details>
              </Card>
            );
          })}
        </section>
      ))}
    </div>
  );
}
