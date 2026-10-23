"use client";

import { useId, useState, useTransition } from "react";

import { PlusCircleIcon } from "~/app/_components/icons";
import {
  addPerson,
  importStudents,
  resetPassword,
  setActive,
  type ImportRow,
  type NewPerson,
} from "../actions";

const field =
  "border-line bg-canvas text-ink placeholder:text-muted focus:border-brand focus:bg-surface focus:ring-brand/10 mt-1 w-full rounded-lg border px-3 py-2 text-sm transition outline-none focus:ring-4";
const label = "text-ink text-xs font-bold";
const primary =
  "bg-navy hover:bg-navy-deep rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-60";
const secondary =
  "border-line text-ink hover:bg-canvas rounded-lg border px-4 py-2 text-sm font-semibold disabled:opacity-60";

function Dialog({
  title,
  onClose,
  children,
  wide = false,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  const id = useId();
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={id}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className={`bg-surface max-h-[90vh] w-full overflow-y-auto rounded-2xl p-6 shadow-xl ${wide ? "max-w-3xl" : "max-w-lg"}`}
      >
        <h2 id={id} className="text-ink mb-4 text-lg font-extrabold">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}

/** Shows a temporary password once, with a copy button. */
function PasswordNotice({
  name,
  email,
  password,
  onDone,
}: {
  name: string;
  email: string;
  password: string;
  onDone: () => void;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="space-y-4">
      <p className="text-muted text-sm">
        Give these sign-in details to <b className="text-ink">{name}</b>.
        They&apos;ll choose their own password the first time they sign in. This
        password is shown only now.
      </p>
      <dl className="bg-canvas space-y-2 rounded-xl p-4 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-muted">Sign-in page</dt>
          <dd className="text-ink font-semibold">
            {typeof window === "undefined"
              ? "/login"
              : `${window.location.origin}/login`}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted">Sign in with</dt>
          <dd className="text-ink font-semibold">{email}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted">Temporary password</dt>
          <dd className="text-ink font-mono text-base font-bold">{password}</dd>
        </div>
      </dl>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          className={secondary}
          onClick={() => {
            void navigator.clipboard
              .writeText(
                `Sign in with: ${email}\nTemporary password: ${password}`,
              )
              .then(() => setCopied(true));
          }}
        >
          {copied ? "Copied" : "Copy"}
        </button>
        <button type="button" className={primary} onClick={onDone} autoFocus>
          Done
        </button>
      </div>
    </div>
  );
}

/** "Add teacher" / "Add student" with its form. */
export function AddPersonButton({
  role,
  departments,
}: {
  role: "TEACHER" | "STUDENT";
  departments: Array<{ id: string; name: string }>;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [grade, setGrade] = useState("10");
  const [title, setTitle] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [created, setCreated] = useState<{ password: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const noun = role === "TEACHER" ? "teacher" : "student";

  const close = () => {
    setOpen(false);
    setCreated(null);
    setError(null);
    setName("");
    setEmail("");
    setNumber("");
    setTitle("");
  };

  const save = () => {
    setError(null);
    const input: NewPerson =
      role === "TEACHER"
        ? {
            role,
            name,
            email,
            title: title || undefined,
            employeeNumber: number,
            departmentId: departmentId || undefined,
          }
        : {
            role,
            name,
            email,
            studentNumber: number,
            gradeLevel: Number(grade),
          };
    startTransition(async () => {
      const result = await addPerson(input);
      if (result.ok) setCreated({ password: result.password });
      else setError(result.error);
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="bg-navy hover:bg-navy-deep inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition"
      >
        <PlusCircleIcon className="size-4" />
        Add {noun}
      </button>
      {open && (
        <Dialog
          title={
            created
              ? `${noun[0]!.toUpperCase()}${noun.slice(1)} added`
              : `Add a ${noun}`
          }
          onClose={close}
        >
          {created ? (
            <PasswordNotice
              name={name}
              email={email.trim().toLowerCase()}
              password={created.password}
              onDone={close}
            />
          ) : (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                save();
              }}
              className="space-y-4"
            >
              <div className="grid gap-4 sm:grid-cols-[110px_1fr]">
                {role === "TEACHER" && (
                  <div>
                    <label htmlFor={`${id}-title`} className={label}>
                      Title
                    </label>
                    <input
                      id={`${id}-title`}
                      value={title}
                      maxLength={20}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ms."
                      className={field}
                    />
                  </div>
                )}
                <div className={role === "TEACHER" ? "" : "sm:col-span-2"}>
                  <label htmlFor={`${id}-name`} className={label}>
                    Full name
                  </label>
                  <input
                    id={`${id}-name`}
                    required
                    maxLength={120}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={field}
                  />
                </div>
              </div>
              <div>
                <label htmlFor={`${id}-email`} className={label}>
                  Email (used to sign in)
                </label>
                <input
                  id={`${id}-email`}
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={field}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor={`${id}-number`} className={label}>
                    {role === "TEACHER"
                      ? "Employee number"
                      : "Student number (LRN)"}
                  </label>
                  <input
                    id={`${id}-number`}
                    required
                    maxLength={40}
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    className={field}
                  />
                </div>
                {role === "STUDENT" ? (
                  <div>
                    <label htmlFor={`${id}-grade`} className={label}>
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
                ) : (
                  <div>
                    <label htmlFor={`${id}-dept`} className={label}>
                      Department
                    </label>
                    <select
                      id={`${id}-dept`}
                      value={departmentId}
                      onChange={(e) => setDepartmentId(e.target.value)}
                      className={field}
                    >
                      <option value="">None</option>
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              {error && (
                <p role="alert" className="text-sm text-rose-600">
                  {error}
                </p>
              )}
              <div className="flex justify-end gap-2">
                <button type="button" onClick={close} className={secondary}>
                  Cancel
                </button>
                <button type="submit" disabled={pending} className={primary}>
                  {pending ? "Adding…" : `Add ${noun}`}
                </button>
              </div>
            </form>
          )}
        </Dialog>
      )}
    </>
  );
}

/** Parses CSV text (quoted fields allowed) into rows of cells. */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]!;
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") {
      row.push(cell);
      cell = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(cell);
      if (row.some((c) => c.trim())) rows.push(row);
      row = [];
      cell = "";
    } else cell += ch;
  }
  row.push(cell);
  if (row.some((c) => c.trim())) rows.push(row);
  return rows;
}

const HEADERS = {
  name: ["name", "full name", "student name"],
  email: ["email", "email address"],
  studentNumber: ["student number", "student_number", "lrn", "number", "id"],
  gradeLevel: ["grade", "grade level", "grade_level"],
};

/** Turns CSV text into import rows; the header row names the columns. */
function toRows(text: string): { rows: ImportRow[]; error: string | null } {
  const table = parseCsv(text.replace(/^﻿/, ""));
  if (table.length < 2)
    return { rows: [], error: "Add a header row and at least one student." };
  const header = table[0]!.map((h) => h.trim().toLowerCase());
  const col = (names: string[]) => header.findIndex((h) => names.includes(h));
  const at = {
    name: col(HEADERS.name),
    email: col(HEADERS.email),
    studentNumber: col(HEADERS.studentNumber),
    gradeLevel: col(HEADERS.gradeLevel),
  };
  const missing = Object.entries(at)
    .filter(([, i]) => i === -1)
    .map(([k]) => k);
  if (missing.length > 0) {
    return {
      rows: [],
      error: `Missing column(s): ${missing.join(", ")}. Use the header: name,email,student number,grade`,
    };
  }
  return {
    rows: table.slice(1).map((r) => ({
      name: (r[at.name] ?? "").trim(),
      email: (r[at.email] ?? "").trim(),
      studentNumber: (r[at.studentNumber] ?? "").trim(),
      gradeLevel: Number((r[at.gradeLevel] ?? "").replace(/\D/g, "")) || 0,
    })),
    error: null,
  };
}

type ImportResult =
  | { line: number; ok: true; name: string; email: string; password: string }
  | { line: number; ok: false; name: string; error: string };

/** Bulk student import from a CSV file or pasted text. */
export function ImportStudentsButton({
  classes,
}: {
  classes: Array<{ id: string; label: string }>;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [results, setResults] = useState<ImportResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const preview = text.trim() ? toRows(text) : null;

  const close = () => {
    setOpen(false);
    setResults(null);
    setText("");
    setError(null);
  };

  const run = () => {
    if (!preview || preview.error || preview.rows.length === 0) return;
    if (preview.rows.length > 200) {
      setError("Import at most 200 students at a time.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await importStudents(
        preview.rows.map((r) => ({ ...r, sectionId: sectionId || undefined })),
      );
      if (result.ok) setResults(result.results);
      else setError(result.error);
    });
  };

  const downloadPasswords = () => {
    if (!results) return;
    const lines = [
      "name,email,temporary password",
      ...results
        .filter((r): r is Extract<ImportResult, { ok: true }> => r.ok)
        .map((r) => `"${r.name.replace(/"/g, '""')}",${r.email},${r.password}`),
    ];
    const blob = new Blob([`﻿${lines.join("\r\n")}\r\n`], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "student-sign-ins.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="border-line bg-surface text-ink hover:bg-canvas rounded-xl border px-4 py-2.5 text-sm font-semibold transition"
      >
        Import from CSV
      </button>
      {open && (
        <Dialog title="Import students" onClose={close} wide>
          {results ? (
            <div className="space-y-4">
              <p className="text-ink text-sm font-semibold">
                {results.filter((r) => r.ok).length} added ·{" "}
                {results.filter((r) => !r.ok).length} not added
              </p>
              <p className="text-muted text-xs">
                Download the sign-in list now — the temporary passwords are
                shown only once.
              </p>
              <div className="border-line max-h-80 overflow-y-auto rounded-xl border">
                <table className="w-full text-left text-sm">
                  <tbody className="divide-line divide-y">
                    {results.map((r) => (
                      <tr key={r.line}>
                        <td className="text-muted px-3 py-2 text-xs">
                          {r.line}
                        </td>
                        <td className="text-ink px-3 py-2">{r.name || "—"}</td>
                        <td className="px-3 py-2">
                          {r.ok ? (
                            <span className="font-mono text-xs">
                              {r.password}
                            </span>
                          ) : (
                            <span className="text-xs text-rose-600">
                              {r.error}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" className={secondary} onClick={close}>
                  Close
                </button>
                <button
                  type="button"
                  className={primary}
                  onClick={downloadPasswords}
                >
                  Download sign-in list (CSV)
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                run();
              }}
              className="space-y-4"
            >
              <p className="text-muted text-sm">
                Use a spreadsheet with the columns{" "}
                <b className="text-ink">name, email, student number, grade</b>,
                saved as CSV. Choose the file or paste its contents.
              </p>
              <input
                type="file"
                accept=".csv,text/csv"
                aria-label="CSV file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void file.text().then(setText);
                }}
                className="text-sm"
              />
              <div>
                <label htmlFor={`${id}-csv`} className={label}>
                  CSV contents
                </label>
                <textarea
                  id={`${id}-csv`}
                  rows={8}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={
                    "name,email,student number,grade\nJuan Dela Cruz,juan.delacruz@school.edu.ph,123456789012,10"
                  }
                  className={`${field} font-mono text-xs`}
                />
              </div>
              {classes.length > 0 && (
                <div>
                  <label htmlFor={`${id}-class`} className={label}>
                    Also enroll them in{" "}
                    <span className="text-muted font-normal">(optional)</span>
                  </label>
                  <select
                    id={`${id}-class`}
                    value={sectionId}
                    onChange={(e) => setSectionId(e.target.value)}
                    className={field}
                  >
                    <option value="">No class yet</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {preview?.error && (
                <p className="text-sm text-rose-600">{preview.error}</p>
              )}
              {preview && !preview.error && (
                <p className="text-muted text-sm">
                  {preview.rows.length} student
                  {preview.rows.length === 1 ? "" : "s"} found.
                </p>
              )}
              {error && (
                <p role="alert" className="text-sm text-rose-600">
                  {error}
                </p>
              )}
              <div className="flex justify-end gap-2">
                <button type="button" onClick={close} className={secondary}>
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    pending ||
                    !preview ||
                    !!preview.error ||
                    preview.rows.length === 0
                  }
                  className={primary}
                >
                  {pending ? "Importing…" : "Import students"}
                </button>
              </div>
            </form>
          )}
        </Dialog>
      )}
    </>
  );
}

/** Per-person actions: new temporary password, turn the account off/on. */
export function PersonActions({
  userId,
  name,
  email,
  active,
}: {
  userId: string;
  name: string;
  email: string;
  active: boolean;
}) {
  const [password, setPassword] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <button
        type="button"
        disabled={pending || !active}
        onClick={() => {
          if (!confirm(`Give ${name} a new temporary password?`)) return;
          setError(null);
          startTransition(async () => {
            const result = await resetPassword(userId);
            if (result.ok) setPassword(result.password);
            else setError(result.error);
          });
        }}
        className="text-brand text-xs font-bold hover:underline disabled:opacity-50"
      >
        Reset password
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (
            active &&
            !confirm(
              `Turn off ${name}'s account? They won't be able to sign in.`,
            )
          ) {
            return;
          }
          setError(null);
          startTransition(async () => {
            const result = await setActive(userId, !active);
            if (!result.ok) setError(result.error);
          });
        }}
        className={`text-xs font-bold hover:underline disabled:opacity-50 ${active ? "text-rose-600" : "text-emerald-700"}`}
      >
        {active ? "Turn off" : "Turn on"}
      </button>
      {error && <span className="text-xs text-rose-600">{error}</span>}
      {password && (
        <Dialog
          title="New temporary password"
          onClose={() => setPassword(null)}
        >
          <PasswordNotice
            name={name}
            email={email}
            password={password}
            onDone={() => setPassword(null)}
          />
        </Dialog>
      )}
    </div>
  );
}
