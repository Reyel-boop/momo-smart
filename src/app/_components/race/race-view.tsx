"use client";

import { useEffect, useRef, useState } from "react";

import { ChevronDownIcon } from "~/app/_components/icons";
import { Card, CardHeader } from "~/app/_components/ui";
import type { RouterOutputs } from "~/trpc/react";

export type Race = RouterOutputs["race"]["forSection"];

/**
 * Team colors, in fixed order by team number (never by rank), from the
 * validated categorical palette. Names and labels always sit beside them,
 * so identity never rests on color alone.
 */
export const TEAM_COLORS = [
  "#2a78d6",
  "#eb6834",
  "#1baf7a",
  "#eda100",
  "#e87ba4",
] as const;

/**
 * A class's Group Race: the race track, the team leaderboard (with every
 * member's stars), and each team's running total over the last two weeks.
 * Teachers also get controls to rename teams and move students.
 */
export function RaceView({
  race,
  myTeam = null,
  onRename,
  onMove,
}: {
  race: Race;
  myTeam?: number | null;
  onRename?: (number: number, name: string) => void;
  onMove?: (studentId: string, number: number) => void;
}) {
  return (
    <div className="space-y-5">
      <RaceTrack race={race} myTeam={myTeam} />
      <div className="grid gap-5 xl:grid-cols-[1fr_1.1fr]">
        <Leaderboard
          race={race}
          myTeam={myTeam}
          onRename={onRename}
          onMove={onMove}
        />
        <ProgressChart race={race} />
      </div>
    </div>
  );
}

function RaceTrack({ race, myTeam }: { race: Race; myTeam: number | null }) {
  // Cars roll in from the start line when the race first shows.
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShown(true), 80);
    return () => clearTimeout(t);
  }, []);
  const lanes = [...race.teams].sort((a, b) => a.number - b.number);
  const leader = Math.max(...lanes.map((t) => t.stars), 0);
  // The leader sits near the flag; everyone else in proportion.
  const scale = leader > 0 ? leader / 0.88 : 1;

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900 px-5 py-3 text-white">
        <p className="text-sm font-extrabold tracking-wide uppercase">
          🏁 Group Race
        </p>
        <p className="text-xs text-slate-300">{race.className}</p>
      </div>
      <div className="relative bg-[repeating-linear-gradient(90deg,#f1f5f9_0_48px,#e2e8f0_48px_50px)] px-3 py-3">
        {/* Finish line */}
        <div className="absolute inset-y-0 right-8 w-3 bg-[repeating-conic-gradient(#0f172a_0_25%,#fff_0_50%)] bg-[length:12px_12px] opacity-70" />
        <div className="space-y-2">
          {lanes.map((team) => {
            const rank = race.teams.find((t) => t.number === team.number)!.rank;
            const pct = shown ? (team.stars / scale) * 100 : 0;
            const mine = myTeam === team.number;
            return (
              <div
                key={team.number}
                className={`relative h-14 rounded-xl border-2 bg-white/70 ${
                  mine ? "border-navy" : "border-transparent"
                }`}
              >
                <div
                  className="absolute inset-y-0 left-0 rounded-xl opacity-15 transition-[width] duration-[1600ms] ease-out"
                  style={{
                    width: `calc(${pct}% + 56px)`,
                    backgroundColor: TEAM_COLORS[team.number],
                  }}
                />
                <div
                  className="absolute top-1/2 flex -translate-y-1/2 items-center gap-2 transition-[left] duration-[1600ms] ease-out"
                  style={{ left: `calc(${pct * 0.86}% + 4px)` }}
                >
                  <span
                    className="flex size-11 items-center justify-center rounded-full text-2xl shadow-md ring-2 ring-white"
                    style={{ backgroundColor: TEAM_COLORS[team.number] }}
                    aria-hidden="true"
                  >
                    🏎️
                  </span>
                  <span className="rounded-lg bg-white/90 px-2 py-0.5 leading-tight shadow-sm">
                    <span className="text-ink block text-xs font-extrabold whitespace-nowrap">
                      #{rank} {team.name}
                      {mine && " (your team)"}
                    </span>
                    <span className="text-muted block text-[11px] font-semibold whitespace-nowrap">
                      ⭐ {team.stars.toLocaleString()} stars
                    </span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

function Leaderboard({
  race,
  myTeam,
  onRename,
  onMove,
}: {
  race: Race;
  myTeam: number | null;
  onRename?: (number: number, name: string) => void;
  onMove?: (studentId: string, number: number) => void;
}) {
  const [open, setOpen] = useState<number | null>(myTeam);
  const medal = ["🥇", "🥈", "🥉"];

  return (
    <Card className="overflow-hidden">
      <CardHeader
        title="Team leaderboard"
        subtitle="Stars earned in this class: correct Unit Questions and Live Quiz answers, graded work, and course games"
      />
      <ol className="divide-line divide-y">
        {race.teams.map((team) => (
          <li key={team.number}>
            <button
              type="button"
              onClick={() => setOpen(open === team.number ? null : team.number)}
              className={`flex w-full items-center gap-3 px-5 py-3 text-left transition hover:bg-slate-50 ${
                myTeam === team.number ? "bg-brand-soft/50" : ""
              }`}
              aria-expanded={open === team.number}
            >
              <span className="w-7 text-center text-lg font-black">
                {medal[team.rank - 1] ?? `#${team.rank}`}
              </span>
              <span
                className="size-3.5 shrink-0 rounded-full"
                style={{ backgroundColor: TEAM_COLORS[team.number] }}
                aria-hidden="true"
              />
              <span className="min-w-0 flex-1">
                <span className="text-ink block truncate text-sm font-bold">
                  {team.name}
                  {myTeam === team.number && (
                    <span className="text-brand"> · your team</span>
                  )}
                </span>
                <span className="text-muted block text-xs">
                  {team.members.length} members · avg {team.average} ·{" "}
                  {team.thisWeek > 0
                    ? `+${team.thisWeek} this week`
                    : "no stars this week"}
                </span>
              </span>
              <span className="text-ink text-lg font-black tabular-nums">
                {team.stars.toLocaleString()}
              </span>
              <ChevronDownIcon
                className={`text-muted size-4 transition ${open === team.number ? "rotate-180" : ""}`}
              />
            </button>
            {open === team.number && (
              <div className="bg-slate-50/70 px-5 pt-1 pb-3">
                {onRename && (
                  <button
                    type="button"
                    onClick={() => {
                      const name = window
                        .prompt("Team name", team.name)
                        ?.trim();
                      if (name) onRename(team.number, name);
                    }}
                    className="text-brand mb-2 text-xs font-semibold hover:underline"
                  >
                    Rename team
                  </button>
                )}
                {team.members.length === 0 ? (
                  <p className="text-muted text-sm">No members yet.</p>
                ) : (
                  <ul className="space-y-1">
                    {team.members.map((m, i) => (
                      <li
                        key={m.studentId}
                        className="flex items-center gap-2 text-sm"
                      >
                        <span className="text-muted w-5 text-right text-xs">
                          {i + 1}.
                        </span>
                        <span className="text-ink min-w-0 flex-1 truncate">
                          {m.name}
                        </span>
                        <span className="text-ink font-bold tabular-nums">
                          ⭐ {m.stars}
                        </span>
                        {onMove && (
                          <select
                            aria-label={`Move ${m.name} to another team`}
                            value={team.number}
                            onChange={(e) =>
                              onMove(m.studentId, Number(e.target.value))
                            }
                            className="border-line rounded-md border bg-white px-1 py-0.5 text-xs"
                          >
                            {[...race.teams]
                              .sort((a, b) => a.number - b.number)
                              .map((t) => (
                                <option key={t.number} value={t.number}>
                                  {t.name}
                                </option>
                              ))}
                          </select>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </li>
        ))}
      </ol>
    </Card>
  );
}

/** Each team's running star total per day, with a hover crosshair. */
function ProgressChart({ race }: { race: Race }) {
  const W = 640;
  const H = 260;
  const pad = { l: 40, r: 16, t: 16, b: 28 };
  const [hover, setHover] = useState<number | null>(null);
  const svg = useRef<SVGSVGElement>(null);
  const n = race.dates.length;
  const max = Math.max(5, ...race.history.flatMap((h) => h.totals));
  const step = niceStep(max);
  const top = Math.ceil(max / step) * step;
  const x = (i: number) =>
    pad.l + (i / Math.max(1, n - 1)) * (W - pad.l - pad.r);
  const y = (v: number) => H - pad.b - (v / top) * (H - pad.t - pad.b);
  const ticks = Array.from({ length: top / step + 1 }, (_, i) => i * step);
  const label = (d: string) =>
    new Date(`${d}T00:00:00`).toLocaleDateString("en-PH", {
      month: "short",
      day: "numeric",
    });

  const onMove = (e: React.PointerEvent) => {
    const box = svg.current?.getBoundingClientRect();
    if (!box) return;
    const px = ((e.clientX - box.left) / box.width) * W;
    const i = Math.round(((px - pad.l) / (W - pad.l - pad.r)) * (n - 1));
    setHover(Math.min(n - 1, Math.max(0, i)));
  };

  const shownIndex = hover ?? n - 1;
  const rows = race.history
    .map((h) => ({ ...h, value: h.totals[shownIndex] ?? 0 }))
    .sort((a, b) => b.value - a.value);

  return (
    <Card className="overflow-hidden">
      <CardHeader
        title="Race progress"
        subtitle="Each team's total stars, day by day, over the last 2 weeks"
      />
      <div className="px-4 pt-3 pb-4">
        {/* Legend */}
        <div className="mb-2 flex flex-wrap gap-x-4 gap-y-1">
          {race.history.map((h) => (
            <span
              key={h.number}
              className="text-muted inline-flex items-center gap-1.5 text-xs font-semibold"
            >
              <span
                className="h-0.5 w-4 rounded-full"
                style={{ backgroundColor: TEAM_COLORS[h.number] }}
              />
              {h.name}
            </span>
          ))}
        </div>
        <div className="relative">
          <svg
            ref={svg}
            viewBox={`0 0 ${W} ${H}`}
            className="w-full touch-none"
            role="img"
            aria-label="Line chart of each team's total stars over the last two weeks"
            onPointerMove={onMove}
            onPointerLeave={() => setHover(null)}
          >
            {ticks.map((t) => (
              <g key={t}>
                <line
                  x1={pad.l}
                  x2={W - pad.r}
                  y1={y(t)}
                  y2={y(t)}
                  stroke="#e2e8f0"
                  strokeWidth={1}
                />
                <text
                  x={pad.l - 6}
                  y={y(t) + 4}
                  textAnchor="end"
                  className="fill-slate-500 text-[11px]"
                >
                  {t}
                </text>
              </g>
            ))}
            {race.dates.map((d, i) =>
              i % 3 === (n - 1) % 3 ? (
                <text
                  key={d}
                  x={x(i)}
                  y={H - 8}
                  textAnchor="middle"
                  className="fill-slate-500 text-[11px]"
                >
                  {label(d)}
                </text>
              ) : null,
            )}
            {hover !== null && (
              <line
                x1={x(hover)}
                x2={x(hover)}
                y1={pad.t}
                y2={H - pad.b}
                stroke="#94a3b8"
                strokeWidth={1}
                strokeDasharray="3 3"
              />
            )}
            {race.history.map((h) => (
              <polyline
                key={h.number}
                fill="none"
                stroke={TEAM_COLORS[h.number]}
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
                points={h.totals.map((v, i) => `${x(i)},${y(v)}`).join(" ")}
              />
            ))}
            {race.history.map((h) => (
              <circle
                key={h.number}
                cx={x(shownIndex)}
                cy={y(h.totals[shownIndex] ?? 0)}
                r={hover !== null ? 4.5 : 3.5}
                fill={TEAM_COLORS[h.number]}
                stroke="#fff"
                strokeWidth={2}
              />
            ))}
          </svg>
          {/* Tooltip: the hovered day (or today), teams ranked */}
          <div className="border-line pointer-events-none mt-2 rounded-lg border bg-white px-3 py-2 text-xs shadow-sm sm:absolute sm:top-1 sm:left-12 sm:mt-0">
            <p className="text-ink mb-1 font-bold">
              {hover === null ? "Today" : label(race.dates[shownIndex]!)}
            </p>
            {rows.map((r) => (
              <p key={r.number} className="flex items-center gap-1.5">
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: TEAM_COLORS[r.number] }}
                />
                <span className="text-muted">{r.name}</span>
                <span className="text-ink ml-auto pl-3 font-bold tabular-nums">
                  {r.value}
                </span>
              </p>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

function niceStep(max: number) {
  const raw = max / 4;
  const pow = 10 ** Math.floor(Math.log10(raw));
  const n = raw / pow;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * pow;
}
