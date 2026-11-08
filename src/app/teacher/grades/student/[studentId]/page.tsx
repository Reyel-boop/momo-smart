import { TRPCError } from "@trpc/server";
import { type Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DESCRIPTORS, descriptor } from "~/server/lib/deped";
import { api } from "~/trpc/server";
import { PrintButton } from "./print-button";

export const metadata: Metadata = { title: "Report Card · Momo Smart" };
export const dynamic = "force-dynamic";

const day = (date: Date) =>
  date.toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    timeZone: "Asia/Manila",
  });

/** Only the card itself is printed, not the menu around it. */
const PRINT_CSS = `@media print {
  body * { visibility: hidden !important; }
  #report-card, #report-card * { visibility: visible !important; }
  #report-card { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none !important; border: 0 !important; }
  @page { margin: 12mm; }
}`;

/** A student's Learner's Progress Report Card (DepEd SF9 layout). */
export default async function ReportCardPage({
  params,
  searchParams,
}: {
  params: Promise<{ studentId: string }>;
  searchParams: Promise<{ section?: string }>;
}) {
  const { studentId } = await params;
  const { section } = await searchParams;
  const card = await load(studentId);
  const back = section
    ? `/teacher/grades?section=${encodeURIComponent(section)}`
    : "/teacher/grades";

  const cell = "border border-slate-400 px-2 py-1.5 text-center";
  const q = card.quarterDates;

  return (
    <div className="mx-auto max-w-[900px] space-y-4">
      <style dangerouslySetInnerHTML={{ __html: PRINT_CSS }} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={back}
          className="text-brand text-sm font-semibold hover:underline"
        >
          ← Back to Grades
        </Link>
        <PrintButton />
      </div>

      <div
        id="report-card"
        className="border-line shadow-card rounded-2xl border bg-white p-6 text-slate-900 sm:p-8"
      >
        <header className="text-center">
          <p className="text-xs">Republic of the Philippines</p>
          <p className="text-sm font-bold">Department of Education</p>
          <p className="mt-2 text-base font-extrabold uppercase">
            {card.school?.name ?? "School"}
          </p>
          {(card.school?.address ?? card.school?.depedId) && (
            <p className="text-xs">
              {[
                card.school?.address,
                card.school?.depedId && `School ID ${card.school.depedId}`,
              ]
                .filter(Boolean)
                .join(" • ")}
            </p>
          )}
          <p className="mt-4 text-lg font-extrabold tracking-wide">
            LEARNER&apos;S PROGRESS REPORT CARD
          </p>
          <p className="text-xs">
            School Year {card.schoolYear.replace("-", "–")}
          </p>
        </header>

        <dl className="mt-5 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
          <div className="flex gap-2">
            <dt className="font-semibold">Name:</dt>
            <dd className="flex-1 border-b border-slate-400 font-bold uppercase">
              {card.student.name}
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-semibold">LRN / Student No.:</dt>
            <dd className="flex-1 border-b border-slate-400">
              {card.student.lrn}
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-semibold">Grade:</dt>
            <dd className="flex-1 border-b border-slate-400">
              {card.student.gradeLevel}
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-semibold">Section:</dt>
            <dd className="flex-1 border-b border-slate-400">
              {card.student.section ?? "—"}
            </dd>
          </div>
        </dl>

        <h2 className="mt-6 text-center text-sm font-bold">
          REPORT ON LEARNING PROGRESS AND ACHIEVEMENT
        </h2>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th rowSpan={2} className={`${cell} text-left`}>
                  Learning Areas
                </th>
                <th colSpan={4} className={cell}>
                  Quarter
                </th>
                <th rowSpan={2} className={cell}>
                  Final Rating
                </th>
                <th rowSpan={2} className={cell}>
                  Remarks
                </th>
              </tr>
              <tr className="bg-slate-100">
                {[1, 2, 3, 4].map((n) => (
                  <th key={n} className={`${cell} w-14`}>
                    {n}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {card.rows.map((row) => (
                <tr key={row.key}>
                  <td className={`${cell} text-left`}>
                    <span className="font-semibold">{row.name}</span>
                    {row.classes.map((c) => (
                      <span
                        key={c}
                        className="block text-[10px] text-slate-500 print:hidden"
                      >
                        {c}
                      </span>
                    ))}
                  </td>
                  {row.quarters.map((grade, i) => (
                    <td key={i} className={cell}>
                      {grade ?? ""}
                    </td>
                  ))}
                  <td className={`${cell} font-bold`}>{row.final ?? ""}</td>
                  <td
                    className={`${cell} ${row.remarks === "Failed" ? "font-bold text-rose-700" : ""}`}
                  >
                    {row.remarks ?? ""}
                  </td>
                </tr>
              ))}
              <tr className="bg-slate-50">
                <td colSpan={5} className={`${cell} text-right font-bold`}>
                  General Average
                </td>
                <td className={`${cell} font-extrabold`}>
                  {card.generalAverage ?? ""}
                </td>
                <td className={cell}>
                  {card.generalAverage === null
                    ? ""
                    : card.generalAverage >= 75
                      ? "Passed"
                      : "Failed"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-5 grid gap-5 text-xs sm:grid-cols-2">
          <table className="border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className={`${cell} text-left`}>Descriptors</th>
                <th className={cell}>Grading Scale</th>
                <th className={cell}>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {DESCRIPTORS.map((d) => (
                <tr key={d.label}>
                  <td className={`${cell} text-left`}>{d.label}</td>
                  <td className={cell}>{d.range}</td>
                  <td className={cell}>
                    {d.label === "Did Not Meet Expectations"
                      ? "Failed"
                      : "Passed"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="space-y-6 self-end">
            {card.generalAverage !== null && (
              <p className="text-sm font-semibold">
                {descriptor(card.generalAverage)}
              </p>
            )}
            <div>
              <div className="border-b border-slate-500 pt-6" />
              <p className="mt-1 text-center">Class Adviser</p>
            </div>
            <div>
              <div className="border-b border-slate-500 pt-6" />
              <p className="mt-1 text-center">School Principal</p>
            </div>
          </div>
        </div>

        <p className="mt-5 text-[10px] leading-relaxed text-slate-500">
          Grades are computed from released scores in Momo using DepEd Order No.
          8, s. 2015 (Written Work, Performance Tasks and Quarterly Assessment,
          then transmuted). Quarters: Q1 {day(q[0]!)}–{day(q[1]!)}, Q2{" "}
          {day(q[1]!)}–{day(q[2]!)}, Q3 {day(q[2]!)}–{day(q[3]!)}, Q4{" "}
          {day(q[3]!)}–{day(q[4]!)}. Blank cells mean no graded work yet
          {card.juniorHigh ? " or a subject not taught in Momo" : ""}. The final
          rating and general average appear once every quarter has a grade.
        </p>
      </div>
    </div>
  );
}

async function load(studentId: string) {
  try {
    return await api.grading.reportCard({ studentId });
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
