import { TRPCError } from "@trpc/server";
import { type Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ChevronRightIcon } from "~/app/_components/icons";
import { Card, Pill } from "~/app/_components/ui";
import { UnitQuestionsForm } from "~/app/student/courses/_components/unit-questions-form";
import { NAT_SUBJECT_INFO } from "~/lib/nat";
import { api } from "~/trpc/server";
import {
  answerNatQuestion,
  openNextNatQuestion,
  reportNatFocusLoss,
  startNatTest,
} from "../actions";

export const metadata: Metadata = { title: "CB-NAT Review · Momo Smart" };
export const dynamic = "force-dynamic";

/** One CB-NAT practice test, taken in focus mode like Unit Questions. */
export default async function NatTestPage({
  params,
}: {
  params: Promise<{ testId: string }>;
}) {
  const { testId } = await params;
  const test = await loadTest(testId);
  const subject = NAT_SUBJECT_INFO[test.subject];

  return (
    <div className="mx-auto max-w-[900px] space-y-5">
      <nav aria-label="Breadcrumb">
        <ol className="text-muted flex flex-wrap items-center gap-1.5 text-xs font-semibold">
          <li>
            <Link href="/student/nat" className="hover:text-ink">
              CB-NAT Review
            </Link>
          </li>
          <li className="flex items-center gap-1.5">
            <ChevronRightIcon className="size-3.5" />
            {subject.label}
          </li>
          <li className="flex items-center gap-1.5">
            <ChevronRightIcon className="size-3.5" />
            <span className="text-brand" aria-current="page">
              {test.title}
            </span>
          </li>
        </ol>
      </nav>

      <Card className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-brand text-[11px] font-bold tracking-wide uppercase">
              {subject.icon} CB-NAT Review · {subject.label}
            </p>
            <h1 className="text-ink mt-1 text-2xl font-extrabold">
              {test.title}
            </h1>
            {test.description && (
              <p className="text-muted mt-2 text-sm">{test.description}</p>
            )}
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Pill tone="blue">
              {test.questionCount} questions · {test.questionSeconds / 60} min
              each
            </Pill>
            <Pill tone={test.triesLeft > 0 ? "slate" : "amber"}>
              {test.triesLeft} of {test.maxAttempts} tries left
            </Pill>
            {test.bestScore !== null && (
              <Pill tone="green">
                Best: {test.bestScore}/{test.totalPoints}
              </Pill>
            )}
          </div>
        </div>
      </Card>

      <UnitQuestionsForm
        quiz={test}
        courseHref="/student/nat"
        backLabel="Back to CB-NAT Review"
        actions={{
          start: startNatTest,
          open: openNextNatQuestion,
          answer: answerNatQuestion,
          focusLoss: reportNatFocusLoss,
        }}
      />
    </div>
  );
}

async function loadTest(testId: string) {
  try {
    return await api.nat.test({ testId });
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
