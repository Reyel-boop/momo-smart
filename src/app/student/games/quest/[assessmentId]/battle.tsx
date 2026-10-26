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
import { Hero, MomoPet, Monster } from "../_components/art";

type Data = RouterOutputs["game"]["questQuestions"];
type Question = Data["questions"][number];

type Phase =
  | "intro"
  | "ask"
  | "checking"
  | "attack" // hero dashes and swings
  | "impact" // the hit lands
  | "enemyDown"
  | "enemyIn"
  | "miss" // wrong answer: the swing misses
  | "lunge" // the monster strikes back
  | "review"
  | "won"
  | "dead";

type Pop = {
  id: number;
  text: string;
  kind: "dmg" | "crit" | "miss" | "hurt" | "exp";
};

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
  "from-sky-400 to-blue-500",
  "from-emerald-400 to-green-500",
  "from-amber-400 to-orange-500",
  "from-pink-400 to-rose-500",
];

/**
 * A Momo's Quest battle in a bright chibi-anime world. A correct answer is a
 * sword strike (three in a row: Momo's Super Bark, double damage); a wrong
 * answer misses, the monster strikes back, and a heart is lost. Defeat all
 * five monsters to level up; lose five hearts and the hero faints. The
 * server checks every answer and replays the quest to award stars.
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
  const [shownEnemy, setShownEnemy] = useState(0);
  const [shownHp, setShownHp] = useState(QUEST_ENEMIES[0]!.hp);
  const [phase, setPhase] = useState<Phase>("intro");
  const [picked, setPicked] = useState<string | null>(null);
  const [rightId, setRightId] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [superBark, setSuperBark] = useState(false);
  const [brokenHeart, setBrokenHeart] = useState<number | null>(null);
  const [enemyPops, setEnemyPops] = useState<Pop[]>([]);
  const [heroPops, setHeroPops] = useState<Pop[]>([]);
  const answers = useRef<Array<{ questionId: string; optionId: string }>>([]);

  const question = deck[cursor % Math.max(1, deck.length)];
  const enemy = QUEST_ENEMIES[Math.min(shownEnemy, QUEST_ENEMIES.length - 1)]!;
  const boss = enemy.kind === "boss";

  const pop = (side: "enemy" | "hero", text: string, kind: Pop["kind"]) => {
    const p = { id: Math.random(), text, kind };
    const set = side === "enemy" ? setEnemyPops : setHeroPops;
    set((all) => [...all, p]);
    setTimeout(() => set((all) => all.filter((x) => x.id !== p.id)), 1400);
  };

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
    setBrokenHeart(null);
    setRun((r) => r + 1);
    finish.reset();
    setPhase("enemyIn");
    setTimeout(() => setPhase("ask"), 800);
  };

  const nextQuestion = useCallback(() => {
    setCursor((c) => {
      const n = c + 1;
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
      await wait(isSuper ? 560 : 420);
      setPhase("impact");
      if (isSuper) sfx.superHit();
      else sfx.hit();
      const base = 90 + Math.floor(Math.random() * 60);
      pop(
        "enemy",
        String(base * next.damage * (isSuper ? 2 : 1)),
        isSuper ? "crit" : "dmg",
      );
      setShownHp((hp) => Math.max(0, hp - next.damage));
      setState(next.state);
      await wait(700);
      if (next.defeated) {
        setPhase("enemyDown");
        sfx.boom();
        pop("enemy", `+${next.state.enemy * 25} EXP`, "exp");
        await wait(1100);
        if (next.state.won) {
          setPhase("won");
          sfx.fanfare();
          finish.mutate({ assessmentId, answers: answers.current });
          return;
        }
        setShownEnemy(next.state.enemy);
        setShownHp(QUEST_ENEMIES[next.state.enemy]!.hp);
        setPhase("enemyIn");
        await wait(800);
      }
      nextQuestion();
    } else {
      setPhase("miss");
      sfx.zap();
      await wait(250);
      pop("enemy", "MISS", "miss");
      await wait(300);
      setPhase("lunge");
      await wait(330);
      sfx.hurt();
      pop("hero", String(40 + Math.floor(Math.random() * 40)), "hurt");
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
  const level = state.enemy + 1;
  const heroClass =
    phase === "dead"
      ? "hero-dead"
      : phase === "won"
        ? "hero-win"
        : phase === "attack" || phase === "miss"
          ? superBark && phase === "attack"
            ? "hero-cheer"
            : "hero-attack"
          : phase === "lunge"
            ? "hero-hurt"
            : phase === "checking"
              ? "hero-ready"
              : "hero-idle";
  const petClass =
    phase === "attack" && superBark
      ? "pet-super"
      : phase === "dead"
        ? "pet-sad"
        : phase === "won"
          ? "pet-win"
          : "pet-idle";
  const enemyClass =
    phase === "impact"
      ? "mon-hit"
      : phase === "enemyDown"
        ? "mon-down"
        : phase === "enemyIn"
          ? "mon-in"
          : phase === "lunge"
            ? "mon-lunge"
            : phase === "won"
              ? "hidden"
              : "mon-idle";

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
        className={`relative h-[320px] overflow-hidden rounded-3xl shadow-xl ring-4 ring-white sm:h-[400px] ${
          phase === "lunge" ? "arena-shake" : ""
        } ${boss ? "sky-boss" : "sky-day"}`}
      >
        {/* Sun rays and sparkles */}
        <div className="sun-rays absolute -top-40 -left-40 size-[520px] rounded-full opacity-60" />
        <div className="absolute top-6 left-10 size-16 rounded-full bg-white/90 shadow-[0_0_80px_40px_rgba(255,255,255,.75)]" />
        {Array.from({ length: 14 }, (_, i) => (
          <span
            key={i}
            className="twinkle absolute text-white"
            style={{
              left: `${(i * 29 + 7) % 96}%`,
              top: `${(i * 17 + 4) % 50}%`,
              fontSize: 8 + (i % 4) * 4,
              animationDelay: `${(i % 6) * 0.35}s`,
            }}
          >
            ✦
          </span>
        ))}
        {/* Clouds */}
        <Cloud className="cloud-a top-[12%]" />
        <Cloud className="cloud-b top-[30%] scale-75 opacity-80" />
        <Cloud className="cloud-c top-[4%] scale-50 opacity-70" />
        {boss && (
          <svg
            viewBox="0 0 200 80"
            className="absolute right-[18%] bottom-[30%] w-56 opacity-50"
            aria-hidden="true"
          >
            <path
              d="M10 80 V40 h10 v-8 h8 v8 h10 V20 h8 v-8 h8 v8 h8 v20 h10 v-8 h8 v8 h10 V30 h8 v-10 h8 v10 h8 v50 Z"
              fill="#5b2a86"
            />
          </svg>
        )}
        {/* Hills, field and path */}
        <div
          className={`absolute -bottom-24 -left-16 h-56 w-[70%] rounded-[50%] ${boss ? "bg-[#9b6fd1]" : "bg-[#a6e3a1]"}`}
        />
        <div
          className={`absolute -right-20 -bottom-28 h-60 w-[75%] rounded-[50%] ${boss ? "bg-[#8256be]" : "bg-[#8fd88a]"}`}
        />
        <div
          className={`absolute inset-x-0 bottom-0 h-20 ${boss ? "bg-gradient-to-b from-[#7a4bb3] to-[#5b2a86]" : "bg-gradient-to-b from-[#7cce6c] to-[#5bb350]"}`}
        />
        <div className="absolute bottom-3 left-1/2 h-10 w-[85%] -translate-x-1/2 rounded-[50%] bg-[#e9d6a8]/70" />
        {Array.from({ length: 10 }, (_, i) => (
          <span
            key={i}
            className="absolute size-2 rounded-full"
            style={{
              left: `${(i * 11 + 3) % 98}%`,
              bottom: `${4 + (i % 3) * 5}%`,
              backgroundColor: ["#fff", "#fde047", "#f9a8d4"][i % 3],
            }}
          />
        ))}

        {/* HUD: status window */}
        <div className="ro-window absolute top-3 left-3 z-30 w-[46%] max-w-[250px] rounded-xl px-3 py-2">
          <div className="flex items-center justify-between text-[11px] font-black text-white">
            <span>Adventurer &amp; Momo</span>
            <span className="text-amber-200">Lv. {level}</span>
          </div>
          <div className="mt-1 flex gap-1">
            {Array.from({ length: QUEST_LIVES }, (_, i) => (
              <Heart
                key={i}
                full={i < state.lives}
                breaking={brokenHeart === i}
              />
            ))}
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-black/30">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-300 to-blue-500 transition-all duration-500"
              style={{
                width: `${(Math.min(state.streak, COMBO_FOR_SUPER) / COMBO_FOR_SUPER) * 100}%`,
              }}
            />
          </div>
          <p
            className={`mt-0.5 text-[10px] font-bold ${state.streak >= COMBO_FOR_SUPER ? "combo-hot text-amber-200" : "text-white/80"}`}
          >
            {state.streak >= COMBO_FOR_SUPER
              ? `🔥 ${state.streak} combo · Momo Bark ready!`
              : `Momo Bark: ${Math.min(state.streak, COMBO_FOR_SUPER)}/${COMBO_FOR_SUPER}`}
          </p>
        </div>
        <div className="absolute top-3 right-3 z-30 flex flex-col items-end gap-1.5">
          <SoundToggle />
          <div className="flex gap-1">
            {QUEST_ENEMIES.map((e, i) => (
              <span
                key={e.kind}
                title={e.name}
                className={`flex size-6 items-center justify-center rounded-full text-[11px] font-black shadow ${
                  i < state.enemy || state.won
                    ? "bg-emerald-400 text-emerald-950"
                    : i === shownEnemy
                      ? "bg-white text-slate-900 ring-2 ring-amber-300"
                      : "bg-white/40 text-slate-700"
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

        {/* Victory light pillar */}
        {phase === "won" && (
          <div className="light-pillar absolute bottom-0 left-[8%] z-0 h-full w-40" />
        )}

        {/* Momo the pet */}
        <div
          className={`absolute bottom-[9%] left-[2%] z-10 w-[17%] max-w-[110px] ${petClass}`}
        >
          <MomoPet className="w-full drop-shadow-[0_6px_6px_rgba(0,0,0,.2)]" />
        </div>

        {/* Hero */}
        <div
          className={`absolute bottom-[7%] left-[13%] z-20 w-[24%] max-w-[170px] ${heroClass}`}
        >
          {phase === "checking" && (
            <div className="charge absolute inset-[5%] -z-10 rounded-full bg-sky-200/80" />
          )}
          <Hero className="w-full drop-shadow-[0_6px_6px_rgba(0,0,0,.2)]" />
          {phase === "dead" && (
            <div className="angel absolute -top-4 left-1/2 text-center">
              <span className="block text-2xl">😇</span>
            </div>
          )}
          {heroPops.map((p) => (
            <span key={p.id} className="num num-hurt absolute top-0 left-1/2">
              {p.text}
            </span>
          ))}
        </div>

        {/* Super Bark shockwave */}
        {superBark && phase === "attack" && (
          <>
            <div className="bark-banner absolute top-[26%] left-1/2 z-40 text-3xl font-black whitespace-nowrap sm:text-5xl">
              MOMO BARK!
            </div>
            <div className="bark-wave absolute bottom-[22%] left-[14%] z-30 size-24 rounded-full border-[6px] border-amber-300" />
            <div className="bark-wave bark-wave-2 absolute bottom-[22%] left-[14%] z-30 size-24 rounded-full border-4 border-white" />
          </>
        )}
        {phase === "impact" && superBark && (
          <div className="flash absolute inset-0 z-30 bg-white" />
        )}

        {/* Monster */}
        <div className="absolute right-[8%] bottom-[8%] z-20 flex w-[30%] max-w-[200px] flex-col items-center sm:right-[12%]">
          <div
            className={`relative w-full ${enemyClass}`}
            key={`${shownEnemy}-${run}`}
          >
            <Monster
              kind={enemy.kind}
              className={`w-full ${boss ? "scale-125" : ""}`}
            />
            {(phase === "impact" || phase === "miss") && (
              <svg
                viewBox="0 0 100 100"
                className={`slash absolute inset-0 z-10 ${phase === "miss" ? "slash-miss" : ""}`}
                aria-hidden="true"
              >
                <path
                  d="M10 80 Q 50 -10 92 30 Q 52 10 10 80 Z"
                  fill="#ffffff"
                />
                <path
                  d="M18 70 Q 50 6 84 34"
                  stroke="#bae6fd"
                  strokeWidth="3"
                  fill="none"
                />
              </svg>
            )}
            {phase === "impact" &&
              Array.from({ length: 10 }, (_, i) => (
                <span
                  key={i}
                  className="spark absolute top-1/2 left-1/2 text-amber-300"
                  style={{ ["--a" as string]: `${i * 36}deg` }}
                >
                  ✦
                </span>
              ))}
            {phase === "enemyDown" && (
              <>
                {Array.from({ length: 16 }, (_, i) => (
                  <span
                    key={i}
                    className="burst absolute top-1/2 left-1/2 text-lg"
                    style={{
                      ["--a" as string]: `${(i / 16) * 360}deg`,
                      color: ["#fde047", "#f9a8d4", "#ffffff", "#a5f3fc"][
                        i % 4
                      ],
                    }}
                  >
                    ★
                  </span>
                ))}
                <span className="loot loot-1 absolute top-1/3 left-1/2 text-2xl">
                  🪙
                </span>
                <span className="loot loot-2 absolute top-1/3 left-1/2 text-2xl">
                  💎
                </span>
                <span className="loot loot-3 absolute top-1/3 left-1/2 text-2xl">
                  🍎
                </span>
              </>
            )}
            {enemyPops.map((p) => (
              <span
                key={p.id}
                className={`num num-${p.kind} absolute top-[10%] left-1/2`}
              >
                {p.kind === "crit" && (
                  <span className="block text-sm">CRITICAL!</span>
                )}
                {p.text}
              </span>
            ))}
          </div>
          {phase !== "won" && (
            <div className="mt-1 w-[80%]">
              <p className="text-center text-[11px] font-black text-white drop-shadow-[0_1px_1px_rgba(0,0,0,.6)]">
                {enemy.name}
              </p>
              <div className="mt-0.5 h-2 overflow-hidden rounded-full bg-black/35 ring-1 ring-white/60">
                <div
                  className={`h-full rounded-full transition-[width] duration-500 ${hpPct > 50 ? "bg-gradient-to-r from-lime-300 to-green-500" : hpPct > 25 ? "bg-gradient-to-r from-yellow-300 to-amber-500" : "bg-gradient-to-r from-rose-300 to-red-500"}`}
                  style={{ width: `${hpPct}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Overlays */}
        {phase === "intro" && (
          <Overlay>
            <p className="text-sm font-black tracking-[0.25em] text-amber-200 uppercase">
              Quest
            </p>
            <h2 className="title-glow mt-1 text-3xl font-black text-white sm:text-4xl">
              The Jelly King awaits!
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-white/90">
              Answer right to strike with your sword. 3 in a row and Momo
              unleashes the <b>Momo Bark</b> for double damage! Defeat all 5
              monsters. You have {QUEST_LIVES} hearts — each wrong answer costs
              one.
            </p>
            <button
              type="button"
              onPointerDown={unlock}
              onClick={() => {
                unlock();
                sfx.select();
                setPhase("enemyIn");
                setTimeout(() => setPhase("ask"), 800);
              }}
              className="start-btn mt-5 rounded-2xl bg-gradient-to-b from-amber-300 to-orange-400 px-8 py-3 text-lg font-black text-slate-900 shadow-lg ring-4 ring-white/70"
            >
              ⚔️ Start adventure
            </button>
          </Overlay>
        )}
        {phase === "dead" && (
          <Overlay tone="dark">
            <p className="title-pop text-4xl font-black text-white">
              You fainted!
            </p>
            <p className="mt-2 text-sm text-white/85">
              5 wrong answers. Read the explanations, then try again — Momo is
              cheering for you! 🐶
            </p>
            <button
              type="button"
              onClick={restart}
              className="start-btn mt-5 rounded-2xl bg-gradient-to-b from-amber-300 to-orange-400 px-8 py-3 text-lg font-black text-slate-900 shadow-lg ring-4 ring-white/70"
            >
              🔁 Try the quest again
            </button>
          </Overlay>
        )}
        {phase === "won" && (
          <>
            <Confetti />
            <Overlay>
              <p className="level-up text-5xl font-black sm:text-6xl">
                LEVEL UP!
              </p>
              <p className="mt-1 font-bold text-white">
                The Jelly King is defeated!
              </p>
              <div className="mt-3 flex justify-center">
                <Stars
                  count={finish.data?.stars ?? 0}
                  className="win-stars size-12"
                />
              </div>
              <p className="mt-2 text-sm text-white/90">
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
                  className="rounded-2xl bg-gradient-to-b from-amber-300 to-orange-400 px-5 py-2.5 text-sm font-black text-slate-900"
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
        <Card className="overflow-hidden">
          <div className="ro-window px-4 py-2 text-xs font-black tracking-wide text-white uppercase">
            ✦ Answer to attack
          </div>
          <div className="p-4 sm:p-5">
            <p className="text-ink text-lg leading-snug font-bold">
              {question.prompt}
            </p>
            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {question.options.map((o, i) => {
                const isRight = rightId === o.id;
                const isPicked = picked === o.id;
                const look =
                  rightId === null
                    ? isPicked
                      ? "ring-4 ring-sky-200 scale-[.98]"
                      : ""
                    : isRight
                      ? "ring-4 ring-emerald-300 answer-right"
                      : isPicked
                        ? "answer-wrong"
                        : "opacity-40";
                return (
                  <button
                    key={o.id}
                    type="button"
                    disabled={phase !== "ask"}
                    onClick={() => void answer(o.id)}
                    className={`flex items-center gap-3 rounded-2xl bg-gradient-to-br px-4 py-3 text-left text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-default disabled:hover:translate-y-0 ${OPTION_STYLES[i % 4]} ${look}`}
                  >
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-white/30 text-xs font-black">
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
                  className={`mt-4 rounded-xl px-4 py-3 text-sm ${phase === "review" ? "bg-rose-50 text-rose-900" : "bg-emerald-50 text-emerald-900"}`}
                >
                  <b>{phase === "review" ? "Ouch! " : "Great hit! "}</b>
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
          </div>
        </Card>
      )}

      <style>{`
        .sky-day { background: linear-gradient(180deg, #5fb4ff 0%, #9fd6ff 38%, #dff1ff 62%, #fff4fb 100%); }
        .sky-boss { background: linear-gradient(180deg, #3b1d6e 0%, #8a4fc9 40%, #f39ac7 75%, #ffd6e8 100%); }
        .sun-rays { background: repeating-conic-gradient(from 0deg, rgba(255,255,255,.55) 0deg 6deg, transparent 6deg 18deg); mask-image: radial-gradient(circle, #000 0 30%, transparent 70%); animation: rays 40s linear infinite; }
        @keyframes rays { to { transform: rotate(360deg) } }
        .twinkle { animation: twinkle 2.2s ease-in-out infinite; text-shadow: 0 0 6px #fff; }
        @keyframes twinkle { 0%,100% { opacity: .2; transform: scale(.7) } 50% { opacity: 1; transform: scale(1.2) } }
        .cloud-a { animation: drift 46s linear infinite; left: -30%; }
        .cloud-b { animation: drift 70s linear infinite -20s; left: -30%; }
        .cloud-c { animation: drift 90s linear infinite -50s; left: -30%; }
        @keyframes drift { to { transform: translateX(170vw) } }
        .ro-window { background: linear-gradient(180deg, rgba(86,120,196,.92), rgba(50,74,140,.92)); border: 2px solid rgba(255,255,255,.75); box-shadow: 0 4px 10px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.4); }

        .hero-idle { animation: hero-idle 1.3s ease-in-out infinite; }
        @keyframes hero-idle { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-4px) } }
        .hero-ready { animation: hero-ready .45s ease-in-out infinite; }
        @keyframes hero-ready { 0%,100% { transform: translateX(0) } 50% { transform: translateX(-4px) scaleY(.97) } }
        .hero-attack { animation: hero-attack .55s cubic-bezier(.3,.9,.3,1); }
        @keyframes hero-attack { 0% { transform: translateX(0) } 40% { transform: translateX(150%) } 55% { transform: translateX(150%) } 100% { transform: translateX(0) } }
        .hero-attack .hero-sword { animation: swing .55s ease-out; transform-origin: 86px 98px; }
        @keyframes swing { 0% { transform: rotate(0) } 30% { transform: rotate(-70deg) } 55% { transform: rotate(80deg) } 100% { transform: rotate(0) } }
        .hero-cheer .hero-sword { animation: raise .6s ease-out; transform-origin: 86px 98px; }
        @keyframes raise { 0%,100% { transform: rotate(0) } 50% { transform: rotate(-60deg) } }
        .hero-hurt { animation: hero-hurt .5s ease-out; }
        @keyframes hero-hurt { 0% { transform: translateX(0); filter: none } 20% { transform: translateX(-14%) rotate(-6deg); filter: brightness(1.2) sepia(1) hue-rotate(-50deg) saturate(4) } 60% { transform: translateX(-6%) } 100% { transform: translateX(0); filter: none } }
        .hero-dead { animation: hero-dead 1s ease-in forwards; transform-origin: 50% 95%; }
        @keyframes hero-dead { 0% { transform: rotate(0) } 30% { transform: rotate(8deg) translateY(-8px) } 100% { transform: rotate(-88deg) translate(-20%, 10%); filter: grayscale(.8) } }
        .hero-win { animation: hero-win .9s ease-in-out infinite; }
        @keyframes hero-win { 0%,100% { transform: translateY(0) } 40% { transform: translateY(-26px) } }
        .hero-win .hero-sword { transform: rotate(-60deg); transform-origin: 86px 98px; }
        .hero-hair { transform-origin: 66px 40px; animation: hair 2.4s ease-in-out infinite; }
        @keyframes hair { 0%,100% { transform: rotate(0) } 50% { transform: rotate(-1.5deg) } }
        .hero-scarf { transform-origin: 56px 96px; animation: scarf .8s ease-in-out infinite; }
        @keyframes scarf { 0%,100% { transform: skewY(0) } 50% { transform: skewY(6deg) scaleX(1.05) } }
        .charge { animation: charge .5s ease-in-out infinite; filter: blur(14px); }
        @keyframes charge { 0%,100% { transform: scale(.85); opacity: .5 } 50% { transform: scale(1.1); opacity: 1 } }

        .pet-idle { animation: pet-hop 1s ease-in-out infinite; }
        @keyframes pet-hop { 0%,100% { transform: translateY(0) } 45% { transform: translateY(-10px) } 55% { transform: translateY(-10px) } }
        .pet-tail { transform-origin: 34px 68px; animation: wag .3s ease-in-out infinite alternate; }
        @keyframes wag { from { transform: rotate(-12deg) } to { transform: rotate(16deg) } }
        .pet-cape { transform-origin: 56px 66px; animation: scarf .7s ease-in-out infinite; }
        .pet-super { animation: pet-super .56s cubic-bezier(.3,.9,.3,1); }
        @keyframes pet-super { 0% { transform: translate(0,0) } 45% { transform: translate(180%, -60%) scale(1.25) } 100% { transform: translate(0,0) } }
        .pet-sad { transform: rotate(-8deg) translateY(4px); filter: saturate(.6); }
        .pet-win { animation: pet-hop .5s ease-in-out infinite; }

        .mon-idle { animation: mon-hop 1.1s ease-in-out infinite; transform-origin: 50% 100%; }
        @keyframes mon-hop { 0% { transform: translateY(0) scale(1.08, .9) } 30% { transform: translateY(-22px) scale(.94, 1.08) } 55% { transform: translateY(-26px) scale(1, 1) } 85% { transform: translateY(0) scale(1.1, .88) } 100% { transform: translateY(0) scale(1.08, .9) } }
        .mon-hit { animation: mon-hit .6s ease-out; transform-origin: 50% 100%; }
        @keyframes mon-hit { 0% { transform: translateX(0); filter: none } 12% { transform: translateX(14%) scale(1.1, .85); filter: brightness(2.6) saturate(0) } 35% { transform: translateX(8%) scale(.95, 1.05); filter: brightness(1.4) } 100% { transform: translateX(0) scale(1); filter: none } }
        .mon-down > svg { animation: mon-down 1s ease-in forwards; transform-origin: 50% 100%; }
        @keyframes mon-down { 0% { transform: scale(1); filter: brightness(2) } 25% { transform: scale(1.3, .5) } 45% { transform: scale(.8, 1.4) translateY(-10%) } 100% { transform: scale(0) translateY(-40%) rotate(200deg); opacity: 0 } }
        .mon-in { animation: mon-in .8s cubic-bezier(.3,1.5,.5,1); transform-origin: 50% 100%; }
        @keyframes mon-in { 0% { transform: translateY(-260%) scale(.8, 1.2); opacity: 0 } 55% { transform: translateY(0) scale(1.25, .7); opacity: 1 } 75% { transform: translateY(-14%) scale(.9, 1.1) } 100% { transform: translateY(0) scale(1) } }
        .mon-lunge { animation: mon-lunge .5s cubic-bezier(.6,0,.3,1); transform-origin: 50% 100%; }
        @keyframes mon-lunge { 0% { transform: translate(0,0) } 45% { transform: translate(-150%, -30%) scale(1.15) rotate(-12deg) } 100% { transform: translate(0,0) } }
        .monster-wing-l { transform-origin: 44px 76px; animation: wing-l .22s ease-in-out infinite alternate; }
        .monster-wing-r { transform-origin: 96px 76px; animation: wing-r .22s ease-in-out infinite alternate; }
        @keyframes wing-l { from { transform: rotate(12deg) } to { transform: rotate(-16deg) } }
        @keyframes wing-r { from { transform: rotate(-12deg) } to { transform: rotate(16deg) } }
        .monster-leaf { transform-origin: 72px 30px; animation: hair 1s ease-in-out infinite; }
        .monster-halo { animation: twinkle 1.6s ease-in-out infinite; }

        .slash { animation: slash .38s ease-out forwards; filter: drop-shadow(0 0 8px #fff) drop-shadow(0 0 16px #7dd3fc); }
        .slash-miss { opacity: .5; filter: drop-shadow(0 0 6px #fff); }
        @keyframes slash { 0% { transform: scale(.3) rotate(-30deg); opacity: 0 } 30% { opacity: 1 } 100% { transform: scale(1.3) rotate(10deg); opacity: 0 } }
        .spark { animation: spark .6s ease-out forwards; font-size: 18px; margin: -10px; }
        @keyframes spark { 0% { transform: rotate(var(--a)) translateX(0) scale(1.2); opacity: 1 } 100% { transform: rotate(var(--a)) translateX(70px) scale(.3); opacity: 0 } }
        .burst { animation: burst .9s ease-out forwards; margin: -12px; }
        @keyframes burst { 0% { transform: rotate(var(--a)) translateX(0) scale(1.4); opacity: 1 } 100% { transform: rotate(var(--a)) translateX(110px) scale(.2); opacity: 0 } }
        .loot { margin-left: -12px; }
        .loot-1 { animation: loot-1 1s ease-out forwards; }
        .loot-2 { animation: loot-2 1s ease-out forwards; }
        .loot-3 { animation: loot-3 1s ease-out forwards; }
        @keyframes loot-1 { 0% { transform: translate(0,0) scale(.4) } 40% { transform: translate(-40px,-70px) scale(1.1) } 100% { transform: translate(-60px,40px) } }
        @keyframes loot-2 { 0% { transform: translate(0,0) scale(.4) } 40% { transform: translate(10px,-90px) scale(1.1) } 100% { transform: translate(14px,44px) } }
        @keyframes loot-3 { 0% { transform: translate(0,0) scale(.4) } 40% { transform: translate(50px,-60px) scale(1.1) } 100% { transform: translate(70px,42px) } }

        .num { margin-left: -2ch; font-weight: 900; text-align: center; white-space: nowrap; pointer-events: none; z-index: 50; font-family: ui-rounded, system-ui, sans-serif; }
        .num-dmg { color: #fff36b; font-size: 2.1rem; text-shadow: 0 2px 0 #7c2d12, 2px 0 0 #7c2d12, -2px 0 0 #7c2d12, 0 -2px 0 #7c2d12, 0 4px 6px rgba(0,0,0,.35); animation: num-arc 1.2s cubic-bezier(.2,.8,.4,1) forwards; }
        .num-crit { color: #ff5a3c; font-size: 2.8rem; text-shadow: 0 2px 0 #fff, 2px 0 0 #fff, -2px 0 0 #fff, 0 -2px 0 #fff, 0 0 18px #fde047; animation: num-arc 1.3s cubic-bezier(.2,.8,.4,1) forwards; }
        .num-crit span { color: #fde047; text-shadow: 0 1px 0 #7c2d12, 0 0 6px #7c2d12; }
        .num-miss { color: #bae6fd; font-size: 1.8rem; text-shadow: 0 2px 0 #1e3a8a, 2px 0 0 #1e3a8a, -2px 0 0 #1e3a8a, 0 -2px 0 #1e3a8a; animation: num-float 1.1s ease-out forwards; }
        .num-hurt { color: #ff4d6d; font-size: 1.9rem; text-shadow: 0 2px 0 #fff, 2px 0 0 #fff, -2px 0 0 #fff, 0 -2px 0 #fff; animation: num-arc-left 1.2s cubic-bezier(.2,.8,.4,1) forwards; }
        .num-exp { color: #a7f3d0; font-size: 1.3rem; text-shadow: 0 2px 0 #065f46, 2px 0 0 #065f46, -2px 0 0 #065f46, 0 -2px 0 #065f46; animation: num-float 1.3s ease-out forwards; }
        @keyframes num-arc { 0% { transform: translate(0, 10px) scale(.4); opacity: 0 } 15% { transform: translate(8px, -40px) scale(1.25); opacity: 1 } 45% { transform: translate(22px, -66px) scale(1) } 100% { transform: translate(46px, -10px) scale(.9); opacity: 0 } }
        @keyframes num-arc-left { 0% { transform: translate(0, 10px) scale(.4); opacity: 0 } 15% { transform: translate(-8px, -40px) scale(1.25); opacity: 1 } 45% { transform: translate(-22px, -60px) } 100% { transform: translate(-46px, -6px); opacity: 0 } }
        @keyframes num-float { 0% { transform: translateY(10px) scale(.5); opacity: 0 } 20% { transform: translateY(-20px) scale(1.15); opacity: 1 } 100% { transform: translateY(-70px) scale(1); opacity: 0 } }

        .bark-banner { transform: translateX(-50%); color: #fde047; text-shadow: 0 3px 0 #c2410c, 0 0 18px #fff, 0 0 30px #fbbf24; animation: bark-banner 1.1s ease-out forwards; }
        @keyframes bark-banner { 0% { transform: translateX(-50%) scale(.3) rotate(-10deg); opacity: 0 } 25% { transform: translateX(-50%) scale(1.2) rotate(-4deg); opacity: 1 } 100% { transform: translateX(-50%) scale(1) rotate(-4deg) translateY(-14px); opacity: 0 } }
        .bark-wave { animation: bark-wave .56s ease-out forwards; }
        .bark-wave-2 { animation-delay: .12s; }
        @keyframes bark-wave { 0% { transform: translateX(0) scale(.4); opacity: 1 } 100% { transform: translateX(min(48vw, 520px)) scale(2.4); opacity: 0 } }
        .flash { animation: flash .35s ease-out forwards; }
        @keyframes flash { 0% { opacity: .85 } 100% { opacity: 0 } }

        .light-pillar { background: linear-gradient(90deg, transparent, rgba(255,255,255,.95), transparent); box-shadow: 0 0 60px 30px rgba(253,224,71,.35); animation: pillar 1.4s ease-in-out infinite; }
        @keyframes pillar { 0%,100% { opacity: .55; transform: scaleX(.85) } 50% { opacity: 1; transform: scaleX(1.1) } }
        .level-up { background: linear-gradient(180deg, #fffbe6, #fde047 45%, #f59e0b); -webkit-background-clip: text; background-clip: text; color: transparent; filter: drop-shadow(0 3px 0 #9a3412) drop-shadow(0 0 16px rgba(253,224,71,.8)); animation: level-up .8s cubic-bezier(.2,1.5,.4,1); }
        @keyframes level-up { 0% { transform: scale(.2) translateY(40px); opacity: 0 } 100% { transform: scale(1) translateY(0); opacity: 1 } }
        .angel { animation: angel 2.4s ease-out infinite; transform: translateX(-50%); }
        @keyframes angel { 0% { transform: translate(-50%, 20px); opacity: 0 } 30% { opacity: 1 } 100% { transform: translate(-50%, -60px); opacity: 0 } }

        .arena-shake { animation: arena-shake .45s ease-in-out .28s; }
        @keyframes arena-shake { 0%,100% { transform: translate(0) } 20% { transform: translate(-9px, 4px) } 40% { transform: translate(7px, -4px) } 60% { transform: translate(-5px, 2px) } 80% { transform: translate(3px, -2px) } }
        .combo-hot { animation: combo-hot .5s ease-in-out infinite; }
        @keyframes combo-hot { 0%,100% { transform: scale(1) } 50% { transform: scale(1.06) } }
        @keyframes pop-in { 0% { transform: scale(.6); opacity: 0 } 70% { transform: scale(1.08); opacity: 1 } 100% { transform: scale(1) } }
        .overlay-in, .title-pop { animation: pop-in .5s cubic-bezier(.2,1.4,.4,1); }
        .title-glow { text-shadow: 0 3px 0 #1e3a8a, 0 0 18px rgba(255,255,255,.6); }
        .win-stars { animation: pop-in .8s .35s cubic-bezier(.2,1.4,.4,1) both; }
        .start-btn { animation: start-pulse 1.4s ease-in-out infinite; }
        @keyframes start-pulse { 0%,100% { transform: scale(1) } 50% { transform: scale(1.06) } }
        @keyframes heart-break { 0% { transform: scale(1) } 30% { transform: scale(1.6) rotate(-12deg) } 60% { transform: scale(.8) rotate(10deg) } 100% { transform: scale(1) } }
        .heart-break { animation: heart-break .6s ease-out; }
        @keyframes answer-right { 0%,100% { transform: scale(1) } 40% { transform: scale(1.04) } }
        .answer-right { animation: answer-right .45s ease-out; }
        @keyframes answer-wrong { 0%,100% { transform: translateX(0) } 25% { transform: translateX(-6px) } 75% { transform: translateX(6px) } }
        .answer-wrong { animation: answer-wrong .3s ease-in-out 2; }
        @media (prefers-reduced-motion: reduce) {
          .sun-rays, .twinkle, .cloud-a, .cloud-b, .cloud-c, .hero-idle, .hero-hair, .hero-scarf, .pet-idle, .pet-tail, .pet-cape, .mon-idle, .monster-wing-l, .monster-wing-r, .monster-leaf, .start-btn, .combo-hot { animation: none; }
        }
      `}</style>
    </div>
  );
}

function Cloud({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute h-16 w-48 ${className}`} aria-hidden="true">
      <span className="absolute bottom-0 left-0 h-10 w-48 rounded-full bg-white" />
      <span className="absolute bottom-3 left-8 size-16 rounded-full bg-white" />
      <span className="absolute bottom-2 left-24 size-12 rounded-full bg-white" />
    </div>
  );
}

function Heart({ full, breaking }: { full: boolean; breaking: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`size-5 ${breaking ? "heart-break" : ""}`}
      aria-hidden="true"
    >
      <path
        d="M12 21s-7.5-4.6-9.7-9.3C.6 8.1 2.6 4 6.4 4c2.2 0 3.6 1.2 4.4 2.5h2.4C14 5.2 15.4 4 17.6 4c3.8 0 5.8 4.1 4.1 7.7C19.5 16.4 12 21 12 21z"
        fill={full ? "#ff4d6d" : "#64748b"}
        stroke="#fff"
        strokeWidth="1.5"
      />
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
      className={`absolute inset-0 z-40 flex items-center justify-center p-4 ${tone === "dark" ? "bg-slate-900/65" : "bg-indigo-950/40"} backdrop-blur-[2px]`}
    >
      <div className="overlay-in text-center">{children}</div>
    </div>
  );
}
