"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { SoundToggle } from "~/app/_components/race/race-view";
import { sfx, unlock } from "~/app/_components/sfx";
import { Card } from "~/app/_components/ui";
import { LAB_LEVELS } from "~/lib/games/lab-sorter";
import { SORT_STARS, type SortCard, type SortLevel } from "~/lib/games/sort";
import { TICKET_LEVELS } from "~/lib/games/ticket-rush";
import { TOOL_LEVELS } from "~/lib/games/tool-shed";
import { api } from "~/trpc/react";
import { LevelHeader, LevelResult, LockedLevel, shuffled } from "./shared";

export type SortGame = "ticket" | "lab" | "tools";

/** Each sorting game's levels and its look and words. */
const SORT_GAMES: Record<
  SortGame,
  {
    levels: SortLevel[];
    name: string;
    round: string;
    emoji: string;
    gradient: string;
    kicker: string;
    start: string;
    /** What one card is called, with its icon. */
    noun: string;
    nounIcon: string;
    /** Cards are quotes from someone (Ticket Rush) or plain samples. */
    quoted: boolean;
    intro: (level: SortLevel) => string;
    timeout: string;
    headings: { top: string; pass: string; fail: string };
    pending: string;
  }
> = {
  ticket: {
    levels: TICKET_LEVELS,
    name: "Ticket Rush",
    round: "Shift",
    emoji: "🎧",
    gradient: "from-teal-600 via-emerald-600 to-cyan-700",
    kicker: "Shift briefing",
    start: "🎧 Start shift",
    noun: "Ticket",
    nounIcon: "🎫",
    quoted: true,
    intro: (l) =>
      `${l.cards.length} tickets. Each customer waits ${l.patience} seconds before hanging up.`,
    timeout: "📵 The customer hung up!",
    headings: {
      top: "🏆 Top agent of the shift!",
      pass: "🎧 Shift complete!",
      fail: "Shift failed — try again",
    },
    pending: "Shift over! Checking the queue…",
  },
  lab: {
    levels: LAB_LEVELS,
    name: "Lab Sorter",
    round: "Round",
    emoji: "🧪",
    gradient: "from-sky-600 via-indigo-600 to-violet-700",
    kicker: "Lab briefing",
    start: "🧪 Start sorting",
    noun: "Sample",
    nounIcon: "🧪",
    quoted: false,
    intro: (l) =>
      `${l.cards.length} samples, ${l.patience} seconds each before they spoil.`,
    timeout: "⏱ Too slow, the sample spoiled!",
    headings: {
      top: "🏆 Lab genius!",
      pass: "🧪 Lab work done!",
      fail: "Lab failed — try again",
    },
    pending: "Checking your lab work…",
  },
  tools: {
    levels: TOOL_LEVELS,
    name: "Tool Shed",
    round: "Round",
    emoji: "🧰",
    gradient: "from-amber-600 via-orange-600 to-red-600",
    kicker: "Shop briefing",
    start: "🧰 Open the shed",
    noun: "Item",
    nounIcon: "🔧",
    quoted: false,
    intro: (l) =>
      `${l.cards.length} items, ${l.patience} seconds each to put away.`,
    timeout: "⏱ Too slow!",
    headings: {
      top: "🏆 Master of the shop!",
      pass: "🧰 Shed sorted!",
      fail: "Not yet — try again",
    },
    pending: "Checking the shelves…",
  },
};

const BIN_COLORS = [
  "from-sky-500 to-blue-600",
  "from-emerald-500 to-teal-600",
  "from-amber-400 to-orange-500",
  "from-pink-500 to-rose-600",
  "from-violet-500 to-purple-600",
  "from-slate-500 to-slate-700",
];

/** Grid columns for a number of bins, phone first. */
function binColumns(count: number) {
  if (count === 2) return "grid-cols-2";
  if (count === 4) return "grid-cols-2 sm:grid-cols-4";
  return "grid-cols-3";
}

/**
 * One round of a sorting game (Ticket Rush, Lab Sorter, Tool Shed): cards
 * come one at a time, each with a timer bar, and the student sorts each
 * into a bin. Wrong or missed cards show why before the next one; the
 * server scores the round.
 */
export function SortScreen({
  game,
  levelId,
}: {
  game: SortGame;
  levelId: string;
}) {
  const level = SORT_GAMES[game].levels.find((l) => l.id === levelId)!;
  const access = api.game.level.useQuery({ game, levelId }, { retry: false });
  const [attempt, setAttempt] = useState(0);

  if (access.error) {
    return (
      <LockedLevel
        what={SORT_GAMES[game].round}
        message={access.error.message}
      />
    );
  }
  return (
    <Round
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

type Feedback = { card: SortCard; bin: number; right: boolean };

function Round({
  game,
  level,
  best,
  number,
  count,
  nextId,
  ready,
  onRetry,
}: {
  game: SortGame;
  level: SortLevel;
  best: number;
  number?: number;
  count?: number;
  nextId: string | null;
  ready: boolean;
  onRetry: () => void;
}) {
  const theme = SORT_GAMES[game];
  const router = useRouter();
  const utils = api.useUtils();
  const [queue] = useState(() => shuffled(level.cards));
  const [phase, setPhase] = useState<"intro" | "play" | "done">("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<{ id: string; bin: number }[]>([]);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const resolved = useRef(-1);
  const finish = api.game.finishSort.useMutation({
    onSuccess: () => {
      void utils.game.hub.invalidate();
      router.refresh();
    },
  });

  const card = queue[index];
  const right = answers.filter(
    (a) => level.cards.find((c) => c.id === a.id)?.bin === a.bin,
  ).length;
  const handled = answers.length;
  // Mood: the share sorted right so far.
  const mood = handled === 0 ? 1 : right / handled;
  const face =
    mood >= 0.9 ? "😄" : mood >= 0.7 ? "🙂" : mood >= 0.5 ? "😐" : "😠";

  const next = () => {
    setFeedback(null);
    if (index + 1 >= queue.length) setPhase("done");
    else setIndex((i) => i + 1);
  };

  const resolve = (bin: number) => {
    if (!card || resolved.current === index || feedback) return;
    resolved.current = index;
    const ok = bin === card.bin;
    setAnswers((a) => [...a, { id: card.id, bin }]);
    setFeedback({ card, bin, right: ok });
    if (ok) sfx.coin();
    else if (bin < 0 && game === "ticket") sfx.hangup();
    else sfx.hurt();
  };

  // The card runs out when its timer bar empties.
  useEffect(() => {
    if (phase !== "play" || feedback) return;
    const t = setTimeout(() => resolve(-1), level.patience * 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, index, feedback]);

  // Right answers move on quickly; mistakes stay up long enough to read.
  useEffect(() => {
    if (!feedback) return;
    const t = setTimeout(next, feedback.right ? 650 : 3200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedback]);

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

  const mistakes = answers
    .map((a) => ({
      card: level.cards.find((c) => c.id === a.id)!,
      bin: a.bin,
    }))
    .filter((m) => m.card.bin !== m.bin);
  const quote = (text: string) => (theme.quoted ? `“${text}”` : text);

  return (
    <div className="mx-auto max-w-4xl space-y-4 max-sm:space-y-3">
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
              {theme.kicker}
            </p>
            <h2 className="mx-auto max-w-lg text-2xl font-black">
              {level.task}
            </h2>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {level.bins.map((b) => (
                <span
                  key={b.label}
                  className="rounded-xl bg-white/15 px-3 py-1.5 text-sm font-bold"
                >
                  {b.icon} {b.label}
                </span>
              ))}
            </div>
            <p className="mx-auto mt-4 max-w-md text-sm text-white/85">
              {theme.intro(level)} Sort {SORT_STARS[2]}% right for 3 stars.
            </p>
            <button
              type="button"
              onPointerDown={unlock}
              onClick={() => {
                unlock();
                if (game === "ticket") sfx.pickup();
                else sfx.select();
                setPhase("play");
              }}
              className="go-btn mt-6 rounded-2xl bg-amber-400 px-8 py-3 text-lg font-black text-slate-900 shadow-lg hover:bg-amber-300"
            >
              {theme.start}
            </button>
          </div>
        </Card>
      )}

      {phase === "play" && card && (
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between bg-slate-800 px-5 py-2.5 text-sm font-black text-white">
            <span>
              {theme.nounIcon} {theme.noun} {index + 1}
              <span className="text-slate-400">/{queue.length}</span>
            </span>
            <span className="text-emerald-300">✓ {right}</span>
            <span title="Mood" className="text-xl">
              {face}
            </span>
          </div>

          <div className="relative px-5 pt-6 pb-4 max-sm:px-3 max-sm:pt-4">
            {/* The queue behind the current card */}
            {queue.slice(index + 1, index + 3).map((c, k) => (
              <div
                key={c.id}
                className="border-line bg-surface absolute inset-x-5 h-24 rounded-2xl border shadow-sm max-sm:inset-x-3"
                style={{
                  top: `${12 - k * 6}px`,
                  transform: `scale(${0.96 - k * 0.04})`,
                  opacity: 0.7 - k * 0.25,
                }}
              />
            ))}
            <div
              key={card.id}
              className={`ticket-in border-line bg-surface relative rounded-2xl border-2 px-5 py-4 shadow-lg ${
                feedback
                  ? feedback.right
                    ? "ticket-right border-emerald-400"
                    : "ticket-wrong border-rose-400"
                  : ""
              }`}
            >
              <div className="flex min-h-4 items-center justify-between gap-3">
                <p className="text-muted text-xs font-black tracking-wide uppercase">
                  {card.from}
                </p>
                {!feedback && (
                  <span className="text-muted text-[11px] font-bold">⏳</span>
                )}
              </div>
              <p className="text-ink mt-1 text-lg leading-snug font-bold sm:text-xl">
                {quote(card.text)}
              </p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                {!feedback && (
                  <div
                    key={card.id}
                    className="patience h-full rounded-full"
                    style={{ animationDuration: `${level.patience}s` }}
                  />
                )}
              </div>
            </div>

            {feedback && (
              <div
                className={`pop-fb mt-3 rounded-xl px-4 py-3 text-sm ${
                  feedback.right
                    ? "bg-emerald-50 text-emerald-900"
                    : "bg-rose-50 text-rose-900"
                }`}
              >
                <p className="font-black">
                  {feedback.right
                    ? "✓ Sorted right!"
                    : feedback.bin < 0
                      ? `${theme.timeout} It was ${level.bins[feedback.card.bin]!.label}.`
                      : `✗ That goes to ${level.bins[feedback.card.bin]!.label}.`}
                </p>
                {!feedback.right && (
                  <div className="mt-0.5 flex flex-wrap items-end justify-between gap-2">
                    <p>{feedback.card.why}</p>
                    <button
                      type="button"
                      onClick={next}
                      className="rounded-lg bg-rose-600 px-3 py-1 text-xs font-black text-white hover:bg-rose-700"
                    >
                      Next ›
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div
            className={`grid gap-2.5 px-5 pb-5 max-sm:gap-2 max-sm:px-3 ${binColumns(level.bins.length)}`}
          >
            {level.bins.map((b, k) => {
              const isAnswer = feedback?.card.bin === k;
              const isPicked = feedback?.bin === k;
              return (
                <button
                  key={b.label}
                  type="button"
                  onClick={() => resolve(k)}
                  disabled={!!feedback}
                  className={`flex min-h-[72px] flex-col items-center justify-center gap-1 rounded-2xl bg-gradient-to-br px-2 py-3 text-center font-black text-white shadow-md transition active:scale-95 ${BIN_COLORS[k % BIN_COLORS.length]} ${
                    isAnswer
                      ? "scale-105 ring-4 ring-emerald-300"
                      : isPicked
                        ? "opacity-60 ring-4 ring-rose-400"
                        : feedback
                          ? "opacity-40"
                          : "hover:-translate-y-0.5 hover:shadow-lg"
                  }`}
                >
                  <span className="text-2xl">{b.icon}</span>
                  <span className="text-sm leading-tight max-sm:text-xs">
                    {b.label}
                  </span>
                </button>
              );
            })}
          </div>
        </Card>
      )}

      {phase === "done" && (
        <Card className="px-4 py-4">
          {!finish.data ? (
            <p className="text-muted text-center text-sm">
              {finish.error ? finish.error.message : theme.pending}
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
              failNote={`Sort at least ${SORT_STARS[0]}% right for a star.`}
              stats={[
                {
                  label: "Sorted right",
                  value: `${finish.data.right}/${finish.data.total}`,
                },
                { label: "Accuracy", value: `${finish.data.percent}%` },
              ]}
              nextHref={nextId ? `/student/games/${game}/${nextId}` : null}
              onRetry={onRetry}
            >
              {mistakes.length > 0 && (
                <div className="mx-auto mt-4 max-w-xl space-y-1.5 text-left">
                  <p className="text-muted text-xs font-bold tracking-wide uppercase">
                    Review your mistakes
                  </p>
                  {mistakes.map((m) => (
                    <div
                      key={m.card.id}
                      className="border-line bg-surface rounded-xl border px-3 py-2 text-xs"
                    >
                      <p className="text-ink font-bold">{quote(m.card.text)}</p>
                      <p className="mt-0.5 text-emerald-700">
                        → {level.bins[m.card.bin]!.icon}{" "}
                        {level.bins[m.card.bin]!.label}:{" "}
                        <span className="text-muted">{m.card.why}</span>
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </LevelResult>
          )}
        </Card>
      )}

      <style>{`
        .go-btn { animation: go-btn 1.1s ease-in-out infinite; }
        @keyframes go-btn { 0%,100% { transform: scale(1) } 50% { transform: scale(1.06) } }
        .ticket-in { animation: ticket-in .35s cubic-bezier(.2,1.3,.4,1) both; }
        @keyframes ticket-in { from { transform: translateY(-28px) rotate(-2deg); opacity: 0 } }
        .ticket-right { animation: ticket-right .6s ease-in forwards; }
        @keyframes ticket-right { 40% { transform: scale(1.03) } to { transform: translateY(40px) scale(.9); opacity: 0 } }
        .ticket-wrong { animation: ticket-wrong .45s ease-in-out; }
        @keyframes ticket-wrong { 0%,100% { transform: translateX(0) } 20% { transform: translateX(-8px) } 40% { transform: translateX(8px) } 60% { transform: translateX(-5px) } 80% { transform: translateX(5px) } }
        .patience { width: 100%; animation-name: patience; animation-timing-function: linear; animation-fill-mode: forwards; }
        @keyframes patience { from { width: 100%; background: #10b981 } 55% { background: #f59e0b } to { width: 0%; background: #f43f5e } }
        .pop-fb { animation: pop-fb .3s ease-out both; }
        @keyframes pop-fb { from { transform: translateY(6px); opacity: 0 } }
        @media (prefers-reduced-motion: reduce) { .go-btn, .ticket-in, .ticket-right, .ticket-wrong, .pop-fb { animation: none } }
      `}</style>
    </div>
  );
}
