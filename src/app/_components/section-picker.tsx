"use client";

import { useRouter } from "next/navigation";

export type PickerSection = { id: string; label: string; group?: string };

/**
 * A dropdown for switching between the teacher's sections, grouped by
 * subject ("TLE 10" → its sections). Stays one line however many sections
 * there are.
 */
export function SectionPicker({
  sections,
  activeId,
  basePath,
  allLabel,
}: {
  sections: PickerSection[];
  activeId: string | null;
  basePath: string;
  allLabel?: string;
}) {
  const router = useRouter();
  const groups: Array<{ name: string; items: PickerSection[] }> = [];
  for (const section of sections) {
    const name = section.group ?? "";
    const group = groups.find((g) => g.name === name);
    if (group) group.items.push(section);
    else groups.push({ name, items: [section] });
  }
  groups.sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { numeric: true }),
  );

  const option = (s: PickerSection) => (
    <option key={s.id} value={s.id}>
      {s.group ? `${s.group} — ${s.label}` : s.label}
    </option>
  );

  return (
    <label className="flex flex-wrap items-center gap-2">
      <span className="text-muted text-[11px] font-bold tracking-wider uppercase">
        Section
      </span>
      <select
        value={activeId ?? ""}
        onChange={(event) => {
          const id = event.target.value;
          router.push(id ? `${basePath}?section=${id}` : basePath);
        }}
        className="border-line bg-surface text-ink focus:border-brand focus:ring-brand/10 w-full max-w-sm min-w-0 rounded-xl border px-3 py-2.5 text-sm font-semibold transition outline-none focus:ring-4 sm:w-auto"
      >
        {allLabel && <option value="">{allLabel}</option>}
        {groups.map((g) =>
          g.name ? (
            <optgroup key={g.name} label={g.name}>
              {g.items.map(option)}
            </optgroup>
          ) : (
            g.items.map(option)
          ),
        )}
      </select>
    </label>
  );
}
