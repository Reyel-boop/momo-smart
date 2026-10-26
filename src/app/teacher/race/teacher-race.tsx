"use client";

import { useState } from "react";

import { RaceView } from "~/app/_components/race/race-view";
import { Card, EmptyState } from "~/app/_components/ui";
import { api, type RouterOutputs } from "~/trpc/react";

type Classes = RouterOutputs["race"]["classes"];

/** Pick a class, watch its race, and manage its five teams. */
export function TeacherRace({ classes }: { classes: Classes }) {
  const [sectionId, setSectionId] = useState(classes[0]?.id ?? "");
  const race = api.race.forSection.useQuery(
    { sectionId },
    { enabled: !!sectionId, refetchInterval: 15000 },
  );
  const changed = () => void race.refetch();
  const shuffle = api.race.shuffle.useMutation({ onSuccess: changed });
  const move = api.race.move.useMutation({ onSuccess: changed });
  const rename = api.race.rename.useMutation({ onSuccess: changed });

  if (classes.length === 0) {
    return (
      <Card>
        <EmptyState>You have no classes this term yet.</EmptyState>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <Card className="flex flex-wrap items-end gap-3 px-5 py-4">
        <label className="min-w-[240px] flex-1">
          <span className="text-ink text-xs font-bold">Class</span>
          <select
            value={sectionId}
            onChange={(e) => setSectionId(e.target.value)}
            className="border-line bg-canvas text-ink mt-1 w-full rounded-lg border px-3 py-2 text-sm"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label} ({c.students} students)
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          disabled={shuffle.isPending}
          onClick={() => {
            if (
              window.confirm(
                "Shuffle the whole class into 5 new teams? Stars stay with each student, so team totals will change.",
              )
            ) {
              shuffle.mutate({ sectionId });
            }
          }}
          className="border-line text-ink hover:bg-canvas rounded-lg border px-4 py-2 text-sm font-semibold disabled:opacity-60"
        >
          {shuffle.isPending ? "Shuffling…" : "🔀 Shuffle teams"}
        </button>
      </Card>
      <p className="text-muted text-xs">
        Open a team in the leaderboard to rename it or move a student to another
        team. Students who join the class later are added to the smallest team
        automatically.
      </p>

      {race.isLoading && (
        <Card>
          <EmptyState>Getting the race ready…</EmptyState>
        </Card>
      )}
      {race.error && (
        <Card>
          <EmptyState>{race.error.message}</EmptyState>
        </Card>
      )}
      {race.data && (
        <RaceView
          key={sectionId}
          race={race.data}
          onRename={(number, name) =>
            rename.mutate({ sectionId, number, name })
          }
          onMove={(studentId, number) =>
            move.mutate({ sectionId, studentId, number })
          }
        />
      )}
    </div>
  );
}
