"use client";

import { useEffect, useState } from "react";

import { sfx } from "~/app/_components/sfx";
import { Hero, MomoPet, Monster, type Mood } from "./art";

/**
 * Manga cut-ins for the big moments of Momo's Quest: a black-and-white
 * inked panel slams onto the screen with focus lines and screentone, a
 * sound-effect stamp, a speech bubble that types itself out, and a tilted
 * inset panel where Momo (or the hero) answers. Buttons and results go
 * underneath.
 */

export type Scene = "start" | "boss" | "win" | "faint";

type Cast = {
  main: { who: "hero"; mood: Mood } | { who: "boss" };
  line: string;
  inset: { who: "pet" } | { who: "hero"; mood: Mood };
  insetLine: string;
  sfx: string;
  mood: "focus" | "menace" | "sparkle" | "gloom";
};

const SCENES: Record<Scene, Cast> = {
  start: {
    main: { who: "hero", mood: "determined" },
    line: "Let's go, Momo! The Jelly King won't know what hit him!",
    inset: { who: "pet" },
    insetLine: "Arf arf!!",
    sfx: "DOON!",
    mood: "focus",
  },
  boss: {
    main: { who: "boss" },
    line: "Who dares enter my Jelly Kingdom?! I'll squish you flat!",
    inset: { who: "hero", mood: "shock" },
    insetLine: "W-woah… he's HUGE!",
    sfx: "GOGOGO…",
    mood: "menace",
  },
  win: {
    main: { who: "hero", mood: "laugh" },
    line: "Ahaha! We did it, Momo! That's a LEVEL UP!",
    inset: { who: "pet" },
    insetLine: "ARF!! ♥",
    sfx: "YATTA!!",
    mood: "sparkle",
  },
  faint: {
    main: { who: "hero", mood: "cry" },
    line: "Uuu… I'm not done yet!",
    inset: { who: "pet" },
    insetLine: "Arf! Read the explanations and try again!",
    sfx: "DOSA…",
    mood: "gloom",
  },
};

function useTyped(text: string, delay: number, speed = 32) {
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(0);
    let i = 0;
    let timer: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      timer = setInterval(() => {
        i++;
        setN(i);
        if (i >= text.length && timer) clearInterval(timer);
      }, speed);
    }, delay);
    return () => {
      clearTimeout(start);
      if (timer) clearInterval(timer);
    };
  }, [text, delay, speed]);
  return text.slice(0, n);
}

export function MangaCutIn({
  scene,
  children,
}: {
  scene: Scene;
  children?: React.ReactNode;
}) {
  const cast = SCENES[scene];
  const line = useTyped(cast.line, 520);
  const insetLine = useTyped(cast.insetLine, 520 + cast.line.length * 32 + 250);

  useEffect(() => {
    const t = setTimeout(() => {
      if (scene === "faint") sfx.faint();
      else if (scene === "win") sfx.fanfare();
      else sfx.hit();
    }, 120);
    return () => clearTimeout(t);
  }, [scene]);

  return (
    <div
      className="manga-backdrop fixed inset-0 z-[70] flex flex-col items-center justify-center gap-5 overflow-y-auto p-3"
      role="dialog"
      aria-modal="true"
      aria-label={`${cast.line} ${cast.insetLine}`}
    >
      <div className="relative w-full max-w-3xl">
        {/* Main panel */}
        <div
          className={`manga-panel relative aspect-[16/10] w-full overflow-hidden bg-white ${cast.mood === "menace" || cast.mood === "gloom" ? "manga-dark" : ""}`}
        >
          <FocusLines mood={cast.mood} />
          <div className="manga-tone absolute inset-0" />
          {cast.mood === "sparkle" &&
            Array.from({ length: 10 }, (_, i) => (
              <span
                key={i}
                className="manga-sparkle absolute text-black"
                style={{
                  left: `${(i * 37 + 8) % 92}%`,
                  top: `${(i * 23 + 6) % 80}%`,
                  fontSize: 14 + (i % 3) * 8,
                  animationDelay: `${(i % 5) * 0.18}s`,
                }}
              >
                ✦
              </span>
            ))}
          {/* Close-up */}
          <div
            className={`manga-face ink absolute ${
              cast.main.who === "boss"
                ? "top-[2%] left-[4%] w-[52%]"
                : "top-[-22%] left-[-4%] w-[66%]"
            }`}
          >
            {cast.main.who === "boss" ? (
              <Monster kind="boss" className="w-full" />
            ) : (
              <Hero mood={cast.main.mood} className="w-full" />
            )}
          </div>
          {/* Sound effect */}
          <p className="manga-sfx absolute top-[6%] right-[5%] text-5xl font-black sm:text-7xl">
            {cast.sfx}
          </p>
          {/* Speech bubble */}
          <div className="manga-bubble absolute top-[34%] right-[4%] max-w-[46%] rounded-[50%] border-[3px] border-black bg-white px-6 py-5 text-center">
            <p className="manga-text min-h-[3.5em] text-sm leading-snug font-black text-black sm:text-lg">
              {line}
              <span className="opacity-0">{cast.line.slice(line.length)}</span>
            </p>
            <span className="manga-tail absolute -bottom-5 left-[18%] block size-0" />
          </div>
        </div>

        {/* Inset panel */}
        <div className="manga-inset absolute -right-1 -bottom-8 w-[40%] max-w-[260px] overflow-hidden bg-white sm:-right-4">
          <FocusLines mood="focus" small />
          <div className="ink relative mx-auto w-[60%] pt-2">
            {cast.inset.who === "pet" ? (
              <MomoPet className="w-full" />
            ) : (
              <Hero mood={cast.inset.mood} className="w-full" />
            )}
          </div>
          <p className="manga-inset-text relative m-2 mt-0 min-h-[2.6em] rounded-xl border-2 border-black bg-white px-2 py-1 text-center text-[11px] leading-tight font-black text-black sm:text-sm">
            {insetLine}
          </p>
        </div>
      </div>

      {children && (
        <div className="manga-actions mt-8 w-full max-w-md text-center">
          {children}
        </div>
      )}

      <style>{`
        .manga-backdrop { background: radial-gradient(circle at 50% 40%, rgba(15,23,42,.55), rgba(2,6,23,.92)), radial-gradient(circle, rgba(255,255,255,.08) 1px, transparent 1.4px) 0 0 / 8px 8px; animation: manga-fade .25s ease-out; }
        @keyframes manga-fade { from { opacity: 0 } to { opacity: 1 } }
        .manga-panel { border: 6px solid #000; box-shadow: 10px 10px 0 rgba(0,0,0,.55); transform: rotate(-1.5deg); animation: manga-slam .55s cubic-bezier(.2,1.6,.4,1) both, manga-shake .35s ease-in-out .5s; }
        @keyframes manga-slam { 0% { transform: scale(1.5) rotate(-8deg); opacity: 0 } 60% { transform: scale(.97) rotate(-1deg); opacity: 1 } 100% { transform: scale(1) rotate(-1.5deg) } }
        @keyframes manga-shake { 0%,100% { translate: 0 0 } 25% { translate: -6px 3px } 50% { translate: 5px -3px } 75% { translate: -3px 2px } }
        .manga-dark { background: #e5e5e5; }
        .manga-tone { background: radial-gradient(circle, rgba(0,0,0,.22) 1px, transparent 1.6px) 0 0 / 7px 7px; mask-image: linear-gradient(160deg, transparent 35%, #000 100%); }
        .manga-dark .manga-tone { background: radial-gradient(circle, rgba(0,0,0,.4) 1.2px, transparent 1.8px) 0 0 / 6px 6px; mask-image: none; }
        .ink { filter: grayscale(1) contrast(1.4) brightness(1.06) drop-shadow(1.6px 0 0 #000) drop-shadow(-1.6px 0 0 #000) drop-shadow(0 1.6px 0 #000) drop-shadow(0 -1.6px 0 #000); }
        .manga-face { animation: manga-face .7s cubic-bezier(.2,1.3,.4,1) .1s both; }
        @keyframes manga-face { 0% { transform: translateX(-18%) scale(1.15); opacity: 0 } 100% { transform: none; opacity: 1 } }
        .manga-sfx { color: #fff; -webkit-text-stroke: 3px #000; paint-order: stroke fill; font-style: italic; letter-spacing: .02em; text-shadow: 5px 5px 0 #000; transform: rotate(-10deg); animation: manga-sfx .45s cubic-bezier(.2,1.8,.4,1) .3s both; }
        @keyframes manga-sfx { 0% { transform: rotate(-10deg) scale(2.4); opacity: 0 } 100% { transform: rotate(-10deg) scale(1); opacity: 1 } }
        .manga-bubble { box-shadow: 4px 4px 0 #000; animation: manga-pop .45s cubic-bezier(.2,1.7,.4,1) .45s both; }
        .manga-tail { border-left: 14px solid transparent; border-right: 6px solid transparent; border-top: 22px solid #000; transform: rotate(28deg); }
        .manga-tail::after { content: ""; position: absolute; left: -10px; top: -26px; border-left: 10px solid transparent; border-right: 4px solid transparent; border-top: 17px solid #fff; }
        .manga-text { font-family: "Comic Sans MS", "Chalkboard SE", ui-rounded, system-ui, sans-serif; }
        .manga-inset { border: 5px solid #000; box-shadow: 6px 6px 0 rgba(0,0,0,.55); transform: rotate(3deg); animation: manga-inset .5s cubic-bezier(.2,1.5,.4,1) .9s both; }
        @keyframes manga-inset { 0% { transform: translate(40%, 30%) rotate(14deg); opacity: 0 } 100% { transform: rotate(3deg); opacity: 1 } }
        .manga-inset-text { font-family: "Comic Sans MS", "Chalkboard SE", ui-rounded, system-ui, sans-serif; }
        @keyframes manga-pop { 0% { transform: scale(0); opacity: 0 } 100% { transform: scale(1); opacity: 1 } }
        .manga-actions { animation: manga-pop .4s cubic-bezier(.2,1.6,.4,1) 1.4s both; }
        .manga-lines { animation: manga-lines .16s steps(2) infinite; }
        @keyframes manga-lines { 0% { transform: rotate(0) scale(1) } 100% { transform: rotate(1.2deg) scale(1.02) } }
        .manga-gloom { animation: manga-gloom 3s ease-in-out infinite; }
        @keyframes manga-gloom { 0%,100% { opacity: .55 } 50% { opacity: .85 } }
        .manga-sparkle { animation: manga-twinkle 1.1s ease-in-out infinite; }
        @keyframes manga-twinkle { 0%,100% { opacity: .2; transform: scale(.6) rotate(0) } 50% { opacity: 1; transform: scale(1.3) rotate(45deg) } }
        .manga-tears { animation: manga-tears .5s linear infinite; }
        @keyframes manga-tears { 0% { transform: translateY(-2px) } 100% { transform: translateY(3px) } }
        .manga-sweat { animation: manga-sweat 1.2s ease-in infinite; }
        @keyframes manga-sweat { 0% { transform: translateY(-4px) } 100% { transform: translateY(6px) } }
        @media (prefers-reduced-motion: reduce) {
          .manga-panel, .manga-face, .manga-sfx, .manga-bubble, .manga-inset, .manga-actions, .manga-lines, .manga-sparkle, .manga-tears, .manga-sweat { animation: none; }
        }
      `}</style>
    </div>
  );
}

// Rounded so the server and the browser draw identical coordinates.
const round = (n: number) => Math.round(n * 100) / 100;

/** Concentration lines (radial ink strokes) or falling gloom lines. */
function FocusLines({
  mood,
  small = false,
}: {
  mood: Cast["mood"];
  small?: boolean;
}) {
  if (mood === "gloom") {
    return (
      <svg
        viewBox="0 0 160 100"
        preserveAspectRatio="none"
        className="manga-gloom absolute inset-0 size-full"
        aria-hidden="true"
      >
        {Array.from({ length: 40 }, (_, i) => (
          <line
            key={i}
            x1={i * 4 + (i % 3)}
            y1="0"
            x2={i * 4 + (i % 3)}
            y2={40 + ((i * 17) % 50)}
            stroke="#000"
            strokeWidth={i % 4 === 0 ? 1.2 : 0.5}
          />
        ))}
      </svg>
    );
  }
  const n = small ? 36 : 72;
  return (
    <svg
      viewBox="0 0 160 100"
      preserveAspectRatio="none"
      className="manga-lines absolute inset-0 size-full"
      aria-hidden="true"
    >
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2;
        const inner = 34 + ((i * 13) % 12);
        const x1 = round(80 + Math.cos(a) * inner * 1.6);
        const y1 = round(50 + Math.sin(a) * inner);
        const x2 = round(80 + Math.cos(a) * 140);
        const y2 = round(50 + Math.sin(a) * 90);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={mood === "menace" ? "#111" : "#000"}
            strokeWidth={i % 3 === 0 ? 1.4 : 0.6}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}
