"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { SoundToggle } from "~/app/_components/race/race-view";
import { sfx, unlock } from "~/app/_components/sfx";
import { Card } from "~/app/_components/ui";
import { GAMES, type MATCH_GAMES } from "~/lib/games/catalog";
import { dealMatch, type MatchCard } from "~/lib/games/memory-match";
import { api } from "~/trpc/react";
import { HeroRive } from "../../_components/hero-rive";
import {
  LevelHeader,
  LevelResult,
  LockedLevel,
} from "../../_components/shared";

type MatchGame = (typeof MATCH_GAMES)[number];

/** What the student's hero says while they play. */
const CHEERS = ["Nice match! 🎉", "You remembered!", "Galing! Keep going!", "That's a pair!"];
const NUDGES = [
  "Almost! Remember where those were.",
  "Not a pair. Try another card!",
  "Look closely at each meaning.",
];
const pick = (list: string[], n: number) => list[n % list.length]!;

/** How long two cards that don't belong together stay face up. */
const SHOW_MISS_MS = 1000;

/** One Memory Match level: pair each word with its meaning. */
export function MatchScreen({
  game,
  levelId,
}: {
  game: MatchGame;
  levelId: string;
}) {
  const access = api.game.level.useQuery({ game, levelId }, { retry: false });
  const [attempt, setAttempt] = useState(0);

  if (access.error) {
    return <LockedLevel what="Level" message={access.error.message} />;
  }
  return (
    <Match
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

function Match({
  game,
  levelId,
  best,
  number,
  count,
  nextId,
  ready,
  onRetry,
}: {
  game: MatchGame;
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
  const byId = new Map(level.words.map((w) => [w.id, w]));
  // Dealt after mounting: the order is random, so it can't render on the
  // server and match in the browser.
  const [cards, setCards] = useState<MatchCard[] | null>(null);
  useEffect(() => setCards(dealMatch(level.words)), [level.words]);

  const [open, setOpen] = useState<string[]>([]); // card keys face up, not yet matched
  const [matched, setMatched] = useState<string[]>([]); // word ids
  const [misses, setMisses] = useState(0);
  const [wrong, setWrong] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const busy = useRef(false);
  // the hero's reaction to the last move: what it says, and a little hop
  const [say, setSay] = useState("Find the pairs! I'll cheer you on.");
  const [hop, setHop] = useState<"" | "yay" | "aww">("");
  const react = (kind: "yay" | "aww", line: string) => {
    setSay(line);
    setHop(kind);
    setTimeout(() => setHop(""), 700);
  };
  const finish = api.game.finishMatch.useMutation({
    onSuccess: () => {
      void utils.game.hub.invalidate();
      router.refresh();
    },
  });

  const done = matched.length === level.words.length;

  useEffect(() => {
    if (!startedAt || done) return;
    const timer = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(timer);
  }, [startedAt, done]);

  useEffect(() => {
    if (done && ready && !finish.data && !finish.isPending && !finish.error) {
      finish.mutate({ game, levelId, matched, misses });
    }
  }, [done, ready, finish, game, levelId, matched, misses]);

  useEffect(() => {
    if (finish.data) sfx.fanfare();
  }, [finish.data]);

  const seconds = startedAt
    ? Math.max(0, Math.round(((done ? now : now || Date.now()) - startedAt) / 1000))
    : 0;
  const clock = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

  const flip = (card: MatchCard) => {
    unlock();
    if (busy.current || done) return;
    if (matched.includes(card.wordId) || open.includes(card.key)) return;
    if (!startedAt) {
      setStartedAt(Date.now());
      setNow(Date.now());
    }
    sfx.select();
    if (open.length === 0) {
      setOpen([card.key]);
      return;
    }
    const first = cards!.find((c) => c.key === open[0])!;
    setOpen([first.key, card.key]);
    if (first.wordId === card.wordId) {
      // a word and its own meaning: keep them
      setTimeout(() => {
        setMatched((m) => [...m, card.wordId]);
        setOpen([]);
        sfx.coin();
        react(
          "yay",
          matched.length + 1 === level.words.length
            ? "We did it! 🏆"
            : pick(CHEERS, matched.length),
        );
      }, 350);
    } else {
      busy.current = true;
      setWrong(true);
      setMisses((n) => n + 1);
      sfx.hurt();
      react("aww", pick(NUDGES, misses));
      setTimeout(() => {
        setOpen([]);
        setWrong(false);
        busy.current = false;
      }, SHOW_MISS_MS);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <LevelHeader
        game="Memory Match"
        unit={level.unit}
        unitTitle={level.unitTitle}
        title={level.title}
        number={number}
        count={count}
        best={best}
      >
        <SoundToggle tone="light" />
      </LevelHeader>

      {done ? (
        <Card className="px-4 py-4">
          {!finish.data ? (
            <p className="text-muted text-center text-sm">
              {finish.error ? finish.error.message : "Checking your pairs…"}
            </p>
          ) : (
            <LevelResult
              heading={
                finish.data.stars === 3
                  ? "🃏 Memory master!"
                  : "🃏 All pairs matched!"
              }
              stars={finish.data.stars}
              newStars={finish.data.newStars}
              best={finish.data.best}
              failNote=""
              stats={[
                { label: "Pairs", value: String(finish.data.pairs) },
                { label: "Misses", value: String(finish.data.misses) },
                { label: "Time", value: clock },
              ]}
              nextHref={nextId ? `/student/games/match/${nextId}` : null}
              onRetry={onRetry}
            />
          )}
        </Card>
      ) : (
        <Card className="p-4">
          <div className="mb-3 flex items-center gap-3">
            <div
              className={`size-16 shrink-0 overflow-hidden rounded-2xl bg-indigo-950 transition-transform duration-300 sm:size-20 ${
                hop === "yay"
                  ? "motion-safe:-translate-y-2 motion-safe:scale-110"
                  : hop === "aww"
                    ? "motion-safe:-rotate-6"
                    : ""
              }`}
              aria-hidden="true"
            >
              <HeroRive className="size-full" />
            </div>
            <p
              role="status"
              className={`relative rounded-2xl px-3 py-2 text-sm font-bold ${
                hop === "aww"
                  ? "bg-rose-50 text-rose-800"
                  : "bg-amber-50 text-amber-900"
              }`}
            >
              {say}
            </p>
          </div>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-muted text-xs font-semibold">
              Flip two cards. Keep a word and its meaning together. Fewer
              misses earn more stars.
            </p>
            <div className="flex gap-2 text-xs font-black">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                ✓ {matched.length}/{level.words.length}
              </span>
              <span className="rounded-full bg-rose-50 px-3 py-1 text-rose-700">
                ✗ {misses}
              </span>
              <span className="bg-canvas text-ink rounded-full px-3 py-1 tabular-nums">
                ⏱ {clock}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3">
            {cards?.map((card) => {
              const word = byId.get(card.wordId)!;
              const isMatched = matched.includes(card.wordId);
              const isOpen = isMatched || open.includes(card.key);
              const isWrong = wrong && open.includes(card.key);
              return (
                <button
                  key={card.key}
                  type="button"
                  onClick={() => flip(card)}
                  aria-label={
                    isOpen
                      ? card.side === "word"
                        ? `Word: ${word.word}`
                        : `Meaning: ${word.clue}`
                      : "Face-down card"
                  }
                  className="aspect-[4/5] sm:aspect-[5/4]"
                >
                  {isOpen ? (
                    // face up: the word or its meaning
                    <span
                      key="face"
                      className={`motion-safe:animate-card-flip grid size-full place-items-center rounded-xl border-2 p-1.5 text-center sm:p-2 ${
                        isMatched
                          ? "border-emerald-300 bg-emerald-50"
                          : isWrong
                            ? "border-rose-300 bg-rose-50"
                            : "border-brand bg-surface"
                      }`}
                    >
                      {card.side === "word" ? (
                        <span
                          className={`text-ink font-black [overflow-wrap:anywhere] ${
                            word.word.length > 9
                              ? "text-[11px] sm:text-base"
                              : word.word.length > 7
                                ? "text-xs sm:text-lg"
                                : "text-sm sm:text-lg"
                          }`}
                        >
                          {word.word}
                        </span>
                      ) : (
                        <span className="text-[11px] leading-snug font-semibold text-slate-700 sm:text-sm">
                          {word.clue}
                        </span>
                      )}
                    </span>
                  ) : (
                    // face down
                    <span
                      key="back"
                      className="motion-safe:animate-card-flip grid size-full place-items-center rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 text-3xl text-white shadow-sm hover:brightness-110"
                    >
                      🃏
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
