"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { SoundToggle } from "~/app/_components/race/race-view";
import { sfx, unlock } from "~/app/_components/sfx";
import { Card } from "~/app/_components/ui";
import { GRAMMAR_LEVELS, type GrammarLevel } from "~/lib/games/grammar-hunt";
import { api } from "~/trpc/react";
import {
  fixedOrder,
  LevelHeader,
  LevelResult,
  LockedLevel,
} from "../../_components/shared";

/**
 * One Grammar Hunt level: five sentences, one wrong word each. Tap the
 * wrong word, pick its correction, read why, and go on to the next one.
 * Wrong words and wrong fixes count as mistakes; the server scores them.
 */
export function GrammarScreen({ levelId }: { levelId: string }) {
  const level = GRAMMAR_LEVELS.find((l) => l.id === levelId)!;
  const access = api.game.level.useQuery(
    { game: "grammar", levelId },
    { retry: false },
  );
  const [attempt, setAttempt] = useState(0);

  if (access.error) {
    return <LockedLevel what="Level" message={access.error.message} />;
  }
  return (
    <Hunt
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

function Hunt({
  level,
  best,
  number,
  count,
  nextId,
  ready,
  onRetry,
}: {
  level: GrammarLevel;
  best: number;
  number?: number;
  count?: number;
  nextId: string | null;
  ready: boolean;
  onRetry: () => void;
}) {
  const router = useRouter();
  const utils = api.useUtils();
  const n = level.sentences.length;
  const [index, setIndex] = useState(0);
  const [taps, setTaps] = useState<number[][]>(() =>
    level.sentences.map(() => []),
  );
  const [picks, setPicks] = useState<number[][]>(() =>
    level.sentences.map(() => []),
  );
  const [open, setOpen] = useState(false);
  const [miss, setMiss] = useState<{ word: number; at: number } | null>(null);
  const [wrongFix, setWrongFix] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const finish = api.game.finishGrammar.useMutation({
    onSuccess: () => {
      void utils.game.hub.invalidate();
      router.refresh();
    },
  });

  const sentence = level.sentences[index]!;
  const fixed = picks[index]!.at(-1) === 0;
  const mistakes =
    taps.reduce(
      (sum, t, i) =>
        sum + t.filter((w) => w !== level.sentences[i]!.wrong).length,
      0,
    ) + picks.reduce((sum, p) => sum + p.filter((x) => x !== 0).length, 0);

  const tap = (w: number) => {
    unlock();
    if (fixed) return;
    setTaps((t) => t.map((x, i) => (i === index ? [...x, w] : x)));
    if (w !== sentence.wrong) {
      sfx.hurt();
      setMiss({ word: w, at: Date.now() });
      setOpen(false);
      return;
    }
    sfx.select();
    setWrongFix(null);
    setOpen(true);
  };

  const pick = (k: number) => {
    setPicks((p) => p.map((x, i) => (i === index ? [...x, k] : x)));
    if (k === 0) {
      sfx.coin();
      setOpen(false);
      setWrongFix(null);
    } else {
      sfx.hurt();
      setWrongFix(k);
    }
  };

  const advance = () => {
    setOpen(false);
    setMiss(null);
    if (index + 1 >= n) setDone(true);
    else setIndex((i) => i + 1);
  };

  useEffect(() => {
    if (done && ready && !finish.data && !finish.isPending && !finish.error) {
      finish.mutate({ levelId: level.id, taps, picks });
    }
  }, [done, ready, finish, level.id, taps, picks]);

  useEffect(() => {
    if (finish.data && finish.data.stars > 0) sfx.fanfare();
  }, [finish.data]);

  const order = fixedOrder(`${level.id}:${index}`, 3);

  return (
    <div className="mx-auto max-w-3xl space-y-4 max-sm:space-y-3">
      <LevelHeader
        game="Grammar Hunt"
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
        <Card className="overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 bg-gradient-to-r from-indigo-600 to-sky-600 px-5 py-3 text-white">
            <p className="text-sm font-black">
              🔎 {level.skill}
              <span className="ml-2 font-bold text-white/75">
                Sentence {index + 1} of {n}
              </span>
            </p>
            <div className="flex items-center gap-3 text-xs font-black">
              <span className="flex gap-1">
                {level.sentences.map((_, i) => (
                  <span
                    key={i}
                    className={`size-2.5 rounded-full ${i < index || (i === index && fixed) ? "bg-emerald-300" : i === index ? "bg-white" : "bg-white/30"}`}
                  />
                ))}
              </span>
              <span className={mistakes ? "text-rose-200" : "text-white/75"}>
                {mistakes} mistake{mistakes === 1 ? "" : "s"}
              </span>
            </div>
          </div>

          <div className="px-5 py-6 max-sm:px-3">
            <p className="text-muted mb-3 text-center text-xs font-bold tracking-wide uppercase">
              {fixed ? "Fixed!" : "One word is wrong. Tap it!"}
            </p>
            <p
              key={index}
              className="sentence-in flex flex-wrap justify-center gap-x-1.5 gap-y-2 text-xl leading-snug font-bold sm:text-2xl"
            >
              {sentence.words.map((word, w) => {
                const isWrong = w === sentence.wrong;
                const shown = isWrong && fixed ? sentence.fixes[0] : word;
                const missed = miss?.word === w;
                return (
                  <button
                    key={missed ? `${w}-${miss.at}` : w}
                    type="button"
                    onClick={() => tap(w)}
                    disabled={fixed}
                    className={`word rounded-lg px-1.5 py-0.5 transition ${
                      isWrong && fixed
                        ? "word-fixed bg-emerald-100 text-emerald-800"
                        : isWrong && open
                          ? "bg-amber-200 text-amber-900"
                          : missed
                            ? "word-miss bg-rose-100 text-rose-700"
                            : "text-ink hover:bg-indigo-50"
                    }`}
                  >
                    {shown}
                  </button>
                );
              })}
            </p>

            {open && !fixed && (
              <div className="pop-fb mx-auto mt-5 max-w-md rounded-2xl border border-amber-300 bg-amber-50 p-3">
                <p className="mb-2 text-center text-xs font-black tracking-wide text-amber-800 uppercase">
                  ✏️ Replace “{sentence.words[sentence.wrong]}” with…
                </p>
                <div className="grid gap-2 sm:grid-cols-3">
                  {order.map((k) => (
                    <button
                      key={`${index}-${k}-${wrongFix === k ? "x" : ""}`}
                      type="button"
                      onClick={() => pick(k)}
                      disabled={wrongFix === k}
                      className={`fix-btn rounded-xl px-3 py-2.5 text-base font-black transition ${
                        wrongFix === k
                          ? "word-miss bg-rose-100 text-rose-400 line-through"
                          : "bg-white text-indigo-700 shadow-sm hover:bg-indigo-600 hover:text-white"
                      }`}
                    >
                      {sentence.fixes[k]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {fixed && (
              <div className="pop-fb mx-auto mt-5 max-w-lg rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                <p className="font-black">✓ Nice catch!</p>
                <div className="mt-0.5 flex flex-wrap items-end justify-between gap-2">
                  <p>{sentence.why}</p>
                  <button
                    type="button"
                    onClick={advance}
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-black text-white hover:bg-emerald-700"
                  >
                    {index + 1 >= n ? "Finish ✓" : "Next sentence ›"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {done && (
        <Card className="px-4 py-4">
          {!finish.data ? (
            <p className="text-muted text-center text-sm">
              {finish.error ? finish.error.message : "Checking your fixes…"}
            </p>
          ) : (
            <LevelResult
              heading={
                finish.data.mistakes === 0
                  ? "🏆 Grammar master!"
                  : "🔎 All sentences fixed!"
              }
              stars={finish.data.stars}
              newStars={finish.data.newStars}
              best={finish.data.best}
              failNote=""
              stats={[
                { label: "Sentences", value: String(n) },
                { label: "Mistakes", value: String(finish.data.mistakes) },
              ]}
              nextHref={nextId ? `/student/games/grammar/${nextId}` : null}
              onRetry={onRetry}
            >
              <div className="mx-auto mt-4 max-w-xl space-y-1.5 text-left">
                {level.sentences.map((s, i) => (
                  <p
                    key={i}
                    className="border-line bg-surface rounded-xl border px-3 py-2 text-xs"
                  >
                    <span className="text-ink font-bold">
                      {s.words
                        .map((w, k) => (k === s.wrong ? s.fixes[0] : w))
                        .join(" ")}
                    </span>
                    <span className="text-muted block">{s.why}</span>
                  </p>
                ))}
              </div>
              <p className="text-muted mt-3 text-xs">
                3 stars for no mistakes · 2 stars for 1–2 mistakes · 1 star for
                more.
              </p>
            </LevelResult>
          )}
        </Card>
      )}

      <style>{`
        .sentence-in { animation: sentence-in .35s ease-out both; }
        @keyframes sentence-in { from { transform: translateY(10px); opacity: 0 } }
        .word-miss { animation: word-miss .45s ease-in-out; }
        @keyframes word-miss { 0%,100% { transform: translateX(0) } 20% { transform: translateX(-5px) } 40% { transform: translateX(5px) } 60% { transform: translateX(-3px) } 80% { transform: translateX(3px) } }
        .word-fixed { animation: word-fixed .6s cubic-bezier(.2,1.4,.4,1); }
        @keyframes word-fixed { 0% { transform: scale(.6) } 60% { transform: scale(1.2) } }
        .pop-fb { animation: pop-fb .3s ease-out both; }
        @keyframes pop-fb { from { transform: translateY(6px); opacity: 0 } }
        @media (prefers-reduced-motion: reduce) { .sentence-in, .word-miss, .word-fixed, .pop-fb { animation: none } }
      `}</style>
    </div>
  );
}
