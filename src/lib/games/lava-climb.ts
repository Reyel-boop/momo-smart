/**
 * Lava Climb, a second Mathematics game: the same seeded problems as Number
 * Rush, played as a climb. A right answer climbs a floor; a miss lets the
 * lava rise. Scored by the Number Rush rules, so the server can check it.
 */

import { MATH_LEVELS, type MathLevel } from "./number-rush";

export const LAVA_LEVELS: MathLevel[] = MATH_LEVELS.map((level) => ({
  ...level,
  id: level.id.replace("math-", "lava-"),
}));

/** Seconds to answer before the lava counts it as a miss. */
export const LAVA_SECONDS = 15;
/** Misses before the lava catches the climber and the round ends. */
export const LAVA_MISSES = 5;
