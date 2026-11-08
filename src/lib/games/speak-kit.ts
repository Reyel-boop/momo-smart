/**
 * Building blocks for Speak Up! content: level types and short builders, so
 * each category's file reads like a script. See speak-up.ts for scoring.
 */

export type SpeakLine = {
  text: string;
  /** A pronunciation or delivery tip shown under the line. */
  tip?: string;
};

/** Something a good reply must contain: any one of `any` counts. */
export type SpeakNeed = { label: string; any: string[] };

export type SpeakStep = {
  /** The call-flow skill, e.g. "Opening". */
  skill: string;
  /** What the customer says (empty on the opening, where the call rings). */
  customer: string;
  /** What the student should do in their reply. */
  task: string;
  /** A model reply, shown after the student speaks. */
  sample: string;
  needs: SpeakNeed[];
};

export type Category = {
  unit: 1 | 2 | 3;
  unitTitle: "Easy" | "Middle Level" | "Difficult";
};

type Base = Category & { id: string; title: string };

export type SpeakReadLevel = Base & { kind: "READ"; lines: SpeakLine[] };
export type SpeakCallLevel = Base & {
  kind: "CALL";
  caller: string;
  setup: string;
  /** The agent's name, used in the model replies. */
  agent: string;
  steps: SpeakStep[];
};
export type SpeakLevel = SpeakReadLevel | SpeakCallLevel;

export const EASY: Category = { unit: 1, unitTitle: "Easy" };
export const MIDDLE: Category = { unit: 2, unitTitle: "Middle Level" };
export const HARD: Category = { unit: 3, unitTitle: "Difficult" };

/** Agents whose model replies use a female voice. */
export const FEMALE_AGENTS = ["Ana", "Bea", "Mia", "Kim", "Joy", "Lea"];

export const need = (label: string, ...any: string[]): SpeakNeed => ({
  label,
  any,
});

// The checks most replies share.
export const THANK = need("Thank the customer", "thank", "thanks", "salamat");
export const SORRY = need(
  "Apologize",
  "sorry",
  "apologize",
  "apologise",
  "apologies",
  "pasensya",
);
export const EMPATHY = need(
  "Show you understand",
  "understand",
  "i see",
  "i know how",
  "frustrating",
  "must be",
  "i hear you",
  "i can imagine",
);
export const POLITE = need(
  "Ask politely",
  "please",
  "may i",
  "could i",
  "could you",
  "can i",
  "would you",
  "kindly",
);
export const HOLD = need(
  "Ask them to hold or wait",
  "hold",
  "moment",
  "wait",
  "second",
  "minute",
);
export const ANYTHING_ELSE = need(
  "Ask if there's anything else",
  "anything else",
  "other concern",
  "else i can",
);
export const GOODBYE = need(
  "Close the call politely",
  "great day",
  "good day",
  "nice day",
  "wonderful day",
  "goodbye",
  "bye",
  "take care",
  "have a",
);
export const OWNERSHIP = need(
  "Take ownership (I will…)",
  "i will",
  "ill",
  "let me",
  "personally",
  "make sure",
  "take care",
);
export const VERIFY = need(
  "Ask for details to verify the account",
  "account number",
  "account name",
  "full name",
  "verify",
  "verification",
  "birthday",
  "date of birth",
  "registered",
);
export const TICKET = need(
  "Give a ticket or reference number",
  "ticket",
  "reference",
);
export const TIMEFRAME = need(
  "Give a time frame",
  "hour",
  "today",
  "tomorrow",
  "within",
  "day",
  "minute",
  "week",
  "morning",
  "afternoon",
  "tonight",
  "evening",
);

/** A Speech Test level. A line is "text" or ["text", "tip"]. */
export function read(
  category: Category,
  id: string,
  title: string,
  lines: (string | [string, string])[],
): SpeakReadLevel {
  return {
    ...category,
    id,
    kind: "READ",
    title: `🎤 ${title}`,
    lines: lines.map((l) =>
      typeof l === "string" ? { text: l } : { text: l[0], tip: l[1] },
    ),
  };
}

/** A call step: skill, what the customer says, the task, a model reply, checks. */
export const step = (
  skill: string,
  customer: string,
  task: string,
  sample: string,
  needs: SpeakNeed[],
): SpeakStep => ({ skill, customer, task, sample, needs });

/** The opening every call needs: thank, company, your name, offer help. */
export function opening(company: string, agent: string): SpeakStep {
  return step(
    "Opening",
    "",
    `Answer the call: thank the caller, say the company name (${company}), give your name, and offer to help.`,
    `Thank you for calling ${company}, this is ${agent}. How may I help you today?`,
    [
      THANK,
      need(
        `Say “${company}”`,
        company.toLowerCase(),
        "momo",
        "mo mo",
        company.split(" ")[1]!.toLowerCase(),
      ),
      need("Give your name", "this is", "my name is", "i am", "im", "speaking"),
      need("Offer to help", "help", "assist"),
    ],
  );
}

/** The usual last step: anything else, thanks, goodbye. */
export function closing(customer: string, company: string): SpeakStep {
  return step(
    "Closing",
    customer,
    "Ask if there's anything else, thank them, and close the call.",
    `You're welcome! Is there anything else I can help you with? Thank you for calling ${company}, and have a great day!`,
    [ANYTHING_ELSE, THANK, GOODBYE],
  );
}

/**
 * A Voice Call level: the opening and closing are added around the middle
 * steps. `end` is the customer's last line before the closing.
 */
export function call(
  category: Category,
  id: string,
  title: string,
  who: { caller: string; setup: string; agent: string; company: string },
  middle: SpeakStep[],
  end = "That's all I need. Thank you!",
): SpeakCallLevel {
  return {
    ...category,
    id,
    kind: "CALL",
    title: `📞 ${title}`,
    caller: who.caller,
    setup: who.setup,
    agent: who.agent,
    steps: [
      opening(who.company, who.agent),
      ...middle,
      closing(end, who.company),
    ],
  };
}
