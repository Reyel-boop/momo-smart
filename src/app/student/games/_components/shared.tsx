import Link from "next/link";

import { LockIcon } from "~/app/_components/icons";
import { Card } from "~/app/_components/ui";
import { Stars } from "./stars";

/** A fixed shuffle of `count` items, the same every time for one key. */
export function fixedOrder(key: string, count: number) {
  const hash = (i: number) => {
    let h = 7;
    for (const ch of `${key}:${i}`) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    return h;
  };
  return Array.from({ length: count }, (_, i) => i).sort(
    (a, b) => hash(a) - hash(b),
  );
}

/** A random shuffle (a new order each play). */
export function shuffled<T>(items: readonly T[]) {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

/** Shown instead of a level the student can't play yet. */
export function LockedLevel({
  what,
  message,
}: {
  what: string;
  message: string;
}) {
  return (
    <Card className="mx-auto max-w-lg px-6 py-10 text-center">
      <LockIcon className="text-muted mx-auto size-10" />
      <p className="text-ink mt-3 text-lg font-extrabold">{what} locked</p>
      <p className="text-muted mt-1 text-sm">{message}</p>
      <Link
        href="/student/games"
        className="bg-navy mt-5 inline-flex rounded-lg px-4 py-2 text-sm font-bold text-white"
      >
        Back to Games
      </Link>
    </Card>
  );
}

/** The top of a level: back link, unit and title, and the best stars. */
export function LevelHeader({
  game,
  unit,
  unitTitle,
  title,
  number,
  count,
  best,
  children,
}: {
  game: string;
  unit: number;
  unitTitle: string;
  title: string;
  number?: number;
  count?: number;
  best: number;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <Link
          href="/student/games"
          className="text-brand text-sm font-semibold hover:underline"
        >
          ← All games
        </Link>
        <p className="text-muted mt-1 text-xs font-bold tracking-wide uppercase">
          {game} · Unit {unit} · {unitTitle}
          {number ? ` · Level ${number} of ${count}` : ""}
        </p>
        <h1 className="text-ink text-2xl font-extrabold tracking-tight">
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-3">
        {children}
        <div className="text-right">
          <p className="text-muted text-[11px] font-semibold">Your best</p>
          <Stars count={best} className="size-5" />
        </div>
      </div>
    </div>
  );
}

/** The end of a level: stars, a line about the leaderboard, and buttons. */
export function LevelResult({
  heading,
  stars,
  newStars,
  best,
  failNote,
  stats,
  nextHref,
  onRetry,
  children,
}: {
  heading: string;
  stars: number;
  newStars: number;
  best: number;
  failNote: string;
  stats: { label: string; value: string }[];
  nextHref: string | null;
  onRetry: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="pop-in rounded-2xl bg-gradient-to-r from-amber-50 to-emerald-50 px-5 py-6 text-center">
      <p className="text-ink text-2xl font-black">{heading}</p>
      <div className="mt-2 flex justify-center">
        <Stars count={stars} className="size-10" />
      </div>
      <div className="mt-3 flex flex-wrap justify-center gap-6 text-sm">
        {stats.map((s) => (
          <p key={s.label}>
            <span className="text-muted block text-xs font-bold uppercase">
              {s.label}
            </span>
            <span className="text-ink text-lg font-black">{s.value}</span>
          </p>
        ))}
      </div>
      <p className="text-muted mt-2 text-sm font-semibold">
        {stars === 0
          ? failNote
          : newStars > 0
            ? `+${newStars} Star${newStars === 1 ? "" : "s"} on the leaderboard`
            : `Your best is still ${best} star${best === 1 ? "" : "s"}`}
      </p>
      {children}
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={onRetry}
          className="border-line bg-surface text-ink hover:bg-canvas rounded-xl border px-4 py-2 text-sm font-bold"
        >
          ↻ Play again
        </button>
        {stars > 0 && nextHref && (
          <Link
            href={nextHref}
            className="bg-navy rounded-xl px-4 py-2 text-sm font-bold text-white hover:opacity-90"
          >
            Next level →
          </Link>
        )}
        <Link
          href="/student/games"
          className="border-line bg-surface text-ink hover:bg-canvas rounded-xl border px-4 py-2 text-sm font-bold"
        >
          All games
        </Link>
      </div>
      <style>{`
        .pop-in { animation: pop-in .45s cubic-bezier(.2,1.4,.4,1) both; }
        @keyframes pop-in { from { transform: scale(.85); opacity: 0 } to { transform: scale(1); opacity: 1 } }
        @media (prefers-reduced-motion: reduce) { .pop-in { animation: none } }
      `}</style>
    </div>
  );
}
