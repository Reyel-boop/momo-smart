/**
 * Memory Match, a card game for every subject, on the Word Scramble words.
 * Each level's six words become twelve face-down cards: six with the word
 * and six with its meaning (the clue). The student flips two at a time and
 * keeps the pairs that belong together. Fewer misses earn more stars.
 */

import type { ScrambleLevel } from "./word-scramble";

export function matchLevelsOf(
  levels: readonly ScrambleLevel[],
): ScrambleLevel[] {
  return levels.map((level) => ({
    ...level,
    id: `match-${level.id}`,
    words: level.words.map((word) => ({ ...word, id: `match-${word.id}` })),
  }));
}

export type MatchCard = { key: string; wordId: string; side: "word" | "clue" };

/** The twelve cards of a level, shuffled. */
export function dealMatch(
  words: readonly { id: string }[],
  rand: () => number = Math.random,
): MatchCard[] {
  const cards: MatchCard[] = words.flatMap((w) => [
    { key: `${w.id}:w`, wordId: w.id, side: "word" as const },
    { key: `${w.id}:c`, wordId: w.id, side: "clue" as const },
  ]);
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [cards[i], cards[j]] = [cards[j]!, cards[i]!];
  }
  return cards;
}

/**
 * Stars from misses (two cards turned that don't belong together). Some
 * misses are expected while learning where the cards are: up to half the
 * number of pairs still earns 3 stars.
 */
export function matchStars(misses: number, pairs: number) {
  return misses <= Math.ceil(pairs / 2) ? 3 : misses <= pairs + 2 ? 2 : 1;
}

/** Scores a finished board; null until every pair has been matched. */
export function scoreMatch(
  level: ScrambleLevel,
  matched: string[],
  misses: number,
) {
  if (!level.words.every((word) => matched.includes(word.id))) return null;
  const pairs = level.words.length;
  return { pairs, misses, stars: matchStars(misses, pairs) };
}
