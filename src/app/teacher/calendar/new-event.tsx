"use client";

import { useId, useState, useTransition } from "react";

import { PlusCircleIcon } from "~/app/_components/icons";
import { createEvent, type EventType } from "./actions";

const TYPES: Array<{ value: EventType; label: string }> = [
  { value: "EXAM", label: "Exam" },
  { value: "CLASS", label: "Class" },
  { value: "OFFICE_HOURS", label: "Office hours" },
  { value: "SCHOOL_EVENT", label: "School event" },
  { value: "ADMIN_DEADLINE", label: "Administrative deadline" },
];

/** "New Event" button with a form that adds an event to the calendar. */
export function NewEvent({
  sections,
}: {
  sections: Array<{ id: string; label: string }>;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<EventType>("EXAM");
  const [startAt, setStartAt] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [sectionId, setSectionId] = useState(sections[0]?.id ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const save = () => {
    setError(null);
    startTransition(async () => {
      // Read the picked time in the browser's time zone, not the server's.
      const when = new Date(startAt);
      const result = await createEvent({
        title,
        type,
        startAt: Number.isNaN(when.getTime()) ? "" : when.toISOString(),
        location,
        description,
        sectionId,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setOpen(false);
      setTitle("");
      setStartAt("");
      setLocation("");
      setDescription("");
    });
  };

  const field =
    "border-line bg-canvas text-ink focus:border-brand focus:bg-surface focus:ring-brand/10 mt-1 w-full rounded-lg border px-3 py-2 text-sm transition outline-none focus:ring-4";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="bg-navy hover:bg-navy-deep inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition"
      >
        <PlusCircleIcon className="size-4" />
        New Event
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${id}-title`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <form
            onSubmit={(event) => {
              event.preventDefault();
              save();
            }}
            className="bg-surface w-full max-w-lg space-y-4 rounded-2xl p-6 shadow-xl"
          >
            <h2 id={`${id}-title`} className="text-ink text-lg font-extrabold">
              New event
            </h2>
            <div>
              <label
                htmlFor={`${id}-name`}
                className="text-ink text-xs font-bold"
              >
                Title
              </label>
              <input
                id={`${id}-name`}
                required
                maxLength={200}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Unit 4 Exam"
                className={field}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor={`${id}-type`}
                  className="text-ink text-xs font-bold"
                >
                  Type
                </label>
                <select
                  id={`${id}-type`}
                  value={type}
                  onChange={(e) => setType(e.target.value as EventType)}
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
                <label
                  htmlFor={`${id}-when`}
                  className="text-ink text-xs font-bold"
                >
                  Date and time
                </label>
                <input
                  id={`${id}-when`}
                  type="datetime-local"
                  required
                  value={startAt}
                  onChange={(e) => setStartAt(e.target.value)}
                  className={field}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor={`${id}-for`}
                  className="text-ink text-xs font-bold"
                >
                  For
                </label>
                <select
                  id={`${id}-for`}
                  value={sectionId}
                  onChange={(e) => setSectionId(e.target.value)}
                  className={field}
                >
                  {sections.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor={`${id}-where`}
                  className="text-ink text-xs font-bold"
                >
                  Location{" "}
                  <span className="text-muted font-normal">(optional)</span>
                </label>
                <input
                  id={`${id}-where`}
                  maxLength={120}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={field}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor={`${id}-notes`}
                className="text-ink text-xs font-bold"
              >
                Details{" "}
                <span className="text-muted font-normal">(optional)</span>
              </label>
              <textarea
                id={`${id}-notes`}
                rows={3}
                maxLength={2000}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`${field} resize-y`}
              />
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
                {pending ? "Saving…" : "Add event"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
