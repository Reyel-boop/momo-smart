"use client";

import { useRouter } from "next/navigation";
import { useId, useMemo, useState, useTransition } from "react";

import { PlusCircleIcon } from "~/app/_components/icons";
import { createClass, enrollStudents, unenrollStudent } from "../actions";

const field =
  "border-line bg-canvas text-ink placeholder:text-muted focus:border-brand focus:bg-surface focus:ring-brand/10 mt-1 w-full rounded-lg border px-3 py-2 text-sm transition outline-none focus:ring-4";
const label = "text-ink text-xs font-bold";

/** "New class": course, teacher, section name, period and room. */
export function NewClassButton({
  courses,
  teachers,
}: {
  courses: Array<{ id: string; label: string }>;
  teachers: Array<{ id: string; label: string }>;
}) {
  const router = useRouter();
  const id = useId();
  const [open, setOpen] = useState(false);
  const [courseId, setCourseId] = useState(courses[0]?.id ?? "");
  const [teacherId, setTeacherId] = useState(teachers[0]?.id ?? "");
  const [code, setCode] = useState("");
  const [period, setPeriod] = useState("1");
  const [room, setRoom] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (teachers.length === 0) {
    return (
      <span className="text-muted text-sm">
        Add a teacher first to create classes.
      </span>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="bg-navy hover:bg-navy-deep inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition"
      >
        <PlusCircleIcon className="size-4" />
        New class
      </button>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${id}-title`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setError(null);
              startTransition(async () => {
                const result = await createClass({
                  courseId,
                  teacherId,
                  code,
                  period: Number(period),
                  room,
                });
                if (!result.ok) {
                  setError(result.error);
                  return;
                }
                router.push(`/admin/classes/${result.sectionId}`);
              });
            }}
            className="bg-surface w-full max-w-lg space-y-4 rounded-2xl p-6 shadow-xl"
          >
            <div>
              <h2
                id={`${id}-title`}
                className="text-ink text-lg font-extrabold"
              >
                New class
              </h2>
              <p className="text-muted text-xs">
                The course&apos;s lessons, lectures and Unit Questions come with
                it. You&apos;ll add students next.
              </p>
            </div>
            <div>
              <label htmlFor={`${id}-course`} className={label}>
                Course
              </label>
              <select
                id={`${id}-course`}
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className={field}
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={`${id}-teacher`} className={label}>
                Teacher
              </label>
              <select
                id={`${id}-teacher`}
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                className={field}
              >
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor={`${id}-code`} className={label}>
                  Section
                </label>
                <input
                  id={`${id}-code`}
                  required
                  maxLength={20}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="St. Joseph"
                  className={field}
                />
              </div>
              <div>
                <label htmlFor={`${id}-period`} className={label}>
                  Period
                </label>
                <input
                  id={`${id}-period`}
                  type="number"
                  min={0}
                  max={12}
                  required
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className={field}
                />
              </div>
              <div>
                <label htmlFor={`${id}-room`} className={label}>
                  Room
                </label>
                <input
                  id={`${id}-room`}
                  maxLength={40}
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder="Room 210"
                  className={field}
                />
              </div>
            </div>
            {error && (
              <p role="alert" className="text-sm text-rose-600">
                {error}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="border-line text-ink hover:bg-canvas rounded-lg border px-4 py-2 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={pending}
                className="bg-navy hover:bg-navy-deep rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {pending ? "Creating…" : "Create class"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

type Candidate = {
  id: string;
  name: string;
  studentNumber: string;
  gradeLevel: number;
};

/** Pick students (filter by grade or name) and enroll them in the class. */
export function EnrollStudents({
  sectionId,
  candidates,
}: {
  sectionId: string;
  candidates: Candidate[];
}) {
  const id = useId();
  const grades = [...new Set(candidates.map((c) => c.gradeLevel))].sort(
    (a, b) => a - b,
  );
  const [grade, setGrade] = useState<string>("");
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const shown = useMemo(
    () =>
      candidates.filter(
        (c) =>
          (!grade || c.gradeLevel === Number(grade)) &&
          (!query ||
            `${c.name} ${c.studentNumber}`
              .toLowerCase()
              .includes(query.toLowerCase())),
      ),
    [candidates, grade, query],
  );

  if (candidates.length === 0) {
    return (
      <p className="text-muted p-5 text-sm">
        Every student is already in this class, or no students have been added
        yet.
      </p>
    );
  }

  const toggle = (studentId: string) =>
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(studentId)) next.delete(studentId);
      else next.add(studentId);
      return next;
    });

  return (
    <div className="space-y-3 p-5">
      <div className="flex flex-wrap gap-2">
        <label htmlFor={`${id}-grade`} className="sr-only">
          Grade
        </label>
        <select
          id={`${id}-grade`}
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          className="border-line bg-canvas text-ink rounded-lg border px-3 py-2 text-sm"
        >
          <option value="">All grades</option>
          {grades.map((g) => (
            <option key={g} value={g}>
              Grade {g}
            </option>
          ))}
        </select>
        <label htmlFor={`${id}-q`} className="sr-only">
          Filter by name
        </label>
        <input
          id={`${id}-q`}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by name or number"
          className="border-line bg-canvas text-ink placeholder:text-muted min-w-0 flex-1 rounded-lg border px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={() => setPicked(new Set(shown.map((c) => c.id)))}
          className="text-brand text-xs font-bold hover:underline"
        >
          Select all shown ({shown.length})
        </button>
      </div>
      <ul className="border-line divide-line max-h-80 divide-y overflow-y-auto rounded-xl border">
        {shown.map((c) => (
          <li key={c.id}>
            <label className="hover:bg-canvas flex cursor-pointer items-center gap-3 px-3 py-2 text-sm">
              <input
                type="checkbox"
                checked={picked.has(c.id)}
                onChange={() => toggle(c.id)}
                className="accent-brand size-4"
              />
              <span className="text-ink flex-1 font-semibold">{c.name}</span>
              <span className="text-muted text-xs">
                {c.studentNumber} · Grade {c.gradeLevel}
              </span>
            </label>
          </li>
        ))}
      </ul>
      {error && (
        <p role="alert" className="text-sm text-rose-600">
          {error}
        </p>
      )}
      <div className="flex justify-end">
        <button
          type="button"
          disabled={pending || picked.size === 0}
          onClick={() => {
            setError(null);
            startTransition(async () => {
              const result = await enrollStudents(sectionId, [...picked]);
              if (result.ok) setPicked(new Set());
              else setError(result.error);
            });
          }}
          className="bg-navy hover:bg-navy-deep rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending
            ? "Enrolling…"
            : `Enroll ${picked.size} student${picked.size === 1 ? "" : "s"}`}
        </button>
      </div>
    </div>
  );
}

export function RemoveStudentButton({
  sectionId,
  studentId,
  name,
}: {
  sectionId: string;
  studentId: string;
  name: string;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (
          !confirm(`Remove ${name} from this class? Their past work is kept.`)
        ) {
          return;
        }
        startTransition(async () => {
          await unenrollStudent(sectionId, studentId);
        });
      }}
      className="text-xs font-bold text-rose-600 hover:underline disabled:opacity-50"
    >
      {pending ? "Removing…" : "Remove"}
    </button>
  );
}
