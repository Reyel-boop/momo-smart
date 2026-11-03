"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Card } from "~/app/_components/ui";
import {
  NAT_SUBJECT_INFO,
  NAT_SUBJECT_ORDER,
  natSubjectOf,
  type NatSubjectKey,
} from "~/lib/nat";
import { api } from "~/trpc/react";

type PreviewQuestion = {
  prompt: string;
  options: string[];
  answer: number;
  explanation?: string;
  /** False when the AI worked out the answer (the file had none). */
  answerFromFile?: boolean;
};
type PreviewTest = {
  subject: NatSubjectKey;
  title: string;
  questions: PreviewQuestion[];
};
type Preview = {
  source: string;
  tests: PreviewTest[];
  errors: string[];
  notes?: string;
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
const LETTERS = "ABCDEF";

/** Downloads Momo's own question sheet (optional — any file works). */
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
  ];
  const book = XLSX.utils.book_new();
  const sheet = XLSX.utils.aoa_to_sheet(rows);
  sheet["!cols"] = [12, 28, 60, 20, 20, 20, 20, 8, 60].map((wch) => ({ wch }));
  XLSX.utils.book_append_sheet(book, sheet, "Questions");
  XLSX.writeFile(book, "CB-NAT questions template.xlsx");
}

/**
 * A sheet in Momo's own template is read right here (free and instant).
 * Null when the file is anything else, so the AI reads it instead.
 */
async function readTemplate(file: File): Promise<Preview | null> {
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
  const headerAt = rows.findIndex((r) =>
    r.some((c) => /^question$/i.test(cell(c))),
  );
  if (headerAt < 0) return null;
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
  if (at.subject < 0 || at.test < 0 || at.answer < 0 || at.options[1]! < 0) {
    return null;
  }
  const tests = new Map<string, PreviewTest>();
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
    if (!subject) {
      errors.push(`Row ${line}: unknown subject “${cell(r[at.subject])}”.`);
      return;
    }
    if (
      !title ||
      options.length < 2 ||
      answer < 0 ||
      answer >= options.length
    ) {
      errors.push(`Row ${line}: the test name, choices or answer is missing.`);
      return;
    }
    const id = `${subject}|${title}`;
    if (!tests.has(id)) tests.set(id, { subject, title, questions: [] });
    tests.get(id)!.questions.push({
      prompt,
      options,
      answer,
      explanation:
        at.rationale >= 0 ? cell(r[at.rationale]) || undefined : undefined,
      answerFromFile: true,
    });
  });
  return { source: file.name, tests: [...tests.values()], errors };
}

/**
 * Add CB-NAT questions from any file: a PDF, Word file, photos of the
 * pages, a spreadsheet or pasted text, in whatever layout. The AI reads it
 * (Momo's own template is read directly), then the uploader checks a
 * preview — answers the AI worked out are flagged — and saves. New tests
 * start hidden from students.
 */
export function NatUploader({ onSaved }: { onSaved?: () => void }) {
  const router = useRouter();
  const importTests = api.nat.importTests.useMutation({
    onSuccess: () => {
      onSaved?.();
      router.refresh();
    },
  });
  const [preview, setPreview] = useState<Preview | null>(null);
  const [reading, setReading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pasted, setPasted] = useState("");
  const [showPaste, setShowPaste] = useState(false);
  const [open, setOpen] = useState<number | null>(null);

  const read = async (files: File[], text: string) => {
    if (files.length === 0 && !text.trim()) return;
    setError(null);
    setPreview(null);
    setOpen(null);
    importTests.reset();
    const source =
      files.length === 1
        ? files[0]!.name
        : files.length > 1
          ? `${files.length} files`
          : "the pasted text";
    try {
      // Momo's own template needs no AI.
      if (files.length === 1 && /\.(xlsx|xls|csv)$/i.test(files[0]!.name)) {
        setReading("Reading the spreadsheet…");
        const own = await readTemplate(files[0]!);
        if (own && own.tests.length > 0) {
          setPreview(own);
          return;
        }
      }
      setReading(
        "The AI is reading the questions, answers and rationales… this takes 1 to 4 minutes for a long file. Keep this page open.",
      );
      const form = new FormData();
      for (const f of files) form.append("files", f);
      form.append("text", text);
      const res = await fetch("/api/nat/extract", {
        method: "POST",
        body: form,
      });
      const data = (await res.json().catch(() => null)) as
        { tests: PreviewTest[]; notes: string } | { error: string } | null;
      if (!res.ok || !data || "error" in data) {
        setError(
          data && "error" in data
            ? data.error
            : "The file could not be read. Try again.",
        );
        return;
      }
      setPreview({ source, tests: data.tests, errors: [], notes: data.notes });
    } catch {
      setError(
        "The file could not be read. Check your connection and try again.",
      );
    } finally {
      setReading(null);
    }
  };

  const update = (i: number, change: Partial<PreviewTest>) =>
    setPreview((p) =>
      p
        ? {
            ...p,
            tests: p.tests.map((t, k) => (k === i ? { ...t, ...change } : t)),
          }
        : p,
    );

  const flagged = (t: PreviewTest) =>
    t.questions.filter((q) => q.answerFromFile === false).length;

  return (
    <Card className="space-y-4 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <h2 className="text-ink text-lg font-extrabold">Add questions</h2>
          <p className="text-muted mt-1 text-sm">
            Upload the reviewer as it is — a PDF, a Word file, photos of the
            pages, or an Excel sheet — or paste the questions. The AI finds each
            question, its choices and the answer key, turns graphs and tables
            into text, and writes a rationale when there is none. You check it
            before saving.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <label
            className={`bg-brand cursor-pointer rounded-xl px-4 py-2.5 text-sm font-bold text-white hover:opacity-90 ${reading ? "pointer-events-none opacity-60" : ""}`}
          >
            ⬆ Upload a file
            <input
              type="file"
              multiple
              accept=".pdf,.docx,.jpg,.jpeg,.png,.webp,.xlsx,.xls,.csv,.txt"
              className="sr-only"
              disabled={!!reading}
              onChange={(e) => {
                void read([...(e.target.files ?? [])], "");
                e.target.value = "";
              }}
            />
          </label>
          <button
            type="button"
            onClick={() => setShowPaste((v) => !v)}
            disabled={!!reading}
            className="border-line bg-surface text-ink hover:bg-canvas rounded-xl border px-4 py-2.5 text-sm font-bold disabled:opacity-60"
          >
            📋 Paste instead
          </button>
        </div>
      </div>
      <p className="text-muted -mt-2 text-xs">
        Several photos of one reviewer can be uploaded together. Up to 4 MB at a
        time.{" "}
        <button
          type="button"
          onClick={() => void downloadTemplate()}
          className="text-brand font-semibold hover:underline"
        >
          Momo&apos;s spreadsheet template
        </button>{" "}
        is optional.
      </p>

      {showPaste && (
        <div className="space-y-2">
          <textarea
            value={pasted}
            onChange={(e) => setPasted(e.target.value)}
            rows={8}
            placeholder="Paste the questions, choices and the answer key here — in any layout."
            className="border-line bg-surface text-ink w-full rounded-xl border p-3 text-sm"
          />
          <button
            type="button"
            onClick={() => void read([], pasted)}
            disabled={!pasted.trim() || !!reading}
            className="bg-brand rounded-xl px-4 py-2 text-sm font-bold text-white hover:opacity-90 disabled:opacity-50"
          >
            Read these questions
          </button>
        </div>
      )}

      {reading && (
        <p
          role="status"
          className="bg-brand-soft text-brand rounded-xl px-4 py-3 text-sm font-semibold"
        >
          ⏳ {reading}
        </p>
      )}
      {error && (
        <p
          role="alert"
          className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          {error}
        </p>
      )}

      {preview && (
        <div className="border-line space-y-3 rounded-xl border p-4">
          <p className="text-ink text-sm font-bold">
            Found in {preview.source}: {preview.tests.length} test
            {preview.tests.length === 1 ? "" : "s"},{" "}
            {preview.tests.reduce((n, t) => n + t.questions.length, 0)}{" "}
            questions. Check the names and subjects, then save.
          </p>
          {preview.notes && (
            <p className="text-muted rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">
              Note from the reader: {preview.notes}
            </p>
          )}
          <ul className="space-y-2">
            {preview.tests.map((t, i) => (
              <li key={i} className="border-line rounded-xl border p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={t.subject}
                    onChange={(e) =>
                      update(i, { subject: e.target.value as NatSubjectKey })
                    }
                    className="border-line bg-surface rounded-lg border px-2 py-1.5 text-sm"
                    aria-label="Subject"
                  >
                    {NAT_SUBJECT_ORDER.map((s) => (
                      <option key={s} value={s}>
                        {NAT_SUBJECT_INFO[s].label}
                      </option>
                    ))}
                  </select>
                  <input
                    value={t.title}
                    onChange={(e) => update(i, { title: e.target.value })}
                    className="border-line bg-surface min-w-0 flex-1 rounded-lg border px-2 py-1.5 text-sm font-semibold"
                    aria-label="Test name"
                  />
                  <span className="text-muted text-xs font-semibold">
                    {t.questions.length} questions
                  </span>
                  <button
                    type="button"
                    onClick={() => setOpen(open === i ? null : i)}
                    className="text-brand text-xs font-bold hover:underline"
                  >
                    {open === i ? "Hide" : "Check questions"}
                  </button>
                </div>
                {flagged(t) > 0 && (
                  <p className="mt-2 text-xs font-semibold text-amber-800">
                    ⚠ The file had no answer for {flagged(t)} question
                    {flagged(t) === 1 ? "" : "s"}, so the AI chose them (marked
                    below). A teacher should check them before students take
                    this test.
                  </p>
                )}
                {open === i && (
                  <ol className="mt-3 max-h-[28rem] space-y-3 overflow-y-auto pr-1">
                    {t.questions.map((q, k) => (
                      <li key={k} className="text-sm">
                        <p className="text-ink font-semibold whitespace-pre-line">
                          {k + 1}. {q.prompt}
                        </p>
                        <ul className="mt-1 grid gap-1 sm:grid-cols-2">
                          {q.options.map((o, n) => (
                            <li
                              key={n}
                              className={`rounded-lg px-2.5 py-1 text-xs ${n === q.answer ? "bg-emerald-50 font-bold text-emerald-700" : "text-muted"}`}
                            >
                              {LETTERS[n]}. {o}
                              {n === q.answer && " ✓"}
                            </li>
                          ))}
                        </ul>
                        {q.answerFromFile === false && (
                          <p className="mt-1 text-xs font-semibold text-amber-800">
                            ⚠ Answer chosen by the AI — please check.
                          </p>
                        )}
                        {q.explanation && (
                          <p className="text-muted mt-1 text-xs">
                            <span className="font-bold">Rationale: </span>
                            {q.explanation}
                          </p>
                        )}
                      </li>
                    ))}
                  </ol>
                )}
              </li>
            ))}
          </ul>
          {preview.errors.length > 0 && (
            <ul className="space-y-0.5 text-xs text-rose-700">
              {preview.errors.slice(0, 8).map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          )}
          {importTests.error && (
            <p className="text-sm text-rose-700">{importTests.error.message}</p>
          )}
          {importTests.data ? (
            <p className="text-sm font-semibold text-emerald-700">
              ✓ Saved {importTests.data.questions} questions in{" "}
              {importTests.data.created + importTests.data.replaced} test
              {importTests.data.created + importTests.data.replaced === 1
                ? ""
                : "s"}
              . They are hidden from students until someone presses Publish
              below.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={
                  preview.tests.length === 0 ||
                  preview.tests.some((t) => !t.title.trim()) ||
                  importTests.isPending
                }
                onClick={() =>
                  importTests.mutate({
                    tests: preview.tests.map((t) => ({
                      subject: t.subject,
                      title: t.title.trim(),
                      questions: t.questions.map((q) => ({
                        prompt: q.prompt,
                        options: q.options,
                        answer: q.answer,
                        explanation: q.explanation,
                      })),
                    })),
                  })
                }
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
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
