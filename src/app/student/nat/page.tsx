import { TRPCError } from "@trpc/server";
import { type Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "~/app/_components/page-header";
import { Card, EmptyState, Pill } from "~/app/_components/ui";
import { NAT_SUBJECT_INFO, NAT_SUBJECT_ORDER } from "~/lib/nat";
import { api } from "~/trpc/server";

export const metadata: Metadata = { title: "CB-NAT Review · Momo Smart" };
export const dynamic = "force-dynamic";

/**
 * CB-NAT Review for Grade 10: practice tests per subject, taken like the
 * computer-based NAT — one question at a time, 2 minutes each, with the
 * rationale after every answer.
 */
export default async function NatReviewPage() {
  const tests = await loadTests();
  if (!tests) {
    return (
      <div className="mx-auto max-w-3xl">
        <Card>
          <EmptyState>CB-NAT Review is for Grade 10 students.</EmptyState>
        </Card>
      </div>
    );
  }

  const subjects = NAT_SUBJECT_ORDER.map((subject) => ({
    subject,
    ...NAT_SUBJECT_INFO[subject],
    tests: tests.filter((t) => t.subject === subject),
  })).filter((s) => s.tests.length > 0);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader
        title="CB-NAT Review"
        subtitle="Practice for the Computer-Based National Achievement Test. One question at a time, 2 minutes each — answer, read the rationale, and the next question opens when the time is up."
      />

      {subjects.length === 0 && (
        <Card>
          <EmptyState>
            The practice tests are being prepared. Check back soon!
          </EmptyState>
        </Card>
      )}

      {subjects.map((s) => (
        <section key={s.subject} className="space-y-3">
          <div
            className={`flex items-center gap-3 rounded-2xl bg-gradient-to-r ${s.tone} px-5 py-4 text-white`}
          >
            <span className="text-3xl" aria-hidden="true">
              {s.icon}
            </span>
            <div>
              <h2 className="text-xl font-extrabold">{s.label}</h2>
              <p className="text-sm text-white/80">
                {s.tests.length} practice test{s.tests.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {s.tests.map((t) => {
              const triesLeft = Math.max(0, t.maxAttempts - t.triesUsed);
              return (
                <Link
                  key={t.id}
                  href={`/student/nat/${t.id}`}
                  className="border-line bg-surface hover:border-brand flex flex-col rounded-2xl border p-4 transition hover:shadow-sm"
                >
                  <p className="text-ink font-extrabold">{t.title}</p>
                  {t.description && (
                    <p className="text-muted mt-1 text-xs">{t.description}</p>
                  )}
                  <p className="text-muted mt-2 text-xs font-semibold">
                    {t.questionCount} questions · about{" "}
                    {Math.ceil((t.questionCount * 2) / 5) * 5} minutes
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {t.running ? (
                      <Pill tone="blue">In progress — continue</Pill>
                    ) : t.bestScore !== null ? (
                      <Pill tone="green">
                        Best {t.bestScore}/{t.questionCount}
                      </Pill>
                    ) : (
                      <Pill tone="slate">Not taken yet</Pill>
                    )}
                    <span className="text-muted text-[11px] font-semibold">
                      {triesLeft} of {t.maxAttempts} tries left
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

async function loadTests() {
  try {
    return await api.nat.tests();
  } catch (error) {
    if (error instanceof TRPCError && error.code === "FORBIDDEN") return null;
    throw error;
  }
}
