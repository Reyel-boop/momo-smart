"use client";

import { useEffect, useRef, useState } from "react";

import { ChevronDownIcon } from "~/app/_components/icons";
import { setSoundOn, sfx, soundOn, unlock } from "~/app/_components/sfx";
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

const clock = (ms: number) => {
  const s = Math.max(0, Math.ceil(ms / 1000));
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0)
    return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${m}:${String(sec).padStart(2, "0")}`;
};

/**
 * A class's Group Race: a countdown, the race track (cars move as teams earn
 * stars, with a sound and a "+N" pop), the team leaderboard, the progress
 * chart, and — when time runs out — the placements with a fanfare. Teachers
 * also get team controls.
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
  // Server time vs this device's clock, so the countdown is right everywhere.
  const skew = useRef(0);
  useEffect(() => {
    skew.current = new Date(race.now).getTime() - Date.now();
  }, [race.now]);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now() + skew.current), 250);
    return () => clearInterval(t);
  }, []);
  const endsAt = race.session ? new Date(race.session.endsAt).getTime() : null;
  const left = endsAt ? endsAt - now : 0;
  const running = !!race.session && left > 0;

  // Last-10-seconds ticks.
  const lastTick = useRef<number | null>(null);
  useEffect(() => {
    if (!running) return;
    const s = Math.ceil(left / 1000);
    if (s <= 10 && s > 0 && lastTick.current !== s) {
      lastTick.current = s;
      sfx.tick();
    }
  }, [left, running]);

  // Placements: shown when a race ends while watching, or on request.
  const [placements, setPlacements] = useState(false);
  const wasRunning = useRef(running);
  useEffect(() => {
    if (wasRunning.current && !running && race.session) setPlacements(true);
    wasRunning.current = running;
  }, [running, race.session]);

  return (
    <div className="space-y-5">
      <RaceTrack
        race={race}
        myTeam={myTeam}
        running={running}
        left={left}
        onShowPlacements={() => setPlacements(true)}
      />
      <div className="grid gap-5 xl:grid-cols-[1fr_1.1fr]">
        <Leaderboard
          race={race}
          myTeam={myTeam}
          onRename={onRename}
          onMove={onMove}
        />
        <ProgressChart race={race} />
      </div>
      {placements && (
        <Placements
          race={race}
          myTeam={myTeam}
          onClose={() => setPlacements(false)}
        />
      )}
    </div>
  );
}

/** Sound on/off, remembered on this device; turning on unlocks audio. */
export function SoundToggle({ className = "" }: { className?: string }) {
  const [on, setOn] = useState(true);
  useEffect(() => setOn(soundOn()), []);
  return (
    <button
      type="button"
      onClick={() => {
        setSoundOn(!on);
        setOn(!on);
        if (!on) sfx.coin();
      }}
      onPointerDown={unlock}
      className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
        on ? "bg-white/15 text-white" : "bg-white/5 text-white/60"
      } hover:bg-white/25 ${className}`}
      aria-pressed={on}
    >
      {on ? "🔊 Sound on" : "🔇 Sound off"}
    </button>
  );
}

function RaceTrack({
  race,
  myTeam,
  running,
  left,
  onShowPlacements,
}: {
  race: Race;
  myTeam: number | null;
  running: boolean;
  left: number;
  onShowPlacements: () => void;
}) {
  // Cars roll in from the start line when the race first shows.
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShown(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Points: when a team's stars go up, play a coin and pop "+N".
  const prev = useRef<Map<number, number> | null>(null);
  const [pops, setPops] = useState<
    Array<{ id: number; team: number; n: number }>
  >([]);
  useEffect(() => {
    const current = new Map(race.teams.map((t) => [t.number, t.stars]));
    const before = prev.current;
    prev.current = current;
    if (!before) return;
    const gains = race.teams
      .map((t) => ({
        team: t.number,
        n: t.stars - (before.get(t.number) ?? t.stars),
      }))
      .filter((g) => g.n > 0);
    if (gains.length === 0) return;
    gains.forEach((_, i) => setTimeout(() => sfx.coin(), i * 160));
    const added = gains.map((g) => ({ ...g, id: Math.random() }));
    setPops((p) => [...p, ...added]);
    const t = setTimeout(
      () => setPops((p) => p.filter((x) => !added.includes(x))),
      1800,
    );
    return () => clearTimeout(t);
  }, [race.teams]);

  const lanes = [...race.teams].sort((a, b) => a.number - b.number);
  const leader = Math.max(...lanes.map((t) => t.stars), 0);
  // The leader sits near the flag; everyone else in proportion.
  const scale = leader > 0 ? leader / 0.88 : 1;
  const urgent = running && left <= 10_000;

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 px-5 py-3 text-white">
        <div className="min-w-0">
          <p className="text-sm font-extrabold tracking-wide uppercase">
            🏁 Group Race
          </p>
          <p className="truncate text-xs text-slate-300">{race.className}</p>
        </div>
        <div className="flex items-center gap-3">
          {running ? (
            <span
              className={`rounded-xl px-3 py-1 font-mono text-2xl font-black tabular-nums ${
                urgent ? "race-urgent bg-rose-500" : "bg-white/10"
              }`}
              aria-live="polite"
            >
              ⏱ {clock(left)}
            </span>
          ) : race.session ? (
            <button
              type="button"
              onClick={onShowPlacements}
              className="rounded-xl bg-amber-400 px-3 py-1.5 text-sm font-black text-slate-900 hover:bg-amber-300"
            >
              🏆 Race over — see placements
            </button>
          ) : (
            <span className="text-xs text-slate-300">
              No timed race yet · showing all stars
            </span>
          )}
          <SoundToggle />
        </div>
      </div>
      <div className="relative bg-[repeating-linear-gradient(90deg,#f1f5f9_0_48px,#e2e8f0_48px_50px)] px-3 py-3">
        {/* Finish line */}
        <div className="absolute inset-y-0 right-8 w-3 bg-[repeating-conic-gradient(#0f172a_0_25%,#fff_0_50%)] bg-[length:12px_12px] opacity-70" />
        <div className="space-y-2">
          {lanes.map((team) => {
            const rank = race.teams.find((t) => t.number === team.number)!.rank;
            const pct = shown ? (team.stars / scale) * 100 : 0;
            const mine = myTeam === team.number;
            const pop = pops.filter((p) => p.team === team.number);
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
                    key={pop.length ? pop[0]!.id : "car"}
                    className={`flex size-11 items-center justify-center rounded-full text-2xl shadow-md ring-2 ring-white ${
                      pop.length ? "race-boost" : running ? "race-idle" : ""
                    }`}
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
                  {pop.map((p) => (
                    <span
                      key={p.id}
                      className="race-pop pointer-events-none absolute -top-5 left-2 rounded-full bg-amber-400 px-2 py-0.5 text-sm font-black text-slate-900 shadow"
                    >
                      +{p.n} ⭐
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <style>{`
        @keyframes race-boost {
          0% { transform: scale(1) rotate(0); }
          30% { transform: scale(1.35) rotate(-8deg); box-shadow: 0 0 0 8px rgba(251,191,36,.45); }
          60% { transform: scale(.95) rotate(4deg); }
          100% { transform: scale(1) rotate(0); }
        }
        .race-boost { animation: race-boost .7s ease-out; }
        @keyframes race-idle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        .race-idle { animation: race-idle .35s ease-in-out infinite; }
        @keyframes race-pop {
          0% { opacity: 0; transform: translateY(8px) scale(.6); }
          20% { opacity: 1; transform: translateY(-6px) scale(1.15); }
          100% { opacity: 0; transform: translateY(-34px) scale(1); }
        }
        .race-pop { animation: race-pop 1.8s ease-out forwards; }
        @keyframes race-urgent {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        .race-urgent { animation: race-urgent .5s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .race-boost, .race-idle, .race-pop, .race-urgent { animation: none; }
        }
      `}</style>
    </Card>
  );
}

/** The end of a race: a drumroll, then the podium rises with a fanfare. */
function Placements({
  race,
  myTeam,
  onClose,
}: {
  race: Race;
  myTeam: number | null;
  onClose: () => void;
}) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    sfx.drumroll(1.6);
    const timers = [
      setTimeout(() => setStage(1), 1700), // 3rd
      setTimeout(() => setStage(2), 2300), // 2nd
      setTimeout(() => {
        setStage(3); // 1st
        sfx.fanfare();
      }, 2900),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);
  const order = [...race.teams].sort(
    (a, b) => a.rank - b.rank || a.number - b.number,
  );
  const podium = [order[1], order[0], order[2]]; // 2nd, 1st, 3rd
  const heights = ["h-28", "h-40", "h-20"];
  const shownAt = [2, 3, 1];
  const medals = ["🥈", "🥇", "🥉"];
  const top = Math.max(1, order[0]?.stars ?? 1);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Race placements"
    >
      {stage >= 3 && <Confetti />}
      <div className="placement-in relative w-full max-w-2xl rounded-3xl bg-gradient-to-b from-slate-900 to-indigo-950 p-6 text-center text-white shadow-2xl">
        <p className="text-sm font-bold tracking-[0.2em] text-amber-300 uppercase">
          Race over
        </p>
        <h2 className="mt-1 text-3xl font-black">
          {stage >= 3 && order[0]
            ? `${order[0].name} win! 🏆`
            : "And the winners are…"}
        </h2>
        <div className="mt-8 flex items-end justify-center gap-3">
          {podium.map((team, i) =>
            team ? (
              <div
                key={team.number}
                className="flex w-1/3 max-w-[180px] flex-col items-center"
              >
                <div
                  className={`transition-all duration-500 ${
                    stage >= shownAt[i]!
                      ? "translate-y-0 opacity-100"
                      : "translate-y-6 opacity-0"
                  }`}
                >
                  <span className="text-4xl">{medals[i]}</span>
                  <span
                    className="mx-auto mt-1 flex size-14 items-center justify-center rounded-full text-3xl ring-4 ring-white/80"
                    style={{ backgroundColor: TEAM_COLORS[team.number] }}
                  >
                    🏎️
                  </span>
                  <p className="mt-2 text-sm leading-tight font-extrabold">
                    {team.name}
                    {myTeam === team.number && (
                      <span className="block text-amber-300">your team!</span>
                    )}
                  </p>
                  <p className="text-xs text-white/70">⭐ {team.stars}</p>
                </div>
                <div
                  className={`mt-2 w-full rounded-t-xl transition-all duration-700 ease-out ${
                    stage >= shownAt[i]! ? heights[i] : "h-0"
                  }`}
                  style={{
                    backgroundColor: TEAM_COLORS[team.number],
                    opacity: 0.9,
                  }}
                >
                  <span className="block pt-2 text-3xl font-black text-white/90">
                    {i === 1 ? 1 : i === 0 ? 2 : 3}
                  </span>
                </div>
              </div>
            ) : null,
          )}
        </div>
        {order.length > 3 && (
          <ol
            className={`mt-5 space-y-1.5 text-left transition-opacity duration-500 ${
              stage >= 3 ? "opacity-100" : "opacity-0"
            }`}
          >
            {order.slice(3).map((t) => (
              <li
                key={t.number}
                className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-2"
              >
                <span className="w-8 font-black">#{t.rank}</span>
                <span
                  className="size-3 rounded-full"
                  style={{ backgroundColor: TEAM_COLORS[t.number] }}
                />
                <span className="flex-1 font-semibold">{t.name}</span>
                <span className="tabular-nums">⭐ {t.stars}</span>
                <span className="h-1.5 w-24 overflow-hidden rounded-full bg-white/15">
                  <span
                    className="block h-full rounded-full"
                    style={{
                      width: `${(t.stars / top) * 100}%`,
                      backgroundColor: TEAM_COLORS[t.number],
                    }}
                  />
                </span>
              </li>
            ))}
          </ol>
        )}
        <button
          type="button"
          onClick={onClose}
          className="mt-6 rounded-xl bg-white px-6 py-2.5 text-sm font-black text-slate-900 hover:bg-white/90"
        >
          Close
        </button>
      </div>
      <style>{`
        @keyframes placement-in {
          0% { opacity: 0; transform: scale(.85) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .placement-in { animation: placement-in .45s cubic-bezier(.2,1.4,.4,1); }
      `}</style>
    </div>
  );
}

/** Falling confetti in the five team colors. */
export function Confetti({ count = 90 }: { count?: number }) {
  const [bits] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      left: Math.random() * 100,
      delay: Math.random() * 0.8,
      duration: 2.2 + Math.random() * 1.8,
      size: 6 + Math.random() * 8,
      color: [...TEAM_COLORS, "#ffffff", "#fde047"][i % 7],
      spin: Math.random() > 0.5 ? 1 : -1,
    })),
  );
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[60] overflow-hidden"
      aria-hidden="true"
    >
      {bits.map((b, i) => (
        <span
          key={i}
          className="confetti-bit absolute top-[-20px] block rounded-sm"
          style={{
            left: `${b.left}%`,
            width: b.size,
            height: b.size * 0.45,
            backgroundColor: b.color,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`,
            ["--spin" as string]: `${b.spin * 720}deg`,
          }}
        />
      ))}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0); opacity: 1; }
          100% { transform: translateY(110vh) rotate(var(--spin)); opacity: .9; }
        }
        .confetti-bit { animation-name: confetti-fall; animation-timing-function: cubic-bezier(.3,.6,.6,1); animation-fill-mode: forwards; }
        @media (prefers-reduced-motion: reduce) { .confetti-bit { display: none; } }
      `}</style>
    </div>
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
        subtitle={
          race.session
            ? "Stars earned during this race: correct answers, graded work, games and quests"
            : "Stars earned in this class: correct answers, graded work, games and quests"
        }
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
                  {team.members.length} members · avg {team.average} stars each
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

/** Each team's running star total, with a hover crosshair. */
function ProgressChart({ race }: { race: Race }) {
  const W = 640;
  const H = 260;
  const pad = { l: 40, r: 16, t: 16, b: 28 };
  const [hover, setHover] = useState<number | null>(null);
  const svg = useRef<SVGSVGElement>(null);
  const n = race.labels.length;
  const max = Math.max(5, ...race.history.flatMap((h) => h.totals));
  const step = niceStep(max);
  const top = Math.ceil(max / step) * step;
  const x = (i: number) =>
    pad.l + (i / Math.max(1, n - 1)) * (W - pad.l - pad.r);
  const y = (v: number) => H - pad.b - (v / top) * (H - pad.t - pad.b);
  const ticks = Array.from({ length: top / step + 1 }, (_, i) => i * step);

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
        subtitle={
          race.session
            ? "Each team's total stars across this race"
            : "Each team's total stars, day by day, over the last 2 weeks"
        }
      />
      <div className="px-4 pt-3 pb-4">
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
            aria-label="Line chart of each team's total stars over time"
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
            {race.labels.map((label, i) =>
              i % 3 === (n - 1) % 3 ? (
                <text
                  key={i}
                  x={x(i)}
                  y={H - 8}
                  textAnchor="middle"
                  className="fill-slate-500 text-[11px]"
                >
                  {label}
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
          <div className="border-line pointer-events-none mt-2 rounded-lg border bg-white px-3 py-2 text-xs shadow-sm sm:absolute sm:top-1 sm:left-12 sm:mt-0">
            <p className="text-ink mb-1 font-bold">
              {hover === null ? "Now" : race.labels[shownIndex]}
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
