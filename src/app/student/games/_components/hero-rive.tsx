"use client";

import { useEffect, useRef, useState } from "react";
import { Fit, Layout, Rive, RuntimeLoader } from "@rive-app/canvas";

/**
 * The student's game hero: a live character from "StudioRun" by thelittlelabs
 * (Rive community file, CC BY 4.0). The file draws its ten characters inside
 * its own night-sky scene, so each hero is shown as a framed portrait: the
 * canvas is drawn much bigger than the frame and shifted so only the
 * character's corner of the scene shows.
 */

export const HERO_CHARACTERS = [
  "Painter",
  "Planner",
  "Coder",
  "Designer",
  "3D Maker",
  "Dreamweaver",
  "Builder",
  "Writer",
  "Chef",
  "Santa",
] as const;

const KEY = "momo-hero-character";
const EVENT = "momo-hero-change";
const DEFAULT = 5; // the Dreamweaver

/** Where the character stands, as fractions of the game artboard. */
const CROP = { x: 0.198, y: 0.578, size: 0.1916, aspect: 1.74 };

let wasmSet = false;
let fileBuffer: Promise<ArrayBuffer> | null = null;
/** Download the 13 MB file once and share it with every hero on the page. */
export function loadFile() {
  if (!wasmSet) {
    RuntimeLoader.setWasmUrl("/rive/rive.wasm");
    wasmSet = true;
  }
  fileBuffer ??= fetch("/rive/studiorun.riv").then((r) => {
    if (!r.ok) throw new Error("Could not load the hero");
    return r.arrayBuffer();
  });
  return fileBuffer;
}

function readChoice() {
  try {
    const n = Number(localStorage.getItem(KEY));
    if (localStorage.getItem(KEY) !== null && n >= 0 && n < 10) return n;
  } catch {}
  return DEFAULT;
}

export function setHeroCharacter(n: number) {
  try {
    localStorage.setItem(KEY, String(n));
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

/** The character this student picked (saved on this device). */
export function useHeroCharacter() {
  const [ch, setCh] = useState(DEFAULT);
  useEffect(() => {
    const sync = () => setCh(readChoice());
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return ch;
}

export function HeroRive({ className = "" }: { className?: string }) {
  const ch = useHeroCharacter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const riveRef = useRef<Rive | null>(null);
  const chRef = useRef(ch);
  const [ready, setReady] = useState(false);

  const pick = (n: number) => {
    const r = riveRef.current;
    const input = r
      ?.stateMachineInputs("STATE MACHINE")
      ?.find((i) => i.name === "CHHH Selected");
    if (input) input.value = n;
  };

  useEffect(() => {
    let gone = false;
    void loadFile()
      .then((buffer) => {
        if (gone || !canvasRef.current) return;
        const r = new Rive({
          buffer,
          canvas: canvasRef.current,
          artboard: "Artboard",
          stateMachines: "STATE MACHINE",
          autoplay: true,
          layout: new Layout({ fit: Fit.Contain }),
          onLoad: () => {
            r.resizeDrawingSurfaceToCanvas();
            pick(chRef.current);
            setReady(true);
          },
        });
        riveRef.current = r;
      })
      .catch(() => setReady(false));
    const onResize = () => riveRef.current?.resizeDrawingSurfaceToCanvas();
    window.addEventListener("resize", onResize);
    return () => {
      gone = true;
      window.removeEventListener("resize", onResize);
      riveRef.current?.cleanup();
      riveRef.current = null;
    };
  }, []);

  useEffect(() => {
    chRef.current = ch;
    pick(ch);
  }, [ch]);

  const w = 100 / CROP.size;
  const h = w / CROP.aspect;
  return (
    <div
      className={`${/(^|\s)(absolute|fixed)(\s|$)/.test(className) ? "" : "relative"} aspect-square overflow-hidden rounded-[22%] bg-[#3d46c6] ring-4 ring-white/80 ${className}`}
      aria-label={`Your hero: ${HERO_CHARACTERS[ch]}`}
      role="img"
    >
      {/* still picture while the live one loads */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/rive/heroes/${ch}.jpg`}
        alt=""
        className={`absolute inset-0 size-full object-cover transition-opacity duration-500 ${ready ? "opacity-0" : "opacity-100"}`}
      />
      <canvas
        ref={canvasRef}
        className="absolute max-w-none"
        style={{
          width: `${w}%`,
          height: `${h}%`,
          left: `${-CROP.x * w}%`,
          top: `${-CROP.y * h}%`,
        }}
      />
    </div>
  );
}

/** Lets the student choose their hero from the ten StudioRun characters. */
export function HeroPicker() {
  const ch = useHeroCharacter();
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {HERO_CHARACTERS.map((name, n) => (
          <button
            key={name}
            type="button"
            onClick={() => setHeroCharacter(n)}
            aria-pressed={ch === n}
            className={`w-20 rounded-2xl p-1 text-center text-xs font-bold transition ${
              ch === n
                ? "bg-amber-400 text-slate-900 shadow-lg"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/rive/heroes/${n}.jpg`}
              alt=""
              className="aspect-square w-full rounded-xl"
            />
            <span className="mt-1 block">{name}</span>
          </button>
        ))}
      </div>
      <p className="mt-2 text-[11px] text-slate-400">
        Characters from{" "}
        <a
          className="underline"
          href="https://rive.app/community/files/26133-49002-studiorun-a-cosmic-game-by-thelittlelabs/"
          target="_blank"
          rel="noreferrer"
        >
          StudioRun by thelittlelabs
        </a>{" "}
        (CC BY 4.0)
      </p>
    </div>
  );
}
