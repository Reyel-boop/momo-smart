"use client";

import { useState } from "react";

import { RaceView, TEAM_COLORS } from "~/app/_components/race/race-view";
import { Card, EmptyState } from "~/app/_components/ui";
import { api } from "~/trpc/react";

/** One tab per class; each shows that class's race with the student's team. */
export function StudentRace() {
  const races = api.race.mine.useQuery(undefined, {
    refetchInterval: (q) =>
      q.state.data?.some((r) => r.session?.running) ? 5000 : 20000,
  });
  const [picked, setPicked] = useState<string | null>(null);

  if (races.isLoading) {
    return (
      <Card>
        <EmptyState>Getting the race ready…</EmptyState>
      </Card>
    );
  }
  const list = races.data ?? [];
  if (list.length === 0) {
    return (
      <Card>
        <EmptyState>
          Join a class with its class code to race with your classmates.
        </EmptyState>
      </Card>
    );
  }
  const race = list.find((r) => r.sectionId === picked) ?? list[0]!;
  const team = race.teams.find((t) => t.number === race.myTeam);

  return (
    <div className="space-y-5">
      {list.length > 1 && (
        <div className="flex flex-wrap gap-2" role="tablist">
          {list.map((r) => (
            <button
              key={r.sectionId}
              type="button"
              role="tab"
              aria-selected={r.sectionId === race.sectionId}
              onClick={() => setPicked(r.sectionId)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                r.sectionId === race.sectionId
                  ? "bg-navy text-white"
                  : "border-line text-ink hover:bg-surface border bg-white"
              }`}
            >
              {r.className}
            </button>
          ))}
        </div>
      )}

      {team && (
        <Card className="flex flex-wrap items-center gap-4 px-5 py-4">
          <span
            className="flex size-12 items-center justify-center rounded-full text-2xl"
            style={{ backgroundColor: TEAM_COLORS[team.number] }}
            aria-hidden="true"
          >
            🏎️
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-muted text-xs font-bold tracking-wide uppercase">
              Your team
            </p>
            <p className="text-ink text-lg font-extrabold">
              {team.name} · #{team.rank} of {race.teams.length}
            </p>
            <p className="text-muted text-sm">
              {team.rank === 1
                ? "You're in the lead! Keep earning stars to stay ahead."
                : `${(race.teams[team.rank - 2]?.stars ?? team.stars) - team.stars + 1} more stars to pass the team ahead.`}
            </p>
          </div>
          <p className="text-ink text-3xl font-black tabular-nums">
            ⭐ {team.stars}
          </p>
        </Card>
      )}

      <RaceView key={race.sectionId} race={race} myTeam={race.myTeam} />
    </div>
  );
}
