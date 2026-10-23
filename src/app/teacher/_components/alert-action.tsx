"use client";

import { useId, useState, useTransition } from "react";

import { actOnAlert, type InterventionType } from "./alert-actions";

export type Tutor = { id: string; name: string };

const TYPES: Array<{ value: InterventionType; label: string }> = [
  { value: "CONTACT_GUARDIAN", label: "Contacted parent or guardian" },
  { value: "SCHEDULE_MAKEUP", label: "Scheduled a make-up" },
  { value: "ASSIGN_PEER_TUTOR", label: "Assigned a peer tutor" },
  { value: "COUNSELOR_REFERRAL", label: "Referred to the counselor" },
  { value: "STUDENT_CONFERENCE", label: "Held a student conference" },
  { value: "NOTE", label: "Other follow-up (note)" },
];

/**
 * The primary button on an alert: opens a short form that records what was
 * done (pre-set to the action the alert suggests) and acknowledges it.
 */
export function AlertAction({
  alertId,
  studentName,
  defaultType,
  tutors,
  children,
}: {
  alertId: string;
  studentName: string;
  defaultType: InterventionType;
  tutors: Tutor[];
  children: React.ReactNode;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<InterventionType>(defaultType);
  const [notes, setNotes] = useState("");
  const [tutorId, setTutorId] = useState(tutors[0]?.id ?? "");
  const [when, setWhen] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const save = () => {
    setError(null);
    if (type === "ASSIGN_PEER_TUTOR" && !tutorId) {
      setError("Choose a tutor from the class.");
      return;
    }
    const slot = when ? new Date(when) : null;
    if (type === "SCHEDULE_MAKEUP" && (!slot || Number.isNaN(slot.getTime()))) {
      setError("Pick the make-up date and time.");
      return;
    }
    startTransition(async () => {
      const result = await actOnAlert({
        alertId,
        type,
        notes,
        tutorId: type === "ASSIGN_PEER_TUTOR" ? tutorId : undefined,
        scheduledFor:
          type === "SCHEDULE_MAKEUP" && slot ? slot.toISOString() : undefined,
      });
      if (result.ok) setOpen(false);
      else setError(result.error);
    });
  };

  const field =
    "border-line bg-canvas text-ink focus:border-brand focus:bg-surface focus:ring-brand/10 mt-1 w-full rounded-lg border px-3 py-2 text-sm transition outline-none focus:ring-4";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="bg-navy hover:bg-navy-deep inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-white transition"
      >
        {children}
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
            <div>
              <h2
                id={`${id}-title`}
                className="text-ink text-lg font-extrabold"
              >
                Follow up with {studentName}
              </h2>
              <p className="text-muted text-xs">
                Saving records the action and marks the alert as acknowledged.
              </p>
            </div>
            <div>
              <label
                htmlFor={`${id}-type`}
                className="text-ink text-xs font-bold"
              >
                What did you do?
              </label>
              <select
                id={`${id}-type`}
                value={type}
                onChange={(e) => setType(e.target.value as InterventionType)}
                className={field}
              >
                {TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            {type === "ASSIGN_PEER_TUTOR" && (
              <div>
                <label
                  htmlFor={`${id}-tutor`}
                  className="text-ink text-xs font-bold"
                >
                  Peer tutor
                </label>
                {tutors.length === 0 ? (
                  <p className="text-muted mt-1 text-sm">
                    No classmates are available to tutor in this section.
                  </p>
                ) : (
                  <select
                    id={`${id}-tutor`}
                    value={tutorId}
                    onChange={(e) => setTutorId(e.target.value)}
                    className={field}
                  >
                    {tutors.map((tutor) => (
                      <option key={tutor.id} value={tutor.id}>
                        {tutor.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}
            {type === "SCHEDULE_MAKEUP" && (
              <div>
                <label
                  htmlFor={`${id}-when`}
                  className="text-ink text-xs font-bold"
                >
                  Make-up date and time
                </label>
                <input
                  id={`${id}-when`}
                  type="datetime-local"
                  value={when}
                  onChange={(e) => setWhen(e.target.value)}
                  className={field}
                />
              </div>
            )}
            <div>
              <label
                htmlFor={`${id}-notes`}
                className="text-ink text-xs font-bold"
              >
                Notes <span className="text-muted font-normal">(optional)</span>
              </label>
              <textarea
                id={`${id}-notes`}
                rows={3}
                maxLength={2000}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
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
                {pending ? "Saving…" : "Save follow-up"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
