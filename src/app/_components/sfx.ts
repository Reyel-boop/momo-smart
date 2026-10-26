"use client";

/**
 * Game sound effects, synthesized with the Web Audio API (no files to load).
 * Browsers only allow sound after the user clicks something, so `unlock()`
 * is called from a click; until then every effect is silent. Each viewer can
 * mute sounds; the choice is remembered on their device.
 */

let ctx: AudioContext | null = null;
const KEY = "momo-sound";

export function soundOn() {
  try {
    return localStorage.getItem(KEY) !== "off";
  } catch {
    return true;
  }
}

export function setSoundOn(on: boolean) {
  try {
    localStorage.setItem(KEY, on ? "on" : "off");
  } catch {
    // Storage blocked: the choice lasts for this page only.
  }
  if (on) unlock();
}

/** Call from a click so later effects can play. */
export function unlock() {
  if (typeof window === "undefined") return;
  ctx ??= new AudioContext();
  if (ctx.state === "suspended") void ctx.resume();
}

function ready() {
  if (ctx?.state !== "running" || !soundOn()) return null;
  return ctx;
}

type Wave = OscillatorType;

/** One tone that glides from `from` to `to` Hz. */
function tone(
  at: number,
  from: number,
  to: number,
  length: number,
  wave: Wave = "sine",
  volume = 0.2,
) {
  const a = ready();
  if (!a) return;
  const t = a.currentTime + at;
  const osc = a.createOscillator();
  const gain = a.createGain();
  osc.type = wave;
  osc.frequency.setValueAtTime(from, t);
  osc.frequency.exponentialRampToValueAtTime(Math.max(1, to), t + length);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(volume, t + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + length);
  osc.connect(gain).connect(a.destination);
  osc.start(t);
  osc.stop(t + length + 0.02);
}

/** A burst of filtered noise: hits, explosions, drums. */
function noise(at: number, length: number, cutoff: number, volume = 0.3) {
  const a = ready();
  if (!a) return;
  const t = a.currentTime + at;
  const buffer = a.createBuffer(
    1,
    Math.ceil(a.sampleRate * length),
    a.sampleRate,
  );
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  }
  const src = a.createBufferSource();
  src.buffer = buffer;
  const filter = a.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = cutoff;
  const gain = a.createGain();
  gain.gain.setValueAtTime(volume, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + length);
  src.connect(filter).connect(gain).connect(a.destination);
  src.start(t);
}

export const sfx = {
  /** Points scored: a bright two-note coin. */
  coin() {
    tone(0, 988, 988, 0.08, "square", 0.12);
    tone(0.08, 1319, 1319, 0.28, "square", 0.12);
  },
  /** Momo's energy blast. */
  zap() {
    tone(0, 1400, 180, 0.3, "sawtooth", 0.12);
    tone(0, 700, 90, 0.3, "triangle", 0.15);
  },
  /** The blast lands. */
  hit() {
    noise(0, 0.18, 2200, 0.35);
    tone(0, 220, 60, 0.18, "square", 0.12);
  },
  /** A Super Bark: a bigger, double hit. */
  superHit() {
    noise(0, 0.3, 3200, 0.45);
    tone(0, 330, 40, 0.35, "sawtooth", 0.16);
    tone(0.12, 660, 80, 0.3, "square", 0.1);
  },
  /** An enemy is defeated. */
  boom() {
    noise(0, 0.6, 900, 0.5);
    tone(0, 160, 30, 0.6, "sine", 0.3);
    [784, 988, 1175, 1568].forEach((f, i) =>
      tone(0.18 + i * 0.07, f, f, 0.12, "square", 0.08),
    );
  },
  /** Momo is hurt. */
  hurt() {
    tone(0, 400, 90, 0.35, "square", 0.14);
    noise(0, 0.15, 800, 0.25);
  },
  /** Momo faints. */
  faint() {
    [523, 466, 392, 311, 262].forEach((f, i) =>
      tone(i * 0.22, f, f * 0.97, 0.3, "triangle", 0.18),
    );
  },
  /** Victory / first place fanfare. */
  fanfare() {
    const notes = [523, 659, 784, 1047, 784, 1047];
    const times = [0, 0.12, 0.24, 0.36, 0.56, 0.68];
    notes.forEach((f, i) => tone(times[i]!, f, f, 0.22, "square", 0.1));
    tone(0.68, 1047, 1047, 0.9, "triangle", 0.18);
    tone(0.68, 1319, 1319, 0.9, "triangle", 0.1);
  },
  /** A drumroll before placements. */
  drumroll(seconds = 1.6) {
    for (let t = 0; t < seconds; t += 0.05)
      noise(t, 0.05, 1500, 0.08 + t * 0.05);
  },
  /** A countdown tick. */
  tick() {
    tone(0, 1800, 1800, 0.04, "square", 0.05);
  },
  /** A soft click for choosing. */
  select() {
    tone(0, 660, 880, 0.08, "triangle", 0.1);
  },
};
