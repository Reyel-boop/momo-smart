/**
 * Turbo Takbo, an obstacle run for every subject, on the Word Scramble
 * words. Tapping builds speed, and each gate on the track opens only for the
 * right answer to its clue. Scoring lives here so the server can check it.
 */

import type { ScrambleLevel } from "./word-scramble";

export function turboLevelsOf(
  levels: readonly ScrambleLevel[],
): ScrambleLevel[] {
  return levels.map((level) => ({
    ...level,
    id: `turbo-${level.id}`,
    words: level.words.map((word) => ({ ...word, id: `turbo-${word.id}` })),
  }));
}

export function turboStars(mistakes: number) {
  return mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
}

/** Scores a run from every guess at every gate; null if a gate stayed shut. */
export function scoreTurbo(
  level: ScrambleLevel,
  gates: { id: string; guesses: string[] }[],
) {
  let mistakes = 0;
  for (const word of level.words) {
    const gate = gates.find((g) => g.id === word.id);
    if (gate?.guesses.at(-1) !== word.word) return null;
    mistakes += gate.guesses.length - 1;
  }
  return { gates: level.words.length, mistakes, stars: turboStars(mistakes) };
}
