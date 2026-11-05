"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { SoundToggle } from "~/app/_components/race/race-view";
import { sfx, unlock } from "~/app/_components/sfx";
import { Card } from "~/app/_components/ui";
import { GAMES, type TURBO_GAMES } from "~/lib/games/catalog";
import { api } from "~/trpc/react";
import {
  LevelHeader,
  LevelResult,
  LockedLevel,
  shuffled,
} from "../../_components/shared";

type TurboGame = (typeof TURBO_GAMES)[number];

/** Speed gained per tap, the most you can hold, and the loss per second. */
const TAP_SPEED = 7;
const MAX_SPEED = 100;
const DRAG = 18;
/** Percent of a stretch covered per second at full speed. */
const PACE = 45;

/** One Turbo Takbo level: tap to run, answer to open each gate. */
export function TurboScreen({
  game,
  levelId,
}: {
  game: TurboGame;
  levelId: string;
}) {
  const access = api.game.level.useQuery({ game, levelId }, { retry: false });
  const [attempt, setAttempt] = useState(0);

  if (access.error) {
    return <LockedLevel what="Level" message={access.error.message} />;
  }
  return (
    <Run
      key={attempt}
      game={game}
      levelId={levelId}
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
  levelId,
  best,
  number,
  count,
  nextId,
  ready,
  onRetry,
}: {
  game: TurboGame;
  levelId: string;
  best: number;
  number?: number;
  count?: number;
  nextId: string | null;
  ready: boolean;
  onRetry: () => void;
}) {
  const router = useRouter();
  const utils = api.useUtils();
  const level = GAMES[game].levels.find((l) => l.id === levelId)!;
  const [phase, setPhase] = useState<"intro" | "run" | "gate" | "done">(
    "intro",
  );
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [gates, setGates] = useState<{ id: string; guesses: string[] }[]>([]);
  const [wrong, setWrong] = useState<string[]>([]);
  const speedRef = useRef(0);
  const finish = api.game.finishTurbo.useMutation({
    onSuccess: () => {
      void utils.game.hub.invalidate();
      router.refresh();
    },
  });

  const word = level.words[index];
  const choices = useMemo(() => {
    if (!word) return [];
    const others = shuffled(level.words.filter((w) => w.id !== word.id));
    return shuffled([word, ...others.slice(0, 3)].map((w) => w.word));
  }, [word, level.words]);

  // The run loop: speed drains, and speed moves the runner to the gate.
  useEffect(() => {
    if (phase !== "run") return;
    let frame = 0;
    let last = performance.now();
    const step = (now: number) => {
      const seconds = (now - last) / 1000;
      last = now;
      speedRef.current = Math.max(0, speedRef.current - DRAG * seconds);
      setSpeed(speedRef.current);
      setProgress((p) => {
        const next = p + (speedRef.current / MAX_SPEED) * PACE * seconds;
        if (next >= 100) {
          setPhase("gate");
          return 100;
        }
        return next;
      });
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [phase]);

  useEffect(() => {
    if (
      phase === "done" &&
      ready &&
      !finish.data &&
      !finish.isPending &&
      !finish.error
    ) {
      finish.mutate({ game, levelId, gates });
    }
  }, [phase, ready, finish, game, levelId, gates]);

  useEffect(() => {
    if (finish.data) sfx.fanfare();
  }, [finish.data]);

  const tap = () => {
    unlock();
    speedRef.current = Math.min(MAX_SPEED, speedRef.current + TAP_SPEED);
    setSpeed(speedRef.current);
  };

  const guess = (choice: string) => {
    if (!word || wrong.includes(choice)) return;
    if (choice !== word.word) {
      setWrong((w) => [...w, choice]);
      speedRef.current = 0;
      setSpeed(0);
      sfx.hurt();
      return;
    }
    sfx.coin();
    setGates((g) => [...g, { id: word.id, guesses: [...wrong, choice] }]);
    setWrong([]);
    setProgress(0);
    if (index + 1 >= level.words.length) setPhase("done");
    else {
      setIndex((i) => i + 1);
      setPhase("run");
    }
  };

  const mistakes = gates.reduce((n, g) => n + g.guesses.length - 1, 0);

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <LevelHeader
        game="Turbo Takbo"
        unit={level.unit}
        unitTitle={level.unitTitle}
        title={level.title}
        number={number}
        count={count}
        best={best}
      >
        <SoundToggle tone="light" />
      </LevelHeader>

      {phase === "intro" && (
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-rose-600 px-6 py-8 text-center text-white">
            <p className="text-5xl">💨</p>
            <h2 className="mt-2 text-3xl font-black">{level.title}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-white/90">
              Tap TAP! as fast as you can to build speed. {level.words.length}{" "}
              gates block the track, and each one opens only for the right
              answer. A wrong answer drops your speed to zero.
            </p>
            <div className="mt-4 flex justify-center gap-4 text-xs font-bold text-white/90">
              <span>⭐⭐⭐ no mistakes</span>
              <span>⭐⭐ 1–2</span>
              <span>⭐ 3 or more</span>
            </div>
            <button
              type="button"
              onPointerDown={unlock}
              onClick={() => {
                sfx.select();
                setPhase("run");
              }}
              className="mt-6 rounded-2xl bg-white px-10 py-3 text-xl font-black text-slate-900 shadow-lg hover:bg-amber-100"
            >
              GO!
            </button>
          </div>
        </Card>
      )}

      {(phase === "run" || phase === "gate") && word && (
        <Card className="overflow-hidden">
          <div className="flex justify-between bg-slate-800 px-5 py-2.5 text-sm font-black text-white">
            <span>
              🚧 Gate {index + 1}/{level.words.length}
            </span>
            <span className="text-amber-300">💨 {Math.round(speed)} km/h</span>
          </div>
          <div className="relative h-40 overflow-hidden bg-gradient-to-b from-sky-300 to-sky-100">
            <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-b from-lime-500 to-emerald-700" />
            <span
              className="absolute bottom-8 text-5xl"
              style={{
                left: `${Math.min(progress, 100) * 0.82}%`,
                transform: "scaleX(-1)",
              }}
              aria-hidden="true"
            >
              🏃
            </span>
            <span
              className="absolute right-3 bottom-8 text-5xl"
              aria-hidden="true"
            >
              🚧
            </span>
          </div>
          {phase === "run" ? (
            <div className="p-4">
              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-rose-500"
                  style={{ width: `${speed}%` }}
                />
              </div>
              <button
                type="button"
                onPointerDown={tap}
                className="mt-3 w-full touch-manipulation rounded-2xl bg-orange-500 py-8 text-4xl font-black text-white select-none active:scale-95 active:bg-orange-600"
              >
                TAP!
              </button>
            </div>
          ) : (
            <div className="p-4">
              <p className="text-ink text-center text-lg font-black">
                {word.clue}
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {choices.map((choice) => (
                  <button
                    key={choice}
                    type="button"
                    disabled={wrong.includes(choice)}
                    onClick={() => guess(choice)}
                    className={`rounded-xl border-2 px-3 py-3 font-black break-words ${
                      wrong.includes(choice)
                        ? "border-rose-300 bg-rose-50 text-rose-400 line-through"
                        : "border-line text-ink hover:border-orange-400 hover:bg-orange-50"
                    }`}
                  >
                    {choice}
                  </button>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

      {phase === "done" && (
        <Card className="px-4 py-4">
          {!finish.data ? (
            <p className="text-muted text-center text-sm">
              {finish.error ? finish.error.message : "Checking your run…"}
            </p>
          ) : (
            <LevelResult
              heading={
                finish.data.stars === 3 ? "💨 Perfect run!" : "💨 Finish line!"
              }
              stars={finish.data.stars}
              newStars={finish.data.newStars}
              best={finish.data.best}
              failNote=""
              stats={[
                { label: "Gates", value: String(finish.data.gates) },
                { label: "Mistakes", value: String(mistakes) },
              ]}
              nextHref={nextId ? `/student/games/turbo/${nextId}` : null}
              onRetry={onRetry}
            />
          )}
        </Card>
      )}
    </div>
  );
}
