import { CORE } from "./core";
import { FIL_AP } from "./fil-ap";
import { topicOf, type UnitActivity } from "./kit";
import { TLE } from "./tle";

export { describe, topicOf, type UnitActivity } from "./kit";

const ALL: Record<string, UnitActivity> = { ...CORE, ...FIL_AP, ...TLE };

/** The activity written for a unit, from its title ("Unit 1: Plate Tectonics"). */
export function activityFor(unitTitle: string): UnitActivity | null {
  return ALL[topicOf(unitTitle)] ?? null;
}

/** Every unit topic that has an activity (for checks). */
export const ACTIVITY_TOPICS = Object.keys(ALL);
