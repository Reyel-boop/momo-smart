"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { SoundToggle } from "~/app/_components/race/race-view";
import { sfx, unlock } from "~/app/_components/sfx";
import { Card } from "~/app/_components/ui";
import { GAMES, type SCRAMBLE_GAMES } from "~/lib/games/catalog";
import {
  scrambleOf,
  type ScrambleLevel,
  type ScrambleWord,
} from "~/lib/games/word-scramble";
import { api } from "~/trpc/react";
import {
  LevelHeader,
  LevelResult,
  LockedLevel,
  shuffled,
} from "../../_components/shared";

type ScrambleGame = (typeof SCRAMBLE_GAMES)[number];
type Answer = { guesses: string[]; hints: number };

/**
 * One Word Scramble level, for any subject: spell each word from its clue
 * by tapping the scrambled tiles (or typing). Wrong guesses and hints count
 * as mistakes; the server scores the guesses once every word is spelled.
 */
export function WordsScreen({
  game,
  levelId,
}: {
  game: ScrambleGame;
  levelId: string;
}) {
  const level = GAMES[game].levels.find((l) => l.id === levelId)!;
  const access = api.game.level.useQuery({ game, levelId }, { retry: false });
  const [attempt, setAttempt] = useState(0);

  if (access.error) {
    return <LockedLevel what="Level" message={access.error.message} />;
  }
  return (
    <Puzzle
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

function Puzzle({
  game,
  level,
  best,
  number,
  count,
  nextId,
  ready,
  onRetry,
}: {
  game: ScrambleGame;
  level: ScrambleLevel;
  best: number;
  number?: number;
  count?: number;
  nextId: string | null;
  ready: boolean;
  onRetry: () => void;
}) {
  const router = useRouter();
  const utils = api.useUtils();
  const [answers, setAnswers] = useState<Answer[]>([]);
  const finish = api.game.finishScramble.useMutation({
    onSuccess: () => {
      void utils.game.hub.invalidate();
      router.refresh();
    },
  });

  const index = answers.length;
  const done = index === level.words.length;
  const mistakes = answers.reduce(
    (sum, a) => sum + a.guesses.length - 1 + a.hints,
    0,
  );

  useEffect(() => {
    if (done && ready && !finish.data && !finish.isPending && !finish.error) {
      finish.mutate({ game, levelId: level.id, answers });
    }
  }, [done, ready, finish, game, level.id, answers]);

  useEffect(() => {
    if (finish.data && finish.data.stars > 0) sfx.fanfare();
  }, [finish.data]);

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <LevelHeader
        game={GAMES[game].title}
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
        <div className="flex items-center gap-1.5">
          {level.words.map((w, i) => (
            <span
              key={w.id}
              className={`h-2.5 w-8 rounded-full transition ${
                i < index
                  ? "bg-emerald-500"
                  : i === index
                    ? "bg-amber-400"
                    : "bg-slate-200"
              }`}
            />
          ))}
        </div>
        <p className="text-sm font-black">
          <span className="text-muted mr-3">
            Word {Math.min(index + 1, level.words.length)} of{" "}
            {level.words.length}
          </span>
          <span className={mistakes ? "text-rose-600" : "text-muted"}>
            {mistakes} mistake{mistakes === 1 ? "" : "s"}
          </span>
        </p>
      </Card>

      {!done ? (
        <Word
          key={level.words[index]!.id}
          word={level.words[index]!}
          onSolved={(a) => setAnswers((all) => [...all, a])}
        />
      ) : (
        <Card className="px-4 py-4">
          {!finish.data ? (
            <p className="text-muted text-center text-sm">
              {finish.error ? finish.error.message : "Checking your words…"}
            </p>
          ) : (
            <LevelResult
              heading={
                finish.data.mistakes === 0
                  ? "🏆 Perfect spelling!"
                  : "🔤 Every word spelled!"
              }
              stars={finish.data.stars}
              newStars={finish.data.newStars}
              best={finish.data.best}
              failNote=""
              stats={[
                { label: "Words", value: String(level.words.length) },
                { label: "Mistakes", value: String(finish.data.mistakes) },
              ]}
              nextHref={nextId ? `/student/games/words/${nextId}` : null}
              onRetry={onRetry}
            >
              <div className="mx-auto mt-4 grid max-w-xl gap-2 text-left sm:grid-cols-2">
                {level.words.map((w) => (
                  <p
                    key={w.id}
                    className="border-line bg-surface rounded-xl border px-3 py-2 text-xs"
                  >
                    <span className="text-ink font-black tracking-wide">
                      {w.word}
                    </span>{" "}
                    <span className="text-muted">— {w.clue}</span>
                  </p>
                ))}
              </div>
              <p className="text-muted mt-3 text-xs">
                3 stars for no mistakes · 2 stars for 1–3 · 1 star for more.
                Hints count as mistakes.
              </p>
            </LevelResult>
          )}
        </Card>
      )}

      <style>{`
        .tile-pop { animation: tile-pop .18s ease-out; }
        @keyframes tile-pop { from { transform: scale(.7) } }
        .word-shake { animation: word-shake .45s ease-in-out; }
        @keyframes word-shake { 0%,100% { transform: translateX(0) } 20% { transform: translateX(-8px) } 40% { transform: translateX(8px) } 60% { transform: translateX(-5px) } 80% { transform: translateX(5px) } }
        .word-win { animation: word-win .6s cubic-bezier(.2,1.4,.4,1); }
        @keyframes word-win { 40% { transform: scale(1.08) } }
        @media (prefers-reduced-motion: reduce) { .tile-pop, .word-shake, .word-win { animation: none } }
      `}</style>
    </div>
  );
}

/** One word: the clue, the slots being filled and the letter tiles. */
function Word({
  word,
  onSolved,
}: {
  word: ScrambleWord;
  onSolved: (answer: Answer) => void;
}) {
  const answer = word.word;
  const [tiles, setTiles] = useState(() => scrambleOf(word));
  // Each slot holds the index of the tile placed in it.
  const [slots, setSlots] = useState<(number | null)[]>(() =>
    answer.split("").map(() => null),
  );
  const [hints, setHints] = useState(0);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [shake, setShake] = useState(0);
  const [won, setWon] = useState(false);

  const used = new Set(slots.filter((s): s is number => s !== null));

  /** Checks a full row of slots, or keeps them when not full yet. */
  const settle = (next: (number | null)[]) => {
    if (next.some((s) => s === null)) {
      setSlots(next);
      return;
    }
    const guess = next.map((s) => tiles[s!]).join("");
    const all = [...guesses, guess];
    setGuesses(all);
    if (guess === answer) {
      sfx.coin();
      setSlots(next);
      setWon(true);
      setTimeout(() => onSolved({ guesses: all, hints }), 900);
    } else {
      sfx.hurt();
      setShake((n) => n + 1);
      setSlots(next.map((s, i) => (i < hints ? s : null)));
    }
  };

  const place = (t: number) => {
    unlock();
    if (won || used.has(t)) return;
    const at = slots.findIndex((s) => s === null);
    if (at < 0) return;
    sfx.select();
    settle(slots.map((s, i) => (i === at ? t : s)));
  };

  const remove = (i: number) => {
    if (won || i < hints || slots[i] === null) return;
    setSlots(slots.map((s, k) => (k === i ? null : s)));
  };

  const clear = () => {
    if (won) return;
    setSlots(slots.map((s, i) => (i < hints ? s : null)));
  };

  /** Locks in the next letter: the first `hints + 1` slots are right. */
  const hint = () => {
    unlock();
    if (won || hints >= answer.length - 1) return;
    const n = hints + 1;
    const taken = new Set<number>();
    const next = answer.split("").map((ch, i) => {
      if (i >= n) return null;
      const t = tiles.findIndex((x, k) => x === ch && !taken.has(k));
      taken.add(t);
      return t;
    });
    setHints(n);
    sfx.select();
    setSlots(next);
  };

  // Typing works too: a letter places a matching tile, Backspace removes.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === "Backspace") {
        for (let i = slots.length - 1; i >= hints; i--) {
          if (slots[i] !== null) return remove(i);
        }
        return;
      }
      const ch = e.key.toUpperCase();
      if (!/^[A-Z]$/.test(ch)) return;
      const t = tiles.findIndex((x, k) => x === ch && !used.has(k));
      if (t >= 0) place(t);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // Long words get smaller tiles so they fit on a phone.
  const size =
    answer.length > 11
      ? "size-7 text-sm sm:size-10 sm:text-lg"
      : answer.length > 8
        ? "size-8 text-base sm:size-11 sm:text-xl"
        : "size-10 text-lg sm:size-12 sm:text-2xl";

  return (
    <Card className="space-y-6 px-4 py-6 text-center sm:px-6">
      <div>
        <p className="text-muted text-xs font-bold tracking-wide uppercase">
          Clue
        </p>
        <p className="text-ink mt-1 text-xl font-extrabold sm:text-2xl">
          {word.clue}
        </p>
        <p className="text-muted mt-1 text-xs">
          {answer.length} letters
          {guesses.length - (won ? 1 : 0) > 0 &&
            ` · ${guesses.length - (won ? 1 : 0)} wrong`}
        </p>
      </div>

      <div
        key={shake}
        className={`flex flex-wrap justify-center gap-1 sm:gap-1.5 ${shake ? "word-shake" : ""} ${won ? "word-win" : ""}`}
      >
        {slots.map((s, i) => (
          <button
            key={`${i}-${s}`}
            type="button"
            onClick={() => remove(i)}
            aria-label={s === null ? `Empty letter ${i + 1}` : tiles[s]}
            className={`${size} flex items-center justify-center rounded-lg border-2 font-black transition ${
              won
                ? "border-emerald-500 bg-emerald-500 text-white"
                : i < hints
                  ? "border-amber-400 bg-amber-100 text-amber-800"
                  : s === null
                    ? "border-dashed border-slate-300 bg-slate-50"
                    : "tile-pop border-navy bg-navy text-white"
            }`}
          >
            {s === null ? "" : tiles[s]}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
        {tiles.map((ch, t) => (
          <button
            key={t}
            type="button"
            onClick={() => place(t)}
            disabled={used.has(t) || won}
            className={`${size} flex items-center justify-center rounded-xl font-black shadow-sm transition ${
              used.has(t)
                ? "bg-slate-100 text-slate-300 shadow-none"
                : "border-b-4 border-amber-500 bg-amber-300 text-slate-900 hover:-translate-y-0.5 hover:bg-amber-200 active:translate-y-0.5 active:border-b-2"
            }`}
          >
            {ch}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={clear}
          disabled={won}
          className="border-line bg-surface text-ink hover:bg-canvas rounded-xl border px-4 py-2 text-sm font-bold disabled:opacity-50"
        >
          ✕ Clear
        </button>
        <button
          type="button"
          onClick={() => {
            setTiles(shuffled(tiles));
            setSlots(answer.split("").map(() => null));
          }}
          disabled={won || hints > 0}
          title={hints > 0 ? "Can't shuffle after a hint" : undefined}
          className="border-line bg-surface text-ink hover:bg-canvas rounded-xl border px-4 py-2 text-sm font-bold disabled:opacity-50"
        >
          🔀 Shuffle
        </button>
        <button
          type="button"
          onClick={hint}
          disabled={won || hints >= answer.length - 1}
          className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-bold text-amber-800 hover:bg-amber-100 disabled:opacity-50"
        >
          💡 Hint <span className="font-semibold">(+1 mistake)</span>
        </button>
      </div>
      {won && (
        <p className="text-lg font-black text-emerald-600">✓ {answer}!</p>
      )}
    </Card>
  );
}
