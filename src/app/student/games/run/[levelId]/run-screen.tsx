"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { SoundToggle } from "~/app/_components/race/race-view";
import { sfx, unlock } from "~/app/_components/sfx";
import { Card } from "~/app/_components/ui";
import { type RunLevel } from "~/lib/games/block-run";
import { GAMES, type RUN_GAMES } from "~/lib/games/catalog";
import { api } from "~/trpc/react";
import {
  fixedOrder,
  LevelHeader,
  LevelResult,
  LockedLevel,
} from "../../_components/shared";
import { type Controls, type World } from "./world";

type RunGame = (typeof RUN_GAMES)[number];

/**
 * One Block Run level, for any subject: run the course, and at every gate
 * land on the platform with the right answer to the question. Wrong
 * platforms crumble and count as mistakes; the server scores the picks.
 */
export function RunScreen({
  game,
  levelId,
}: {
  game: RunGame;
  levelId: string;
}) {
  const level = GAMES[game].levels.find((l) => l.id === levelId)!;
  const access = api.game.level.useQuery({ game, levelId }, { retry: false });
  const [attempt, setAttempt] = useState(0);

  if (access.error) {
    return <LockedLevel what="Level" message={access.error.message} />;
  }
  return (
    <Run
      key={attempt}
      game={game}
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

function Run({
  game,
  level,
  best,
  number,
  count,
  nextId,
  ready,
  onRetry,
}: {
  game: RunGame;
  level: RunLevel;
  best: number;
  number?: number;
  count?: number;
  nextId: string | null;
  ready: boolean;
  onRetry: () => void;
}) {
  const router = useRouter();
  const utils = api.useUtils();
  const canvas = useRef<HTMLCanvasElement>(null);
  const world = useRef<World | null>(null);
  // Per gate, every answer platform landed on (0 = right).
  const picks = useRef<number[][]>(level.gates.map(() => []));
  const [gate, setGate] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [toast, setToast] = useState<{
    text: string;
    good: boolean;
    at: number;
  } | null>(null);
  const [done, setDone] = useState(false);
  const [failed, setFailed] = useState(false);
  const finish = api.game.finishRun.useMutation({
    onSuccess: () => {
      void utils.game.hub.invalidate();
      router.refresh();
    },
  });

  // Build the world once; the callbacks read the latest state via refs.
  const gateRef = useRef(0);
  useEffect(() => {
    let disposed = false;
    void import("three")
      .then(async (T) => {
        const { createWorld } = await import("./world");
        if (disposed || !canvas.current) return;
        const gates = level.gates.map((g) => ({
          labels: fixedOrder(g.id, 3).map((choice) => ({
            text: g.choices[choice]!,
            choice,
          })),
        }));
        world.current = createWorld(T, canvas.current, gates, {
          onAnswer: (g, choice) => {
            if (g !== gateRef.current) return;
            picks.current[g]!.push(choice);
            if (choice === 0) {
              sfx.coin();
              world.current?.markRight(g, choice);
              world.current?.openGate(g);
              gateRef.current = g + 1;
              setGate(g + 1);
              setToast({
                text: `✓ ${level.gates[g]!.choices[0]}!`,
                good: true,
                at: Date.now(),
              });
            } else {
              sfx.hurt();
              world.current?.crumble(g, choice);
              setMistakes((n) => n + 1);
              setToast({
                text: "✗ Not that one — try again!",
                good: false,
                at: Date.now(),
              });
            }
          },
          onCheckpoint: () => sfx.select(),
          onFall: () => sfx.hurt(),
          onFinish: () => setDone(true),
        });
        // Lets the browser tests reach any platform (development only).
        if (process.env.NODE_ENV === "development") {
          Object.assign(window, { blockRun: world.current });
        }
      })
      .catch(() => setFailed(true));
    return () => {
      disposed = true;
      world.current?.dispose();
      world.current = null;
    };
  }, [level]);

  // Keyboard: arrows or WASD to move, Space to jump.
  useEffect(() => {
    const keys: Record<string, keyof Controls> = {
      ArrowLeft: "left",
      a: "left",
      ArrowRight: "right",
      d: "right",
      ArrowUp: "up",
      w: "up",
      ArrowDown: "down",
      s: "down",
      " ": "jump",
    };
    const set = (e: KeyboardEvent, on: boolean) => {
      const k = keys[e.key.length === 1 ? e.key.toLowerCase() : e.key];
      if (!k) return;
      e.preventDefault();
      if (on) unlock();
      world.current?.setControls({ [k]: on });
    };
    const down = (e: KeyboardEvent) => set(e, true);
    const up = (e: KeyboardEvent) => set(e, false);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useEffect(() => {
    if (done && ready && !finish.data && !finish.isPending && !finish.error) {
      finish.mutate({ game, levelId: level.id, picks: picks.current });
    }
  }, [done, ready, finish, game, level.id]);

  useEffect(() => {
    if (finish.data && finish.data.stars > 0) sfx.fanfare();
  }, [finish.data]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 1800);
    return () => clearTimeout(t);
  }, [toast]);

  const current = level.gates[gate];

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <LevelHeader
        game={`${GAMES[game].title} · ${GAMES[game].course}`}
        unit={level.unit}
        unitTitle={level.unitTitle}
        title={level.title}
        number={number}
        count={count}
        best={best}
      >
        <SoundToggle tone="light" />
      </LevelHeader>

      {!done && (
        <Card className="relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 z-10 p-2 sm:p-3">
            <div className="mx-auto max-w-2xl rounded-2xl bg-slate-900/80 px-4 py-2.5 text-center text-white shadow-lg backdrop-blur">
              {current ? (
                <>
                  <p className="text-[11px] font-black tracking-wide text-amber-300 uppercase">
                    Gate {gate + 1} of {level.gates.length} · land on the right
                    answer
                  </p>
                  <p className="text-sm font-extrabold sm:text-lg">
                    {current.question}
                  </p>
                </>
              ) : (
                <p className="text-sm font-extrabold sm:text-lg">
                  🏆 All gates cleared! Run to the trophy!
                </p>
              )}
              <p className="mt-0.5 text-[11px] text-white/70">
                {mistakes} mistake{mistakes === 1 ? "" : "s"}
              </p>
            </div>
          </div>

          {toast && (
            <p
              key={toast.at}
              className={`run-toast absolute top-28 left-1/2 z-10 -translate-x-1/2 rounded-xl px-4 py-2 text-sm font-black text-white shadow-lg sm:top-32 ${toast.good ? "bg-emerald-500" : "bg-rose-500"}`}
            >
              {toast.text}
            </p>
          )}

          {failed ? (
            <p className="text-muted px-4 py-24 text-center text-sm">
              This device couldn&apos;t start the 3D game. Try another browser,
              or a computer.
            </p>
          ) : (
            <canvas
              ref={canvas}
              className="block h-[62vh] max-h-[640px] min-h-[380px] w-full touch-none bg-sky-300"
            />
          )}

          <TouchPad onChange={(c) => world.current?.setControls(c)} />
          <p className="text-muted hidden px-4 py-2 text-center text-xs sm:block">
            Move with the arrow keys or WASD · Space to jump · Fall off and you
            go back to the last gate.
          </p>
        </Card>
      )}

      {done && (
        <Card className="px-4 py-4">
          {!finish.data ? (
            <p className="text-muted text-center text-sm">
              {finish.error ? finish.error.message : "Checking your run…"}
            </p>
          ) : (
            <LevelResult
              heading={
                finish.data.mistakes === 0
                  ? "🏆 Flawless run!"
                  : "🧱 Course cleared!"
              }
              stars={finish.data.stars}
              newStars={finish.data.newStars}
              best={finish.data.best}
              failNote=""
              stats={[
                { label: "Gates", value: String(level.gates.length) },
                { label: "Mistakes", value: String(finish.data.mistakes) },
              ]}
              nextHref={nextId ? `/student/games/run/${nextId}` : null}
              onRetry={onRetry}
            >
              <div className="mx-auto mt-4 grid max-w-xl gap-2 text-left sm:grid-cols-2">
                {level.gates.map((g) => (
                  <p
                    key={g.id}
                    className="border-line bg-surface rounded-xl border px-3 py-2 text-xs"
                  >
                    <span className="text-ink font-black">{g.choices[0]}</span>{" "}
                    <span className="text-muted">— {g.question}</span>
                  </p>
                ))}
              </div>
              <p className="text-muted mt-3 text-xs">
                3 stars for no mistakes · 2 stars for 1–2 · 1 star for more.
              </p>
            </LevelResult>
          )}
        </Card>
      )}

      <style>{`
        .run-toast { animation: run-toast .3s cubic-bezier(.2,1.4,.4,1) both; }
        @keyframes run-toast { from { transform: translate(-50%, 8px) scale(.9); opacity: 0 } }
        @media (prefers-reduced-motion: reduce) { .run-toast { animation: none } }
      `}</style>
    </div>
  );
}

/** On-screen arrows and a jump button for phones and tablets. */
function TouchPad({ onChange }: { onChange: (c: Partial<Controls>) => void }) {
  const hold = (key: keyof Controls) => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault();
      unlock();
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      onChange({ [key]: true });
    },
    onPointerUp: () => onChange({ [key]: false }),
    onPointerCancel: () => onChange({ [key]: false }),
    onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
  });
  const btn =
    "flex size-14 items-center justify-center rounded-2xl bg-white/85 text-2xl font-black text-slate-800 shadow-lg select-none active:bg-amber-300";
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-3 z-10 hidden items-end justify-between px-3 pointer-coarse:flex">
      <div className="pointer-events-auto grid grid-cols-3 gap-1.5">
        <span />
        <button
          type="button"
          aria-label="Forward"
          className={btn}
          {...hold("up")}
        >
          {"▲︎"}
        </button>
        <span />
        <button
          type="button"
          aria-label="Left"
          className={btn}
          {...hold("left")}
        >
          {"◀︎"}
        </button>
        <button
          type="button"
          aria-label="Back"
          className={btn}
          {...hold("down")}
        >
          {"▼︎"}
        </button>
        <button
          type="button"
          aria-label="Right"
          className={btn}
          {...hold("right")}
        >
          {"▶︎"}
        </button>
      </div>
      <button
        type="button"
        aria-label="Jump"
        className="pointer-events-auto flex size-20 items-center justify-center rounded-full bg-amber-400 text-sm font-black text-slate-900 shadow-lg select-none active:bg-amber-300"
        {...hold("jump")}
      >
        JUMP
      </button>
    </div>
  );
}
