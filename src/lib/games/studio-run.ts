/**
 * Studio Run, a cosmic runner for every subject: the student plays
 * "StudioRun" by thelittlelabs (public/rive/studiorun.riv, Rive Marketplace,
 * CC BY 4.0), jumping over obstacles on the way to the finish. Each of the
 * six items on the track holds one of the unit's key words (the same ones
 * as Word Scramble): grabbing it pauses the run and asks for the word from
 * its clue. Words not reached before the run ends are asked at the end.
 *
 * Scoring is the same as Turbo Takbo's (every guess at every word), so the
 * server checks it with scoreTurbo.
 */

import type { ScrambleLevel } from "./word-scramble";

export function studioLevelsOf(
  levels: readonly ScrambleLevel[],
): ScrambleLevel[] {
  return levels.map((level) => ({
    ...level,
    id: `srun-${level.id}`,
    words: level.words.map((word) => ({ ...word, id: `srun-${word.id}` })),
  }));
}
