"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { SoundToggle } from "~/app/_components/race/race-view";
import { sfx, unlock } from "~/app/_components/sfx";
import { Card } from "~/app/_components/ui";
import {
  MATH_LEVELS,
  MATH_PROBLEMS,
  MATH_SECONDS,
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

const BALLOONS = ["#f43f5e", "#3b82f6", "#f59e0b", "#10b981"];
/** Extra seconds for the last balloon's head start. */
const STAGGER = 0.5;

/**
 * One Number Rush level: twelve problems, each with four answer balloons
 * floating up. Pop the right one before they drift off the top. Problems
 * come from random seeds; the server makes the same problems to check.
 */
export function MathScreen({ levelId }: { levelId: string }) {
  const level = MATH_LEVELS.find((l) => l.id === levelId)!;
  const access = api.game.level.useQuery(
    { game: "math", levelId },
    { retry: false },
  );
  const [attempt, setAttempt] = useState(0);

  if (access.error) {
    return <LockedLevel what="Level" message={access.error.message} />;
  }
  return (
    <Rush
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

type Feedback = { choice: string; right: boolean };

function Rush({
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
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [streak, setStreak] = useState(0);
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

  const resolve = (choice: string) => {
    if (!problem || resolved.current === index || feedback) return;
    resolved.current = index;
    const ok = choice === problem.answer;
    setAnswers((a) => [...a, { seed: seeds[index]!, choice }]);
    setFeedback({ choice, right: ok });
    setStreak((s) => (ok ? s + 1 : 0));
    if (ok) {
      if ((streak + 1) % 5 === 0) sfx.zap();
      else sfx.coin();
      sfx.hit();
    } else sfx.hurt();
  };

  // The balloons drift away when time runs out.
  useEffect(() => {
    if (phase !== "play" || feedback) return;
    const t = setTimeout(() => resolve(""), (MATH_SECONDS + STAGGER) * 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, index, feedback]);

  useEffect(() => {
    if (!feedback) return;
    const t = setTimeout(
      () => {
        setFeedback(null);
        if (index + 1 >= MATH_PROBLEMS) setPhase("done");
        else setIndex((i) => i + 1);
      },
      feedback.right ? 900 : 2200,
    );
    return () => clearTimeout(t);
  }, [feedback, index]);

  useEffect(() => {
    if (
      phase === "done" &&
      ready &&
      !finish.data &&
      !finish.isPending &&
      !finish.error
    ) {
      finish.mutate({ levelId: level.id, answers });
    }
  }, [phase, ready, finish, level.id, answers]);

  useEffect(() => {
    if (finish.data && finish.data.stars > 0) sfx.fanfare();
  }, [finish.data]);

  const missed = problems
    .map((p, i) => ({ p, a: answers[i] }))
    .filter(({ p, a }) => a && a.choice !== p.answer);

  return (
    <div className="mx-auto max-w-3xl space-y-4 max-sm:space-y-3">
      <LevelHeader
        game="Number Rush"
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
          <div className="bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 px-6 py-8 text-center text-white">
            <p className="text-5xl">🎈</p>
            <p className="mt-2 text-xs font-black tracking-[0.25em] text-amber-300 uppercase">
              {MATH_PROBLEMS} problems
            </p>
            <h2 className="text-3xl font-black">{level.topic}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-white/85">
              The answers float up in balloons. Work it out and pop the right
              one before they drift away. Every play has new numbers!
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
              className="go-btn mt-6 rounded-2xl bg-amber-400 px-10 py-3 text-xl font-black text-slate-900 shadow-lg hover:bg-amber-300"
            >
              GO!
            </button>
          </div>
        </Card>
      )}

      {phase === "play" && problem && (
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between bg-slate-800 px-5 py-2.5 text-sm font-black text-white">
            <span>
              🎈 {index + 1}
              <span className="text-slate-400">/{MATH_PROBLEMS}</span>
            </span>
            <span className="text-emerald-300">✓ {right}</span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs ${streak >= 3 ? "bg-gradient-to-r from-amber-400 to-pink-500" : "bg-white/10 text-white/60"}`}
            >
              🔥 {streak}
            </span>
          </div>
          <p
            key={index}
            className="prompt-in text-ink px-5 pt-4 text-center text-xl leading-snug font-black max-sm:px-3 max-sm:text-lg sm:text-2xl"
          >
            {problem.prompt}
          </p>
          <div
            className={`sky relative mx-4 mt-3 mb-4 h-[340px] overflow-hidden rounded-2xl max-sm:mx-2 max-sm:h-[300px] ${feedback ? "paused" : ""}`}
          >
            <span className="cloud" style={{ top: "18%", left: "6%" }} />
            <span className="cloud" style={{ top: "52%", left: "64%" }} />
            {problem.choices.map((choice, k) => {
              const isAnswer = choice === problem.answer;
              const popped = feedback?.choice === choice;
              return (
                <button
                  key={`${index}-${choice}`}
                  type="button"
                  onClick={() => resolve(choice)}
                  disabled={!!feedback}
                  className={`balloon absolute w-[23%] ${popped ? "popped" : ""} ${feedback && !feedback.right && isAnswer ? "reveal" : ""}`}
                  style={{
                    left: `${2 + k * 25}%`,
                    animationDuration: `${MATH_SECONDS}s`,
                    animationDelay: `${(k * STAGGER) / 3}s`,
                  }}
                  aria-label={choice}
                >
                  <span
                    className="sway block"
                    style={{ animationDelay: `${k * 0.35}s` }}
                  >
                    <svg viewBox="0 0 80 120" className="w-full drop-shadow-md">
                      <ellipse
                        cx="40"
                        cy="42"
                        rx="36"
                        ry="40"
                        fill={BALLOONS[k]}
                      />
                      <ellipse
                        cx="27"
                        cy="26"
                        rx="8"
                        ry="12"
                        fill="white"
                        opacity=".35"
                      />
                      <path d="M36 81 L44 81 L40 88 Z" fill={BALLOONS[k]} />
                      <path
                        d="M40 88 Q34 100 40 108 Q46 116 40 120"
                        stroke="#64748b"
                        strokeWidth="1.5"
                        fill="none"
                      />
                    </svg>
                    <span className="absolute inset-x-0 top-[13%] flex h-[50%] items-center justify-center px-1 text-center text-sm leading-tight font-black break-words text-white drop-shadow sm:text-base">
                      {choice}
                    </span>
                  </span>
                </button>
              );
            })}
            {feedback && (
              <div
                className={`pop-fb absolute inset-x-3 bottom-3 rounded-xl px-4 py-2.5 text-center text-sm font-black ${
                  feedback.right
                    ? "bg-emerald-500 text-white"
                    : "bg-white text-rose-700 shadow-lg"
                }`}
              >
                {feedback.right
                  ? streak >= 3
                    ? `💥 Pop! ${streak} in a row!`
                    : "💥 Pop! Correct!"
                  : `${feedback.choice ? "✗ Not that one." : "⏱ They floated away!"} The answer is ${problem.answer}.`}
              </div>
            )}
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
                  ? "🎈 Math whiz!"
                  : finish.data.stars > 0
                    ? "🎈 Level cleared!"
                    : "Not yet — try again"
              }
              stars={finish.data.stars}
              newStars={finish.data.newStars}
              best={finish.data.best}
              failNote={`Get at least ${MATH_STARS[0]} right for a star.`}
              stats={[
                {
                  label: "Right",
                  value: `${finish.data.right}/${finish.data.total}`,
                },
              ]}
              nextHref={nextId ? `/student/games/math/${nextId}` : null}
              onRetry={onRetry}
            >
              {missed.length > 0 && (
                <div className="mx-auto mt-4 max-w-md space-y-1.5 text-left">
                  <p className="text-muted text-xs font-bold tracking-wide uppercase">
                    Review what you missed
                  </p>
                  {missed.map(({ p }, i) => (
                    <p
                      key={i}
                      className="border-line bg-surface flex justify-between gap-3 rounded-xl border px-3 py-2 text-sm"
                    >
                      <span className="text-ink">{p.prompt}</span>
                      <span className="shrink-0 font-bold text-emerald-700">
                        {p.answer}
                      </span>
                    </p>
                  ))}
                </div>
              )}
            </LevelResult>
          )}
        </Card>
      )}

      <style>{`
        .go-btn { animation: go-btn 1.1s ease-in-out infinite; }
        @keyframes go-btn { 0%,100% { transform: scale(1) } 50% { transform: scale(1.08) } }
        .prompt-in { animation: prompt-in .25s ease-out both; }
        @keyframes prompt-in { from { transform: translateY(8px); opacity: 0 } }
        .sky { background: linear-gradient(#bfe3ff, #e8f5ff 70%, #f7fbff); }
        .cloud { position: absolute; width: 90px; height: 28px; border-radius: 999px; background: white; opacity: .8; box-shadow: 30px -12px 0 4px white, -22px -6px 0 0 white; }
        .balloon { bottom: -45%; animation-name: rise; animation-timing-function: linear; animation-fill-mode: forwards; }
        @keyframes rise { from { bottom: -45% } to { bottom: 105% } }
        .sway { animation: sway 2.2s ease-in-out infinite; transform-origin: 50% 100%; }
        @keyframes sway { 0%,100% { transform: rotate(-4deg) } 50% { transform: rotate(4deg) } }
        .paused .balloon, .paused .sway { animation-play-state: paused; }
        .balloon:not(:disabled):hover { filter: brightness(1.08); }
        .popped { pointer-events: none; }
        .popped .sway { animation: pop .35s ease-out forwards !important; }
        @keyframes pop { 40% { transform: scale(1.35); opacity: 1 } to { transform: scale(1.7); opacity: 0 } }
        .reveal .sway { filter: drop-shadow(0 0 10px #10b981) drop-shadow(0 0 4px #10b981); }
        .pop-fb { animation: pop-fb .3s ease-out both; }
        @keyframes pop-fb { from { transform: translateY(8px); opacity: 0 } }
        @media (prefers-reduced-motion: reduce) { .go-btn, .prompt-in, .sway, .pop-fb { animation: none } }
      `}</style>
    </div>
  );
}
