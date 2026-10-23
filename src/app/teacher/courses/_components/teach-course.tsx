"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";

import { api } from "~/trpc/react";

/**
 * "Teach this course": pick a section and the class is created with this
 * teacher, ready for students to join with its class or course code.
 */
export function TeachCourse({
  courseId,
  courseName,
  sections,
}: {
  courseId: string;
  courseName: string;
  /** Sections not yet taught this course by this teacher. */
  sections: Array<{ id: string; label: string }>;
}) {
  const router = useRouter();
  const id = useId();
  const [homeroomId, setHomeroomId] = useState("");
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(
    null,
  );
  const start = api.course.startClass.useMutation({
    onSuccess: ({ joinCode }) => {
      setMessage({
        ok: true,
        text: `Class started. Students join with class code ${joinCode} or the course code.`,
      });
      setHomeroomId("");
      router.refresh();
    },
    onError: (e) => setMessage({ ok: false, text: e.message }),
  });

  if (sections.length === 0) {
    return message ? (
      <p className="mt-3 text-sm font-semibold text-emerald-300">
        {message.text}
      </p>
    ) : null;
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setMessage(null);
        start.mutate({ courseId, homeroomId });
      }}
      className="mt-4 flex flex-wrap items-center gap-2"
    >
      <label htmlFor={id} className="text-xs font-bold text-white/80">
        Teach {courseName} to
      </label>
      <select
        id={id}
        value={homeroomId}
        onChange={(e) => setHomeroomId(e.target.value)}
        required
        className="focus:ring-brand/40 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-sm text-white outline-none focus:ring-4 [&>option]:text-black"
      >
        <option value="">Choose a section…</option>
        {sections.map((s) => (
          <option key={s.id} value={s.id}>
            {s.label}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={!homeroomId || start.isPending}
        className="bg-brand hover:bg-brand/90 rounded-lg px-3 py-1.5 text-sm font-semibold text-white transition disabled:opacity-60"
      >
        {start.isPending ? "Starting…" : "Teach this course"}
      </button>
      {message && (
        <p
          role={message.ok ? "status" : "alert"}
          className={`w-full text-sm font-semibold ${message.ok ? "text-emerald-300" : "text-rose-300"}`}
        >
          {message.text}
        </p>
      )}
    </form>
  );
}
