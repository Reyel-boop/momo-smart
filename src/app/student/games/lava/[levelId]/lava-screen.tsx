"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { SoundToggle } from "~/app/_components/race/race-view";
import { sfx, unlock } from "~/app/_components/sfx";
import { Card } from "~/app/_components/ui";
import { LAVA_LEVELS, LAVA_MISSES, LAVA_SECONDS } from "~/lib/games/lava-climb";
import {
  MATH_PROBLEMS,
  MATH_STARS,
  mathProblem,
  type MathLevel,
} from "~/lib/games/number-rush";
import { api } from "~/trpc/react";
import {
  LevelHeader,
  LevelResult,
  LockedLevel,
} from "../../_components/shared";

/**
 * One Lava Climb level: twelve problems on a rising tower. A right answer
 * climbs a floor and a miss lets the lava rise; five misses end the round.
 */
export function LavaScreen({ levelId }: { levelId: string }) {
  const level = LAVA_LEVELS.find((l) => l.id === levelId)!;
  const access = api.game.level.useQuery(
    { game: "lava", levelId },
    { retry: false },
  );
  const [attempt, setAttempt] = useState(0);

  if (access.error) {
    return <LockedLevel what="Level" message={access.error.message} />;
  }
  return (
    <Climb
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

function Climb({
  level,
  best,
  number,
  count,
  nextId,
  ready,
  onRetry,
}: {
  level: MathLevel;
  best: number;
  number?: number;
  count?: number;
  nextId: string | null;
  ready: boolean;
  onRetry: () => void;
}) {
  const router = useRouter();
  const utils = api.useUtils();
  const [seeds] = useState(() => {
    const out = new Set<number>();
    while (out.size < MATH_PROBLEMS) out.add(Math.floor(Math.random() * 1e9));
    return [...out];
  });
  const [phase, setPhase] = useState<"intro" | "play" | "done">("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<{ seed: number; choice: string }[]>(
    [],
  );
  const [feedback, setFeedback] = useState<{
    choice: string;
    right: boolean;
  } | null>(null);
  const resolved = useRef(-1);
  const finish = api.game.finishMath.useMutation({
    onSuccess: () => {
      void utils.game.hub.invalidate();
      router.refresh();
    },
  });

  const problems = useMemo(
    () => seeds.map((seed) => mathProblem(level, seed)),
    [seeds, level],
  );
  const problem = problems[index];
  const right = answers.filter(
    (a, i) => problems[i]!.answer === a.choice,
  ).length;
  const misses = answers.length - right;

  const resolve = (choice: string) => {
    if (!problem || resolved.current === index || feedback) return;
    resolved.current = index;
    const ok = choice === problem.answer;
    setAnswers((a) => [...a, { seed: seeds[index]!, choice }]);
    setFeedback({ choice, right: ok });
    if (ok) sfx.coin();
    else sfx.hurt();
  };

  useEffect(() => {
    if (phase !== "play" || feedback) return;
    const t = setTimeout(() => resolve(""), LAVA_SECONDS * 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, index, feedback]);

  useEffect(() => {
    if (!feedback) return;
    const t = setTimeout(
      () => {
        setFeedback(null);
        if (misses >= LAVA_MISSES) {
          // Caught: the problems left count as unanswered.
          setAnswers((a) => [
            ...a,
            ...seeds.slice(a.length).map((seed) => ({ seed, choice: "" })),
          ]);
          setPhase("done");
        } else if (index + 1 >= MATH_PROBLEMS) setPhase("done");
        else setIndex((i) => i + 1);
      },
      feedback.right ? 800 : 2000,
    );
    return () => clearTimeout(t);
  }, [feedback, index, misses, seeds]);

  useEffect(() => {
    if (
      phase === "done" &&
      ready &&
      !finish.data &&
      !finish.isPending &&
      !finish.error
    ) {
      finish.mutate({ game: "lava", levelId: level.id, answers });
    }
  }, [phase, ready, finish, level.id, answers]);

  useEffect(() => {
    if (finish.data && finish.data.stars > 0) sfx.fanfare();
  }, [finish.data]);

  const climbed = (right / MATH_PROBLEMS) * 78;
  const lava = 6 + (misses / LAVA_MISSES) * (climbed + 10);

  return (
    <div className="mx-auto max-w-3xl space-y-4 max-sm:space-y-3">
      <LevelHeader
        game="Lava Climb"
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
          <div className="bg-gradient-to-br from-amber-500 via-orange-600 to-red-700 px-6 py-8 text-center text-white">
            <p className="text-5xl">🌋</p>
            <p className="mt-2 text-xs font-black tracking-[0.25em] text-amber-200 uppercase">
              {MATH_PROBLEMS} floors
            </p>
            <h2 className="text-3xl font-black">{level.topic}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-white/85">
              Solve each problem to climb a floor. Every miss lets the lava
              rise, and {LAVA_MISSES} misses end the climb. You have{" "}
              {LAVA_SECONDS} seconds per floor.
            </p>
            <div className="mt-4 flex justify-center gap-4 text-xs font-bold text-white/85">
              <span>⭐ {MATH_STARS[0]} right</span>
              <span>⭐⭐ {MATH_STARS[1]}</span>
              <span>⭐⭐⭐ {MATH_STARS[2]}</span>
            </div>
            <button
              type="button"
              onPointerDown={unlock}
              onClick={() => {
                unlock();
                sfx.select();
                setPhase("play");
              }}
              className="mt-6 rounded-2xl bg-white px-10 py-3 text-xl font-black text-slate-900 shadow-lg hover:bg-amber-100"
            >
              CLIMB!
            </button>
          </div>
        </Card>
      )}

      {phase === "play" && problem && (
        <Card className="overflow-hidden">
          <div className="grid grid-cols-[92px_minmax(0,1fr)] sm:grid-cols-[130px_minmax(0,1fr)]">
            <div className="relative h-[380px] overflow-hidden bg-gradient-to-b from-slate-800 to-slate-950">
              {Array.from({ length: MATH_PROBLEMS }, (_, floor) => (
                <span
                  key={floor}
                  className={`absolute inset-x-3 h-1.5 rounded ${floor < right ? "bg-amber-400" : "bg-slate-600"}`}
                  style={{
                    bottom: `${10 + ((floor + 1) / MATH_PROBLEMS) * 78}%`,
                  }}
                />
              ))}
              <span
                className="absolute left-1/2 -translate-x-1/2 text-3xl transition-all duration-500"
                style={{ bottom: `${10 + climbed}%` }}
                aria-hidden="true"
              >
                🐶
              </span>
              <div
                className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-red-700 via-orange-500 to-amber-400 transition-all duration-700"
                style={{ height: `${lava}%` }}
              />
            </div>
            <div className="flex min-w-0 flex-col p-5 max-sm:p-3">
              <div className="flex justify-between text-sm font-black">
                <span className="text-ink">
                  Floor {right}/{MATH_PROBLEMS}
                </span>
                <span className="text-rose-600">
                  {"🔥".repeat(misses)}
                  <span className="text-muted">
                    {" "}
                    {misses}/{LAVA_MISSES}
                  </span>
                </span>
              </div>
              <p className="text-ink mt-4 text-xl leading-snug font-black max-sm:text-lg">
                {problem.prompt}
              </p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {problem.choices.map((choice) => {
                  const picked = feedback?.choice === choice;
                  const reveal = feedback && choice === problem.answer;
                  return (
                    <button
                      key={`${index}-${choice}`}
                      type="button"
                      disabled={!!feedback}
                      onClick={() => resolve(choice)}
                      className={`rounded-xl border-2 px-3 py-3 text-base font-black break-words transition ${
                        reveal
                          ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                          : picked
                            ? "border-rose-500 bg-rose-50 text-rose-800"
                            : "border-line text-ink hover:border-orange-400 hover:bg-orange-50"
                      }`}
                    >
                      {choice}
                    </button>
                  );
                })}
              </div>
              {feedback && (
                <p
                  className={`mt-3 text-sm font-black ${feedback.right ? "text-emerald-700" : "text-rose-700"}`}
                >
                  {feedback.right
                    ? "Up you go!"
                    : `${feedback.choice ? "The lava rises!" : "Too slow! The lava rises!"} The answer is ${problem.answer}.`}
                </p>
              )}
            </div>
          </div>
        </Card>
      )}

      {phase === "done" && (
        <Card className="px-4 py-4">
          {!finish.data ? (
            <p className="text-muted text-center text-sm">
              {finish.error ? finish.error.message : "Checking your answers…"}
            </p>
          ) : (
            <LevelResult
              heading={
                finish.data.stars === 3
                  ? "🌋 You beat the lava!"
                  : finish.data.stars > 0
                    ? "🌋 Level cleared!"
                    : "The lava got you — try again"
              }
              stars={finish.data.stars}
              newStars={finish.data.newStars}
              best={finish.data.best}
              failNote={`Get at least ${MATH_STARS[0]} right for a star.`}
              stats={[
                {
                  label: "Floors",
                  value: `${finish.data.right}/${finish.data.total}`,
                },
              ]}
              nextHref={nextId ? `/student/games/lava/${nextId}` : null}
              onRetry={onRetry}
            />
          )}
        </Card>
      )}
    </div>
  );
}
