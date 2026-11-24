"use client";

import { useEffect, useRef, useState } from "react";
import { Fit, Layout, Rive, RuntimeLoader } from "@rive-app/canvas";

/**
 * The student's game hero: a live character from "StudioRun" by thelittlelabs
 * (Rive community file, CC BY 4.0). The file draws its ten characters inside
 * its own night-sky scene, so each hero is shown as a framed portrait: the
 * canvas is drawn much bigger than the frame and shifted so only the
 * character's corner of the scene shows. The scene's blue night sky and
 * purple floor are then cut away (see `cutBackground`), so only the
 * character itself shows, on whatever is behind it.
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

/**
 * The scene's sky (deep indigo) and floor (purple): low red, green close to
 * red, much more blue. The characters' colours (light blue, pink, the dark
 * clapperboard, …) all fail at least one of these.
 */
const isBackground = (r: number, g: number, b: number) =>
  r < 120 && g < 120 && b > 88 && b - g > 35 && g - r < 35;

/**
 * Makes the background see-through: starts at the edges and spreads through
 * background colours only, so dark parts inside a character (eyes) stay.
 */
function cutBackground(img: ImageData) {
  const { data, width: W, height: H } = img;
  const seen = new Uint8Array(W * H);
  const stack: number[] = [];
  for (let x = 0; x < W; x++) stack.push(x, (H - 1) * W + x);
  for (let y = 0; y < H; y++) stack.push(y * W, y * W + W - 1);
  while (stack.length) {
    const i = stack.pop()!;
    if (seen[i]) continue;
    const o = i * 4;
    if (!isBackground(data[o]!, data[o + 1]!, data[o + 2]!)) continue;
    seen[i] = 1;
    data[o + 3] = 0;
    const x = i % W;
    if (x > 0) stack.push(i - 1);
    if (x < W - 1) stack.push(i + 1);
    if (i >= W) stack.push(i - W);
    if (i < W * (H - 1)) stack.push(i + W);
  }
  // Soften the outline: bluish edge pixels next to the cut fade halfway.
  for (let i = 0; i < W * H; i++) {
    if (seen[i]) continue;
    const x = i % W;
    const edge =
      (x > 0 && seen[i - 1] === 1) ||
      (x < W - 1 && seen[i + 1] === 1) ||
      (i >= W && seen[i - W] === 1) ||
      (i < W * (H - 1) && seen[i + W] === 1);
    const o = i * 4;
    if (edge && data[o]! < 140 && data[o + 2]! - data[o + 1]! > 20) {
      data[o + 3] = 110;
    }
  }
}

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
  const viewRef = useRef<HTMLCanvasElement>(null);
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

  // Copy the character's corner of the scene into the small visible canvas,
  // without its background, about 30 times a second.
  useEffect(() => {
    if (!ready) return;
    let frame = 0;
    let last = 0;
    const tick = (t: number) => {
      frame = requestAnimationFrame(tick);
      if (t - last < 33) return;
      last = t;
      const src = canvasRef.current;
      const view = viewRef.current;
      const ctx = view?.getContext("2d", { willReadFrequently: true });
      if (!src || !view || !ctx || !src.width) return;
      const side = Math.min(
        256,
        Math.round(view.clientWidth * (window.devicePixelRatio || 1)),
      );
      if (!side) return;
      if (view.width !== side) view.width = view.height = side;
      const sw = CROP.size * src.width;
      ctx.clearRect(0, 0, side, side);
      ctx.drawImage(
        src,
        CROP.x * src.width,
        CROP.y * src.height,
        sw,
        sw,
        0,
        0,
        side,
        side,
      );
      const img = ctx.getImageData(0, 0, side, side);
      cutBackground(img);
      ctx.putImageData(img, 0, 0);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [ready]);

  const w = 100 / CROP.size;
  const h = w / CROP.aspect;
  return (
    <div
      className={`${/(^|\s)(absolute|fixed)(\s|$)/.test(className) ? "" : "relative"} aspect-square overflow-hidden ${className}`}
      aria-label={`Your hero: ${HERO_CHARACTERS[ch]}`}
      role="img"
    >
      {/* still picture while the live one loads */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/rive/heroes/${ch}.png`}
        alt=""
        className={`absolute inset-0 size-full object-cover transition-opacity duration-500 ${ready ? "opacity-0" : "opacity-100"}`}
      />
      {/* the live scene, drawn off to the side (never shown) */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute max-w-none opacity-0"
        style={{
          width: `${w}%`,
          height: `${h}%`,
          left: `${-CROP.x * w}%`,
          top: `${-CROP.y * h}%`,
        }}
      />
      {/* what shows: the character alone */}
      <canvas
        ref={viewRef}
        aria-hidden="true"
        className="absolute inset-0 size-full"
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
              src={`/rive/heroes/${n}.png`}
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
