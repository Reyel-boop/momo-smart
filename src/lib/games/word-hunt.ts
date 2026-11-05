/**
 * Word Hunt, a word search for every subject, on the Word Scramble words.
 * The list shows clues, not words, so the student has to know the term
 * before they can find it. Tap a word's first letter, then its last.
 */

import type { ScrambleLevel } from "./word-scramble";

export function huntLevelsOf(
  levels: readonly ScrambleLevel[],
): ScrambleLevel[] {
  return levels.map((level) => ({
    ...level,
    id: `hunt-${level.id}`,
    words: level.words.map((word) => ({
      ...word,
      id: `hunt-${word.id}`,
      word: word.word.toUpperCase().replace(/[^A-ZÑ]/g, ""),
    })),
  }));
}

export type HuntPlacement = {
  wordId: string;
  row: number;
  col: number;
  dRow: number;
  dCol: number;
  length: number;
};

const DIRECTIONS = [
  [0, 1],
  [1, 0],
  [1, 1],
] as const;
const FILLER = "ABCDEFGHIJKLMNOPRSTUVWY";

/** A new puzzle: every word placed across, down or diagonally. */
export function buildHunt(
  words: readonly { id: string; word: string }[],
  rand: () => number = Math.random,
) {
  const longest = Math.max(...words.map((w) => w.word.length));
  const size = Math.max(10, longest + 1);
  const pick = (n: number) => Math.floor(rand() * n);

  for (;;) {
    const grid: string[][] = Array.from({ length: size }, () =>
      Array<string>(size).fill(""),
    );
    const placed: HuntPlacement[] = [];
    const ordered = [...words].sort((a, b) => b.word.length - a.word.length);

    for (const { id, word } of ordered) {
      for (let tries = 0; tries < 200; tries++) {
        const [dRow, dCol] = DIRECTIONS[pick(DIRECTIONS.length)]!;
        const row = pick(size - dRow * (word.length - 1));
        const col = pick(size - dCol * (word.length - 1));
        const fits = [...word].every((letter, i) => {
          const cell = grid[row + dRow * i]![col + dCol * i];
          return cell === "" || cell === letter;
        });
        if (!fits) continue;
        [...word].forEach((letter, i) => {
          grid[row + dRow * i]![col + dCol * i] = letter;
        });
        placed.push({ wordId: id, row, col, dRow, dCol, length: word.length });
        break;
      }
    }
    if (placed.length < words.length) continue;

    return {
      size,
      placed,
      grid: grid.map((line) =>
        line.map((cell) => cell || FILLER[pick(FILLER.length)]!),
      ),
    };
  }
}

export function huntStars(hints: number) {
  return hints === 0 ? 3 : hints <= 2 ? 2 : 1;
}

/** Scores a finished puzzle; null until every word has been found. */
export function scoreHunt(
  level: ScrambleLevel,
  found: string[],
  hints: number,
) {
  if (!level.words.every((word) => found.includes(word.id))) return null;
  return { found: level.words.length, hints, stars: huntStars(hints) };
}
