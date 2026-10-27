"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { Confetti, SoundToggle } from "~/app/_components/race/race-view";
import { sfx, unlock } from "~/app/_components/sfx";
import { Card } from "~/app/_components/ui";
import {
  BOSS,
  canCast,
  canHeal,
  CAST_COST,
  COMBO_FOR_SUPER,
  ELEMENT_INFO,
  ELEMENTS,
  HEAL_COST,
  QUEST,
  SP_MAX,
  startState,
  step,
  type Element,
  type QuestState,
} from "~/lib/games/quest";
import { api, type RouterOutputs } from "~/trpc/react";
import { Stars } from "../../_components/stars";
import { Hero, MomoPet, Monster } from "../_components/art";
import {
  EffectStyles,
  ElementCast,
  ElementImpact,
} from "../_components/effects";
import { MangaCutIn, type Scene } from "../_components/manga";

type Data = RouterOutputs["game"]["questQuestions"];
type Question = Data["questions"][number];
export type Arena = { kind: "unit" | "boss"; id: string };

type Phase =
  | "intro"
  | "ask"
  | "checking"
  | "attack" // the skill flies
  | "impact" // the skill lands
  | "enemyDown"
  | "enemyIn"
  | "burst" // 3 in a row: Momo's elemental Bark cut-in
  | "bossIntro" // manga cut-in before the boss or a new dragon phase
  | "miss" // wrong answer: the attack misses
  | "lunge" // the monster strikes back
  | "review"
  | "won"
  | "dead";

type Pop = {
  id: number;
  text: string;
  kind: "dmg" | "crit" | "miss" | "hurt" | "exp" | "star" | "weak" | "heal";
  color?: string;
};

type Turn =
  | { kind: "answer"; questionId: string; optionId: string; element: Element }
  | { kind: "cast"; element: Element }
  | { kind: "heal" };

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
 * A Momo's Quest battle — a unit quest or a class's Boss Level. Answering
 * correctly casts the selected element skill (and charges mana); a monster
 * hit with its weak element takes extra damage. Three right in a row add
 * Momo's elemental Bark. Students who don't know an answer can spend mana to
 * cast a skill anyway, or have Momo heal a heart. Wrong answers (and, in the
 * Boss Level's later phases, running out of time) cost a heart. The server
 * checks every answer and replays every turn to award stars.
 */
export function Battle({ arena, data }: { arena: Arena; data: Data }) {
  const router = useRouter();
  const utils = api.useUtils();
  const rules = arena.kind === "boss" ? BOSS : QUEST;
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
  const [state, setState] = useState<QuestState>(() => startState(rules));
  const [shownEnemy, setShownEnemy] = useState(0);
  const [shownHp, setShownHp] = useState(rules.enemies[0]!.hp);
  const [phase, setPhase] = useState<Phase>("intro");
  const [picked, setPicked] = useState<string | null>(null);
  const [rightId, setRightId] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [element, setElement] = useState<Element>("fire");
  const [castElement, setCastElement] = useState<Element>("fire");
  const [bark, setBark] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [healing, setHealing] = useState(false);
  const [revealed, setRevealed] = useState<boolean[]>(() =>
    rules.enemies.map(() => false),
  );
  const [brokenHeart, setBrokenHeart] = useState<number | null>(null);
  const [enemyPops, setEnemyPops] = useState<Pop[]>([]);
  const [heroPops, setHeroPops] = useState<Pop[]>([]);
  const [earned, setEarned] = useState(0);
  const [deadline, setDeadline] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const turns = useRef<Turn[]>([]);

  const question = deck[cursor % Math.max(1, deck.length)];
  const enemy = rules.enemies[Math.min(shownEnemy, rules.enemies.length - 1)]!;
  const lastEnemy = shownEnemy === rules.enemies.length - 1;
  const info = ELEMENT_INFO[element];

  const pop = (
    side: "enemy" | "hero",
    text: string,
    kind: Pop["kind"],
    color?: string,
  ) => {
    const p = { id: Math.random(), text, kind, color };
    const set = side === "enemy" ? setEnemyPops : setHeroPops;
    set((all) => [...all, p]);
    setTimeout(() => set((all) => all.filter((x) => x.id !== p.id)), 1500);
  };

  // The answer timer, on enemies that have one.
  useEffect(() => {
    if (phase === "ask" && enemy.seconds) {
      setDeadline(Date.now() + enemy.seconds * 1000);
    } else if (phase !== "checking") {
      setDeadline(null);
    }
  }, [phase, enemy.seconds, cursor]);
  useEffect(() => {
    if (!deadline) return;
    const t = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(t);
  }, [deadline]);
  const secondsLeft = deadline
    ? Math.max(0, Math.ceil((deadline - now) / 1000))
    : null;

  const restart = () => {
    turns.current = [];
    setDeck(shuffle(data.questions));
    setCursor(0);
    setState(startState(rules));
    setShownEnemy(0);
    setShownHp(rules.enemies[0]!.hp);
    setPicked(null);
    setRightId(null);
    setExplanation(null);
    setBrokenHeart(null);
    setRevealed(rules.enemies.map(() => false));
    setEarned(0);
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
    setTimedOut(false);
    setPhase("ask");
  }, [deck.length]);

  /** The skill (and maybe Momo's Bark) lands; on to the next enemy if it falls. */
  const strike = async (next: ReturnType<typeof step>, used: Element) => {
    setCastElement(used);
    setBark(next.bark);
    if (next.bark) {
      setPhase("burst");
      sfx.burst();
      await wait(1500);
    }
    setPhase("attack");
    sfx.zap();
    await wait(next.bark ? 520 : 440);
    setPhase("impact");
    if (next.bark || next.weak) sfx.superHit();
    else sfx.hit();
    const base = 90 + Math.floor(Math.random() * 60);
    pop(
      "enemy",
      String(base * next.damage),
      next.bark ? "crit" : "dmg",
      ELEMENT_INFO[used].color,
    );
    if (next.weak) {
      setTimeout(
        () =>
          pop("enemy", "SUPER EFFECTIVE!", "weak", ELEMENT_INFO[used].color),
        180,
      );
      setRevealed((r) => r.map((v, i) => (i === state.enemy ? true : v)));
    }
    setShownHp((hp) => Math.max(0, hp - next.damage));
    setState(next.state);
    await wait(760);
    if (next.defeated) {
      setPhase("enemyDown");
      sfx.boom();
      pop("enemy", `+${next.state.enemy * 25} EXP`, "exp");
      await wait(1100);
      if (next.state.won) {
        setPhase("won");
        finish.mutate({ arena, answers: turns.current });
        return;
      }
      setShownEnemy(next.state.enemy);
      setShownHp(rules.enemies[next.state.enemy]!.hp);
      // The boss (or a new dragon phase) gets a manga entrance.
      if (
        rules.mode === "boss" ||
        next.state.enemy === rules.enemies.length - 1
      ) {
        setPhase("bossIntro");
        return;
      }
      setPhase("enemyIn");
      await wait(800);
    }
    nextQuestion();
  };

  /** Answer the question; an empty option means the timer ran out. */
  const answer = async (optionId: string) => {
    if (phase !== "ask" || !question) return;
    unlock();
    sfx.select();
    setPicked(optionId || null);
    setPhase("checking");
    let result: Awaited<ReturnType<typeof check.mutateAsync>>;
    try {
      result = await check.mutateAsync({
        arena,
        questionId: question.id,
        optionId,
      });
    } catch {
      setPicked(null);
      setPhase("ask");
      return;
    }
    turns.current.push({
      kind: "answer",
      questionId: question.id,
      optionId,
      element,
    });
    setRightId(result.correctOptionId);
    setExplanation(result.explanation);
    const next = step(
      state,
      { kind: "answer", correct: result.correct, element },
      rules,
    );
    if (result.newStar) {
      setEarned((n) => n + 1);
      setTimeout(() => {
        sfx.coin();
        pop("hero", "+1 ⭐", "star");
      }, 300);
    }

    if (result.correct) {
      await strike(next, element);
      return;
    }
    if (!optionId) {
      setTimedOut(true);
      pop("enemy", "TIME UP!", "miss");
    } else {
      setPhase("miss");
      sfx.zap();
      await wait(250);
      pop("enemy", "MISS", "miss");
      await wait(300);
    }
    setPhase("lunge");
    await wait(330);
    sfx.hurt();
    pop("hero", String(40 + Math.floor(Math.random() * 40)), "hurt");
    setBrokenHeart(next.state.lives);
    setState(next.state);
    await wait(700);
    if (next.state.dead) {
      setPhase("dead");
      finish.mutate({ arena, answers: turns.current });
      return;
    }
    setPhase("review");
  };

  /** Don't know it? Spend mana to cast the selected skill and skip. */
  const castSkill = async () => {
    if (phase !== "ask" || !canCast(state)) return;
    unlock();
    turns.current.push({ kind: "cast", element });
    const next = step(state, { kind: "cast", element }, rules);
    setPicked(null);
    setRightId(null);
    setExplanation(null);
    pop("hero", `−${CAST_COST} 💎`, "heal", "#a5b4fc");
    await strike(next, element);
  };

  /** Momo's Healing Paw: a heart back for mana. */
  const healPaw = () => {
    if (phase !== "ask" || !canHeal(state, rules)) return;
    unlock();
    turns.current.push({ kind: "heal" });
    const next = step(state, { kind: "heal" }, rules);
    setState(next.state);
    setHealing(true);
    sfx.coin();
    pop("hero", "+1 ❤️", "heal", "#fb7185");
    setTimeout(() => setHealing(false), 1100);
  };

  // The timer running out counts as a wrong answer.
  useEffect(() => {
    if (phase === "ask" && deadline && now >= deadline) void answer("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now, deadline, phase]);

  // Keys: 1–4 answer, Q W E R pick an element, Space casts, H heals.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (phase === "ask" && question && /^[1-4]$/.test(e.key)) {
        const option = question.options[Number(e.key) - 1];
        if (option) void answer(option.id);
      } else if (
        phase === "ask" &&
        "qwer".includes(e.key.toLowerCase()) &&
        e.key.length === 1
      ) {
        setElement(ELEMENTS["qwer".indexOf(e.key.toLowerCase())]!);
      } else if (phase === "review" && e.key === "Enter") {
        nextQuestion();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const hpPct = (shownHp / enemy.hp) * 100;
  const castColor = ELEMENT_INFO[castElement].color;
  const heroClass =
    phase === "dead"
      ? "hero-dead"
      : phase === "won"
        ? "hero-win"
        : phase === "miss"
          ? "hero-attack"
          : phase === "attack"
            ? "hero-cheer"
            : phase === "lunge"
              ? "hero-hurt"
              : phase === "checking"
                ? "hero-ready"
                : "hero-idle";
  const petClass =
    phase === "attack" && bark
      ? "pet-super"
      : healing
        ? "pet-heal"
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
  const sky =
    rules.mode === "boss"
      ? `sky-final sky-final-${shownEnemy + 1}`
      : lastEnemy
        ? "sky-boss"
        : "sky-day";
  const introScene: Scene = rules.mode === "boss" ? "dragon" : "start";
  const bossScene: Scene =
    rules.mode === "boss" ? (shownEnemy === 1 ? "phase2" : "phase3") : "boss";
  const winScene: Scene = rules.mode === "boss" ? "legend" : "win";
  const busy = phase !== "ask";

  return (
    <div
      className="mx-auto max-w-5xl space-y-4 max-sm:-mt-3 max-sm:space-y-2"
      key={run}
    >
      <div className="flex flex-wrap items-end justify-between gap-3 max-sm:flex-nowrap max-sm:items-center">
        <div className="min-w-0">
          <Link
            href="/student/games/quest"
            className="text-brand text-sm font-semibold hover:underline max-sm:text-xs"
          >
            ← All quests
          </Link>
          <p className="text-muted mt-1 text-xs font-bold tracking-wide uppercase max-sm:hidden">
            Momo&apos;s Quest · {data.className}
          </p>
          <h1 className="text-ink text-2xl font-extrabold tracking-tight max-sm:truncate max-sm:text-sm">
            {data.title}
          </h1>
        </div>
        <div className="text-right max-sm:hidden">
          <p className="text-muted text-[11px] font-semibold">Your best</p>
          <Stars
            count={Math.min(3, Math.max(data.best, finish.data?.best ?? 0))}
            className="size-6"
          />
          {rules.mode === "boss" && (
            <p className="text-muted text-[11px] font-semibold">
              {Math.max(data.best, finish.data?.best ?? 0)} / 5 stars
            </p>
          )}
        </div>
      </div>

      {/* Arena */}
      <div
        className={`relative h-[226px] overflow-hidden rounded-3xl shadow-xl ring-4 ring-white max-sm:rounded-2xl max-sm:ring-2 sm:h-[400px] ${
          phase === "lunge" ? "arena-shake" : ""
        } ${sky}`}
      >
        {rules.mode !== "boss" && (
          <>
            <div className="sun-rays absolute -top-40 -left-40 size-[520px] rounded-full opacity-60" />
            <div className="absolute top-6 left-10 size-16 rounded-full bg-white/90 shadow-[0_0_80px_40px_rgba(255,255,255,.75)]" />
            <Cloud className="cloud-a top-[12%]" />
            <Cloud className="cloud-b top-[30%] scale-75 opacity-80" />
            <Cloud className="cloud-c top-[4%] scale-50 opacity-70" />
          </>
        )}
        {rules.mode === "boss" && (
          <div className="lightning absolute inset-0" />
        )}
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
        {(lastEnemy || rules.mode === "boss") && (
          <svg
            viewBox="0 0 200 80"
            className="absolute right-[18%] bottom-[30%] w-56 opacity-50"
            aria-hidden="true"
          >
            <path
              d="M10 80 V40 h10 v-8 h8 v8 h10 V20 h8 v-8 h8 v8 h8 v20 h10 v-8 h8 v8 h10 V30 h8 v-10 h8 v10 h8 v50 Z"
              fill={rules.mode === "boss" ? "#1c1917" : "#5b2a86"}
            />
          </svg>
        )}
        <div className="hill-a absolute -bottom-24 -left-16 h-56 w-[70%] rounded-[50%]" />
        <div className="hill-b absolute -right-20 -bottom-28 h-60 w-[75%] rounded-[50%]" />
        <div className="ground absolute inset-x-0 bottom-0 h-20" />
        <div className="absolute bottom-3 left-1/2 h-10 w-[85%] -translate-x-1/2 rounded-[50%] bg-[#e9d6a8]/60" />

        {/* HUD: status window */}
        <div className="ro-window absolute top-3 left-3 z-30 w-[48%] max-w-[260px] rounded-xl px-3 py-2 max-sm:top-2 max-sm:left-2 max-sm:w-[46%] max-sm:px-2 max-sm:py-1">
          <div className="flex items-center justify-between text-[11px] font-black text-white max-sm:hidden">
            <span>Adventurer &amp; Momo</span>
            <span
              className="rounded-full bg-amber-300/90 px-1.5 text-[10px] text-amber-950"
              title="Stars earned this battle"
            >
              ⭐ {earned}
            </span>
          </div>
          <div className="mt-1 flex gap-1">
            {Array.from({ length: rules.lives }, (_, i) => (
              <Heart
                key={i}
                full={i < state.lives}
                breaking={brokenHeart === i}
              />
            ))}
          </div>
          <div
            className="mt-1 flex items-center gap-1"
            title="Mana: earned by correct answers, spent on skills"
          >
            {Array.from({ length: SP_MAX }, (_, i) => (
              <span
                key={i}
                className={`size-3 rotate-45 rounded-[3px] border border-white/70 transition ${
                  i < state.sp
                    ? "bg-gradient-to-br from-indigo-300 to-violet-500 shadow-[0_0_6px_#a5b4fc]"
                    : "bg-black/30"
                }`}
              />
            ))}
            <span className="ml-1 text-[10px] font-bold text-indigo-100">
              {state.sp} mana
            </span>
          </div>
          <p
            className={`mt-0.5 text-[10px] font-bold ${state.streak >= COMBO_FOR_SUPER ? "combo-hot text-amber-200" : "text-white/80"}`}
          >
            {state.streak >= COMBO_FOR_SUPER
              ? `🔥 ${state.streak} combo · ${info.bark}!`
              : `Momo Bark: ${Math.min(state.streak, COMBO_FOR_SUPER)}/${COMBO_FOR_SUPER}`}
          </p>
        </div>
        <div className="absolute top-3 right-3 z-30 flex flex-col items-end gap-1.5">
          <SoundToggle className="max-sm:px-2 max-sm:py-1 max-sm:text-[10px]" />
          <div className="flex gap-1">
            {rules.enemies.map((e, i) => (
              <span
                key={e.kind}
                title={e.name}
                className={`flex size-6 items-center justify-center rounded-full text-[11px] font-black shadow max-sm:size-5 max-sm:text-[10px] ${
                  i < state.enemy || state.won
                    ? "bg-emerald-400 text-emerald-950"
                    : i === shownEnemy
                      ? "bg-white text-slate-900 ring-2 ring-amber-300"
                      : "bg-white/40 text-slate-700"
                }`}
              >
                {i < state.enemy || state.won
                  ? "✓"
                  : rules.mode === "boss"
                    ? "🐉"
                    : i === rules.enemies.length - 1
                      ? "👑"
                      : i + 1}
              </span>
            ))}
          </div>
          {secondsLeft !== null && phase === "ask" && (
            <span
              className={`rounded-xl px-2.5 py-1 font-mono text-lg font-black text-white tabular-nums ${secondsLeft <= 5 ? "timer-hot bg-rose-600" : "bg-black/40"}`}
            >
              ⏱ {secondsLeft}s
            </span>
          )}
        </div>

        {phase === "won" && (
          <div className="light-pillar absolute bottom-0 left-[8%] z-0 h-full w-40" />
        )}

        {/* Momo the pet */}
        <div
          className={`absolute bottom-[9%] left-[2%] z-10 w-[17%] max-w-[110px] ${petClass}`}
        >
          {healing && (
            <div className="heal-glow absolute inset-[-20%] -z-10 rounded-full" />
          )}
          <MomoPet className="w-full drop-shadow-[0_6px_6px_rgba(0,0,0,.2)]" />
        </div>

        {/* Hero */}
        <div
          className={`absolute bottom-[7%] left-[13%] z-20 w-[24%] max-w-[170px] ${heroClass}`}
        >
          {phase === "checking" && (
            <div className="charge absolute inset-[5%] -z-10 rounded-full bg-sky-200/80" />
          )}
          {(phase === "attack" || phase === "impact") && (
            <div
              className="aura absolute inset-0 -z-10 rounded-full"
              style={{ backgroundColor: castColor }}
            />
          )}
          <Hero className="w-full drop-shadow-[0_6px_6px_rgba(0,0,0,.2)]" />
          {phase === "dead" && (
            <div className="angel absolute -top-4 left-1/2 text-center">
              <span className="block text-2xl">😇</span>
            </div>
          )}
          {heroPops.map((p) => (
            <span
              key={p.id}
              className={`num num-${p.kind} absolute top-0 left-1/2`}
              style={p.color ? { color: p.color } : undefined}
            >
              {p.text}
            </span>
          ))}
        </div>

        {/* The skill in flight, and Momo's Bark wave */}
        {phase === "attack" && (
          <ElementCast key={`cast-${cursor}`} element={castElement} />
        )}
        {phase === "attack" && bark && (
          <>
            <div
              className="bark-wave absolute bottom-[22%] left-[14%] z-30 size-24 rounded-full border-[6px]"
              style={{ borderColor: castColor }}
            />
            <div className="bark-wave bark-wave-2 absolute bottom-[22%] left-[14%] z-30 size-24 rounded-full border-4 border-white" />
          </>
        )}
        {phase === "impact" && bark && (
          <>
            <div
              className="flash absolute inset-0 z-30"
              style={{ backgroundColor: castColor, opacity: 0.4 }}
            />
            <p className="sfx-stamp absolute top-[14%] left-[30%] z-40 text-5xl font-black italic sm:text-7xl">
              {castElement === "fire"
                ? "GOOOO!!"
                : castElement === "water"
                  ? "SPLAAASH!!"
                  : castElement === "air"
                    ? "WHOOOSH!!"
                    : "DOGOOON!!"}
            </p>
          </>
        )}

        {/* Momo's Bark cut-in */}
        {phase === "burst" && (
          <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden">
            <div className="burst-dim absolute inset-0" />
            <div
              className="burst-band absolute top-1/2 left-[-20%] h-[58%] w-[140%]"
              style={{
                background: `linear-gradient(100deg, #1e1b4b 0%, ${castColor} 40%, #fef3c7 62%, ${castColor} 82%, #1e1b4b 100%)`,
              }}
            >
              <div className="burst-lines absolute inset-0" />
              <div className="burst-portrait absolute top-[-30%] left-[12%] w-[58%] max-w-[420px]">
                <Hero mood="determined" className="w-full" />
              </div>
              <div className="burst-pet absolute right-[22%] bottom-[2%] w-[16%] max-w-[110px]">
                <MomoPet className="w-full" />
              </div>
            </div>
            <div className="burst-name absolute right-[6%] bottom-[12%] text-right">
              <p className="text-xs font-black tracking-[0.35em] text-white/80 uppercase">
                {ELEMENT_INFO[castElement].icon} Momo&apos;s Bark
              </p>
              <p className="text-3xl font-black text-white italic sm:text-5xl">
                {ELEMENT_INFO[castElement].bark}
              </p>
            </div>
          </div>
        )}

        {/* Monster */}
        <div className="absolute right-[8%] bottom-[8%] z-20 flex w-[30%] max-w-[200px] flex-col items-center max-sm:right-[4%] max-sm:bottom-[4%] max-sm:w-[26%] sm:right-[12%]">
          <div
            className={`relative w-full ${enemyClass}`}
            key={`${shownEnemy}-${run}`}
          >
            <Monster
              kind={enemy.kind}
              className={`w-full ${lastEnemy || rules.mode === "boss" ? "scale-125" : ""}`}
            />
            {phase === "miss" && (
              <svg
                viewBox="0 0 100 100"
                className="slash slash-miss absolute inset-0 z-10"
                aria-hidden="true"
              >
                <path
                  d="M10 80 Q 50 -10 92 30 Q 52 10 10 80 Z"
                  fill="#ffffff"
                />
              </svg>
            )}
            {phase === "impact" && <ElementImpact element={castElement} />}
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
                style={p.color ? { color: p.color } : undefined}
              >
                {p.kind === "crit" && (
                  <span className="block text-sm">CRITICAL!</span>
                )}
                {p.text}
              </span>
            ))}
          </div>
          {phase !== "won" && (
            <div className="mt-1 w-[86%]">
              <p className="text-center text-[11px] font-black text-white drop-shadow-[0_1px_1px_rgba(0,0,0,.6)]">
                {enemy.name}
              </p>
              <div className="mt-0.5 h-2 overflow-hidden rounded-full bg-black/35 ring-1 ring-white/60">
                <div
                  className={`h-full rounded-full transition-[width] duration-500 ${hpPct > 50 ? "bg-gradient-to-r from-lime-300 to-green-500" : hpPct > 25 ? "bg-gradient-to-r from-yellow-300 to-amber-500" : "bg-gradient-to-r from-rose-300 to-red-500"}`}
                  style={{ width: `${hpPct}%` }}
                />
              </div>
              <p className="mt-0.5 text-center text-[10px] font-bold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,.6)]">
                Weak<span className="max-sm:hidden"> to</span>:{" "}
                {revealed[shownEnemy]
                  ? `${ELEMENT_INFO[enemy.weak].icon} ${ELEMENT_INFO[enemy.weak].name}`
                  : "❓"}
                {!revealed[shownEnemy] && (
                  <span className="max-sm:hidden"> find out!</span>
                )}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Skills */}
      {phase !== "intro" && phase !== "won" && phase !== "dead" && (
        <Card className="overflow-hidden">
          <div className="ro-window flex flex-wrap items-center justify-between gap-2 px-4 py-2 text-xs font-black tracking-wide text-white uppercase max-sm:hidden">
            <span>✦ Skills — pick an element, then answer</span>
            <span className="normal-case">Keys: Q W E R · 1–4</span>
          </div>
          <div className="flex items-stretch gap-1.5 p-1.5 sm:flex-wrap sm:gap-2 sm:p-3">
            {ELEMENTS.map((el, i) => {
              const e = ELEMENT_INFO[el];
              const on = element === el;
              return (
                <button
                  key={el}
                  type="button"
                  onClick={() => {
                    setElement(el);
                    sfx.select();
                  }}
                  aria-pressed={on}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl border-2 px-1 py-1 text-left transition sm:min-w-[96px] sm:justify-start sm:px-3 sm:py-2 ${
                    on
                      ? "skill-on -translate-y-0.5 bg-white shadow-md"
                      : "border-transparent bg-slate-100 hover:bg-slate-50"
                  }`}
                  style={
                    on
                      ? {
                          borderColor: e.color,
                          boxShadow: `0 0 0 3px ${e.color}33`,
                        }
                      : undefined
                  }
                >
                  <span className="text-2xl max-sm:text-xl" title={e.skill}>
                    {e.icon}
                  </span>
                  <span className="min-w-0 leading-tight max-sm:hidden">
                    <span className="text-ink block text-sm font-black">
                      {e.skill}
                    </span>
                    <span className="text-muted block text-[10px] font-bold">
                      {e.name} · {"QWER"[i]}
                    </span>
                  </span>
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => void castSkill()}
              disabled={busy || !canCast(state)}
              className="flex flex-[1.4] flex-col items-start justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 px-3 py-2 text-left text-white shadow-md transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 max-sm:items-center max-sm:px-1 max-sm:py-1 sm:min-w-[150px]"
              title="Don't know the answer? Spend mana to attack anyway (the question comes back later)."
            >
              <span className="text-sm font-black max-sm:text-[11px]">
                ✨ Cast<span className="max-sm:hidden"> {info.skill}</span>
              </span>
              <span className="text-[10px] font-bold text-indigo-100">
                <span className="max-sm:hidden">Skip &amp; attack · </span>
                {CAST_COST} 💎
              </span>
            </button>
            <button
              type="button"
              onClick={healPaw}
              disabled={busy || !canHeal(state, rules)}
              className="flex flex-[1.4] flex-col items-start justify-center rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 px-3 py-2 text-left text-white shadow-md transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 max-sm:items-center max-sm:px-1 max-sm:py-1 sm:min-w-[130px]"
              title="Momo heals one heart."
            >
              <span className="text-sm font-black max-sm:text-[11px]">
                🐾 <span className="max-sm:hidden">Healing Paw</span>
                <span className="sm:hidden">Heal</span>
              </span>
              <span className="text-[10px] font-bold text-rose-100">
                <span className="max-sm:hidden">Momo · +1 ❤️ · </span>
                {HEAL_COST} 💎
              </span>
            </button>
          </div>
        </Card>
      )}

      {/* Question */}
      {question && phase !== "intro" && phase !== "won" && phase !== "dead" && (
        <Card className="overflow-hidden">
          <div className="ro-window px-4 py-2 text-xs font-black tracking-wide text-white uppercase max-sm:hidden">
            {ELEMENT_INFO[element].icon} Answer to cast{" "}
            {ELEMENT_INFO[element].skill}
          </div>
          <div className="p-4 max-sm:p-2.5 sm:p-5">
            <p className="text-ink text-lg leading-snug font-bold max-sm:text-sm">
              {question.prompt}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2.5 max-sm:mt-2 max-sm:gap-1.5">
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
                    className={`flex items-center gap-3 rounded-2xl bg-gradient-to-br px-4 py-3 text-left text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-default disabled:hover:translate-y-0 max-sm:min-h-[52px] max-sm:gap-1.5 max-sm:rounded-xl max-sm:px-2 max-sm:py-1.5 max-sm:text-xs max-sm:leading-tight ${OPTION_STYLES[i % 4]} ${look}`}
                  >
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-white/30 text-xs font-black max-sm:size-5 max-sm:text-[10px]">
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
                  className={`mt-4 rounded-xl px-4 py-3 text-sm max-sm:mt-2 max-sm:line-clamp-3 max-sm:px-2.5 max-sm:py-1.5 max-sm:text-xs ${phase === "review" ? "bg-rose-50 text-rose-900" : "bg-emerald-50 text-emerald-900"}`}
                >
                  <b>
                    {phase === "review"
                      ? timedOut
                        ? "Time's up! "
                        : "Ouch! "
                      : "Great hit! "}
                  </b>
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

      {phase === "intro" && (
        <MangaCutIn scene={introScene}>
          <p className="text-sm text-white/85">
            Pick an element skill — 💧 Water, 🔥 Fire, 🌪️ Air or 🪨 Earth — and
            answer right to cast it. Each monster has a hidden weakness. Correct
            answers charge 💎 mana: don&apos;t know an answer? Spend it to cast
            anyway, or have Momo heal a heart. Every new correct answer earns ⭐
            1 star; winning adds up to {rules.mode === "boss" ? 5 : 3} more.
            {rules.mode === "boss" &&
              " The dragon's later phases put a timer on every question!"}
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
            className="start-btn mt-4 rounded-2xl bg-gradient-to-b from-amber-300 to-orange-400 px-8 py-3 text-lg font-black text-slate-900 shadow-lg ring-4 ring-white/70"
          >
            ⚔️ {rules.mode === "boss" ? "Face the dragon" : "Start adventure"}
          </button>
        </MangaCutIn>
      )}
      {phase === "bossIntro" && (
        <MangaCutIn scene={bossScene}>
          {enemy.seconds && (
            <p className="text-sm font-bold text-rose-200">
              ⏱ {enemy.seconds} seconds per question from now on!
            </p>
          )}
          <button
            type="button"
            onClick={() => {
              sfx.select();
              setPhase("enemyIn");
              setTimeout(nextQuestion, 800);
            }}
            className="start-btn mt-3 rounded-2xl bg-gradient-to-b from-rose-400 to-red-600 px-10 py-3 text-xl font-black text-white shadow-lg ring-4 ring-white/70"
          >
            ⚔️ FIGHT!
          </button>
        </MangaCutIn>
      )}
      {phase === "dead" && (
        <MangaCutIn scene="faint">
          <p className="text-sm text-white/85">
            Read the explanations, then try again. Tip: save mana for the
            questions you don&apos;t know.
          </p>
          <button
            type="button"
            onClick={restart}
            className="start-btn mt-4 rounded-2xl bg-gradient-to-b from-amber-300 to-orange-400 px-8 py-3 text-lg font-black text-slate-900 shadow-lg ring-4 ring-white/70"
          >
            🔁 Try again
          </button>
        </MangaCutIn>
      )}
      {phase === "won" && (
        <>
          <Confetti />
          <MangaCutIn scene={winScene}>
            <p className="level-up text-4xl font-black sm:text-5xl">
              {rules.mode === "boss" ? "LEGEND!" : "LEVEL UP!"}
            </p>
            <div className="mt-2 flex justify-center">
              <Stars
                count={Math.min(3, finish.data?.stars ?? 0)}
                className="win-stars size-11"
              />
            </div>
            <p className="mt-1 text-sm text-white/90">
              {finish.isPending
                ? "Saving your stars…"
                : finish.data
                  ? finish.data.newStars > 0
                    ? `+${finish.data.newStars} bonus Star${finish.data.newStars === 1 ? "" : "s"} for winning (${finish.data.stars}/${rules.mode === "boss" ? 5 : 3}) · ${earned} for new correct answers`
                    : `${earned} star${earned === 1 ? "" : "s"} for new correct answers · your win bonus is still ${finish.data.best}`
                  : (finish.error?.message ?? "")}
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
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
                {rules.mode === "boss" ? "Back to quests →" : "Next quest →"}
              </Link>
            </div>
          </MangaCutIn>
        </>
      )}

      <EffectStyles />
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
        .num-crit { color: #f5d0fe; font-size: 2.8rem; text-shadow: 0 3px 0 #3b0764, 3px 0 0 #3b0764, -3px 0 0 #3b0764, 0 -3px 0 #3b0764, 0 0 20px #a855f7; animation: num-arc 1.3s cubic-bezier(.2,.8,.4,1) forwards; }
        .num-crit span { color: #fef08a; text-shadow: 0 1px 0 #7c2d12, 0 0 6px #7c2d12; }
        .num-miss { color: #bae6fd; font-size: 1.8rem; text-shadow: 0 2px 0 #1e3a8a, 2px 0 0 #1e3a8a, -2px 0 0 #1e3a8a, 0 -2px 0 #1e3a8a; animation: num-float 1.1s ease-out forwards; }
        .num-hurt { color: #ff4d6d; font-size: 1.9rem; text-shadow: 0 2px 0 #fff, 2px 0 0 #fff, -2px 0 0 #fff, 0 -2px 0 #fff; animation: num-arc-left 1.2s cubic-bezier(.2,.8,.4,1) forwards; }
        .num-star { color: #fde047; font-size: 1.6rem; text-shadow: 0 2px 0 #92400e, 2px 0 0 #92400e, -2px 0 0 #92400e, 0 -2px 0 #92400e, 0 0 14px #fde047; animation: num-float 1.3s ease-out forwards; }
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
        .sfx-stamp { color: #fff; -webkit-text-stroke: 3px #000; paint-order: stroke fill; text-shadow: 5px 5px 0 #000; transform: rotate(-12deg); animation: sfx-stamp .7s cubic-bezier(.2,1.8,.4,1) forwards; }
        @keyframes sfx-stamp { 0% { transform: rotate(-12deg) scale(2.6); opacity: 0 } 30% { transform: rotate(-12deg) scale(1); opacity: 1 } 80% { opacity: 1 } 100% { transform: rotate(-12deg) scale(1.1); opacity: 0 } }
        .burst-dim { background: radial-gradient(ellipse at center, rgba(30,10,60,.55), rgba(10,5,25,.92)); animation: burst-dim 1.5s ease-in-out forwards; }
        @keyframes burst-dim { 0% { opacity: 0 } 12% { opacity: 1 } 85% { opacity: 1 } 100% { opacity: 0 } }
        .burst-band { background: linear-gradient(100deg, #2e1065 0%, #7c3aed 35%, #c084fc 55%, #fde68a 75%, #7c3aed 100%); box-shadow: 0 0 40px 10px rgba(168,85,247,.6); overflow: hidden; animation: burst-band 1.5s cubic-bezier(.2,.9,.2,1) forwards; }
        @keyframes burst-band { 0% { transform: translateY(-50%) skewY(-8deg) translateX(-110%) } 18% { transform: translateY(-50%) skewY(-8deg) translateX(0) } 80% { transform: translateY(-50%) skewY(-8deg) translateX(4%) } 100% { transform: translateY(-50%) skewY(-8deg) translateX(120%) } }
        .burst-lines { background: repeating-linear-gradient(100deg, rgba(255,255,255,0) 0 22px, rgba(255,255,255,.35) 22px 24px, rgba(255,255,255,0) 24px 60px); animation: burst-lines .3s linear infinite; }
        @keyframes burst-lines { from { background-position: 0 0 } to { background-position: -120px 0 } }
        .burst-portrait { animation: burst-portrait 1.5s cubic-bezier(.2,.9,.2,1) forwards; filter: drop-shadow(0 0 18px rgba(253,230,138,.8)); }
        @keyframes burst-portrait { 0% { transform: skewY(8deg) translateX(-40%) scale(1.1); opacity: 0 } 22% { transform: skewY(8deg) translateX(0) scale(1); opacity: 1 } 80% { transform: skewY(8deg) translateX(6%) scale(1.03); opacity: 1 } 100% { transform: skewY(8deg) translateX(30%); opacity: 0 } }
        .burst-eye-glow { text-shadow: 0 0 10px #fde68a, 0 0 20px #c084fc; opacity: 0; animation: eye-glow 1.5s ease-in-out forwards; }
        @keyframes eye-glow { 0%,28% { opacity: 0; transform: scale(.2) rotate(0) } 42% { opacity: 1; transform: scale(1.6) rotate(45deg) } 70% { opacity: .9; transform: scale(1) rotate(90deg) } 100% { opacity: 0 } }
        .burst-pet { animation: burst-pet 1.5s ease-out forwards; }
        @keyframes burst-pet { 0%,20% { opacity: 0; transform: skewY(8deg) translateY(40%) } 40% { opacity: 1; transform: skewY(8deg) translateY(-10%) } 80% { opacity: 1; transform: skewY(8deg) translateY(0) } 100% { opacity: 0 } }
        .burst-name { animation: burst-name 1.5s cubic-bezier(.2,.9,.2,1) forwards; text-shadow: 0 0 14px #a855f7, 0 3px 0 #4c1d95; }
        @keyframes burst-name { 0%,20% { opacity: 0; transform: translateX(60px) } 38% { opacity: 1; transform: translateX(0) } 82% { opacity: 1; transform: translateX(-8px) } 100% { opacity: 0; transform: translateX(-40px) } }
        .boom-core { margin: -80px; background: radial-gradient(circle, #fff 0 18%, #f5d0fe 30%, rgba(168,85,247,.85) 50%, rgba(124,58,237,0) 70%); animation: boom-core .7s ease-out forwards; }
        @keyframes boom-core { 0% { transform: scale(.2); opacity: 1 } 60% { transform: scale(1.6); opacity: .9 } 100% { transform: scale(2.2); opacity: 0 } }
        .boom-ring { margin: -80px; animation: boom-ring .7s ease-out forwards; box-shadow: 0 0 20px #c084fc; }
        .boom-ring-2 { animation-delay: .12s; }
        @keyframes boom-ring { 0% { transform: scale(.1); opacity: 1 } 100% { transform: scale(2.6); opacity: 0 } }
        .bolt { margin: -48px -16px; transform-origin: 50% 100%; animation: bolt .6s ease-out forwards; filter: drop-shadow(0 0 8px #e879f9); }
        @keyframes bolt { 0% { transform: rotate(var(--a)) translateY(-10px) scale(.4); opacity: 0 } 25% { opacity: 1 } 100% { transform: rotate(var(--a)) translateY(-90px) scale(1.2); opacity: 0 } }
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
      
        .sky-final-1 { background: linear-gradient(180deg, #0f0a1f 0%, #3b1d6e 45%, #7c3aed 80%, #c4b5fd 100%); }
        .sky-final-2 { background: linear-gradient(180deg, #1c0707 0%, #7f1d1d 40%, #ea580c 78%, #fdba74 100%); }
        .sky-final-3 { background: linear-gradient(180deg, #030008 0%, #1e1b2e 45%, #4c1d95 75%, #facc15 100%); }
        .sky-day .hill-a { background: #a6e3a1 } .sky-day .hill-b { background: #8fd88a } .sky-day .ground { background: linear-gradient(180deg, #7cce6c, #5bb350) }
        .sky-boss .hill-a { background: #9b6fd1 } .sky-boss .hill-b { background: #8256be } .sky-boss .ground { background: linear-gradient(180deg, #7a4bb3, #5b2a86) }
        .sky-final .hill-a { background: #292524 } .sky-final .hill-b { background: #1c1917 } .sky-final .ground { background: linear-gradient(180deg, #44403c, #1c1917) }
        .sky-final-2 .hill-a { background: #7c2d12 } .sky-final-2 .hill-b { background: #431407 }
        .lightning { animation: lightning 5s linear infinite; background: rgba(255,255,255,.0); }
        @keyframes lightning { 0%, 93%, 100% { background: rgba(255,255,255,0) } 94% { background: rgba(233,213,255,.55) } 95% { background: rgba(255,255,255,0) } 96% { background: rgba(233,213,255,.35) } }
        .dragon-flame { transform-origin: 50% 100%; animation: dragon-flame .5s ease-in-out infinite alternate; }
        @keyframes dragon-flame { from { transform: scaleY(.8) } to { transform: scaleY(1.15) translateY(-3px) } }
        .num-weak { font-size: 1.1rem; text-shadow: 0 2px 0 #1e293b, 2px 0 0 #1e293b, -2px 0 0 #1e293b, 0 -2px 0 #1e293b; animation: num-float 1.4s ease-out forwards; margin-top: -26px; }
        .num-heal { font-size: 1.5rem; text-shadow: 0 2px 0 #fff, 2px 0 0 #fff, -2px 0 0 #fff, 0 -2px 0 #fff; animation: num-float 1.3s ease-out forwards; }
        .aura { animation: aura .6s ease-out; filter: blur(16px); opacity: .7; }
        @keyframes aura { 0% { transform: scale(.6); opacity: 0 } 50% { transform: scale(1.2); opacity: .8 } 100% { transform: scale(1.3); opacity: 0 } }
        .pet-heal { animation: pet-heal 1s ease-in-out; }
        @keyframes pet-heal { 0%,100% { transform: translate(0,0) } 40% { transform: translate(40%, -30%) scale(1.15) } }
        .heal-glow { background: radial-gradient(circle, rgba(251,113,133,.7), transparent 65%); animation: aura 1s ease-out; }
        .timer-hot { animation: combo-hot .5s ease-in-out infinite; }
        .skill-on { animation: skill-on .3s cubic-bezier(.2,1.6,.4,1); }
        @keyframes skill-on { 0% { transform: scale(.94) } 100% { transform: scale(1) translateY(-2px) } }
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
      className={`size-4 sm:size-5 ${breaking ? "heart-break" : ""}`}
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
