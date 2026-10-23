"use client";

import { useId, useState, useTransition } from "react";

import { MegaphoneIcon } from "~/app/_components/icons";
import { publishAnnouncement } from "./announcement-actions";

/**
 * Opens a compose form for an announcement. With `sections`, the teacher
 * picks one class; without, it is broadcast to all of their classes.
 */
export function AnnouncementButton({
  label,
  sections,
  className,
}: {
  label: string;
  sections?: Array<{ id: string; label: string }>;
  className: string;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [sectionId, setSectionId] = useState(sections?.[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isPinned, setPinned] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [pending, startTransition] = useTransition();

  const send = () => {
    setError(null);
    startTransition(async () => {
      const result = await publishAnnouncement({
        sectionId: sections ? sectionId : null,
        title,
        body,
        isPinned,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSent(true);
      setTitle("");
      setBody("");
      setPinned(false);
    });
  };

  const field =
    "border-line bg-canvas text-ink focus:border-brand focus:bg-surface focus:ring-brand/10 mt-1 w-full rounded-lg border px-3 py-2 text-sm transition outline-none focus:ring-4";

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setSent(false);
          setOpen(true);
        }}
        className={className}
      >
        <MegaphoneIcon className="size-4" />
        {label}
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
          {sent ? (
            <div className="bg-surface w-full max-w-md space-y-4 rounded-2xl p-6 text-center shadow-xl">
              <p className="text-ink text-lg font-extrabold">
                Announcement sent
              </p>
              <p className="text-muted text-sm">
                Students see it on their dashboard and get a notification.
              </p>
              <button
                type="button"
                autoFocus
                onClick={() => setOpen(false)}
                className="bg-navy hover:bg-navy-deep rounded-lg px-4 py-2 text-sm font-semibold text-white"
              >
                Done
              </button>
            </div>
          ) : (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                send();
              }}
              className="bg-surface w-full max-w-lg space-y-4 rounded-2xl p-6 shadow-xl"
            >
              <div>
                <h2
                  id={`${id}-title`}
                  className="text-ink text-lg font-extrabold"
                >
                  {label}
                </h2>
                <p className="text-muted text-xs">
                  {sections
                    ? "Posted to one class. Its students are notified."
                    : "Sent to every class you teach. All your students are notified."}
                </p>
              </div>
              {sections && (
                <div>
                  <label
                    htmlFor={`${id}-section`}
                    className="text-ink text-xs font-bold"
                  >
                    Class
                  </label>
                  <select
                    id={`${id}-section`}
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
              )}
              <div>
                <label
                  htmlFor={`${id}-head`}
                  className="text-ink text-xs font-bold"
                >
                  Title
                </label>
                <input
                  id={`${id}-head`}
                  required
                  maxLength={200}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={field}
                />
              </div>
              <div>
                <label
                  htmlFor={`${id}-body`}
                  className="text-ink text-xs font-bold"
                >
                  Message
                </label>
                <textarea
                  id={`${id}-body`}
                  required
                  rows={5}
                  maxLength={20_000}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className={`${field} resize-y`}
                />
              </div>
              <label className="text-ink flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setPinned(e.target.checked)}
                  className="accent-brand size-4"
                />
                Pin to the top of the class feed
              </label>
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
                  {pending ? "Sending…" : "Send announcement"}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </>
  );
}
