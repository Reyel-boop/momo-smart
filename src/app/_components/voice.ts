"use client";

import { soundOn } from "./sfx";

/**
 * Spoken lines for the Call Simulator, using the browser's own text to
 * speech (no audio files). It picks the most natural voices the device has
 * — "Natural"/"Neural"/"Online" voices (Edge), Google voices (Chrome),
 * "Enhanced"/"Premium" voices (Apple), Filipino-English first — one for the
 * caller and a different one for the agent. Lines are read sentence by
 * sentence with short pauses, and money and symbols are spelled out.
 * Respects the shared sound on/off setting.
 */

export type Gender = "female" | "male";
export type Speaker = { role: "customer" | "agent"; gender: Gender };

const FEMALE =
  /female|aria|jenny|michelle|emma|ava|ana\b|sara|nancy|rosa|libby|sonia|natasha|clara|zira|samantha|susan|hazel|karen|moira|tessa|fiona|victoria|catherine|google us english/i;
const MALE =
  /\bmale\b|guy|davis|andrew|brian|christopher|eric|roger|steffan|james|ryan|william|liam|connor|david|mark|daniel|alex|fred|george|thomas|rishi|google uk english male/i;

export function voiceSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
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
    setTimeout(done, 1500);
  });
}

/** How natural a voice is likely to sound (higher is better). */
function quality(v: SpeechSynthesisVoice) {
  const n = v.name;
  let score = 0;
  if (/natural|neural/i.test(n)) score += 100;
  if (/premium|enhanced/i.test(n)) score += 70;
  if (/online/i.test(n)) score += 40;
  if (/google/i.test(n)) score += 35;
  if (!v.localService) score += 10;
  if (/en[-_]PH/i.test(v.lang)) score += 30;
  else if (/en[-_]US/i.test(v.lang)) score += 12;
  else if (/en[-_](GB|AU|CA|IE|NZ)/i.test(v.lang)) score += 8;
  // The old desktop voices sound the most robotic.
  if (
    /\b(david|zira|mark|hazel|george)\b/i.test(n) &&
    !/natural|online/i.test(n)
  )
    score -= 30;
  return score;
}

function genderOfVoice(v: SpeechSynthesisVoice): Gender | null {
  if (FEMALE.test(v.name) && !/\bmale\b/i.test(v.name.replace(/female/i, "")))
    return "female";
  if (MALE.test(v.name)) return "male";
  return null;
}

let cast: {
  customer: Map<Gender, SpeechSynthesisVoice | null>;
  agent: Map<Gender, SpeechSynthesisVoice | null>;
} | null = null;

/** The best voice for a speaker, never the same voice for caller and agent. */
function pickVoice(speaker: Speaker) {
  if (!voiceSupported()) return { voice: null, matched: false };
  const voices = window.speechSynthesis
    .getVoices()
    .filter((v) => /^en/i.test(v.lang))
    .sort((a, b) => quality(b) - quality(a));
  if (!voices.length) return { voice: null, matched: false };
  cast ??= { customer: new Map(), agent: new Map() };
  const memo = cast[speaker.role];
  if (!memo.has(speaker.gender)) {
    const other = cast[speaker.role === "agent" ? "customer" : "agent"];
    const taken = new Set([...other.values()].filter(Boolean));
    const byGender = voices.filter((v) => genderOfVoice(v) === speaker.gender);
    const choice =
      byGender.find((v) => !taken.has(v)) ??
      byGender[0] ??
      voices.find((v) => !taken.has(v)) ??
      voices[0] ??
      null;
    memo.set(speaker.gender, choice);
  }
  const voice = memo.get(speaker.gender) ?? null;
  return { voice, matched: !!voice && genderOfVoice(voice) === speaker.gender };
}

/** Whether this device has at least one natural-sounding English voice. */
export function hasNaturalVoice() {
  if (!voiceSupported()) return false;
  return window.speechSynthesis
    .getVoices()
    .some((v) => /^en/i.test(v.lang) && quality(v) >= 35);
}

/** Guesses a caller's voice from how they're named ("Aling Rosa", "Mr. Lim"). */
export function genderOf(name: string): Gender {
  return /\b(ms|mrs|miss|aling|lola|ate|tita|nanay|ma'am|mommy)\b\.?/i.test(
    name,
  )
    ? "female"
    : "male";
}

/** Text the way a person would say it. */
function spoken(text: string) {
  return text
    .replace(/₱\s?([\d,]+(?:\.\d+)?)/g, "$1 pesos")
    .replace(/(\d+)\s?GB\b/g, "$1 gigabytes")
    .replace(/\bAHT\b/g, "A H T")
    .replace(/\bCSAT\b/g, "C-SAT")
    .replace(/\bFCR\b/g, "F C R")
    .replace(/(\d{4}) (\d{3}) (\d{4})/g, "$1, $2, $3")
    .replace(/[“”"]/g, "")
    .replace(/…/g, "...")
    .replace(/\s+—\s+/g, ", ");
}

/** Sentences, so each can end with a natural pause. */
function sentences(text: string) {
  return (
    text
      .match(/[^.!?]+[.!?]+["')\]]*|[^.!?]+$/g)
      ?.map((s) => s.trim())
      .filter(Boolean) ?? [text]
  );
}

/** Stops whatever is being said. */
export function hush() {
  if (voiceSupported()) window.speechSynthesis.cancel();
}

/** Says a line; resolves when it's done (or right away when sound is off). */
export async function say(text: string, speaker: Speaker): Promise<void> {
  if (!voiceSupported() || !soundOn() || !text) return;
  window.speechSynthesis.cancel();
  await loadVoices();
  const { voice, matched } = pickVoice(speaker);
  for (const part of sentences(spoken(text))) {
    const finished = await new Promise<boolean>((resolve) => {
      const u = new SpeechSynthesisUtterance(part);
      try {
        if (voice) u.voice = voice;
      } catch {
        // Some browsers reject a voice; the default voice still speaks.
      }
      u.lang = voice?.lang ?? "en-US";
      // Natural voices sound best untouched; with a single basic voice, a
      // small pitch shift keeps the caller and the agent apart.
      u.pitch = matched ? 1 : speaker.gender === "female" ? 1.1 : 0.9;
      u.rate = speaker.role === "agent" ? 0.98 : 0.94;
      u.onend = () => resolve(true);
      u.onerror = () => resolve(false);
      window.speechSynthesis.speak(u);
    });
    if (!finished) return;
    await new Promise((r) => setTimeout(r, 180));
  }
}
