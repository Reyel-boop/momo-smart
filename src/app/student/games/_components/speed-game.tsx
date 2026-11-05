"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { SoundToggle } from "~/app/_components/race/race-view";
import { sfx, unlock } from "~/app/_components/sfx";
import { Card } from "~/app/_components/ui";
import { BANSA_LEVELS } from "~/lib/games/bansa-quiz";
import { SALITA_LEVELS } from "~/lib/games/salita-sprint";
import {
  SPEED_SECONDS,
  SPEED_STARS,
  type SpeedItem,
  type SpeedLevel,
} from "~/lib/games/speed";
import { SPRINT_LEVELS } from "~/lib/games/tag-sprint";
import { api } from "~/trpc/react";
import { LevelHeader, LevelResult, LockedLevel, shuffled } from "./shared";

export type SpeedGame = "sprint" | "salita" | "bansa";

/** Each speed game's levels and its look and words. */
const SPEED_GAMES: Record<
  SpeedGame,
  {
    levels: SpeedLevel[];
    name: string;
    emoji: string;
    gradient: string;
    rules: string;
    /** Code answers (tags, properties) show in a code font. */
    code: boolean;
    headings: { top: string; pass: string; fail: string };
  }
> = {
  sprint: {
    levels: SPRINT_LEVELS,
    name: "Tag Sprint",
    emoji: "⚡",
    gradient: "from-fuchsia-600 via-violet-600 to-indigo-700",
    rules:
      "A description appears. Tap the tag, attribute or property that matches, as fast as you can. 5 in a row doubles your points, 10 triples them. A wrong tap costs a point and a short pause.",
    code: true,
    headings: {
      top: "⚡ Lightning fast!",
      pass: "⏱ Time's up!",
      fail: "⏱ Time's up — try again",
    },
  },
  salita: {
    levels: SALITA_LEVELS,
    name: "Salita Sprint",
    emoji: "📜",
    gradient: "from-rose-600 via-red-600 to-amber-500",
    rules:
      "May lalabas na paglalarawan. Piliin agad ang tamang sagot! 5 sunod-sunod na tama, doble ang puntos; 10, triple. Ang mali ay bawas na isang puntos at maikling hinto.",
    code: false,
    headings: {
      top: "📜 Ang galing mo!",
      pass: "⏱ Tapos na ang oras!",
      fail: "⏱ Tapos na ang oras — subukan muli",
    },
  },
  bansa: {
    levels: BANSA_LEVELS,
    name: "Bansa Quiz",
    emoji: "🌏",
    gradient: "from-emerald-600 via-teal-600 to-sky-700",
    rules:
      "May lalabas na clue. Piliin agad ang tamang bansa o lalawigan! 5 sunod-sunod na tama, doble ang puntos; 10, triple. Ang mali ay bawas na isang puntos at maikling hinto.",
    code: false,
    headings: {
      top: "🌏 Bihasa ka sa mapa!",
      pass: "⏱ Tapos na ang oras!",
      fail: "⏱ Tapos na ang oras — subukan muli",
    },
  },
};

/** Seconds of lockout after a wrong tap, so guessing doesn't pay. */
const WRONG_PAUSE = 700;
const CHOICE_COLORS = [
  "from-sky-400 to-blue-600",
  "from-emerald-400 to-teal-600",
  "from-amber-400 to-orange-500",
  "from-pink-400 to-rose-500",
];

/**
 * One speed round (Tag Sprint, Salita Sprint): 60 seconds of "which one is
 * this?". The combo multiplier only changes the points on screen; the
 * server scores the answers (right minus wrong) for stars.
 */
export function SpeedScreen({
  game,
  levelId,
}: {
  game: SpeedGame;
  levelId: string;
}) {
  const level = SPEED_GAMES[game].levels.find((l) => l.id === levelId)!;
  const access = api.game.level.useQuery({ game, levelId }, { retry: false });
  const [attempt, setAttempt] = useState(0);

  if (access.error) {
    return <LockedLevel what="Round" message={access.error.message} />;
  }
  return (
    <Sprint
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

type Deal = { item: SpeedItem; choices: string[] };

function Sprint({
  game,
  level,
  best,
  number,
  count,
  nextId,
  ready,
  onRetry,
}: {
  game: SpeedGame;
  level: SpeedLevel;
  best: number;
  number?: number;
  count?: number;
  nextId: string | null;
  ready: boolean;
  onRetry: () => void;
}) {
  const theme = SPEED_GAMES[game];
  const router = useRouter();
  const utils = api.useUtils();
  const [phase, setPhase] = useState<"intro" | "play" | "done">("intro");
  const [left, setLeft] = useState(SPEED_SECONDS);
  const [card, setCard] = useState<Deal | null>(null);
  const [answers, setAnswers] = useState<{ id: string; choice: string }[]>([]);
  const [combo, setCombo] = useState(0);
  const [points, setPoints] = useState(0);
  const [flash, setFlash] = useState<{ choice: string; right: boolean } | null>(
    null,
  );
  const [pop, setPop] = useState<{ text: string; at: number } | null>(null);
  const queue = useRef<SpeedItem[]>([]);
  const locked = useRef(false);
  const finish = api.game.finishSpeed.useMutation({
    onSuccess: () => {
      void utils.game.hub.invalidate();
      router.refresh();
    },
  });

  const right = answers.filter(
    (a) => level.items.find((i) => i.id === a.id)?.answer === a.choice,
  ).length;
  const wrong = answers.length - right;
  const net = Math.max(0, right - wrong);
  const multiplier = combo >= 10 ? 3 : combo >= 5 ? 2 : 1;

  const deal = useCallback(() => {
    if (!queue.current.length) queue.current = shuffled(level.items);
    const item = queue.current.pop()!;
    const others = shuffled(
      level.items.filter((i) => i.answer !== item.answer).map((i) => i.answer),
    ).slice(0, 3);
    setCard({ item, choices: shuffled([item.answer, ...others]) });
  }, [level.items]);

  const start = () => {
    unlock();
    sfx.select();
    deal();
    setPhase("play");
  };

  // The clock: ticks in the last ten seconds, then the round ends.
  useEffect(() => {
    if (phase !== "play") return;
    const t = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [phase]);
  useEffect(() => {
    if (phase !== "play") return;
    if (left === 0) setPhase("done");
    else if (left <= 10) sfx.tick();
  }, [phase, left]);

  useEffect(() => {
    if (
      phase === "done" &&
      ready &&
      !finish.data &&
      !finish.isPending &&
      !finish.error
    ) {
      finish.mutate({ game, levelId: level.id, answers });
    }
  }, [phase, ready, finish, game, level.id, answers]);

  useEffect(() => {
    if (finish.data && finish.data.stars > 0) sfx.fanfare();
  }, [finish.data]);

  const answer = (choice: string) => {
    if (!card || locked.current || phase !== "play") return;
    const ok = choice === card.item.answer;
    setAnswers((a) => [...a, { id: card.item.id, choice }]);
    setFlash({ choice, right: ok });
    if (ok) {
      const next = combo + 1;
      const gain = 10 * (next >= 10 ? 3 : next >= 5 ? 2 : 1);
      setCombo(next);
      setPoints((p) => p + gain);
      setPop({ text: `+${gain}`, at: Date.now() });
      if (next === 5 || next === 10) sfx.zap();
      else sfx.coin();
      locked.current = true;
      setTimeout(() => {
        locked.current = false;
        setFlash(null);
        deal();
      }, 160);
    } else {
      setCombo(0);
      setPop({ text: "−1", at: Date.now() });
      sfx.hurt();
      locked.current = true;
      setTimeout(() => {
        locked.current = false;
        setFlash(null);
        deal();
      }, WRONG_PAUSE);
    }
  };

  const missed = [
    ...new Map(
      answers
        .map((a) => level.items.find((i) => i.id === a.id)!)
        .filter((item, k) => item.answer !== answers[k]!.choice)
        .map((item) => [item.id, item]),
    ).values(),
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-4 max-sm:space-y-3">
      <LevelHeader
        game={theme.name}
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
          <div
            className={`bg-gradient-to-br ${theme.gradient} px-6 py-8 text-center text-white`}
          >
            <p className="text-5xl">{theme.emoji}</p>
            <p className="mt-2 text-xs font-black tracking-[0.25em] text-amber-300 uppercase">
              {SPEED_SECONDS}-second round
            </p>
            <h2 className="text-3xl font-black">{level.topic}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-white/85">
              {theme.rules}
            </p>
            <div className="mt-4 flex justify-center gap-4 text-xs font-bold text-white/85">
              <span>⭐ {SPEED_STARS[0]} right</span>
              <span>⭐⭐ {SPEED_STARS[1]}</span>
              <span>⭐⭐⭐ {SPEED_STARS[2]}</span>
            </div>
            <button
              type="button"
              onPointerDown={unlock}
              onClick={start}
              className="go-btn mt-6 rounded-2xl bg-amber-400 px-10 py-3 text-xl font-black text-slate-900 shadow-lg hover:bg-amber-300"
            >
              GO!
            </button>
          </div>
        </Card>
      )}

      {phase === "play" && card && (
        <Card className="overflow-hidden">
          <div className="h-2 bg-slate-100">
            <div
              className={`h-full transition-all duration-1000 ease-linear ${left <= 10 ? "bg-rose-500" : "bg-violet-500"}`}
              style={{ width: `${(left / SPEED_SECONDS) * 100}%` }}
            />
          </div>
          <div className="flex items-center justify-between px-5 pt-3 text-sm font-black">
            <span
              className={`tabular-nums ${left <= 10 ? "text-rose-600" : "text-ink"}`}
            >
              ⏱ {left}s
            </span>
            <span className="relative text-violet-700 tabular-nums">
              {points} pts
              {pop && (
                <span
                  key={pop.at}
                  className={`score-pop absolute -top-4 right-0 text-xs ${pop.text.startsWith("+") ? "text-emerald-600" : "text-rose-600"}`}
                >
                  {pop.text}
                </span>
              )}
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs ${
                multiplier > 1
                  ? "combo-glow bg-gradient-to-r from-amber-400 to-pink-500 text-white"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              🔥 {combo} {multiplier > 1 ? `· ×${multiplier}` : ""}
            </span>
          </div>
          <div className="px-5 pt-4 pb-5 max-sm:px-3">
            <p
              key={card.item.id + answers.length}
              className="prompt-in text-ink min-h-[3.5rem] text-center text-xl leading-snug font-black sm:text-2xl"
            >
              {card.item.prompt}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              {card.choices.map((choice, k) => {
                const isPicked = flash?.choice === choice;
                const showRight =
                  flash && !flash.right && choice === card.item.answer;
                return (
                  <button
                    key={choice}
                    type="button"
                    onClick={() => answer(choice)}
                    className={`choice-btn min-h-[64px] rounded-2xl bg-gradient-to-br px-3 py-3 text-base font-bold break-words text-white shadow-md transition active:scale-95 sm:text-lg ${theme.code ? "font-mono" : ""} ${CHOICE_COLORS[k]} ${
                      isPicked
                        ? flash.right
                          ? "scale-105 ring-4 ring-emerald-300"
                          : "choice-shake opacity-60 ring-4 ring-rose-400"
                        : showRight
                          ? "ring-4 ring-emerald-300"
                          : flash
                            ? "opacity-50"
                            : "hover:-translate-y-0.5 hover:shadow-lg"
                    }`}
                  >
                    {choice}
                  </button>
                );
              })}
            </div>
            <div className="text-muted mt-3 flex justify-center gap-5 text-xs font-bold">
              <span className="text-emerald-600">✓ {right}</span>
              <span className="text-rose-600">✗ {wrong}</span>
              <span>Score {net}</span>
            </div>
          </div>
        </Card>
      )}

      {phase === "done" && (
        <Card className="px-4 py-4">
          {!finish.data ? (
            <p className="text-muted text-center text-sm">
              {finish.error
                ? finish.error.message
                : "⏱ Time! Counting your answers…"}
            </p>
          ) : (
            <LevelResult
              heading={
                finish.data.stars === 3
                  ? theme.headings.top
                  : finish.data.stars > 0
                    ? theme.headings.pass
                    : theme.headings.fail
              }
              stars={finish.data.stars}
              newStars={finish.data.newStars}
              best={finish.data.best}
              failNote={`Get a score of ${SPEED_STARS[0]} or more (right minus wrong) for a star.`}
              stats={[
                { label: "Right", value: String(finish.data.right) },
                { label: "Wrong", value: String(finish.data.wrong) },
                { label: "Score", value: String(finish.data.net) },
                { label: "Points", value: String(points) },
              ]}
              nextHref={nextId ? `/student/games/${game}/${nextId}` : null}
              onRetry={onRetry}
            >
              {missed.length > 0 && (
                <div className="mx-auto mt-4 max-w-md text-left">
                  <p className="text-muted mb-1.5 text-xs font-bold tracking-wide uppercase">
                    Review what you missed
                  </p>
                  <div className="space-y-1.5">
                    {missed.map((item) => (
                      <p
                        key={item.id}
                        className="border-line bg-surface flex justify-between gap-3 rounded-xl border px-3 py-2 text-sm"
                      >
                        <span className="text-ink">{item.prompt}</span>
                        <span
                          className={`font-bold text-emerald-700 ${theme.code ? "font-mono" : ""}`}
                        >
                          {item.answer}
                        </span>
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </LevelResult>
          )}
        </Card>
      )}

      <style>{`
        .go-btn { animation: go-btn 1.1s ease-in-out infinite; }
        @keyframes go-btn { 0%,100% { transform: scale(1) } 50% { transform: scale(1.08) } }
        .prompt-in { animation: prompt-in .22s ease-out both; }
        @keyframes prompt-in { from { transform: translateY(10px) scale(.96); opacity: 0 } }
        .score-pop { animation: score-pop .7s ease-out both; }
        @keyframes score-pop { from { transform: translateY(6px); opacity: 1 } to { transform: translateY(-14px); opacity: 0 } }
        .choice-shake { animation: choice-shake .4s ease-in-out; }
        @keyframes choice-shake { 0%,100% { transform: translateX(0) } 25% { transform: translateX(-6px) } 50% { transform: translateX(6px) } 75% { transform: translateX(-3px) } }
        .combo-glow { animation: combo-glow .9s ease-in-out infinite alternate; }
        @keyframes combo-glow { from { box-shadow: 0 0 0 0 rgba(236,72,153,.5) } to { box-shadow: 0 0 14px 2px rgba(236,72,153,.6) } }
        @media (prefers-reduced-motion: reduce) { .go-btn, .prompt-in, .score-pop, .choice-shake, .combo-glow { animation: none } }
      `}</style>
    </div>
  );
}
