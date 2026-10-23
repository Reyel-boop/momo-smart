"use client";

import { useId, useState, useTransition } from "react";

import { setUnitStatus, type UnitStatus } from "./actions";

const OPTIONS: Array<{ value: UnitStatus; label: string }> = [
  { value: "NOT_STARTED", label: "Upcoming" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "COMPLETED", label: "Completed" },
];

/** Lets the teacher mark where each class is in a unit. */
export function UnitStatusSelect({
  unitId,
  sectionIds,
  status,
}: {
  unitId: string;
  sectionIds: string[];
  status: UnitStatus;
}) {
  const id = useId();
  const [value, setValue] = useState(status);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <label
        htmlFor={id}
        className="text-muted font-bold tracking-wider uppercase"
      >
        Unit status
      </label>
      <select
        id={id}
        value={value}
        disabled={pending}
        onChange={(event) => {
          const next = event.target.value as UnitStatus;
          setValue(next);
          setError(null);
          startTransition(async () => {
            const result = await setUnitStatus(sectionIds, unitId, next);
            if (!result.ok) {
              setValue(status);
              setError(result.error);
            }
          });
        }}
        className="border-line bg-surface text-ink rounded-lg border px-2 py-1 text-xs font-semibold"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {pending && <span className="text-muted">Saving…</span>}
      {error && <span className="text-rose-600">{error}</span>}
    </div>
  );
}
