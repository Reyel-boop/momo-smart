"use client";

import { useRouter } from "next/navigation";
import { useId, useState, useTransition } from "react";

import {
  createAssignment,
  type AssignmentType,
  type SubmissionFormat,
} from "./actions";

const TYPES: Array<{ value: AssignmentType; label: string }> = [
  { value: "WORKSHEET", label: "Worksheet" },
  { value: "PROBLEM_SET", label: "Problem set" },
  { value: "ESSAY", label: "Essay" },
  { value: "QUIZ", label: "Quiz" },
  { value: "EXAM", label: "Exam" },
  { value: "LAB_REPORT", label: "Lab report" },
  { value: "PROJECT", label: "Project" },
  { value: "PRACTICUM", label: "Practicum" },
  { value: "DIAGRAM", label: "Diagram" },
  { value: "DISCUSSION", label: "Discussion" },
];

const FORMATS: Array<{ value: SubmissionFormat; label: string }> = [
  { value: "FILE_UPLOAD", label: "Upload a file" },
  { value: "TEXT_ENTRY", label: "Type an answer" },
  { value: "EXTERNAL_LINK", label: "Share a link" },
  { value: "ON_PAPER", label: "Hand in on paper" },
];

export type ClassOption = {
  id: string;
  label: string;
  units: Array<{ id: string; label: string }>;
};

export function AssignmentForm({
  classes,
  initialSectionId,
}: {
  classes: ClassOption[];
  initialSectionId: string;
}) {
  const router = useRouter();
  const id = useId();
  const [sectionId, setSectionId] = useState(initialSectionId);
  const units = classes.find((c) => c.id === sectionId)?.units ?? [];
  const [unitId, setUnitId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<AssignmentType>("WORKSHEET");
  const [format, setFormat] = useState<SubmissionFormat>("FILE_UPLOAD");
  const [points, setPoints] = useState("20");
  const [dueAt, setDueAt] = useState("");
  const [allowLate, setAllowLate] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const save = (publish: boolean) => {
    setError(null);
    const due = new Date(dueAt);
    startTransition(async () => {
      const result = await createAssignment({
        sectionId,
        unitId,
        title,
        description,
        type,
        format,
        pointsPossible: Number(points),
        dueAt: Number.isNaN(due.getTime()) ? "" : due.toISOString(),
        allowLate,
        publish,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push(`/teacher/assignments?section=${result.sectionId}`);
    });
  };

  const field =
    "border-line bg-canvas text-ink placeholder:text-muted focus:border-brand focus:bg-surface focus:ring-brand/10 mt-1 w-full rounded-lg border px-3 py-2 text-sm transition outline-none focus:ring-4";
  const label = "text-ink text-xs font-bold";

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        save(true);
      }}
      className="space-y-5 p-5"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-class`} className={label}>
            Class
          </label>
          <select
            id={`${id}-class`}
            value={sectionId}
            onChange={(e) => {
              setSectionId(e.target.value);
              setUnitId("");
            }}
            className={field}
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${id}-unit`} className={label}>
            Unit <span className="text-muted font-normal">(optional)</span>
          </label>
          <select
            id={`${id}-unit`}
            value={unitId}
            onChange={(e) => setUnitId(e.target.value)}
            className={field}
          >
            <option value="">Not tied to a unit</option>
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor={`${id}-title`} className={label}>
          Title
        </label>
        <input
          id={`${id}-title`}
          required
          maxLength={200}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Unit 4 Problem Set"
          className={field}
        />
      </div>

      <div>
        <label htmlFor={`${id}-desc`} className={label}>
          Instructions
        </label>
        <textarea
          id={`${id}-desc`}
          rows={5}
          maxLength={10_000}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What students should do and how it will be graded."
          className={`${field} resize-y`}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor={`${id}-type`} className={label}>
            Type
          </label>
          <select
            id={`${id}-type`}
            value={type}
            onChange={(e) => setType(e.target.value as AssignmentType)}
            className={field}
          >
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${id}-format`} className={label}>
            Students hand in by
          </label>
          <select
            id={`${id}-format`}
            value={format}
            onChange={(e) => setFormat(e.target.value as SubmissionFormat)}
            className={field}
          >
            {FORMATS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${id}-points`} className={label}>
            Points
          </label>
          <input
            id={`${id}-points`}
            type="number"
            min={0}
            max={1000}
            required
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            className={field}
          />
        </div>
        <div>
          <label htmlFor={`${id}-due`} className={label}>
            Due
          </label>
          <input
            id={`${id}-due`}
            type="datetime-local"
            required
            value={dueAt}
            onChange={(e) => setDueAt(e.target.value)}
            className={field}
          />
        </div>
      </div>

      <label className="text-ink flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={allowLate}
          onChange={(e) => setAllowLate(e.target.checked)}
          className="accent-brand size-4"
        />
        Accept late work
      </label>

      {error && (
        <p role="alert" className="text-sm text-rose-600">
          {error}
        </p>
      )}
      <div className="flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={() => save(false)}
          disabled={pending}
          className="border-line text-ink hover:bg-canvas rounded-lg border px-4 py-2 text-sm font-semibold disabled:opacity-60"
        >
          Save as draft
        </button>
        <button
          type="submit"
          disabled={pending}
          className="bg-navy hover:bg-navy-deep rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Saving…" : "Publish to students"}
        </button>
      </div>
    </form>
  );
}
