"use client";

import { useState } from "react";

import { RaceView } from "~/app/_components/race/race-view";
import { unlock } from "~/app/_components/sfx";
import { Card, EmptyState } from "~/app/_components/ui";
import { api, type RouterOutputs } from "~/trpc/react";

type Classes = RouterOutputs["race"]["classes"];

const LENGTHS: Array<[number, string]> = [
  [5, "5 minutes"],
  [10, "10 minutes"],
  [15, "15 minutes"],
  [30, "30 minutes"],
  [60, "1 hour"],
  [24 * 60, "1 day"],
  [7 * 24 * 60, "1 week"],
];

/** Pick a class, watch its race, and manage its five teams. */
export function TeacherRace({ classes }: { classes: Classes }) {
  const [sectionId, setSectionId] = useState(classes[0]?.id ?? "");
  const [minutes, setMinutes] = useState(10);
  const race = api.race.forSection.useQuery(
    { sectionId },
    {
      enabled: !!sectionId,
      // Quick updates while a race runs, so points sound as they come in.
      refetchInterval: (q) => (q.state.data?.session?.running ? 4000 : 15000),
    },
  );
  const changed = () => void race.refetch();
  const shuffle = api.race.shuffle.useMutation({ onSuccess: changed });
  const move = api.race.move.useMutation({ onSuccess: changed });
  const rename = api.race.rename.useMutation({ onSuccess: changed });
  const start = api.race.start.useMutation({ onSuccess: changed });
  const stop = api.race.stop.useMutation({ onSuccess: changed });
  const running = !!race.data?.session?.running;

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
        <label>
          <span className="text-ink text-xs font-bold">Race length</span>
          <select
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
            className="border-line bg-canvas text-ink mt-1 block rounded-lg border px-3 py-2 text-sm"
          >
            {LENGTHS.map(([m, label]) => (
              <option key={m} value={m}>
                {label}
              </option>
            ))}
          </select>
        </label>
        {running ? (
          <button
            type="button"
            disabled={stop.isPending}
            onClick={() => {
              if (window.confirm("End the race now and show the placements?")) {
                stop.mutate({ sectionId });
              }
            }}
            className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-bold text-white hover:bg-rose-700 disabled:opacity-60"
          >
            ⏹ End race
          </button>
        ) : (
          <button
            type="button"
            disabled={start.isPending || !sectionId}
            onPointerDown={unlock}
            onClick={() => start.mutate({ sectionId, minutes })}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {start.isPending ? "Starting…" : "🏁 Start race"}
          </button>
        )}
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
        Only stars earned while the race runs count. Points make a sound and the
        placements show with a fanfare when time is up — turn the sound on for
        the projector. Open a team in the leaderboard to rename it or move a
        student to another team. Students who join the class later are added to
        the smallest team automatically.
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
