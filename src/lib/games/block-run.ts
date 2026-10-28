/**
 * Block Run, a 3D obstacle-course adventure for every subject: the student
 * runs and jumps across floating blocks, and at each gate a question from
 * the unit appears with three answer platforms ahead. The right one builds
 * the bridge onward; a wrong one crumbles and drops them back to the
 * checkpoint.
 *
 * The questions are the unit's key words (the same ones as Word Scramble):
 * the clue is the question and the answers are words from the same unit.
 * Scoring lives here so the server can score a run from the picks alone.
 */

import { type ScrambleLevel } from "./word-scramble";

export type RunGate = {
  id: string;
  question: string;
  /** The right answer first, then two wrong ones (placed by fixedOrder). */
  choices: [string, string, string];
};

export type RunLevel = {
  id: string;
  unit: number;
  unitTitle: string;
  title: string;
  gates: RunGate[];
};

/** "PARAGRAPH" → "Paragraph"; short codes like HTML or DNA stay as they are. */
export function wordLabel(word: string) {
  return /^(HTML|HREF|DNA|OFW)$/.test(word)
    ? word
    : word[0] + word.slice(1).toLowerCase();
}

/** One run per Word Scramble level, with the same words as its gates. */
export function runLevelsOf(levels: ScrambleLevel[]): RunLevel[] {
  return levels.map((l) => ({
    id: `run-${l.id}`,
    unit: l.unit,
    unitTitle: l.unitTitle,
    title: l.title,
    gates: l.words.map((w, i) => {
      // The two wrong answers: the next two words of the same unit.
      const others = [1, 2].map((k) => l.words[(i + k) % l.words.length]!);
      return {
        id: w.id,
        question: w.clue,
        choices: [
          wordLabel(w.word),
          wordLabel(others[0]!.word),
          wordLabel(others[1]!.word),
        ],
      };
    }),
  }));
}

/** Stars from mistakes (wrong platforms stepped on). */
export function runStars(mistakes: number) {
  return mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
}

/**
 * Scores a finished run from, per gate, every answer platform stepped on
 * (index into `choices`, 0 = right), the last one right. Null when a gate
 * wasn't cleared.
 */
export function scoreRun(level: RunLevel, picks: number[][]) {
  if (picks.length !== level.gates.length) return null;
  if (picks.some((p) => p.at(-1) !== 0 || p.slice(0, -1).includes(0))) {
    return null;
  }
  const mistakes = picks.reduce((sum, p) => sum + p.length - 1, 0);
  return { mistakes, stars: runStars(mistakes) };
}
