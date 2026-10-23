import { type Metadata } from "next";
import Link from "next/link";

import { PageHeader, SectionTabs } from "~/app/_components/page-header";
import { api } from "~/trpc/server";
import { GradingQueue } from "../_components/grading-queue";

export const metadata: Metadata = { title: "Grading · Momo Smart" };
export const dynamic = "force-dynamic";

const SORTS = [
  { id: "OLDEST", label: "Oldest first" },
  { id: "NEWEST", label: "Newest first" },
  { id: "DUE_DATE", label: "By due date" },
] as const;
type Sort = (typeof SORTS)[number]["id"];

const PAGE_SIZE = 10;

/** The full grading queue: filter by class, sort, and page through. */
export default async function GradingPage({
  searchParams,
}: {
  searchParams: Promise<{ section?: string; sort?: string; cursor?: string }>;
}) {
  const params = await searchParams;
  const sections = await api.course.mySections();
  const sectionId =
    params.section && sections.some((s) => s.id === params.section)
      ? params.section
      : undefined;
  const sort: Sort = SORTS.find((s) => s.id === params.sort)?.id ?? "OLDEST";

  const [queue, summary] = await Promise.all([
    api.grading.queue({
      sectionId,
      sort,
      cursor: params.cursor ?? null,
      limit: PAGE_SIZE,
    }),
    api.grading.queueSummary(),
  ]);

  const href = (extra: Record<string, string | undefined>) => {
    const query = new URLSearchParams();
    const merged = { section: sectionId, sort, ...extra };
    for (const [key, value] of Object.entries(merged)) {
      if (value) query.set(key, value);
    }
    const text = query.toString();
    return `/teacher/grading${text ? `?${text}` : ""}`;
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <PageHeader
        title="Grading"
        subtitle={`${summary.total} submission${summary.total === 1 ? "" : "s"} waiting for a grade across ${summary.sections} class section${summary.sections === 1 ? "" : "s"}.`}
      />
      <SectionTabs
        sections={sections.map((s) => ({
          id: s.id,
          label: `${s.course.name} — ${s.code}`,
        }))}
        activeId={sectionId ?? null}
        basePath="/teacher/grading"
        allLabel="All sections"
      />
      <nav aria-label="Sort" className="flex flex-wrap items-center gap-2">
        <span className="text-muted text-xs font-semibold">Sort:</span>
        {SORTS.map((s) => (
          <Link
            key={s.id}
            href={href({ sort: s.id })}
            aria-current={s.id === sort ? "true" : undefined}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              s.id === sort
                ? "bg-brand-soft text-brand"
                : "text-muted hover:text-ink"
            }`}
          >
            {s.label}
          </Link>
        ))}
      </nav>
      <GradingQueue
        items={queue.items}
        total={summary.total}
        sectionCount={summary.sections}
        nextHref={queue.nextCursor ? href({ cursor: queue.nextCursor }) : null}
        firstHref={params.cursor ? href({}) : null}
      />
    </div>
  );
}
