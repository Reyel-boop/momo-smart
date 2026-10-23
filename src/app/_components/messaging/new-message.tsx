"use client";

import { useRouter } from "next/navigation";
import { useId, useState, useTransition } from "react";

import { PlusCircleIcon } from "~/app/_components/icons";
import { startConversation } from "./actions";

export type Contact = {
  /** The recipient's user id. */
  id: string;
  name: string;
  /** Shown after the name, e.g. "Science 10" or "St. Joseph". */
  detail?: string;
};

/** "New message" button that opens a compose form for one recipient. */
export function NewMessage({
  contacts,
  basePath,
  label = "New message",
}: {
  contacts: Contact[];
  basePath: string;
  label?: string;
}) {
  const router = useRouter();
  const id = useId();
  const [open, setOpen] = useState(false);
  const [to, setTo] = useState(contacts[0]?.id ?? "");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (contacts.length === 0) return null;

  const send = () => {
    setError(null);
    startTransition(async () => {
      const result = await startConversation({
        recipientId: to,
        subject,
        body,
        basePath,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setOpen(false);
      setSubject("");
      setBody("");
      router.push(`${basePath}?thread=${result.conversationId}`);
      router.refresh();
    });
  };

  const field =
    "border-line bg-canvas text-ink placeholder:text-muted focus:border-brand focus:bg-surface focus:ring-brand/10 mt-1 w-full rounded-lg border px-3 py-2 text-sm transition outline-none focus:ring-4";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="bg-navy hover:bg-navy-deep inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition"
      >
        <PlusCircleIcon className="size-4" />
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
          <form
            onSubmit={(event) => {
              event.preventDefault();
              send();
            }}
            className="bg-surface w-full max-w-lg space-y-4 rounded-2xl p-6 shadow-xl"
          >
            <h2 id={`${id}-title`} className="text-ink text-lg font-extrabold">
              New message
            </h2>
            <div>
              <label
                htmlFor={`${id}-to`}
                className="text-ink text-xs font-bold"
              >
                To
              </label>
              <select
                id={`${id}-to`}
                value={to}
                onChange={(event) => setTo(event.target.value)}
                className={field}
              >
                {contacts.map((contact) => (
                  <option key={contact.id} value={contact.id}>
                    {contact.name}
                    {contact.detail ? ` — ${contact.detail}` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor={`${id}-subject`}
                className="text-ink text-xs font-bold"
              >
                Subject{" "}
                <span className="text-muted font-normal">(optional)</span>
              </label>
              <input
                id={`${id}-subject`}
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                maxLength={200}
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
                rows={5}
                required
                value={body}
                onChange={(event) => setBody(event.target.value)}
                maxLength={20_000}
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
                disabled={pending || !body.trim()}
                className="bg-navy hover:bg-navy-deep rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {pending ? "Sending…" : "Send"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
