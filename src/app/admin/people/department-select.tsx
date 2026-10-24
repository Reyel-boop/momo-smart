"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "~/trpc/react";

/** Sets a teacher's department (subject area) from their row. */
export function TeacherDepartmentSelect({
  userId,
  value,
  departments,
}: {
  userId: string;
  value: string;
  departments: Array<{ id: string; name: string }>;
}) {
  const router = useRouter();
  const [current, setCurrent] = useState(value);
  const [error, setError] = useState<string | null>(null);
  const save = api.admin.setTeacherDepartment.useMutation({
    onSuccess: () => router.refresh(),
    onError: (e) => {
      setCurrent(value);
      setError(e.message);
    },
  });

  return (
    <div>
      <select
        aria-label="Department"
        value={current}
        disabled={save.isPending}
        onChange={(e) => {
          setError(null);
          setCurrent(e.target.value);
          save.mutate({ userId, departmentId: e.target.value || null });
        }}
        className="border-line bg-surface text-ink focus:border-brand max-w-[220px] rounded-lg border px-2 py-1 text-xs transition outline-none disabled:opacity-60"
      >
        <option value="">No department</option>
        {departments.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
}
