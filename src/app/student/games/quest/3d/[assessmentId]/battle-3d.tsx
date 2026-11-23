"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Confetti, SoundToggle } from "~/app/_components/race/race-view";
import { sfx, unlock } from "~/app/_components/sfx";
import { api, type RouterOutputs } from "~/trpc/react";
import type { Stage } from "./stage";

type Data = RouterOutputs["game"]["questQuestions"];
type Question = Data["questions"][number];

const HERO_HEARTS = 5;
/** Right answers in a row that charge the rose-petal power strike (2 damage). */
const COMBO = 3;

const OPTION_STYLES = [
  "from-sky-400 to-blue-500",
  "from-emerald-400 to-green-500",
  "from-amber-400 to-orange-500",
  "from-pink-400 to-rose-500",
];

const shuffle = <V,>(a: V[]) => {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j]!, b[i]!];
  }
  return b;
};

type Phase = "loading" | "intro" | "ask" | "busy" | "review" | "won" | "lost";
type Pop = { id: number; text: string; side: "hero" | "monster"; tone: string };

/**
 * Momo's Quest 3D Battle: the student's ghost mage fights the Skull Warrior
 * with one unit's questions. A right answer casts a spell (three in a row:
 * the rose-petal power strike for double damage); a wrong one lets the
 * monster strike and shows the right answer. Every answer is checked by the
 * server, and each question's first correct answer earns a star.
 */
export function Battle3D({
  assessmentId,
  data,
}: {
  assessmentId: string;
  data: Data;
}) {
  const arena = { kind: "unit" as const, id: assessmentId };
  const monsterMax = Math.min(8, Math.max(5, data.questions.length));
  const check = api.game.questAnswer.useMutation();

  const canvas = useRef<HTMLCanvasElement>(null);
  const stage = useRef<Stage | null>(null);
  const [loaded, setLoaded] = useState(0);
  const [failed, setFailed] = useState(false);
  const [phase, setPhase] = useState<Phase>("loading");
  const [deck, setDeck] = useState<Question[]>(() => shuffle(data.questions));
  const [cursor, setCursor] = useState(0);
  const [hearts, setHearts] = useState(HERO_HEARTS);
  const [monsterHp, setMonsterHp] = useState(monsterMax);
  const [combo, setCombo] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [rightId, setRightId] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [right, setRight] = useState(0);
  const [asked, setAsked] = useState(0);
  const [stars, setStars] = useState(0);
  const [pops, setPops] = useState<Pop[]>([]);
  const [error, setError] = useState<string | null>(null);

  // build the 3D stage once (three.js is loaded only on this page)
  useEffect(() => {
    let gone = false;
    void (async () => {
      try {
        const [THREE, { GLTFLoader }, { createStage }] = await Promise.all([
          import("three"),
          import("three/examples/jsm/loaders/GLTFLoader.js"),
          import("./stage"),
        ]);
        if (gone || !canvas.current) return;
        const s = await createStage(
          THREE,
          GLTFLoader,
          canvas.current,
          setLoaded,
        );
        if (gone) return s.dispose();
        stage.current = s;
        setPhase("intro");
      } catch {
        if (!gone) setFailed(true);
      }
    })();
    return () => {
      gone = true;
      stage.current?.dispose();
      stage.current = null;
    };
  }, []);

  const question = deck[cursor % deck.length]!;

  const pop = (side: Pop["side"], text: string, tone: string) => {
    const p = { id: Math.random(), text, side, tone };
    setPops((list) => [...list, p]);
    setTimeout(
      () => setPops((list) => list.filter((x) => x.id !== p.id)),
      1400,
    );
  };

  const next = () => {
    setPicked(null);
    setRightId(null);
    setExplanation(null);
    setError(null);
    if (cursor + 1 >= deck.length) {
      // out of questions: go round again in a new order
      setDeck(shuffle(data.questions));
      setCursor(0);
    } else setCursor((c) => c + 1);
    setPhase("ask");
  };

  const answer = async (optionId: string) => {
    const s = stage.current;
    if (phase !== "ask" || !s) return;
    unlock();
    setPicked(optionId);
    setPhase("busy");
    let result;
    try {
      result = await check.mutateAsync({
        arena,
        questionId: question.id,
        optionId,
      });
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Couldn't check that answer. Try again.",
      );
      setPicked(null);
      setPhase("ask");
      return;
    }
    setAsked((n) => n + 1);
    setRightId(result.correctOptionId);
    setExplanation(result.explanation ?? null);

    if (result.correct) {
      const streak = combo + 1;
      const power = streak % COMBO === 0;
      setCombo(streak);
      setRight((n) => n + 1);
      if (result.newStar) {
        setStars((n) => n + 1);
        pop("hero", "⭐ +1", "text-amber-300");
      }
      sfx.zap();
      await s.heroAttack(power);
      const dmg = power ? 2 : 1;
      if (power) sfx.superHit();
      else sfx.hit();
      pop(
        "monster",
        power ? `🌹 −${dmg} POWER!` : `−${dmg}`,
        power ? "text-pink-300" : "text-white",
      );
      const hp = Math.max(0, monsterHp - dmg);
      setMonsterHp(hp);
      if (hp === 0) {
        await s.monsterDefeat();
        sfx.fanfare();
        void s.heroWin();
        setPhase("won");
        return;
      }
      setTimeout(next, 600);
      return;
    }

    setCombo(0);
    sfx.hurt();
    pop("monster", "✗ Miss", "text-rose-300");
    await s.monsterAttack(Math.random() < 0.35);
    const left = hearts - 1;
    setHearts(left);
    pop("hero", "−💗", "text-rose-300");
    if (left === 0) {
      sfx.faint();
      await s.heroFall();
      setPhase("lost");
      return;
    }
    setPhase("review");
  };

  const restart = () => {
    stage.current?.reset();
    setDeck(shuffle(data.questions));
    setCursor(0);
    setHearts(HERO_HEARTS);
    setMonsterHp(monsterMax);
    setCombo(0);
    setRight(0);
    setAsked(0);
    setStars(0);
    setPicked(null);
    setRightId(null);
    setExplanation(null);
    setPhase("intro");
  };

  // number keys 1–4 pick an answer
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const o = question.options[Number(e.key) - 1];
      if (o && phase === "ask") void answer(o.id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="mx-auto max-w-4xl space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link
          href="/student/games/quest"
          className="text-brand text-sm font-semibold hover:underline"
        >
          ← Momo&apos;s Quest
        </Link>
        <SoundToggle tone="light" />
      </div>

      {/* the arena */}
      <div className="relative overflow-hidden rounded-3xl bg-[#140c2e] shadow-xl">
        <canvas
          ref={canvas}
          className="block aspect-square w-full sm:aspect-[16/9]"
        />

        {/* health */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3 text-white">
          <div>
            <p className="text-[11px] font-black tracking-widest text-cyan-200 uppercase">
              Lumina · you
            </p>
            <p
              className="text-lg leading-none"
              aria-label={`${hearts} of ${HERO_HEARTS} hearts`}
            >
              {Array.from({ length: HERO_HEARTS }, (_, i) =>
                i < hearts ? "💗" : "🖤",
              ).join("")}
            </p>
            <p className="mt-1 text-[11px] font-bold text-pink-200">
              🌹 Power{" "}
              {Math.min(
                combo % COMBO || (combo > 0 && combo % COMBO === 0 ? COMBO : 0),
                COMBO,
              )}
              /{COMBO}
            </p>
          </div>
          <div className="w-40 text-right sm:w-56">
            <p className="text-[11px] font-black tracking-widest text-rose-200 uppercase">
              Skull Warrior
            </p>
            <div className="mt-1 h-3 overflow-hidden rounded-full bg-black/50 ring-1 ring-white/20">
              <div
                className="h-full rounded-full bg-gradient-to-r from-rose-500 to-orange-400 transition-all duration-500"
                style={{ width: `${(monsterHp / monsterMax) * 100}%` }}
              />
            </div>
            <p className="mt-0.5 text-[11px] font-bold">
              {monsterHp}/{monsterMax}
            </p>
          </div>
        </div>

        {/* damage and star pops */}
        {pops.map((p) => (
          <span
            key={p.id}
            className={`pointer-events-none absolute top-[28%] text-2xl font-black drop-shadow-[0_2px_2px_rgba(0,0,0,.8)] motion-safe:animate-bounce ${p.tone} ${p.side === "hero" ? "left-[22%]" : "right-[22%]"}`}
          >
            {p.text}
          </span>
        ))}

        {/* loading / intro / end overlays */}
        {(phase === "loading" ||
          phase === "intro" ||
          phase === "won" ||
          phase === "lost") && (
          <div className="absolute inset-x-0 top-16 bottom-0 grid place-items-center rounded-b-3xl bg-black/55 p-4 text-center text-white sm:top-20">
            {phase === "loading" &&
              (failed ? (
                <p className="max-w-xs text-sm">
                  The 3D battle couldn&apos;t load on this device. Try{" "}
                  <Link
                    href={`/student/games/quest/${assessmentId}`}
                    className="font-bold underline"
                  >
                    the regular quest
                  </Link>{" "}
                  instead.
                </p>
              ) : (
                <div className="w-56">
                  <p className="text-sm font-bold">
                    Summoning the fighters… {Math.round(loaded * 100)}%
                  </p>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/20">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-pink-400"
                      style={{ width: `${loaded * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            {phase === "intro" && (
              <div className="max-w-sm">
                <p className="text-xs font-black tracking-[0.25em] text-amber-300 uppercase">
                  3D Battle · {data.title}
                </p>
                <h2 className="mt-1 text-2xl font-black">
                  Defeat the Skull Warrior!
                </h2>
                <p className="mt-2 text-xs text-white/85 sm:text-sm">
                  Answer right to cast a spell. Three in a row unleash the 🌹
                  rose-petal power strike. A wrong answer lets him hit back: you
                  have {HERO_HEARTS} hearts. New correct answers earn ⭐ stars.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    unlock();
                    sfx.select();
                    setPhase("ask");
                  }}
                  className="mt-4 rounded-xl bg-gradient-to-b from-amber-300 to-amber-500 px-6 py-2.5 text-sm font-black text-slate-900 shadow hover:brightness-105"
                >
                  ⚔️ Fight!
                </button>
              </div>
            )}
            {(phase === "won" || phase === "lost") && (
              <div className="max-w-sm">
                {phase === "won" && <Confetti />}
                <h2 className="text-3xl font-black">
                  {phase === "won" ? "🏆 Victory!" : "💫 Defeated…"}
                </h2>
                <p className="mt-2 text-sm text-white/85">
                  {right} of {asked} answers right ·{" "}
                  {stars > 0
                    ? `⭐ ${stars} new star${stars === 1 ? "" : "s"}`
                    : "no new stars this time"}
                </p>
                {phase === "lost" && (
                  <p className="mt-1 text-xs text-white/70">
                    Review the unit&apos;s lessons, then try again!
                  </p>
                )}
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <button
                    type="button"
                    onClick={restart}
                    className="rounded-xl bg-gradient-to-b from-amber-300 to-amber-500 px-5 py-2.5 text-sm font-black text-slate-900 shadow"
                  >
                    {phase === "won" ? "Battle again" : "Try again"}
                  </button>
                  <Link
                    href="/student/games/quest"
                    className="rounded-xl bg-white/15 px-5 py-2.5 text-sm font-bold ring-1 ring-white/30"
                  >
                    Back to quests
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* the question */}
      {(phase === "ask" || phase === "busy" || phase === "review") && (
        <div className="border-line bg-surface rounded-2xl border p-4 shadow-sm">
          <p className="text-ink text-base font-bold sm:text-lg">
            {question.prompt}
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {question.options.map((o, i) => {
              const isRight = rightId === o.id;
              const isWrongPick =
                picked === o.id && rightId !== null && !isRight;
              return (
                <button
                  key={o.id}
                  type="button"
                  disabled={phase !== "ask"}
                  onClick={() => void answer(o.id)}
                  className={`flex items-center gap-2 rounded-xl px-3 py-3 text-left text-sm font-bold text-white shadow transition disabled:cursor-default ${
                    isRight
                      ? "bg-emerald-600 ring-4 ring-emerald-300"
                      : isWrongPick
                        ? "bg-rose-600 opacity-90"
                        : rightId !== null
                          ? "bg-slate-400 opacity-60"
                          : `bg-gradient-to-r ${OPTION_STYLES[i % 4]} hover:brightness-105 ${picked === o.id ? "ring-4 ring-white" : ""}`
                  }`}
                >
                  <span className="grid size-6 shrink-0 place-items-center rounded-md bg-black/20 text-xs">
                    {o.label}
                  </span>
                  <span>{o.text}</span>
                </button>
              );
            })}
          </div>
          {phase === "busy" && rightId === null && (
            <p className="text-muted mt-3 text-center text-sm font-semibold">
              Casting…
            </p>
          )}
          {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
          {phase === "review" && (
            <div className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
              <p className="font-bold">
                Not quite. The right answer is highlighted in green.
              </p>
              {explanation && <p className="mt-1">{explanation}</p>}
              <button
                type="button"
                onClick={next}
                className="bg-navy mt-2 rounded-lg px-4 py-2 text-sm font-bold text-white"
              >
                Next question →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
