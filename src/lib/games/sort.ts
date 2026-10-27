/**
 * The sorting engine shared by Ticket Rush, Lab Sorter and Tool Shed: cards
 * drop in one at a time and each must go into the right bin before its
 * timer runs out. Each game supplies its own levels; scoring lives here so
 * the server can score a round from the answers.
 */

export type SortCard = {
  id: string;
  /** Who or what it's from, e.g. "Mr. Santos" or "Agent"; may be empty. */
  from: string;
  text: string;
  /** The right bin's index. */
  bin: number;
  /** Shown when it's sorted wrong or runs out. */
  why: string;
};

export type SortLevel = {
  id: string;
  unit: number;
  unitTitle: string;
  title: string;
  /** What the student does this round. */
  task: string;
  bins: { label: string; icon: string }[];
  /** Seconds before an unsorted card runs out. */
  patience: number;
  cards: SortCard[];
};

/** Accuracy (percent) for 1, 2 and 3 stars. */
export const SORT_STARS = [50, 70, 90] as const;

export const sortCards = (
  id: string,
  rows: [from: string, text: string, bin: number, why: string][],
): SortCard[] =>
  rows.map(([from, text, bin, why], i) => ({
    id: `${id}.${i}`,
    from,
    text,
    bin,
    why,
  }));

export function sortStars(percent: number) {
  return SORT_STARS.filter((needed) => percent >= needed).length;
}

/**
 * Scores a round: one answer per card, the bin picked (-1 when it ran out
 * of time). Null when cards are missing.
 */
export function scoreSort(
  level: SortLevel,
  answers: { id: string; bin: number }[],
) {
  const picked = new Map(answers.map((a) => [a.id, a.bin]));
  if (level.cards.some((c) => !picked.has(c.id))) return null;
  const right = level.cards.filter((c) => picked.get(c.id) === c.bin).length;
  const percent = Math.round((right / level.cards.length) * 100);
  return {
    right,
    total: level.cards.length,
    percent,
    stars: sortStars(percent),
  };
}
