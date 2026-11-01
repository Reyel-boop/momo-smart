"use client";

import { useState } from "react";

import { Card, EmptyState, Pill } from "~/app/_components/ui";
import {
  NAT_SUBJECT_INFO,
  NAT_SUBJECT_ORDER,
  natSubjectOf,
  type NatSubjectKey,
} from "~/lib/nat";
import { api } from "~/trpc/react";

type ParsedTest = {
  subject: NatSubjectKey;
  title: string;
  questions: {
    prompt: string;
    options: string[];
    answer: number;
    explanation?: string;
  }[];
};

const HEADERS = [
  "Subject",
  "Test",
  "Question",
  "A",
  "B",
  "C",
  "D",
  "Answer",
  "Rationale",
];

/** Downloads the question template, with two example rows and the rules. */
async function downloadTemplate() {
  const XLSX = await import("xlsx");
  const rows = [
    HEADERS,
    [
      "English",
      "Reading Comprehension Set 1",
      "Which word is closest in meaning to 'diligent'?",
      "lazy",
      "hardworking",
      "careless",
      "slow",
      "B",
      "Diligent means showing steady, careful effort — hardworking.",
    ],
    [
      "Mathematics",
      "Algebra Set 1",
      "What is the value of x if 2x + 5 = 17?",
      "5",
      "6",
      "7",
      "11",
      "B",
      "2x = 17 − 5 = 12, so x = 6.",
    ],
  ];
  const rules = [
    ["How to fill in the questions"],
    ["One row per question. Keep the header row."],
    [
      "Subject: English, Filipino, Mathematics, Science, Araling Panlipunan, or Mock (a full mock exam of all subjects).",
    ],
    [
      "Test: the practice test's name. Rows with the same Subject and Test become one test, in row order.",
    ],
    [
      "A–D: the choices. Answer: the letter of the right choice (A, B, C or D).",
    ],
    ["Rationale: the explanation students see after answering."],
    [
      "Uploading a test name again replaces its questions — unless students already took it.",
    ],
  ];
  const book = XLSX.utils.book_new();
  const sheet = XLSX.utils.aoa_to_sheet(rows);
  sheet["!cols"] = [12, 28, 60, 20, 20, 20, 20, 8, 60].map((wch) => ({ wch }));
  XLSX.utils.book_append_sheet(book, sheet, "Questions");
  XLSX.utils.book_append_sheet(book, XLSX.utils.aoa_to_sheet(rules), "How to");
  XLSX.writeFile(book, "CB-NAT questions template.xlsx");
}

/** Reads the uploaded sheet into tests, with a message per bad row. */
async function parseFile(file: File) {
  const XLSX = await import("xlsx");
  const book = XLSX.read(await file.arrayBuffer());
  const sheet = book.Sheets[book.SheetNames[0]!]!;
  const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    blankrows: false,
    defval: "",
  });
  const cell = (v: unknown) =>
    typeof v === "string" ? v.trim() : typeof v === "number" ? String(v) : "";

  // Find the header row and each column by name.
  const headerAt = rows.findIndex((r) =>
    r.some((c) => /^question$/i.test(cell(c))),
  );
  if (headerAt < 0) {
    return {
      tests: [],
      errors: ["No header row with a “Question” column was found."],
    };
  }
  const header = rows[headerAt]!.map((c) => cell(c).toLowerCase());
  const col = (...names: string[]) =>
    header.findIndex((h) => names.includes(h));
  const at = {
    subject: col("subject", "learning area"),
    test: col("test", "title", "test title", "set"),
    question: col("question", "prompt"),
    options: ["a", "b", "c", "d", "e"].map((l) => col(l, `choice ${l}`)),
    answer: col("answer", "correct", "correct answer", "key"),
    rationale: col("rationale", "explanation"),
  };
  const missing = [
    at.subject < 0 && "Subject",
    at.test < 0 && "Test",
    at.answer < 0 && "Answer",
    at.options[0]! < 0 && "A",
    at.options[1]! < 0 && "B",
  ].filter(Boolean);
  if (missing.length) {
    return {
      tests: [],
      errors: [
        `Missing column${missing.length > 1 ? "s" : ""}: ${missing.join(", ")}.`,
      ],
    };
  }

  const tests = new Map<string, ParsedTest>();
  const errors: string[] = [];
  rows.slice(headerAt + 1).forEach((r, i) => {
    const line = headerAt + i + 2;
    const prompt = cell(r[at.question]);
    if (!prompt) return;
    const subject = natSubjectOf(cell(r[at.subject]));
    const title = cell(r[at.test]);
    const options = at.options
      .filter((c) => c >= 0)
      .map((c) => cell(r[c]))
      .filter(Boolean);
    const key = cell(r[at.answer]).toUpperCase();
    const answer = /^[A-F]$/.test(key)
      ? key.charCodeAt(0) - 65
      : options.findIndex((o) => o.toUpperCase() === key);
    if (!subject)
      return errors.push(
        `Row ${line}: unknown subject “${cell(r[at.subject])}”.`,
      );
    if (!title) return errors.push(`Row ${line}: the Test name is empty.`);
    if (options.length < 2)
      return errors.push(`Row ${line}: needs at least choices A and B.`);
    if (answer < 0 || answer >= options.length) {
      return errors.push(
        `Row ${line}: the Answer “${cell(r[at.answer])}” is not one of the choices.`,
      );
    }
    const id = `${subject}|${title}`;
    if (!tests.has(id)) tests.set(id, { subject, title, questions: [] });
    tests.get(id)!.questions.push({
      prompt,
      options,
      answer,
      explanation:
        at.rationale >= 0 ? cell(r[at.rationale]) || undefined : undefined,
    });
  });
  return { tests: [...tests.values()], errors };
}

/**
 * The owner's CB-NAT question sets: download the template, upload the
 * questions with a preview first, then publish, set tries, or delete.
 */
export function NatManager() {
  const utils = api.useUtils();
  const tests = api.nat.adminList.useQuery();
  const refresh = () => void utils.nat.adminList.invalidate();
  const importTests = api.nat.importTests.useMutation({ onSuccess: refresh });
  const setPublished = api.nat.setPublished.useMutation({ onSuccess: refresh });
  const setMaxAttempts = api.nat.setMaxAttempts.useMutation({
    onSuccess: refresh,
  });
  const remove = api.nat.remove.useMutation({ onSuccess: refresh });

  const [preview, setPreview] = useState<{
    file: string;
    tests: ParsedTest[];
    errors: string[];
  } | null>(null);
  const [reading, setReading] = useState(false);
  const [open, setOpen] = useState<string | null>(null);

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setReading(true);
    importTests.reset();
    try {
      setPreview({ file: file.name, ...(await parseFile(file)) });
    } catch {
      setPreview({
        file: file.name,
        tests: [],
        errors: [
          "This file could not be read. Save it as .xlsx and try again.",
        ],
      });
    } finally {
      setReading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="space-y-4 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-xl">
            <h2 className="text-ink text-lg font-extrabold">Add questions</h2>
            <p className="text-muted mt-1 text-sm">
              One row per question: Subject, Test, Question, choices A–D, the
              Answer letter and the Rationale. Rows with the same Subject and
              Test become one practice test.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void downloadTemplate()}
              className="border-line bg-surface text-ink hover:bg-canvas rounded-xl border px-4 py-2.5 text-sm font-bold"
            >
              ⬇ Download template
            </button>
            <label className="bg-brand cursor-pointer rounded-xl px-4 py-2.5 text-sm font-bold text-white hover:opacity-90">
              {reading ? "Reading…" : "⬆ Upload questions"}
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                className="sr-only"
                onChange={(e) => {
                  void onFile(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </label>
          </div>
        </div>

        {preview && (
          <div className="border-line rounded-xl border p-4">
            <p className="text-ink text-sm font-bold">
              Preview of {preview.file}
            </p>
            {preview.tests.length > 0 && (
              <ul className="mt-2 space-y-1 text-sm">
                {preview.tests.map((t) => (
                  <li key={`${t.subject}|${t.title}`} className="text-ink">
                    <span className="font-semibold">
                      {NAT_SUBJECT_INFO[t.subject].label} · {t.title}
                    </span>{" "}
                    <span className="text-muted">
                      — {t.questions.length} question
                      {t.questions.length === 1 ? "" : "s"}
                      {t.questions.some((q) => !q.explanation) &&
                        `, ${t.questions.filter((q) => !q.explanation).length} without a rationale`}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {preview.errors.length > 0 && (
              <ul className="mt-2 space-y-0.5 text-xs text-rose-700">
                {preview.errors.slice(0, 12).map((e) => (
                  <li key={e}>{e}</li>
                ))}
                {preview.errors.length > 12 && (
                  <li>…and {preview.errors.length - 12} more.</li>
                )}
              </ul>
            )}
            {importTests.error && (
              <p className="mt-2 text-sm text-rose-700">
                {importTests.error.message}
              </p>
            )}
            {importTests.data ? (
              <p className="mt-3 text-sm font-semibold text-emerald-700">
                ✓ Saved: {importTests.data.created} new test
                {importTests.data.created === 1 ? "" : "s"}
                {importTests.data.replaced > 0 &&
                  `, ${importTests.data.replaced} replaced`}{" "}
                ({importTests.data.questions} questions). Publish them below
                when they&apos;re ready.
              </p>
            ) : (
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={
                    preview.tests.length === 0 ||
                    preview.errors.length > 0 ||
                    importTests.isPending
                  }
                  onClick={() => importTests.mutate({ tests: preview.tests })}
                  className="bg-brand rounded-xl px-4 py-2 text-sm font-bold text-white hover:opacity-90 disabled:opacity-50"
                >
                  {importTests.isPending ? "Saving…" : "Save these tests"}
                </button>
                <button
                  type="button"
                  onClick={() => setPreview(null)}
                  className="border-line text-ink hover:bg-canvas rounded-xl border px-4 py-2 text-sm font-semibold"
                >
                  Cancel
                </button>
                {preview.errors.length > 0 && (
                  <p className="text-muted self-center text-xs">
                    Fix the rows above in the file and upload it again.
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </Card>

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
