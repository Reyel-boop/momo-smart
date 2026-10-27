/**
 * The speed-round engine shared by Tag Sprint and Salita Sprint: a
 * 60-second round where a prompt appears and the student taps its answer
 * among four. The wrong choices are other answers from the same round, so
 * each item is just a prompt and its answer. Scoring lives here for the
 * server: right minus wrong.
 */

export type SpeedItem = { id: string; prompt: string; answer: string };

export type SpeedLevel = {
  id: string;
  unit: number;
  unitTitle: string;
  title: string;
  /** What the round covers, shown before it starts. */
  topic: string;
  items: SpeedItem[];
};

export const SPEED_SECONDS = 60;
/** Net score (right minus wrong) for 1, 2 and 3 stars. */
export const SPEED_STARS = [6, 12, 18] as const;

export const pool = (id: string, pairs: [string, string][]): SpeedItem[] =>
  pairs.map(([prompt, answer], i) => ({ id: `${id}.${i}`, prompt, answer }));

export function speedStars(net: number) {
  return SPEED_STARS.filter((needed) => net >= needed).length;
}

/** Scores a round from every answer tapped. */
export function scoreSpeed(
  level: SpeedLevel,
  answers: { id: string; choice: string }[],
) {
  const byId = new Map(level.items.map((i) => [i.id, i.answer]));
  let right = 0;
  let wrong = 0;
  for (const a of answers) {
    if (byId.get(a.id) === a.choice) right++;
    else wrong++;
  }
  const net = Math.max(0, right - wrong);
  return { right, wrong, net, stars: speedStars(net) };
}
