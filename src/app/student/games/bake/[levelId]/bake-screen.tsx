"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { SoundToggle } from "~/app/_components/race/race-view";
import { sfx, unlock } from "~/app/_components/sfx";
import { Card } from "~/app/_components/ui";
import { BAKE_LEVELS, BAKE_STARS, type BakeLevel } from "~/lib/games/bake-shop";
import { api } from "~/trpc/react";
import {
  LevelHeader,
  LevelResult,
  LockedLevel,
  shuffled,
} from "../../_components/shared";

/** One Bake Shop level: three recipes, each put back in order. */
export function BakeScreen({ levelId }: { levelId: string }) {
  const level = BAKE_LEVELS.find((l) => l.id === levelId)!;
  const access = api.game.level.useQuery(
    { game: "bake", levelId },
    { retry: false },
  );
  const [attempt, setAttempt] = useState(0);

  if (access.error) {
    return <LockedLevel what="Level" message={access.error.message} />;
  }
  return (
    <Shop
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

function Shop({
  level,
  best,
  number,
  count,
  nextId,
  ready,
  onRetry,
}: {
  level: BakeLevel;
  best: number;
  number?: number;
  count?: number;
  nextId: string | null;
  ready: boolean;
  onRetry: () => void;
}) {
  const router = useRouter();
  const utils = api.useUtils();
  const [phase, setPhase] = useState<"intro" | "play" | "done">("intro");
  const [index, setIndex] = useState(0);
  const [cards, setCards] = useState<string[]>([]);
  const [taps, setTaps] = useState<string[]>([]);
  const [played, setPlayed] = useState<{ id: string; taps: string[] }[]>([]);
  const [shake, setShake] = useState<string | null>(null);
  const finish = api.game.finishBake.useMutation({
    onSuccess: () => {
      void utils.game.hub.invalidate();
      router.refresh();
    },
  });

  const recipe = level.recipes[index];
  const placed = recipe
    ? recipe.steps.filter((step) => taps.includes(step))
    : [];
  const mistakes =
    played.reduce(
      (n, r, i) => n + r.taps.length - level.recipes[i]!.steps.length,
      0,
    ) +
    (taps.length - placed.length);

  const tap = (step: string) => {
    if (!recipe) return;
    const next = [...taps, step];
    if (step !== recipe.steps[placed.length]) {
      setTaps(next);
      setShake(step);
      setTimeout(() => setShake(null), 450);
      sfx.hurt();
      return;
    }
    sfx.coin();
    if (placed.length + 1 < recipe.steps.length) {
      setTaps(next);
      return;
    }
    setPlayed((p) => [...p, { id: recipe.id, taps: next }]);
    setTaps([]);
    if (index + 1 >= level.recipes.length) setPhase("done");
    else {
      setCards(shuffled(level.recipes[index + 1]!.steps));
      setIndex((i) => i + 1);
    }
  };

  useEffect(() => {
    if (
      phase === "done" &&
      ready &&
      !finish.data &&
      !finish.isPending &&
      !finish.error
    ) {
      finish.mutate({ levelId: level.id, recipes: played });
    }
  }, [phase, ready, finish, level.id, played]);

  useEffect(() => {
    if (finish.data) sfx.fanfare();
  }, [finish.data]);

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <LevelHeader
        game="Bake Shop"
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
          <div className="bg-gradient-to-br from-amber-400 via-orange-400 to-pink-500 px-6 py-8 text-center text-white">
            <p className="text-5xl">🧑‍🍳</p>
            <h2 className="mt-2 text-3xl font-black">{level.title}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-white/95">
              The recipe cards got mixed up! Tap each step in the right order to
              bake {level.recipes.length} recipes. A wrong step is a mistake.
            </p>
            <div className="mt-4 flex justify-center gap-4 text-xs font-bold text-white/95">
              <span>⭐⭐⭐ {BAKE_STARS[0]} mistake or less</span>
              <span>⭐⭐ up to {BAKE_STARS[1]}</span>
              <span>⭐ finished</span>
            </div>
            <button
              type="button"
              onPointerDown={unlock}
              onClick={() => {
                unlock();
                sfx.select();
                setCards(shuffled(level.recipes[0]!.steps));
                setPhase("play");
              }}
              className="mt-6 rounded-2xl bg-white px-10 py-3 text-xl font-black text-slate-900 shadow-lg hover:bg-amber-100"
            >
              START BAKING
            </button>
          </div>
        </Card>
      )}

      {phase === "play" && recipe && (
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between bg-amber-900 px-5 py-2.5 text-sm font-black text-white">
            <span>
              Recipe {index + 1}/{level.recipes.length}
            </span>
            <span className="text-amber-200">Mistakes: {mistakes}</span>
          </div>
          <div className="p-5 max-sm:p-3">
            <p className="text-ink text-2xl font-black">
              {recipe.emoji} {recipe.name}
            </p>
            <ol className="mt-3 space-y-1.5">
              {recipe.steps.map((step, i) => (
                <li
                  key={step}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm ${
                    i < placed.length
                      ? "border-emerald-300 bg-emerald-50 font-bold text-emerald-800"
                      : i === placed.length
                        ? "border-amber-400 bg-amber-50 text-amber-700"
                        : "border-line text-muted"
                  }`}
                >
                  <span className="font-black">{i + 1}.</span>
                  {i < placed.length
                    ? step
                    : i === placed.length
                      ? "What comes next?"
                      : "…"}
                </li>
              ))}
            </ol>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {cards
                .filter((step) => !placed.includes(step))
                .map((step) => (
                  <button
                    key={step}
                    type="button"
                    onClick={() => tap(step)}
                    className={`rounded-xl border-2 px-3 py-2.5 text-left text-sm font-bold transition ${
                      shake === step
                        ? "border-rose-500 bg-rose-50 text-rose-700"
                        : "border-line text-ink hover:border-amber-400 hover:bg-amber-50"
                    }`}
                  >
                    {step}
                  </button>
                ))}
            </div>
          </div>
        </Card>
      )}

      {phase === "done" && (
        <Card className="px-4 py-4">
          {!finish.data ? (
            <p className="text-muted text-center text-sm">
              {finish.error ? finish.error.message : "Checking your recipes…"}
            </p>
          ) : (
            <LevelResult
              heading={
                finish.data.stars === 3
                  ? "🧑‍🍳 Master baker!"
                  : "🍞 Fresh from the oven!"
              }
              stars={finish.data.stars}
              newStars={finish.data.newStars}
              best={finish.data.best}
              failNote=""
              stats={[
                { label: "Recipes", value: String(finish.data.recipes) },
                { label: "Mistakes", value: String(finish.data.mistakes) },
              ]}
              nextHref={nextId ? `/student/games/bake/${nextId}` : null}
              onRetry={onRetry}
            />
          )}
        </Card>
      )}
    </div>
  );
}
