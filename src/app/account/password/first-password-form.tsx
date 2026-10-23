"use client";

import { useId, useState, useTransition } from "react";

import { changePassword } from "~/app/_components/settings/actions";

export function FirstPasswordForm({ home }: { home: string }) {
  const id = useId();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const field =
    "border-line bg-canvas text-ink focus:border-brand focus:bg-surface focus:ring-brand/10 mt-1 w-full rounded-lg border px-3 py-2.5 text-sm transition outline-none focus:ring-4";

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setError(null);
        if (next !== confirm) {
          setError("The new passwords don't match.");
          return;
        }
        if (next === current) {
          setError("Choose a password different from the temporary one.");
          return;
        }
        startTransition(async () => {
          const result = await changePassword({
            currentPassword: current,
            newPassword: next,
          });
          if (result.ok) {
            // A full load, so the new session state applies everywhere.
            window.location.assign(home);
          } else {
            setError(result.error);
          }
        });
      }}
      className="space-y-4"
    >
      <div>
        <label htmlFor={`${id}-current`} className="text-ink text-xs font-bold">
          Temporary password
        </label>
        <input
          id={`${id}-current`}
          type="password"
          autoComplete="current-password"
          required
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          className={field}
        />
      </div>
      <div>
        <label htmlFor={`${id}-new`} className="text-ink text-xs font-bold">
          New password
        </label>
        <input
          id={`${id}-new`}
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={next}
          onChange={(e) => setNext(e.target.value)}
          className={field}
        />
      </div>
      <div>
        <label htmlFor={`${id}-confirm`} className="text-ink text-xs font-bold">
          Confirm new password
        </label>
        <input
          id={`${id}-confirm`}
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className={field}
        />
      </div>
      {error && (
        <p role="alert" className="text-sm text-rose-600">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="bg-navy hover:bg-navy-deep w-full rounded-xl px-4 py-3 text-sm font-bold text-white transition disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save password and continue"}
      </button>
    </form>
  );
}
