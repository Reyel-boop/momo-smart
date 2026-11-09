/**
 * Unit Activities: one short, easy performance task per unit, opened after
 * the student finishes that unit's Unit Questions. Each is doable in 10–15
 * minutes with paper or a phone, in three steps.
 */

export type UnitActivity = {
  /** Short name, e.g. "Map the Plates". */
  title: string;
  /** What the activity is for, in one sentence. */
  goal: string;
  /** Three short steps. */
  steps: [string, string, string];
  /** What to hand in. */
  submit: string;
  /** Written in Filipino (for Filipino and Araling Panlipunan). */
  filipino?: boolean;
};

/** A unit's title without its "Unit 3: " prefix. */
export const topicOf = (unitTitle: string) =>
  unitTitle.replace(/^Unit\s+\d+\s*:\s*/i, "").trim();

/** Builder: `a(goal, steps, submit)` keyed by the unit topic. */
export const a = (
  title: string,
  goal: string,
  steps: [string, string, string],
  submit: string,
): UnitActivity => ({ title, goal, steps, submit });

/** Same, written in Filipino. */
export const f = (
  title: string,
  goal: string,
  steps: [string, string, string],
  submit: string,
): UnitActivity => ({ title, goal, steps, submit, filipino: true });

/** The text students see on the assignment. */
export function describe(activity: UnitActivity) {
  const [one, two, three] = activity.steps;
  return activity.filipino
    ? `🎯 ${activity.goal}

Gawin:
1. ${one}
2. ${two}
3. ${three}

📤 Ipasa: ${activity.submit}
I-type ang iyong sagot, o kunan ng malinaw na litrato ang iyong gawa at i-attach ito. Madali lang ito — kaya mo 'yan!`
    : `🎯 ${activity.goal}

What to do:
1. ${one}
2. ${two}
3. ${three}

📤 Submit: ${activity.submit}
Type your answer, or take a clear photo of your work and attach it. Keep it simple — you can do this!`;
}
