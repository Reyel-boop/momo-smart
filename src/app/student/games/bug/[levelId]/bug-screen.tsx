"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { SoundToggle } from "~/app/_components/race/race-view";
import { sfx, unlock } from "~/app/_components/sfx";
import { Card } from "~/app/_components/ui";
import { BUG_LEVELS, type BugLevel } from "~/lib/games/bug-hunt";
import { api } from "~/trpc/react";
import {
  fixedOrder,
  LevelHeader,
  LevelResult,
  LockedLevel,
} from "../../_components/shared";

/** The code as a page for the preview, wrapped when it isn't a full page. */
function pageOf(lines: string[]) {
  const code = lines.join("\n");
  return /<html/i.test(code)
    ? code
    : `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{font-family:system-ui,sans-serif;padding:12px}</style></head><body>${code}</body></html>`;
}

/**
 * One Bug Hunt level: tap a line with a bug, pick its fix, and watch the
 * preview change. Wrong lines and wrong fixes count as mistakes; the server
 * scores the taps once every bug is fixed.
 */
export function BugScreen({ levelId }: { levelId: string }) {
  const level = BUG_LEVELS.find((l) => l.id === levelId)!;
  const access = api.game.level.useQuery(
    { game: "bug", levelId },
    { retry: false },
  );
  const [attempt, setAttempt] = useState(0);

  if (access.error) {
    return <LockedLevel what="Level" message={access.error.message} />;
  }
  return (
    <Hunt
      key={attempt}
      level={level}
      best={access.data?.best ?? 0}
      number={access.data?.number}
      count={access.data?.count}
      nextId={access.data?.nextId ?? null}
      ready={!!access.data}
      onRetry={() => setAttempt((n) => n + 1)}
    />
  );
}

function Hunt({
  level,
  best,
  number,
  count,
  nextId,
  ready,
  onRetry,
}: {
  level: BugLevel;
  best: number;
  number?: number;
  count?: number;
  nextId: string | null;
  ready: boolean;
  onRetry: () => void;
}) {
  const router = useRouter();
  const utils = api.useUtils();
  const [taps, setTaps] = useState<number[]>([]);
  const [picks, setPicks] = useState<number[][]>(() =>
    level.bugs.map(() => []),
  );
  // The bug whose fixes are showing.
  const [open, setOpen] = useState<number | null>(null);
  const [miss, setMiss] = useState<{ line: number; at: number } | null>(null);
  const [wrongFix, setWrongFix] = useState<number | null>(null);
  const [lastFixed, setLastFixed] = useState<number | null>(null);
  const finish = api.game.finishBug.useMutation({
    onSuccess: () => {
      void utils.game.hub.invalidate();
      router.refresh();
    },
  });

  const isFixed = (b: number) => picks[b]!.at(-1) === 0;
  const fixedCount = level.bugs.filter((_, b) => isFixed(b)).length;
  const done = fixedCount === level.bugs.length;
  const mistakes =
    taps.filter((t) => !level.bugs.some((b) => b.line === t)).length +
    picks.reduce((sum, p) => sum + p.filter((x) => x !== 0).length, 0);

  const lines = useMemo(
    () =>
      level.code.map((text, i) => {
        const b = level.bugs.findIndex((bug) => bug.line === i);
        return b >= 0 && picks[b]!.at(-1) === 0
          ? level.bugs[b]!.fixes[0]
          : text;
      }),
    [level, picks],
  );

  useEffect(() => {
    if (done && ready && !finish.data && !finish.isPending && !finish.error) {
      finish.mutate({ levelId: level.id, taps, picks });
    }
  }, [done, ready, finish, level.id, taps, picks]);

  useEffect(() => {
    if (finish.data && finish.data.stars > 0) sfx.fanfare();
  }, [finish.data]);

  const tap = (i: number) => {
    unlock();
    if (done) return;
    const b = level.bugs.findIndex((bug) => bug.line === i);
    if (b >= 0 && isFixed(b)) return;
    setTaps((t) => [...t, i]);
    if (b < 0) {
      sfx.hurt();
      setMiss({ line: i, at: Date.now() });
      setOpen(null);
      return;
    }
    sfx.select();
    setWrongFix(null);
    setOpen(b);
  };

  const pick = (b: number, k: number) => {
    setPicks((p) => p.map((x, i) => (i === b ? [...x, k] : x)));
    if (k === 0) {
      sfx.coin();
      setOpen(null);
      setLastFixed(b);
      setWrongFix(null);
    } else {
      sfx.hurt();
      setWrongFix(k);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <LevelHeader
        game="Bug Hunt"
        unit={level.unit}
        unitTitle={level.unitTitle}
        title={level.title}
        number={number}
        count={count}
        best={best}
      >
        <SoundToggle tone="light" />
      </LevelHeader>

      <Card className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
        <p className="text-ink text-sm">
          <span className="mr-1">🕵️</span>
          {level.story}{" "}
          <span className="text-muted">
            Tap the line with a bug, then pick the right fix.
          </span>
        </p>
        <div className="flex items-center gap-4 text-sm font-black">
          <span className="flex items-center gap-1">
            {level.bugs.map((_, b) => (
              <span
                key={b}
                className={`text-xl transition ${isFixed(b) ? "scale-75 opacity-30 grayscale" : "bug-wiggle"}`}
                style={{ animationDelay: `${b * 0.2}s` }}
              >
                🐞
              </span>
            ))}
          </span>
          <span className={mistakes ? "text-rose-600" : "text-muted"}>
            {mistakes} mistake{mistakes === 1 ? "" : "s"}
          </span>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr]">
        <Card className="overflow-hidden">
          <div className="flex items-center gap-1.5 bg-slate-800 px-4 py-2">
            <span className="size-2.5 rounded-full bg-rose-400" />
            <span className="size-2.5 rounded-full bg-amber-400" />
            <span className="size-2.5 rounded-full bg-emerald-400" />
            <span className="ml-2 font-mono text-xs text-slate-400">
              index.html
            </span>
          </div>
          <div className="overflow-x-auto bg-slate-900 py-2 font-mono text-[13px] leading-relaxed">
            {lines.map((text, i) => {
              const b = level.bugs.findIndex((bug) => bug.line === i);
              const fixed = b >= 0 && isFixed(b);
              const missed = miss?.line === i;
              return (
                <div key={i}>
                  <button
                    type="button"
                    onClick={() => tap(i)}
                    disabled={done}
                    className={`flex w-full min-w-max items-start text-left transition ${
                      fixed
                        ? "bg-emerald-500/20"
                        : open === b && b >= 0
                          ? "bg-amber-400/25"
                          : "hover:bg-white/10"
                    } ${missed ? "line-miss" : ""} ${fixed && lastFixed === b ? "line-fixed" : ""}`}
                    key={missed ? miss.at : undefined}
                  >
                    <span className="w-10 shrink-0 pr-3 text-right text-slate-500 select-none">
                      {i + 1}
                    </span>
                    <span
                      className={`pr-4 whitespace-pre ${fixed ? "text-emerald-300" : "text-slate-100"}`}
                    >
                      {text || " "}
                    </span>
                    {fixed && <span className="pr-3 text-emerald-300">✓</span>}
                  </button>
                  {open === b && b >= 0 && (
                    <FixPicker
                      levelId={level.id}
                      bug={b}
                      fixes={level.bugs[b]!.fixes}
                      wrong={wrongFix}
                      onPick={(k) => pick(b, k)}
                      onClose={() => setOpen(null)}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="overflow-hidden">
            <div className="border-line text-muted flex items-center justify-between border-b px-4 py-2 text-xs font-bold tracking-wide uppercase">
              <span>Live preview</span>
              <span>
                {fixedCount}/{level.bugs.length} fixed
              </span>
            </div>
            <iframe
              title="Preview"
              sandbox="allow-scripts"
              srcDoc={pageOf(lines)}
              className="h-64 w-full bg-white lg:h-80"
            />
          </Card>

          {lastFixed !== null && !done && (
            <Card className="pop-why border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              <p className="font-black">🐞 Bug squashed!</p>
              <p className="mt-0.5">{level.bugs[lastFixed]!.why}</p>
            </Card>
          )}
        </div>
      </div>

      {done && (
        <Card className="px-4 py-4">
          {!finish.data ? (
            <p className="text-muted text-center text-sm">
              {finish.error ? finish.error.message : "Checking your fixes…"}
            </p>
          ) : (
            <LevelResult
              heading={
                finish.data.mistakes === 0
                  ? "🏆 Flawless debugging!"
                  : "🐞 All bugs fixed!"
              }
              stars={finish.data.stars}
              newStars={finish.data.newStars}
              best={finish.data.best}
              failNote=""
              stats={[
                { label: "Bugs fixed", value: String(level.bugs.length) },
                { label: "Mistakes", value: String(finish.data.mistakes) },
              ]}
              nextHref={nextId ? `/student/games/bug/${nextId}` : null}
              onRetry={onRetry}
            >
              <div className="mx-auto mt-4 max-w-xl space-y-2 text-left">
                {level.bugs.map((bug, b) => (
                  <p
                    key={b}
                    className="border-line bg-surface rounded-xl border px-3 py-2 text-xs"
                  >
                    <span className="text-ink font-bold">
                      Line {bug.line + 1}:
                    </span>{" "}
                    <span className="text-muted">{bug.why}</span>
                  </p>
                ))}
              </div>
              <p className="text-muted mt-3 text-xs">
                3 stars for no mistakes · 2 stars for 1–2 mistakes · 1 star for
                more.
              </p>
            </LevelResult>
          )}
        </Card>
      )}

      <style>{`
        .bug-wiggle { display: inline-block; animation: bug-wiggle 1.2s ease-in-out infinite; }
        @keyframes bug-wiggle { 0%,100% { transform: rotate(-8deg) } 50% { transform: rotate(8deg) translateY(-1px) } }
        .line-miss { animation: line-miss .45s ease-in-out; background: rgba(244,63,94,.3) !important; }
        @keyframes line-miss { 0%,100% { transform: translateX(0) } 20% { transform: translateX(-6px) } 40% { transform: translateX(6px) } 60% { transform: translateX(-4px) } 80% { transform: translateX(4px) } }
        .line-fixed { animation: line-fixed .8s ease-out; }
        @keyframes line-fixed { from { background: rgba(16,185,129,.7) } }
        .pop-why { animation: pop-why .35s cubic-bezier(.2,1.4,.4,1) both; }
        @keyframes pop-why { from { transform: translateY(8px) scale(.96); opacity: 0 } }
        .fix-shake { animation: line-miss .4s ease-in-out; }
        @media (prefers-reduced-motion: reduce) { .bug-wiggle, .line-miss, .line-fixed, .pop-why, .fix-shake { animation: none } }
      `}</style>
    </div>
  );
}

/** The three possible fixes for a bug, under its line. */
function FixPicker({
  levelId,
  bug,
  fixes,
  wrong,
  onPick,
  onClose,
}: {
  levelId: string;
  bug: number;
  fixes: readonly string[];
  wrong: number | null;
  onPick: (k: number) => void;
  onClose: () => void;
}) {
  const order = fixedOrder(`${levelId}:${bug}`, fixes.length);
  return (
    <div className="mx-2 my-1.5 rounded-xl border border-amber-300/60 bg-slate-800 p-2 font-sans">
      <div className="mb-1.5 flex items-center justify-between px-1">
        <p className="text-xs font-black tracking-wide text-amber-300 uppercase">
          🔧 Pick the fix
        </p>
        <button
          type="button"
          onClick={onClose}
          className="text-xs font-bold text-slate-400 hover:text-white"
        >
          Close
        </button>
      </div>
      <div className="space-y-1.5">
        {order.map((k) => (
          <button
            key={`${k}-${wrong === k ? "x" : ""}`}
            type="button"
            onClick={() => onPick(k)}
            disabled={wrong === k}
            className={`block w-full overflow-x-auto rounded-lg px-3 py-2 text-left font-mono text-[13px] whitespace-pre transition ${
              wrong === k
                ? "fix-shake bg-rose-500/30 text-rose-200 line-through"
                : "bg-slate-700 text-slate-100 hover:bg-indigo-500"
            }`}
          >
            {fixes[k]!.trim()}
          </button>
        ))}
      </div>
    </div>
  );
}
