"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { SoundToggle } from "~/app/_components/race/race-view";
import { sfx, unlock } from "~/app/_components/sfx";
import { Card } from "~/app/_components/ui";
import {
  TAMA_LEVELS,
  TAMA_STARS,
  type TamaCard,
  type TamaLevel,
} from "~/lib/games/tama-o-mali";
import { api } from "~/trpc/react";
import {
  LevelHeader,
  LevelResult,
  LockedLevel,
  shuffled,
} from "../../_components/shared";

/** How far (px) a card must be dragged to count as a swipe. */
const SWIPE = 90;

/**
 * One Tama o Mali round: swipe each statement right for Tama or left for
 * Mali (or tap the buttons, or use the arrow keys). Every card explains
 * the answer; the server scores the round.
 */
export function TamaScreen({ levelId }: { levelId: string }) {
  const level = TAMA_LEVELS.find((l) => l.id === levelId)!;
  const access = api.game.level.useQuery(
    { game: "tama", levelId },
    { retry: false },
  );
  const [attempt, setAttempt] = useState(0);

  if (access.error) {
    return <LockedLevel what="Round" message={access.error.message} />;
  }
  return (
    <Round
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

type Feedback = { card: TamaCard; tama: boolean; right: boolean };

function Round({
  level,
  best,
  number,
  count,
  nextId,
  ready,
  onRetry,
}: {
  level: TamaLevel;
  best: number;
  number?: number;
  count?: number;
  nextId: string | null;
  ready: boolean;
  onRetry: () => void;
}) {
  const router = useRouter();
  const utils = api.useUtils();
  const [deck] = useState(() => shuffled(level.cards));
  const [phase, setPhase] = useState<"intro" | "play" | "done">("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<{ id: string; tama: boolean }[]>([]);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [streak, setStreak] = useState(0);
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ x: number; id: number } | null>(null);
  const finish = api.game.finishTama.useMutation({
    onSuccess: () => {
      void utils.game.hub.invalidate();
      router.refresh();
    },
  });

  const card = deck[index];
  const right = answers.filter(
    (a) => level.cards.find((c) => c.id === a.id)?.tama === a.tama,
  ).length;

  const decide = (tama: boolean) => {
    if (!card || feedback || phase !== "play") return;
    const ok = tama === card.tama;
    setAnswers((a) => [...a, { id: card.id, tama }]);
    setFeedback({ card, tama, right: ok });
    setStreak((s) => (ok ? s + 1 : 0));
    setDx(tama ? 600 : -600);
    if (ok) sfx.coin();
    else sfx.hurt();
  };

  const next = () => {
    setFeedback(null);
    setDx(0);
    if (index + 1 >= deck.length) setPhase("done");
    else setIndex((i) => i + 1);
  };

  // Right answers move on by themselves; wrong ones wait to be read.
  useEffect(() => {
    if (!feedback?.right) return;
    const t = setTimeout(next, 2000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedback]);

  // Arrow keys: ← Mali, → Tama, Enter for the next card.
  useEffect(() => {
    if (phase !== "play") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") decide(true);
      else if (e.key === "ArrowLeft") decide(false);
      else if (e.key === "Enter" && feedback) next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, feedback, index]);

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

  const mistakes = answers
    .map((a) => ({ card: level.cards.find((c) => c.id === a.id)!, a }))
    .filter(({ card: c, a }) => c.tama !== a.tama);
  const lean = Math.max(-1, Math.min(1, dx / SWIPE));

  return (
    <div className="mx-auto max-w-2xl space-y-4 max-sm:space-y-3">
      <LevelHeader
        game="Tama o Mali"
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
          <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 px-6 py-8 text-center text-white">
            <p className="text-5xl">🇵🇭</p>
            <p className="mt-2 text-xs font-black tracking-[0.25em] text-amber-100 uppercase">
              {deck.length} pahayag
            </p>
            <h2 className="text-3xl font-black">{level.unitTitle}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-white/90">
              Basahin ang bawat pahayag. I-swipe pakanan kung <b>TAMA</b>,
              pakaliwa kung <b>MALI</b>, o pindutin ang mga button.
            </p>
            <div className="mt-4 flex justify-center gap-4 text-xs font-bold text-white/90">
              <span>⭐ {TAMA_STARS[0]} tama</span>
              <span>⭐⭐ {TAMA_STARS[1]}</span>
              <span>⭐⭐⭐ {TAMA_STARS[2]}</span>
            </div>
            <button
              type="button"
              onPointerDown={unlock}
              onClick={() => {
                unlock();
                sfx.select();
                setPhase("play");
              }}
              className="go-btn mt-6 rounded-2xl bg-white px-10 py-3 text-xl font-black text-orange-600 shadow-lg hover:bg-amber-50"
            >
              Simulan!
            </button>
          </div>
        </Card>
      )}

      {phase === "play" && card && (
        <div className="space-y-3">
          <div className="text-muted flex items-center justify-between px-1 text-sm font-black">
            <span>
              {index + 1}
              <span className="font-bold">/{deck.length}</span>
            </span>
            <span className="text-emerald-600">✓ {right}</span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs ${streak >= 3 ? "bg-gradient-to-r from-amber-400 to-pink-500 text-white" : "bg-slate-100 text-slate-500"}`}
            >
              🔥 {streak}
            </span>
          </div>

          <div className="relative h-[290px] select-none max-sm:h-[270px]">
            {deck.slice(index + 1, index + 3).map((c, k) => (
              <div
                key={c.id}
                className="border-line bg-surface absolute inset-0 rounded-3xl border shadow-sm"
                style={{
                  transform: `translateY(${(k + 1) * 10}px) scale(${0.95 - k * 0.04})`,
                  opacity: 0.8 - k * 0.3,
                }}
              />
            ))}
            <div
              key={card.id}
              className={`card-in border-line bg-surface absolute inset-0 flex touch-none flex-col justify-center rounded-3xl border-2 px-6 py-6 shadow-xl ${feedback ? "" : "cursor-grab active:cursor-grabbing"}`}
              style={{
                transform: `translateX(${dx}px) rotate(${dx / 18}deg)`,
                transition: dragging
                  ? "none"
                  : "transform .45s cubic-bezier(.2,.8,.3,1)",
              }}
              onPointerDown={(e) => {
                if (feedback) return;
                unlock();
                drag.current = { x: e.clientX, id: e.pointerId };
                setDragging(true);
                e.currentTarget.setPointerCapture(e.pointerId);
              }}
              onPointerMove={(e) => {
                if (drag.current?.id === e.pointerId)
                  setDx(e.clientX - drag.current.x);
              }}
              onPointerUp={(e) => {
                if (drag.current?.id !== e.pointerId) return;
                drag.current = null;
                setDragging(false);
                if (dx > SWIPE) decide(true);
                else if (dx < -SWIPE) decide(false);
                else setDx(0);
              }}
              onPointerCancel={() => {
                drag.current = null;
                setDragging(false);
                setDx(0);
              }}
            >
              <span
                className="stamp absolute top-5 left-5 rotate-[-14deg] border-emerald-500 text-emerald-600"
                style={{ opacity: Math.max(0, lean) }}
              >
                TAMA
              </span>
              <span
                className="stamp absolute top-5 right-5 rotate-[14deg] border-rose-500 text-rose-600"
                style={{ opacity: Math.max(0, -lean) }}
              >
                MALI
              </span>
              <p className="text-ink text-center text-xl leading-snug font-bold sm:text-2xl">
                {card.text}
              </p>
            </div>
          </div>

          {feedback ? (
            <div
              className={`pop-fb rounded-2xl px-4 py-3 text-sm ${
                feedback.right
                  ? "bg-emerald-50 text-emerald-900"
                  : "bg-rose-50 text-rose-900"
              }`}
            >
              <p className="font-black">
                {feedback.right ? "✓ Tama ka!" : "✗ Hindi tama."}{" "}
                {feedback.card.tama ? "Ito ay TAMA." : "Ito ay MALI."}
              </p>
              <div className="mt-0.5 flex flex-wrap items-end justify-between gap-2">
                <p>{feedback.card.why}</p>
                <button
                  type="button"
                  onClick={next}
                  className={`rounded-lg px-3 py-1 text-xs font-black text-white ${feedback.right ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700"}`}
                >
                  Susunod ›
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => decide(false)}
                className="rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 py-4 text-lg font-black text-white shadow-md transition hover:-translate-y-0.5 active:scale-95"
              >
                ✗ MALI
              </button>
              <button
                type="button"
                onClick={() => decide(true)}
                className="rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 py-4 text-lg font-black text-white shadow-md transition hover:-translate-y-0.5 active:scale-95"
              >
                ✓ TAMA
              </button>
            </div>
          )}
        </div>
      )}

      {phase === "done" && (
        <Card className="px-4 py-4">
          {!finish.data ? (
            <p className="text-muted text-center text-sm">
              {finish.error
                ? finish.error.message
                : "Tinitingnan ang iyong sagot…"}
            </p>
          ) : (
            <LevelResult
              heading={
                finish.data.stars === 3
                  ? "🏆 Napakahusay!"
                  : finish.data.stars > 0
                    ? "🇵🇭 Magaling!"
                    : "Subukan muli!"
              }
              stars={finish.data.stars}
              newStars={finish.data.newStars}
              best={finish.data.best}
              failNote={`Kailangan ng ${TAMA_STARS[0]} tamang sagot para sa isang star.`}
              stats={[
                {
                  label: "Tama",
                  value: `${finish.data.right}/${finish.data.total}`,
                },
              ]}
              nextHref={nextId ? `/student/games/tama/${nextId}` : null}
              onRetry={onRetry}
            >
              {mistakes.length > 0 && (
                <div className="mx-auto mt-4 max-w-xl space-y-1.5 text-left">
                  <p className="text-muted text-xs font-bold tracking-wide uppercase">
                    Balikan ang mga mali
                  </p>
                  {mistakes.map(({ card: c }) => (
                    <div
                      key={c.id}
                      className="border-line bg-surface rounded-xl border px-3 py-2 text-xs"
                    >
                      <p className="text-ink font-bold">{c.text}</p>
                      <p className="mt-0.5 text-emerald-700">
                        → {c.tama ? "TAMA" : "MALI"}:{" "}
                        <span className="text-muted">{c.why}</span>
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
        @keyframes go-btn { 0%,100% { transform: scale(1) } 50% { transform: scale(1.08) } }
        .card-in { animation: card-in .35s cubic-bezier(.2,1.3,.4,1) both; }
        @keyframes card-in { from { opacity: 0; scale: .9 } }
        .stamp { border-width: 3px; border-radius: 10px; padding: 2px 10px; font-size: 1.4rem; font-weight: 900; letter-spacing: .1em; }
        .pop-fb { animation: pop-fb .3s ease-out both; }
        @keyframes pop-fb { from { transform: translateY(6px); opacity: 0 } }
        @media (prefers-reduced-motion: reduce) { .go-btn, .card-in, .pop-fb { animation: none } }
      `}</style>
    </div>
  );
}
