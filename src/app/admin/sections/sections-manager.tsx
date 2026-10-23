"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ListIcon } from "~/app/_components/icons";
import { Card, CardHeader, EmptyState } from "~/app/_components/ui";
import { api } from "~/trpc/react";

type Section = {
  id: string;
  name: string;
  gradeLevel: number;
  students: number;
};

const GRADES = [7, 8, 9, 10, 11, 12];
const field =
  "border-line bg-canvas text-ink placeholder:text-muted focus:border-brand focus:bg-surface focus:ring-brand/10 rounded-lg border px-3 py-2 text-sm transition outline-none focus:ring-4";

/** Add a section, rename it or change its grade, or delete it. */
export function SectionsManager({ sections }: { sections: Section[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("10");
  const [error, setError] = useState<string | null>(null);
  const create = api.admin.createSection.useMutation({
    onSuccess: () => {
      setName("");
      router.refresh();
    },
    onError: (e) => setError(e.message),
  });

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setError(null);
            create.mutate({ name, gradeLevel: Number(grade) });
          }}
          className="flex flex-wrap items-end gap-3"
        >
          <div className="min-w-[200px] flex-1">
            <label htmlFor="new-section" className="text-ink text-xs font-bold">
              New section
            </label>
            <input
              id="new-section"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rizal"
              maxLength={60}
              required
              className={`${field} mt-1 w-full`}
            />
          </div>
          <div>
            <label htmlFor="new-grade" className="text-ink text-xs font-bold">
              Grade
            </label>
            <select
              id="new-grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className={`${field} mt-1 block`}
            >
              {GRADES.map((g) => (
                <option key={g} value={g}>
                  Grade {g}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={create.isPending}
            className="bg-navy hover:bg-navy-deep rounded-lg px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-60"
          >
            {create.isPending ? "Adding…" : "Add section"}
          </button>
        </form>
        {error && (
          <p role="alert" className="mt-2 text-sm text-rose-600">
            {error}
          </p>
        )}
      </Card>

      <Card className="overflow-hidden">
        <CardHeader
          icon={<ListIcon className="size-[18px]" />}
          title="Sections"
          subtitle={`${sections.length} section${sections.length === 1 ? "" : "s"}`}
        />
        {sections.length === 0 ? (
          <EmptyState>
            No sections yet. Add one above, or upload a School Form 1 from
            People.
          </EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-canvas text-muted text-[11px] font-bold tracking-wide uppercase">
                <tr>
                  <th className="px-5 py-2.5">Section</th>
                  <th className="px-4 py-2.5">Grade</th>
                  <th className="px-4 py-2.5">Students</th>
                  <th className="px-5 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-line divide-y">
                {sections.map((section) => (
                  <SectionRow key={section.id} section={section} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

function SectionRow({ section }: { section: Section }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(section.name);
  const [grade, setGrade] = useState(String(section.gradeLevel));
  const [error, setError] = useState<string | null>(null);
  const update = api.admin.updateSection.useMutation({
    onSuccess: () => {
      setEditing(false);
      router.refresh();
    },
    onError: (e) => setError(e.message),
  });
  const remove = api.admin.deleteSection.useMutation({
    onSuccess: () => router.refresh(),
    onError: (e) => setError(e.message),
  });
  const busy = update.isPending || remove.isPending;

  if (editing) {
    return (
      <tr>
        <td colSpan={4} className="px-5 py-3">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setError(null);
              update.mutate({
                id: section.id,
                name,
                gradeLevel: Number(grade),
              });
            }}
            className="flex flex-wrap items-center gap-2"
          >
            <input
              aria-label="Section name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={60}
              required
              autoFocus
              className={`${field} min-w-[180px] flex-1`}
            />
            <select
              aria-label="Grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className={field}
            >
              {GRADES.map((g) => (
                <option key={g} value={g}>
                  Grade {g}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={busy}
              className="bg-navy hover:bg-navy-deep rounded-lg px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
            >
              {update.isPending ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setName(section.name);
                setGrade(String(section.gradeLevel));
                setError(null);
              }}
              className="border-line text-ink hover:bg-canvas rounded-lg border px-3 py-2 text-xs font-semibold"
            >
              Cancel
            </button>
          </form>
          {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
        </td>
      </tr>
    );
  }

  return (
    <tr className={busy ? "opacity-60" : ""}>
      <td className="text-ink px-5 py-3 font-semibold">{section.name}</td>
      <td className="text-muted px-4 py-3">Grade {section.gradeLevel}</td>
      <td className="px-4 py-3">
        <Link
          href={`/admin/people?role=STUDENT&section=${section.id}`}
          className="text-brand font-bold hover:underline"
        >
          {section.students} student{section.students === 1 ? "" : "s"}
        </Link>
      </td>
      <td className="px-5 py-3 text-right">
        <div className="flex justify-end gap-3 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setEditing(true)}
            disabled={busy}
            className="text-brand hover:underline"
          >
            Edit
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              const note =
                section.students > 0
                  ? ` Its ${section.students} student${section.students === 1 ? "" : "s"} will stay, with no section.`
                  : "";
              if (window.confirm(`Delete section ${section.name}?${note}`)) {
                setError(null);
                remove.mutate({ id: section.id });
              }
            }}
            className="text-rose-600 hover:underline"
          >
            {remove.isPending ? "Deleting…" : "Delete"}
          </button>
        </div>
        {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
      </td>
    </tr>
  );
}
