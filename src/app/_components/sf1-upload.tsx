"use client";

import { TRPCClientError } from "@trpc/client";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";

import { parseSchoolForm1, type Sf1 } from "~/lib/sf1";
import type { AppRouter } from "~/server/api/root";
import { api } from "~/trpc/react";

export type ImportRow = {
  studentNumber: string;
  name: string;
  gradeLevel: number;
};
export type ImportResult =
  | { lrn: string; name: string; status: "created"; password: string }
  | { lrn: string; name: string; status: "existing" }
  | { lrn: string; name: string; status: "failed"; error: string };

/** Accounts are created in batches so each request stays short. */
const BATCH = 50;

const field =
  "border-line bg-canvas text-ink focus:border-brand focus:bg-surface focus:ring-brand/10 mt-1 w-full rounded-lg border px-3 py-2 text-sm transition outline-none focus:ring-4";

async function readWorkbook(file: File): Promise<Sf1 | null> {
  const XLSX = await import("xlsx");
  const book = XLSX.read(await file.arrayBuffer(), { type: "array" });
  for (const name of book.SheetNames) {
    const rows = XLSX.utils.sheet_to_json<Array<string | number | null>>(
      book.Sheets[name]!,
      { header: 1, raw: false, defval: "" },
    );
    const parsed = parseSchoolForm1(rows);
    if (parsed && parsed.students.length > 0) return parsed;
  }
  return null;
}

/**
 * "Upload School Form 1": reads the SF1 Excel file in the browser, shows
 * who was found, then creates accounts (sign-in with LRN) and places
 * everyone in the section. Students join their courses themselves with a
 * class or course code. Ends with a downloadable sign-in list.
 */
export function Sf1Upload({
  mode,
  buttonClassName,
  label = "Upload School Form 1",
}: {
  mode: "admin" | "teacher";
  buttonClassName: string;
  label?: string;
}) {
  const router = useRouter();
  const id = useId();
  const adminImport = api.admin.importRoster.useMutation();
  const teacherImport = api.course.importRoster.useMutation();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Sf1 | null>(null);
  const [fileName, setFileName] = useState("");
  const [readError, setReadError] = useState<string | null>(null);
  const [sectionName, setSectionName] = useState("");
  const [grade, setGrade] = useState("10");
  const [results, setResults] = useState<ImportResult[] | null>(null);
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Separate flags: reading the file and adding students are distinct steps,
  // and Add must not be pressable while the file is still being read.
  const [reading, setReading] = useState(false);
  const [importing, setImporting] = useState(false);
  const busy = reading || importing;

  const reset = () => {
    setForm(null);
    setFileName("");
    setReadError(null);
    setResults(null);
    setError(null);
    setProgress(null);
  };
  const close = () => {
    const imported = results !== null;
    setOpen(false);
    reset();
    // Show the new students once the passwords have been seen.
    if (imported) router.refresh();
  };

  const onFile = (file: File | undefined) => {
    reset();
    if (!file) return;
    setFileName(file.name);
    setReading(true);
    void (async () => {
      try {
        const parsed = await readWorkbook(file);
        if (!parsed) {
          setReadError(
            "No learners found. Use the School Form 1 Excel file from LIS — its table needs an LRN column.",
          );
          return;
        }
        setForm(parsed);
        setSectionName(parsed.section?.trim() ?? "");
        if (parsed.gradeLevel) setGrade(String(parsed.gradeLevel));
      } catch {
        setReadError(
          "This file couldn't be read. Save it as .xlsx and try again.",
        );
      } finally {
        setReading(false);
      }
    })();
  };

  const run = () => {
    if (!form) return;
    setError(null);
    const rows: ImportRow[] = form.students.map((s) => ({
      studentNumber: s.lrn,
      name: s.name,
      gradeLevel: Number(grade),
    }));
    const homeroom = { name: sectionName.trim(), gradeLevel: Number(grade) };
    setImporting(true);
    void (async () => {
      const all: ImportResult[] = [];
      try {
        for (let i = 0; i < rows.length; i += BATCH) {
          setProgress(
            `Adding ${Math.min(i + BATCH, rows.length)} of ${rows.length}…`,
          );
          const batch = rows.slice(i, i + BATCH);
          const result: ImportResult[] =
            mode === "admin"
              ? await adminImport.mutateAsync({ rows: batch, homeroom })
              : await teacherImport.mutateAsync({ rows: batch, homeroom });
          all.push(...result);
        }
        setResults(all);
      } catch (e) {
        setError(
          e instanceof TRPCClientError &&
            (e as TRPCClientError<AppRouter>).data?.code !==
              "INTERNAL_SERVER_ERROR"
            ? e.message
            : "The connection was interrupted. Some students may have been added — upload the form again; nobody is added twice.",
        );
        setResults(all.length > 0 ? all : null);
      } finally {
        setProgress(null);
        setImporting(false);
      }
    })();
  };

  const download = () => {
    if (!results) return;
    const lines = [
      "LRN,name,temporary password,note",
      ...results.map((r) =>
        [
          r.lrn,
          `"${r.name.replace(/"/g, '""')}"`,
          r.status === "created" ? r.password : "",
          r.status === "existing"
            ? "already had an account"
            : r.status === "failed"
              ? `"not added: ${r.error.replace(/"/g, '""')}"`
              : "",
        ].join(","),
      ),
    ];
    const blob = new Blob([`﻿${lines.join("\r\n")}\r\n`], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sign-in-list-${(sectionName || "section").replace(/\W+/g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const created = results?.filter((r) => r.status === "created").length ?? 0;
  const existing = results?.filter((r) => r.status === "existing").length ?? 0;
  const failed = results?.filter((r) => r.status === "failed").length ?? 0;
  const sectionLabel = `Grade ${grade} — ${sectionName.trim()}`;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={buttonClassName}
      >
        {label}
      </button>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${id}-title`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget && !busy) close();
          }}
        >
          <div className="bg-surface max-h-[90vh] w-full max-w-3xl space-y-4 overflow-y-auto rounded-2xl p-6 shadow-xl">
            <div>
              <h2
                id={`${id}-title`}
                className="text-ink text-lg font-extrabold"
              >
                Upload School Form 1 (SF1)
              </h2>
              <p className="text-muted text-sm">
                Choose the SF1 Excel file from LIS. Every learner gets an
                account that signs in with their <b>LRN</b> and a temporary
                password, and is placed in the section. Students then join each
                course with its <b>class code</b> or <b>course code</b>.
              </p>
            </div>

            {results ? (
              <>
                <p className="text-ink text-sm font-semibold">
                  {created} new account{created === 1 ? "" : "s"} · {existing}{" "}
                  already had one
                  {failed > 0 && ` · ${failed} not added`} — all in{" "}
                  {sectionLabel}.
                </p>
                <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
                  Download the sign-in list now — temporary passwords are shown
                  only once. Students sign in with their LRN, change the
                  password the first time, then join their courses under Courses
                  → Join a class.
                </p>
                <div className="border-line max-h-72 overflow-y-auto rounded-xl border">
                  <table className="w-full text-left text-sm">
                    <tbody className="divide-line divide-y">
                      {results.map((r) => (
                        <tr key={r.lrn}>
                          <td className="text-muted px-3 py-2 font-mono text-xs">
                            {r.lrn}
                          </td>
                          <td className="text-ink px-3 py-2">{r.name}</td>
                          <td className="px-3 py-2 text-xs">
                            {r.status === "created" ? (
                              <span className="font-mono">{r.password}</span>
                            ) : r.status === "existing" ? (
                              <span className="text-muted">Had an account</span>
                            ) : (
                              <span className="text-rose-600">{r.error}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {error && <p className="text-sm text-rose-600">{error}</p>}
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={close}
                    className="border-line text-ink hover:bg-canvas rounded-lg border px-4 py-2 text-sm font-semibold"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={download}
                    className="bg-navy hover:bg-navy-deep rounded-lg px-4 py-2 text-sm font-semibold text-white"
                  >
                    Download sign-in list
                  </button>
                </div>
              </>
            ) : (
              <>
                <label className="border-line hover:border-brand flex cursor-pointer flex-col items-center gap-1 rounded-xl border-2 border-dashed px-4 py-6 text-center transition">
                  <span className="text-ink text-sm font-bold">
                    {fileName || "Choose the SF1 file (.xlsx or .xls)"}
                  </span>
                  <span className="text-muted text-xs">
                    The file is read on this computer; only names and LRNs are
                    sent.
                  </span>
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    className="sr-only"
                    onChange={(e) => onFile(e.target.files?.[0])}
                  />
                </label>
                {readError && (
                  <p role="alert" className="text-sm text-rose-600">
                    {readError}
                  </p>
                )}

                {form && (
                  <>
                    <div className="bg-canvas rounded-xl px-4 py-3 text-sm">
                      <p className="text-ink font-semibold">
                        {form.students.length} learner
                        {form.students.length === 1 ? "" : "s"} found
                        {form.section && ` · Section ${form.section}`}
                        {form.gradeLevel && ` · Grade ${form.gradeLevel}`}
                        {form.schoolYear && ` · S.Y. ${form.schoolYear}`}
                      </p>
                      <p className="text-muted mt-1 text-xs">
                        {form.students
                          .slice(0, 6)
                          .map((s) => s.name)
                          .join(", ")}
                        {form.students.length > 6 &&
                          `, and ${form.students.length - 6} more`}
                      </p>
                      {form.skipped > 0 && (
                        <p className="mt-1 text-xs text-amber-700">
                          {form.skipped} row{form.skipped === 1 ? "" : "s"}{" "}
                          skipped (missing or invalid LRN).
                        </p>
                      )}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-[1fr_150px]">
                      <div>
                        <label
                          htmlFor={`${id}-section`}
                          className="text-ink text-xs font-bold"
                        >
                          Section name
                        </label>
                        <input
                          id={`${id}-section`}
                          value={sectionName}
                          onChange={(e) => setSectionName(e.target.value)}
                          maxLength={60}
                          placeholder="e.g. ST ANNE"
                          className={field}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor={`${id}-grade`}
                          className="text-ink text-xs font-bold"
                        >
                          Grade level
                        </label>
                        <select
                          id={`${id}-grade`}
                          value={grade}
                          onChange={(e) => setGrade(e.target.value)}
                          className={field}
                        >
                          {[7, 8, 9, 10, 11, 12].map((g) => (
                            <option key={g} value={g}>
                              Grade {g}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {error && (
                  <p role="alert" className="text-sm text-rose-600">
                    {error}
                  </p>
                )}
                <div className="flex items-center justify-end gap-2">
                  {progress && (
                    <span className="text-muted mr-auto text-sm">
                      {progress}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={close}
                    disabled={busy}
                    className="border-line text-ink hover:bg-canvas rounded-lg border px-4 py-2 text-sm font-semibold disabled:opacity-60"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={run}
                    disabled={busy || !form || !sectionName.trim()}
                    className="bg-navy hover:bg-navy-deep rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {importing
                      ? "Adding students…"
                      : reading
                        ? "Reading the file…"
                        : `Add ${form?.students.length ?? ""} students`}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
