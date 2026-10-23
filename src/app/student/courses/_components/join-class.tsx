"use client";

import { useId, useState, useTransition } from "react";

import { joinClass } from "../actions";

/** "Join a class" — enter the code your teacher shared. */
export function JoinClass() {
  const id = useId();
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(
    null,
  );
  const [pending, startTransition] = useTransition();

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setMessage(null);
        startTransition(async () => {
          const result = await joinClass(code);
          if (result.ok) {
            setCode("");
            setMessage({ ok: true, text: `You joined ${result.name}.` });
          } else {
            setMessage({ ok: false, text: result.error });
          }
        });
      }}
      className="border-line bg-surface flex flex-wrap items-center gap-3 rounded-2xl border px-5 py-4"
    >
      <label htmlFor={id} className="text-ink text-sm font-bold">
        Join a class
      </label>
      <input
        id={id}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        required
        maxLength={20}
        placeholder="Class code from your teacher"
        autoCapitalize="characters"
        className="border-line bg-canvas text-ink placeholder:text-muted focus:border-brand focus:ring-brand/10 min-w-0 flex-1 rounded-lg border px-3 py-2 font-mono text-sm uppercase transition outline-none placeholder:font-sans placeholder:normal-case focus:ring-4"
      />
      <button
        type="submit"
        disabled={pending || !code.trim()}
        className="bg-navy hover:bg-navy-deep rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Joining…" : "Join"}
      </button>
      {message && (
        <p
          role={message.ok ? "status" : "alert"}
          className={`w-full text-sm ${message.ok ? "text-emerald-700" : "text-rose-600"}`}
        >
          {message.text}
        </p>
      )}
    </form>
  );
}
