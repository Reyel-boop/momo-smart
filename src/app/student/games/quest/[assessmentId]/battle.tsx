"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { Confetti, SoundToggle } from "~/app/_components/race/race-view";
import { sfx, unlock } from "~/app/_components/sfx";
import { Card } from "~/app/_components/ui";
import {
  COMBO_FOR_SUPER,
  QUEST_ENEMIES,
  QUEST_LIVES,
  startState,
  step,
  type QuestState,
} from "~/lib/games/quest";
import { api, type RouterOutputs } from "~/trpc/react";
import { Stars } from "../../_components/stars";
import { Enemy, MomoHero } from "../_components/art";

type Data = RouterOutputs["game"]["questQuestions"];
type Question = Data["questions"][number];

type Phase =
  | "intro"
  | "ask"
  | "checking"
  | "attack" // blast flying
  | "impact" // enemy hit
  | "enemyDown"
  | "enemyIn"
  | "lunge" // enemy attacks
  | "review" // wrong answer: read the rationale
  | "won"
  | "dead";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const shuffle = <T,>(a: T[]) => {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j]!, b[i]!];
  }
  return b;
};

const OPTION_STYLES = [
  "from-blue-500 to-blue-600",
  "from-emerald-500 to-emerald-600",
  "from-orange-500 to-orange-600",
  "from-rose-500 to-rose-600",
];

/**
 * A Momo's Quest battle. Correct answers make Momo blast the enemy (three in
 * a row: Super Bark, double damage); wrong answers let the enemy strike and
 * cost a heart. Beat all five enemies to win; lose five hearts and Momo
 * faints. The server checks every answer and replays the quest to award
 * stars.
 */
export function Battle({
  assessmentId,
  data,
}: {
  assessmentId: string;
  data: Data;
}) {
  const router = useRouter();
  const utils = api.useUtils();
  const check = api.game.questAnswer.useMutation();
  const finish = api.game.questFinish.useMutation({
    onSuccess: () => {
      void utils.game.questUnits.invalidate();
      router.refresh();
    },
  });

  const [run, setRun] = useState(0);
  const [deck, setDeck] = useState<Question[]>(data.questions);
  const [cursor, setCursor] = useState(0);
  const [state, setState] = useState<QuestState>(startState);
  // The enemy on screen lags the state while it is being defeated.
  const [shownEnemy, setShownEnemy] = useState(0);
  const [shownHp, setShownHp] = useState(QUEST_ENEMIES[0]!.hp);
  const [phase, setPhase] = useState<Phase>("intro");
  const [picked, setPicked] = useState<string | null>(null);
  const [rightId, setRightId] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [damage, setDamage] = useState<{ id: number; n: number } | null>(null);
  const [superBark, setSuperBark] = useState(false);
  const [brokenHeart, setBrokenHeart] = useState<number | null>(null);
  const answers = useRef<Array<{ questionId: string; optionId: string }>>([]);

  const question = deck[cursor % Math.max(1, deck.length)];
  const enemy = QUEST_ENEMIES[Math.min(shownEnemy, QUEST_ENEMIES.length - 1)]!;
  const boss = enemy.kind === "boss";

  const restart = () => {
    answers.current = [];
    setDeck(shuffle(data.questions));
    setCursor(0);
    setState(startState());
    setShownEnemy(0);
    setShownHp(QUEST_ENEMIES[0]!.hp);
    setPicked(null);
    setRightId(null);
    setExplanation(null);
    setDamage(null);
    setBrokenHeart(null);
    setRun((r) => r + 1);
    finish.reset();
    setPhase("enemyIn");
    setTimeout(() => setPhase("ask"), 700);
  };

  const nextQuestion = useCallback(() => {
    setCursor((c) => {
      const n = c + 1;
      // Ran through every question: shuffle and go again.
      if (n % deck.length === 0) setDeck((d) => shuffle(d));
      return n;
    });
    setPicked(null);
    setRightId(null);
    setExplanation(null);
    setPhase("ask");
  }, [deck.length]);

  const answer = async (optionId: string) => {
    if (phase !== "ask" || !question) return;
    unlock();
    sfx.select();
    setPicked(optionId);
    setPhase("checking");
    let result: Awaited<ReturnType<typeof check.mutateAsync>>;
    try {
      result = await check.mutateAsync({
        assessmentId,
        questionId: question.id,
        optionId,
      });
    } catch {
      setPicked(null);
      setPhase("ask");
      return;
    }
    answers.current.push({ questionId: question.id, optionId });
    setRightId(result.correctOptionId);
    setExplanation(result.explanation);
    const next = step(state, result.correct);

    if (result.correct) {
      const isSuper = next.state.streak >= COMBO_FOR_SUPER;
      setSuperBark(isSuper);
      setPhase("attack");
      sfx.zap();
      await wait(480);
      setPhase("impact");
      if (isSuper) sfx.superHit();
      else sfx.hit();
      setDamage({ id: Math.random(), n: next.damage });
      setShownHp((hp) => Math.max(0, hp - next.damage));
      setState(next.state);
      await wait(650);
      if (next.defeated) {
        setPhase("enemyDown");
        sfx.boom();
        await wait(1000);
        if (next.state.won) {
          setPhase("won");
          sfx.fanfare();
          finish.mutate({ assessmentId, answers: answers.current });
          return;
        }
        setShownEnemy(next.state.enemy);
        setShownHp(QUEST_ENEMIES[next.state.enemy]!.hp);
        setPhase("enemyIn");
        await wait(750);
      }
      nextQuestion();
    } else {
      setPhase("lunge");
      await wait(380);
      sfx.hurt();
      setBrokenHeart(next.state.lives);
      setState(next.state);
      await wait(700);
      if (next.state.dead) {
        setPhase("dead");
        sfx.faint();
        finish.mutate({ assessmentId, answers: answers.current });
        return;
      }
      setPhase("review");
    }
  };

  // Keys 1–4 answer; Enter continues.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (phase === "ask" && question && /^[1-4]$/.test(e.key)) {
        const option = question.options[Number(e.key) - 1];
        if (option) void answer(option.id);
      } else if (phase === "review" && e.key === "Enter") {
        nextQuestion();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const hpPct = (shownHp / enemy.hp) * 100;
  const momoClass =
    phase === "dead"
      ? "momo-dead"
      : phase === "won"
        ? "momo-win"
        : phase === "attack"
          ? "momo-dash"
          : phase === "lunge"
            ? "momo-brace"
            : "momo-idle";
  const enemyClass =
    phase === "impact"
      ? "enemy-hit"
      : phase === "enemyDown"
        ? "enemy-down"
        : phase === "enemyIn"
          ? "enemy-in"
          : phase === "lunge"
            ? "enemy-lunge"
            : phase === "won"
              ? "hidden"
              : "enemy-idle";

  return (
    <div className="mx-auto max-w-5xl space-y-4" key={run}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <Link
            href="/student/games/quest"
            className="text-brand text-sm font-semibold hover:underline"
          >
            ← All quests
          </Link>
          <p className="text-muted mt-1 text-xs font-bold tracking-wide uppercase">
            Momo&apos;s Quest · {data.className}
          </p>
          <h1 className="text-ink text-2xl font-extrabold tracking-tight">
            {data.title}
          </h1>
        </div>
        <div className="text-right">
          <p className="text-muted text-[11px] font-semibold">Your best</p>
          <Stars
            count={Math.max(data.best, finish.data?.best ?? 0)}
            className="size-6"
          />
        </div>
      </div>

      {/* Arena */}
      <div
        className={`relative h-[300px] overflow-hidden rounded-3xl shadow-xl sm:h-[360px] ${
          phase === "lunge" ? "arena-shake" : ""
        } ${boss ? "bg-gradient-to-b from-[#1e0b3a] via-[#4c1d95] to-[#9d174d]" : "bg-gradient-to-b from-sky-400 via-sky-300 to-amber-100"}`}
      >
        {/* Sky decor */}
        {boss ? (
          <div className="absolute inset-0">
            {Array.from({ length: 24 }, (_, i) => (
              <span
                key={i}
                className="sky-star absolute block size-1 rounded-full bg-white"
                style={{
                  left: `${(i * 37) % 100}%`,
                  top: `${(i * 23) % 55}%`,
                  animationDelay: `${(i % 7) * 0.3}s`,
                }}
              />
            ))}
          </div>
        ) : (
          <>
            <div className="cloud absolute top-6 left-[-20%] h-8 w-32 rounded-full bg-white/80" />
            <div className="cloud cloud-slow absolute top-16 left-[-40%] h-6 w-24 rounded-full bg-white/70" />
            <div className="absolute top-10 left-[46%] size-14 rounded-full bg-yellow-200 shadow-[0_0_60px_20px_rgba(253,224,71,.6)]" />
          </>
        )}
        {/* Hills and ground */}
        <div
          className={`absolute -bottom-16 -left-10 h-48 w-[60%] rounded-[50%] ${boss ? "bg-[#3b0764]" : "bg-emerald-400"}`}
        />
        <div
          className={`absolute -right-10 -bottom-20 h-52 w-[70%] rounded-[50%] ${boss ? "bg-[#2e1065]" : "bg-emerald-500"}`}
        />
        <div
          className={`absolute inset-x-0 bottom-0 h-16 ${boss ? "bg-[#1e0b3a]" : "bg-gradient-to-b from-emerald-600 to-emerald-700"}`}
        />

        {/* HUD */}
        <div className="absolute inset-x-3 top-3 z-20 flex items-start justify-between gap-3">
          <div className="rounded-2xl bg-black/35 px-3 py-2 backdrop-blur-sm">
            <p className="text-[10px] font-black tracking-widest text-white/80 uppercase">
              Momo
            </p>
            <div className="mt-0.5 flex gap-1">
              {Array.from({ length: QUEST_LIVES }, (_, i) => (
                <Heart
                  key={i}
                  full={i < state.lives}
                  breaking={brokenHeart === i}
                />
              ))}
            </div>
            {state.streak >= 2 && phase !== "dead" && (
              <p
                className={`mt-1 text-xs font-black ${state.streak >= COMBO_FOR_SUPER ? "combo-hot text-amber-300" : "text-white"}`}
              >
                🔥 {state.streak} combo
                {state.streak >= COMBO_FOR_SUPER ? " · SUPER!" : ""}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <SoundToggle />
            <div className="flex gap-1">
              {QUEST_ENEMIES.map((e, i) => (
                <span
                  key={e.kind}
                  title={e.name}
                  className={`flex size-6 items-center justify-center rounded-full text-[11px] font-black ${
                    i < state.enemy || state.won
                      ? "bg-emerald-400 text-emerald-950"
                      : i === shownEnemy
                        ? "bg-white text-slate-900 ring-2 ring-amber-300"
                        : "bg-black/30 text-white/70"
                  }`}
                >
                  {i < state.enemy || state.won
                    ? "✓"
                    : e.kind === "boss"
                      ? "👑"
                      : i + 1}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Momo */}
        <div
          className={`absolute bottom-6 left-[3%] z-10 w-[38%] max-w-[230px] sm:left-[6%] ${momoClass}`}
        >
          {phase === "checking" && (
            <div className="charge absolute inset-[10%] -z-10 rounded-full bg-amber-200/70" />
          )}
          {(phase === "attack" || phase === "impact") && (
            <div
              className={`aura absolute inset-0 -z-10 rounded-full ${superBark ? "bg-cyan-300/60" : "bg-amber-300/50"}`}
            />
          )}
          <MomoHero className="w-full drop-shadow-[0_8px_8px_rgba(0,0,0,.35)]" />
          {phase === "dead" && (
            <div className="dizzy absolute -top-2 left-1/2 text-2xl">💫</div>
          )}
        </div>

        {/* Blast */}
        {phase === "attack" && (
          <div
            className={`blast absolute bottom-[38%] left-[34%] z-20 rounded-full ${superBark ? "blast-super" : ""}`}
          />
        )}
        {superBark && (phase === "attack" || phase === "impact") && (
          <div className="super-banner absolute top-[28%] left-1/2 z-30 -translate-x-1/2 text-3xl font-black whitespace-nowrap text-amber-300 sm:text-4xl">
            SUPER BARK!
          </div>
        )}

        {/* Enemy */}
        <div className="absolute right-[4%] bottom-8 z-10 flex w-[34%] max-w-[210px] flex-col items-center sm:right-[8%]">
          {phase !== "won" && (
            <div className="mb-1 w-[85%]">
              <p className="text-center text-xs font-black text-white drop-shadow">
                {enemy.name}
              </p>
              <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-black/40 ring-1 ring-white/40">
                <div
                  className={`h-full rounded-full transition-[width] duration-500 ${hpPct > 50 ? "bg-emerald-400" : hpPct > 25 ? "bg-amber-400" : "bg-rose-500"}`}
                  style={{ width: `${hpPct}%` }}
                />
              </div>
            </div>
          )}
          <div
            className={`relative w-full ${enemyClass}`}
            key={`${shownEnemy}-${run}`}
          >
            <Enemy
              kind={enemy.kind}
              className={`w-full drop-shadow-[0_8px_8px_rgba(0,0,0,.35)] ${boss ? "scale-110" : ""}`}
            />
            {phase === "enemyDown" && (
              <div className="pointer-events-none absolute inset-0">
                {Array.from({ length: 16 }, (_, i) => (
                  <span
                    key={i}
                    className="spark absolute top-1/2 left-1/2 block size-3 rounded-full"
                    style={{
                      ["--a" as string]: `${(i / 16) * 360}deg`,
                      backgroundColor: [
                        "#fde047",
                        "#fb923c",
                        "#f472b6",
                        "#ffffff",
                      ][i % 4],
                    }}
                  />
                ))}
              </div>
            )}
          </div>
          {damage && phase === "impact" && (
            <span
              key={damage.id}
              className={`dmg absolute top-[42%] z-20 font-black drop-shadow-[0_2px_0_rgba(0,0,0,.6)] ${damage.n > 1 ? "text-4xl text-amber-300" : "text-3xl text-white"}`}
            >
              −{damage.n}
              {damage.n > 1 && <span className="block text-sm">CRITICAL!</span>}
            </span>
          )}
        </div>

        {/* Overlays */}
        {phase === "intro" && (
          <Overlay>
            <p className="text-sm font-black tracking-[0.25em] text-amber-300 uppercase">
              Quest
            </p>
            <h2 className="mt-1 text-3xl font-black text-white">
              Help Momo save the class!
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-white/85">
              Answer right to blast the enemies — 3 in a row unleashes a{" "}
              <b>Super Bark</b>. Beat all 5, including King Virus. Momo has{" "}
              {QUEST_LIVES} hearts: each wrong answer costs one.
            </p>
            <button
              type="button"
              onPointerDown={unlock}
              onClick={() => {
                unlock();
                sfx.select();
                setPhase("enemyIn");
                setTimeout(() => setPhase("ask"), 700);
              }}
              className="mt-5 rounded-2xl bg-amber-400 px-8 py-3 text-lg font-black text-slate-900 shadow-lg hover:bg-amber-300"
            >
              ⚡ Start quest
            </button>
          </Overlay>
        )}
        {phase === "dead" && (
          <Overlay tone="dark">
            <p className="faint-title text-4xl font-black text-white">
              Momo fainted! 💫
            </p>
            <p className="mt-2 text-sm text-white/85">
              5 wrong answers. Read the rationales, then try the quest again —
              Momo believes in you!
            </p>
            <button
              type="button"
              onClick={restart}
              className="mt-5 rounded-2xl bg-amber-400 px-8 py-3 text-lg font-black text-slate-900 shadow-lg hover:bg-amber-300"
            >
              🔁 Try the quest again
            </button>
          </Overlay>
        )}
        {phase === "won" && (
          <>
            <Confetti />
            <Overlay>
              <p className="win-title text-4xl font-black text-amber-300">
                Victory! 🏆
              </p>
              <p className="mt-1 text-white/90">Momo defeated King Virus!</p>
              <div className="mt-3 flex justify-center">
                <Stars
                  count={finish.data?.stars ?? 0}
                  className="win-stars size-12"
                />
              </div>
              <p className="mt-2 text-sm text-white/85">
                {finish.isPending
                  ? "Saving your stars…"
                  : finish.data
                    ? finish.data.newStars > 0
                      ? `+${finish.data.newStars} Star${finish.data.newStars === 1 ? "" : "s"} on the leaderboard`
                      : `Your best is still ${finish.data.best} star${finish.data.best === 1 ? "" : "s"}`
                    : (finish.error?.message ?? "")}
                {finish.data &&
                  finish.data.stars < 3 &&
                  " · Lose fewer hearts for 3 stars"}
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={restart}
                  className="rounded-2xl bg-white px-5 py-2.5 text-sm font-black text-slate-900 hover:bg-white/90"
                >
                  Play again
                </button>
                <Link
                  href="/student/games/quest"
                  className="rounded-2xl bg-amber-400 px-5 py-2.5 text-sm font-black text-slate-900 hover:bg-amber-300"
                >
                  Next quest →
                </Link>
              </div>
            </Overlay>
          </>
        )}
      </div>

      {/* Question */}
      {question && phase !== "intro" && phase !== "won" && phase !== "dead" && (
        <Card className="p-4 sm:p-5">
          <p className="text-ink text-lg leading-snug font-bold">
            {question.prompt}
          </p>
          <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {question.options.map((o, i) => {
              const isRight = rightId === o.id;
              const isPicked = picked === o.id;
              const state =
                rightId === null
                  ? isPicked
                    ? "ring-4 ring-white/70 scale-[.98]"
                    : ""
                  : isRight
                    ? "ring-4 ring-emerald-300 answer-right"
                    : isPicked
                      ? "opacity-90 grayscale-[.3] answer-wrong"
                      : "opacity-40";
              return (
                <button
                  key={o.id}
                  type="button"
                  disabled={phase !== "ask"}
                  onClick={() => void answer(o.id)}
                  className={`flex items-center gap-3 rounded-2xl bg-gradient-to-br px-4 py-3 text-left text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-default disabled:hover:translate-y-0 ${OPTION_STYLES[i % 4]} ${state}`}
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-white/25 text-xs font-black">
                    {isRight ? "✓" : isPicked && rightId ? "✗" : i + 1}
                  </span>
                  <span>{o.text}</span>
                </button>
              );
            })}
          </div>
          {explanation &&
            (phase === "review" ||
              phase === "impact" ||
              phase === "enemyDown" ||
              phase === "attack") && (
              <div
                className={`mt-4 rounded-xl px-4 py-3 text-sm ${
                  phase === "review"
                    ? "bg-rose-50 text-rose-900"
                    : "bg-emerald-50 text-emerald-900"
                }`}
              >
                <b>{phase === "review" ? "Ouch! " : "Correct! "}</b>
                {explanation}
              </div>
            )}
          {phase === "review" && (
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={nextQuestion}
                className="bg-navy hover:bg-navy-deep rounded-xl px-5 py-2 text-sm font-bold text-white"
              >
                Keep fighting →
              </button>
            </div>
          )}
        </Card>
      )}

      <style>{`
        @keyframes momo-idle { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }
        .momo-idle { animation: momo-idle 1.6s ease-in-out infinite; }
        @keyframes momo-dash { 0% { transform: translateX(0) } 35% { transform: translateX(28%) scale(1.04) } 100% { transform: translateX(0) } }
        .momo-dash { animation: momo-dash .5s cubic-bezier(.2,.9,.3,1); }
        @keyframes momo-brace { 0%,100% { transform: translateX(0) } 50% { transform: translateX(-6%) } }
        .momo-brace { animation: momo-brace .4s ease-in-out; }
        @keyframes momo-dead { 0% { transform: rotate(0) translateY(0); filter: none } 40% { transform: rotate(-12deg) translateY(-10px) } 100% { transform: rotate(-90deg) translate(-30%, 10%); filter: grayscale(1) brightness(.8) } }
        .momo-dead { animation: momo-dead 1.1s ease-in forwards; transform-origin: 30% 90%; }
        @keyframes momo-win { 0%,100% { transform: translateY(0) rotate(0) } 25% { transform: translateY(-30px) rotate(-6deg) } 50% { transform: translateY(0) } 75% { transform: translateY(-18px) rotate(5deg) } }
        .momo-win { animation: momo-win 1s ease-in-out infinite; }
        .momo-cape { transform-origin: 128px 92px; animation: cape 0.9s ease-in-out infinite; }
        @keyframes cape { 0%,100% { transform: skewY(0) scaleX(1) } 50% { transform: skewY(4deg) scaleX(1.06) } }
        .momo-tail { transform-origin: 62px 116px; animation: tail .35s ease-in-out infinite alternate; }
        @keyframes tail { from { transform: rotate(-10deg) } to { transform: rotate(14deg) } }
        @keyframes aura { 0% { transform: scale(.6); opacity: 0 } 50% { transform: scale(1.15); opacity: 1 } 100% { transform: scale(1.3); opacity: 0 } }
        .aura { animation: aura .6s ease-out; filter: blur(14px); }
        @keyframes charge { 0%,100% { transform: scale(.85); opacity: .5 } 50% { transform: scale(1.1); opacity: 1 } }
        .charge { animation: charge .5s ease-in-out infinite; filter: blur(16px); }

        @keyframes blast { 0% { transform: translateX(0) scale(.4); opacity: 1 } 100% { transform: translateX(min(38vw, 360px)) scale(1.2); opacity: 1 } }
        .blast { width: 44px; height: 44px; background: radial-gradient(circle, #fff 0 25%, #fde047 45%, #f59e0b 70%, transparent 72%); box-shadow: 0 0 24px 10px rgba(253,224,71,.8), -40px 0 30px -6px rgba(253,224,71,.6), -80px 0 30px -10px rgba(253,224,71,.35); animation: blast .48s cubic-bezier(.5,0,.9,.6) forwards; }
        .blast-super { width: 70px; height: 70px; background: radial-gradient(circle, #fff 0 25%, #67e8f9 45%, #6366f1 70%, transparent 72%); box-shadow: 0 0 40px 16px rgba(103,232,249,.9), -50px 0 40px -6px rgba(99,102,241,.6), -100px 0 40px -10px rgba(103,232,249,.4); }
        @keyframes super-banner { 0% { transform: translate(-50%, 10px) scale(.4) rotate(-8deg); opacity: 0 } 30% { transform: translate(-50%, 0) scale(1.15) rotate(-4deg); opacity: 1 } 100% { transform: translate(-50%, -10px) scale(1) rotate(-4deg); opacity: 0 } }
        .super-banner { animation: super-banner 1.1s ease-out forwards; text-shadow: 0 3px 0 #b45309, 0 0 20px rgba(251,191,36,.9); }

        @keyframes enemy-idle { 0%,100% { transform: translateY(0) rotate(0) } 50% { transform: translateY(-8px) rotate(2deg) } }
        .enemy-idle { animation: enemy-idle 1.4s ease-in-out infinite; }
        @keyframes enemy-hit { 0% { transform: translateX(0); filter: brightness(1) } 15% { transform: translateX(16%) rotate(8deg); filter: brightness(3) saturate(0) } 35% { transform: translateX(6%) rotate(-4deg); filter: brightness(1.6) } 60% { transform: translateX(10%) } 100% { transform: translateX(0); filter: brightness(1) } }
        .enemy-hit { animation: enemy-hit .55s ease-out; }
        @keyframes enemy-down { 0% { transform: scale(1) rotate(0); opacity: 1 } 30% { transform: scale(1.2) rotate(-20deg); filter: brightness(2.5) } 100% { transform: scale(0) rotate(540deg); opacity: 0 } }
        .enemy-down > svg { animation: enemy-down .9s ease-in forwards; }
        @keyframes enemy-in { 0% { transform: translateX(140%) scale(.8); opacity: 0 } 70% { transform: translateX(-8%) scale(1.05); opacity: 1 } 100% { transform: translateX(0) scale(1) } }
        .enemy-in { animation: enemy-in .7s cubic-bezier(.2,1.3,.4,1); }
        @keyframes enemy-lunge { 0% { transform: translateX(0) } 45% { transform: translateX(-120%) scale(1.1) rotate(-10deg) } 100% { transform: translateX(0) } }
        .enemy-lunge { animation: enemy-lunge .5s cubic-bezier(.6,0,.3,1); }
        .enemy-wing-l { transform-origin: 60px 80px; animation: wing-l .25s ease-in-out infinite alternate; }
        .enemy-wing-r { transform-origin: 100px 80px; animation: wing-r .25s ease-in-out infinite alternate; }
        @keyframes wing-l { from { transform: rotate(10deg) } to { transform: rotate(-14deg) } }
        @keyframes wing-r { from { transform: rotate(-10deg) } to { transform: rotate(14deg) } }
        @keyframes spark { 0% { transform: rotate(var(--a)) translateX(0) scale(1); opacity: 1 } 100% { transform: rotate(var(--a)) translateX(90px) scale(.2); opacity: 0 } }
        .spark { margin: -6px; animation: spark .8s ease-out forwards; }
        @keyframes dmg { 0% { transform: translateY(10px) scale(.4); opacity: 0 } 25% { transform: translateY(-10px) scale(1.3); opacity: 1 } 100% { transform: translateY(-50px) scale(1); opacity: 0 } }
        .dmg { animation: dmg .9s ease-out forwards; text-align: center; }

        @keyframes arena-shake { 0%,100% { transform: translate(0) } 20% { transform: translate(-10px, 4px) } 40% { transform: translate(8px, -4px) } 60% { transform: translate(-6px, 2px) } 80% { transform: translate(4px, -2px) } }
        .arena-shake { animation: arena-shake .45s ease-in-out .3s; }
        @keyframes cloud { from { transform: translateX(0) } to { transform: translateX(160vw) } }
        .cloud { animation: cloud 38s linear infinite; }
        .cloud-slow { animation-duration: 60s; }
        @keyframes sky-star { 0%,100% { opacity: .2 } 50% { opacity: 1 } }
        .sky-star { animation: sky-star 1.8s ease-in-out infinite; }
        @keyframes dizzy { from { transform: translateX(-50%) rotate(0) } to { transform: translateX(-50%) rotate(360deg) } }
        .dizzy { animation: dizzy 1s linear infinite; }
        @keyframes combo-hot { 0%,100% { transform: scale(1) } 50% { transform: scale(1.12) } }
        .combo-hot { animation: combo-hot .5s ease-in-out infinite; }
        @keyframes pop-in { 0% { transform: scale(.6); opacity: 0 } 70% { transform: scale(1.08); opacity: 1 } 100% { transform: scale(1) } }
        .overlay-in { animation: pop-in .45s cubic-bezier(.2,1.4,.4,1); }
        .win-title, .faint-title { animation: pop-in .6s cubic-bezier(.2,1.4,.4,1); }
        .win-stars { animation: pop-in .8s .3s cubic-bezier(.2,1.4,.4,1) both; }
        @keyframes heart-break { 0% { transform: scale(1) } 30% { transform: scale(1.6) rotate(-12deg) } 60% { transform: scale(.8) rotate(10deg) } 100% { transform: scale(1) } }
        .heart-break { animation: heart-break .6s ease-out; }
        @keyframes answer-right { 0%,100% { transform: scale(1) } 40% { transform: scale(1.04) } }
        .answer-right { animation: answer-right .45s ease-out; }
        @keyframes answer-wrong { 0%,100% { transform: translateX(0) } 25% { transform: translateX(-6px) } 75% { transform: translateX(6px) } }
        .answer-wrong { animation: answer-wrong .3s ease-in-out 2; }
        @media (prefers-reduced-motion: reduce) {
          .momo-idle, .momo-cape, .momo-tail, .enemy-idle, .cloud, .sky-star, .combo-hot, .enemy-wing-l, .enemy-wing-r { animation: none; }
        }
      `}</style>
    </div>
  );
}

function Heart({ full, breaking }: { full: boolean; breaking: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`size-6 ${breaking ? "heart-break" : ""}`}
      aria-hidden="true"
    >
      <path
        d="M12 21s-7.5-4.6-9.7-9.3C.6 8.1 2.6 4 6.4 4c2.2 0 3.6 1.2 4.4 2.5h2.4C14 5.2 15.4 4 17.6 4c3.8 0 5.8 4.1 4.1 7.7C19.5 16.4 12 21 12 21z"
        fill={full ? "#ef4444" : "#475569"}
        stroke="#fff"
        strokeWidth="1.5"
      />
      {!full && (
        <path
          d="M12 7l-1.5 4 3 2-2 5"
          stroke="#1e293b"
          strokeWidth="1.6"
          fill="none"
        />
      )}
    </svg>
  );
}

function Overlay({
  children,
  tone = "light",
}: {
  children: React.ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <div
      className={`absolute inset-0 z-40 flex items-center justify-center p-4 ${tone === "dark" ? "bg-slate-950/70" : "bg-slate-950/45"} backdrop-blur-[2px]`}
    >
      <div className="overlay-in text-center">{children}</div>
    </div>
  );
}
