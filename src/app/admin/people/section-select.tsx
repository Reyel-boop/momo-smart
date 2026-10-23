"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

/** Section dropdown for the students list; the choice lives in the URL. */
export function SectionSelect({
  sections,
  value,
}: {
  sections: string[];
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
        {sections.map((code) => (
          <option key={code} value={code}>
            {code}
          </option>
        ))}
        <option value="none">No section</option>
      </select>
    </div>
  );
}
