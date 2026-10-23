"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { api } from "~/trpc/react";

type Option = { value: string; label: string };

/** Section dropdown for the students list; the choice lives in the URL. */
export function SectionSelect({
  sections,
  value,
}: {
  sections: Option[];
  value: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const choose = (section: string) => {
    const next = new URLSearchParams(params.toString());
    if (section) next.set("section", section);
    else next.delete("section");
    router.push(`${pathname}?${next.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="people-section" className="text-muted text-xs font-bold">
        Section
      </label>
      <select
        id="people-section"
        value={value}
        onChange={(e) => choose(e.target.value)}
        className="border-line bg-surface text-ink focus:border-brand focus:ring-brand/10 rounded-xl border py-2.5 pr-8 pl-3 text-sm font-semibold transition outline-none focus:ring-4"
      >
        <option value="">All sections</option>
        {sections.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
        <option value="none">No section</option>
      </select>
    </div>
  );
}

/** Moves one student to another section, or to none. */
export function StudentSectionSelect({
  userId,
  value,
  sections,
}: {
  userId: string;
  value: string;
  sections: Option[];
}) {
  const router = useRouter();
  const [current, setCurrent] = useState(value);
  const [error, setError] = useState<string | null>(null);
  const move = api.admin.setStudentSection.useMutation({
    onSuccess: () => router.refresh(),
    onError: (e) => {
      setCurrent(value);
      setError(e.message);
    },
  });

  return (
    <div>
      <select
        aria-label="Section"
        value={current}
        disabled={move.isPending}
        onChange={(e) => {
          setError(null);
          setCurrent(e.target.value);
          move.mutate({ userId, sectionId: e.target.value || null });
        }}
        className="border-line bg-surface text-ink focus:border-brand max-w-[180px] rounded-lg border px-2 py-1 text-xs transition outline-none disabled:opacity-60"
      >
        <option value="">No section</option>
        {sections.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
}
