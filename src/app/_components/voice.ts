"use client";

import { soundOn } from "./sfx";

/**
 * Spoken lines for the Call Simulator, using the browser's own text to
 * speech (no audio files). Callers and the agent get different voices —
 * female or male to match the caller — with pitch as a fallback when the
 * device has only one voice. Respects the shared sound on/off setting.
 */

export type Gender = "female" | "male";
export type Speaker = { role: "customer" | "agent"; gender: Gender };

const FEMALE =
  /female|zira|aria|jenny|samantha|susan|hazel|karen|moira|tessa|fiona|victoria|libby|sonia|natasha|catherine|heera|rosa|google us english$|google uk english female/i;
const MALE =
  /\bmale\b|david|mark|guy|daniel|alex|fred|george|ryan|james|thomas|google uk english male|rishi|william/i;

export function voiceSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function englishVoices() {
  if (!voiceSupported()) return [];
  const all = window.speechSynthesis.getVoices();
  const en = all.filter((v) => /^en/i.test(v.lang));
  return en.length ? en : all;
}

/** Voices load asynchronously in some browsers; wait briefly for them. */
export function loadVoices(): Promise<void> {
  if (!voiceSupported()) return Promise.resolve();
  if (window.speechSynthesis.getVoices().length) return Promise.resolve();
  return new Promise((resolve) => {
    const done = () => resolve();
    window.speechSynthesis.addEventListener("voiceschanged", done, {
      once: true,
    });
    setTimeout(done, 1200);
  });
}

function pickVoice(speaker: Speaker) {
  const voices = englishVoices();
  if (!voices.length) return null;
  const want = speaker.gender === "female" ? FEMALE : MALE;
  const avoid = speaker.gender === "female" ? MALE : FEMALE;
  const matches = voices.filter(
    (v) => want.test(v.name) && !avoid.test(v.name),
  );
  // The agent takes a different voice from the caller when there's a choice.
  const pool = matches.length ? matches : voices;
  return pool[speaker.role === "agent" ? pool.length - 1 : 0] ?? null;
}

/** Guesses a caller's voice from how they're named ("Aling Rosa", "Mr. Lim"). */
export function genderOf(name: string): Gender {
  return /\b(ms|mrs|miss|aling|lola|ate|tita|nanay|ma'am|mommy)\b\.?/i.test(
    name,
  )
    ? "female"
    : "male";
}

/** Stops whatever is being said. */
export function hush() {
  if (voiceSupported()) window.speechSynthesis.cancel();
}

/** Says a line; resolves when it's done (or right away when sound is off). */
export function say(text: string, speaker: Speaker): Promise<void> {
  if (!voiceSupported() || !soundOn() || !text) return Promise.resolve();
  window.speechSynthesis.cancel();
  return new Promise((resolve) => {
    const u = new SpeechSynthesisUtterance(text);
    const voice = pickVoice(speaker);
    if (voice) u.voice = voice;
    u.lang = voice?.lang ?? "en-US";
    // Pitch keeps the two speakers apart even with a single system voice.
    u.pitch =
      speaker.role === "customer"
        ? speaker.gender === "female"
          ? 1.2
          : 0.8
        : speaker.gender === "female"
          ? 1.05
          : 0.95;
    u.rate = speaker.role === "agent" ? 1.02 : 0.97;
    u.onend = () => resolve();
    u.onerror = () => resolve();
    window.speechSynthesis.speak(u);
  });
}
