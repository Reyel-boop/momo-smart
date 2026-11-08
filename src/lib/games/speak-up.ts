/**
 * Speak Up!, a Telecommunications (Contact Center Services) speaking game in
 * three categories: Easy, Middle Level and Difficult. Each has:
 *
 * - Speech Tests: read each line aloud; the score is how many of its words
 *   the microphone heard, in order.
 * - Voice Calls: a customer calls, and the student says the agent's reply
 *   into the microphone instead of picking it. Each reply is checked for
 *   what a good agent must say at that step (thank, apologize, verify ...).
 *
 * Scoring lives here so the server can score a level from what was heard.
 */

import { EASY_CALLS, EASY_READS } from "./speak-easy";
import { HARD_CALLS, HARD_READS } from "./speak-hard";
import {
  ANYTHING_ELSE,
  EASY,
  EMPATHY,
  GOODBYE,
  HARD,
  HOLD,
  MIDDLE,
  POLITE,
  SORRY,
  THANK,
  need,
  opening,
  type SpeakLevel,
  type SpeakStep,
} from "./speak-kit";
import { MIDDLE_CALLS, MIDDLE_READS } from "./speak-middle";

export type {
  SpeakCallLevel,
  SpeakLevel,
  SpeakLine,
  SpeakNeed,
  SpeakReadLevel,
  SpeakStep,
} from "./speak-kit";

/** The first 12 levels; their ids keep students' stars. */
const ORIGINAL: SpeakLevel[] = [
  // ---------------------------------------------------------------- Easy
  {
    ...EASY,
    id: "spk-1-1",
    kind: "READ",
    title: "🎤 Agent Greetings",
    lines: [
      {
        text: "Good morning, thank you for calling.",
        tip: "Smile while you speak: callers can hear it.",
      },
      { text: "How may I help you today?" },
      { text: "May I have your name, please?" },
      {
        text: "Please hold while I check your account.",
        tip: "Say “hold” clearly; it should not sound like “old”.",
      },
      { text: "Thank you for waiting." },
      { text: "Is there anything else I can help you with?" },
    ],
  },
  {
    ...EASY,
    id: "spk-1-2",
    kind: "READ",
    title: "🎤 Telecom Words",
    lines: [
      { text: "Please check the signal bars on your phone." },
      {
        text: "Your mobile data is now active.",
        tip: "Stress the first part: MO-bile, DA-ta.",
      },
      { text: "Please restart your phone and try again." },
      { text: "There is a network problem in your area." },
      { text: "I will create a repair ticket for you." },
      { text: "Thank you for calling, and have a great day." },
    ],
  },
  {
    ...EASY,
    id: "spk-1-3",
    kind: "CALL",
    title: "📞 Load Balance",
    caller: "Aling Rosa",
    setup: "Inbound · Prepaid mobile account",
    agent: "Ana",
    steps: [
      opening("Momo Telco", "Ana"),
      {
        skill: "Get details",
        customer: "Hello! I want to check my load balance, please.",
        task: "Ask politely for her mobile number.",
        sample: "Sure! May I have your mobile number, please?",
        needs: [POLITE, need("Ask for the mobile number", "number", "mobile")],
      },
      {
        skill: "Hold",
        customer:
          "It's zero nine one seven, five five five, one two three four.",
        task: "Thank her, then ask her to hold while you check.",
        sample:
          "Thank you! Please hold for a moment while I check your balance.",
        needs: [THANK, HOLD],
      },
      {
        skill: "Give the answer",
        customer: "Okay, I'll wait.",
        task: "Thank her for waiting, then tell her the balance is 150 pesos.",
        sample:
          "Thank you for waiting. Your load balance is one hundred fifty pesos.",
        needs: [
          THANK,
          need(
            "Say the balance: 150 pesos",
            "one hundred fifty",
            "one hundred and fifty",
            "a hundred fifty",
            "a hundred and fifty",
          ),
          need("Say “pesos”", "peso"),
        ],
      },
      {
        skill: "Closing",
        customer: "Great, that's all I need. Thank you!",
        task: "Ask if there's anything else, thank her, and close the call.",
        sample:
          "Is there anything else I can help you with? Thank you for calling Momo Telco. Have a great day!",
        needs: [ANYTHING_ELSE, THANK, GOODBYE],
      },
    ],
  },
  {
    ...EASY,
    id: "spk-1-4",
    kind: "CALL",
    title: "📞 No Signal",
    caller: "Mr. Lim",
    setup: "Inbound · Postpaid mobile account",
    agent: "Paolo",
    steps: [
      opening("Momo Telco", "Paolo"),
      {
        skill: "Empathy",
        customer: "Hi. My phone has no signal since this morning.",
        task: "Say sorry for the trouble and say that you will help.",
        sample:
          "I'm sorry to hear that, Mr. Lim. Don't worry, I will help you with that.",
        needs: [SORRY, need("Promise to help", "help", "assist", "fix")],
      },
      {
        skill: "Troubleshoot",
        customer: "What should I do?",
        task: "Ask him to restart his phone.",
        sample: "Could you please restart your phone for me?",
        needs: [
          POLITE,
          need(
            "Ask him to restart the phone",
            "restart",
            "turn off",
            "switch off",
            "reboot",
            "power off",
          ),
        ],
      },
      {
        skill: "Confirm",
        customer: "Okay... it's back on. I have full signal now!",
        task: "Say you are glad the signal is back.",
        sample: "That's great! I'm glad your signal is back.",
        needs: [
          need(
            "Show you're glad",
            "glad",
            "great",
            "good to hear",
            "happy",
            "good news",
            "awesome",
            "wonderful",
          ),
          need("Mention the signal", "signal", "working", "back"),
        ],
      },
      {
        skill: "Closing",
        customer: "Thanks a lot!",
        task: "Ask if there's anything else and close the call.",
        sample:
          "You're welcome! Is there anything else I can help you with? Have a nice day!",
        needs: [ANYTHING_ELSE, GOODBYE],
      },
    ],
  },

  // -------------------------------------------------------- Middle Level
  {
    ...MIDDLE,
    id: "spk-2-1",
    kind: "READ",
    title: "🎤 Polite Phrases",
    lines: [
      {
        text: "I understand how frustrating that must be, and I'm here to help.",
        tip: "Slow down on “frustrating”: frus-TRAY-ting.",
      },
      {
        text: "For security purposes, may I verify your full name and account number?",
      },
      {
        text: "I'm sorry for the inconvenience. Let me look into this right away.",
      },
      {
        text: "May I place you on hold for about two minutes while I check?",
      },
      {
        text: "Thank you for your patience. I found the cause of the problem.",
      },
      {
        text: "I appreciate you letting us know about this concern.",
        tip: "ap-PREE-shee-ate: four clear syllables.",
      },
    ],
  },
  {
    ...MIDDLE,
    id: "spk-2-2",
    kind: "READ",
    title: "🎤 Phonetic Alphabet",
    lines: [
      {
        text: "Alpha, Bravo, Charlie, Delta, Echo.",
        tip: "Agents spell names and codes with these words so no letter is misheard.",
      },
      { text: "Foxtrot, Golf, Hotel, India, Juliet." },
      { text: "Kilo, Lima, Mike, November, Oscar." },
      { text: "Papa, Quebec, Romeo, Sierra, Tango." },
      { text: "Uniform, Victor, Whiskey, X-ray, Yankee, Zulu." },
      {
        text: "That is M as in Mike, O as in Oscar, M as in Mike, O as in Oscar.",
      },
    ],
  },
  {
    ...MIDDLE,
    id: "spk-2-3",
    kind: "CALL",
    title: "📞 Slow Internet",
    caller: "Ms. Garcia",
    setup: "Inbound · Home fiber account",
    agent: "Bea",
    steps: [
      opening("Momo Fiber", "Bea"),
      {
        skill: "Empathy",
        customer:
          "My internet has been very slow for two days. My kids can't attend their online classes!",
        task: "Apologize and show you understand how hard that is.",
        sample:
          "I'm very sorry about that, Ms. Garcia. I understand how frustrating it is, especially for your kids' classes.",
        needs: [SORRY, EMPATHY],
      },
      {
        skill: "Verification",
        customer: "So what can you do about it?",
        task: "Before checking, politely ask for her account number to verify the account.",
        sample:
          "I'll check that right away. For verification, may I have your account number, please?",
        needs: [
          POLITE,
          need("Ask for the account number", "account number", "account"),
          need(
            "Say why: verification",
            "verif",
            "security",
            "confirm",
            "check",
          ),
        ],
      },
      {
        skill: "Troubleshoot",
        customer: "It's one two three four, five six seven eight.",
        task: "Thank her, then ask her to unplug the modem, wait thirty seconds, and plug it back in.",
        sample:
          "Thank you. Could you please unplug your modem, wait thirty seconds, then plug it back in?",
        needs: [
          THANK,
          need("Mention the modem or router", "modem", "router"),
          need(
            "Unplug or restart it",
            "unplug",
            "restart",
            "turn off",
            "reboot",
          ),
          need("Wait thirty seconds", "thirty second", "thirty sec"),
        ],
      },
      {
        skill: "Next steps",
        customer: "I did that, but it's still slow.",
        task: "Say you will create a repair ticket and a technician will check the line.",
        sample:
          "I'm sorry it's still slow. I've created a repair ticket, and a technician will check your line within twenty four hours.",
        needs: [
          need("Create a ticket or report", "ticket", "report", "request"),
          need("Send a technician", "technician", "team", "engineer"),
        ],
      },
      {
        skill: "Closing",
        customer: "Okay. Thank you for your help.",
        task: "Ask if there's anything else, thank her, and close the call.",
        sample:
          "You're welcome! Is there anything else I can help you with? Thank you for calling Momo Fiber, and have a great day!",
        needs: [ANYTHING_ELSE, THANK, GOODBYE],
      },
    ],
  },
  {
    ...MIDDLE,
    id: "spk-2-4",
    kind: "CALL",
    title: "📞 High Bill",
    caller: "Mang Ben",
    setup: "Inbound · Postpaid billing",
    agent: "Carlo",
    steps: [
      opening("Momo Telco", "Carlo"),
      {
        skill: "Empathy",
        customer:
          "My bill this month is two thousand pesos! It's usually only nine hundred!",
        task: "Apologize and show you understand why he is worried.",
        sample:
          "I'm sorry for the worry, Mang Ben. I understand that's a big jump from your usual bill.",
        needs: [SORRY, EMPATHY],
      },
      {
        skill: "Probing",
        customer: "Why is it so high?",
        task: "Ask him to hold while you review his bill.",
        sample:
          "Let me review your bill. May I place you on hold for a moment?",
        needs: [
          HOLD,
          need("Review or check the bill", "bill", "review", "check", "look"),
        ],
      },
      {
        skill: "Explain",
        customer: "Sige, I'll wait.",
        task: "Thank him for waiting, then explain the extra charges are for roaming while he was abroad.",
        sample:
          "Thank you for waiting. The extra charges are for roaming, because you used your phone while you were abroad.",
        needs: [
          THANK,
          need("Explain: roaming", "roaming", "abroad", "overseas", "travel"),
          need("Mention the charges", "charge", "fee", "bill"),
        ],
      },
      {
        skill: "Offer",
        customer: "Oh, I forgot about that. Can I pay it in parts?",
        task: "Offer him an installment plan.",
        sample:
          "Yes, you can. I can set up an installment plan so you can pay it in three months.",
        needs: [
          need("Agree", "yes", "sure", "of course", "definitely", "you can"),
          need(
            "Offer installments",
            "installment",
            "instalment",
            "parts",
            "monthly",
            "month",
          ),
        ],
      },
      {
        skill: "Closing",
        customer: "That helps a lot. Thank you!",
        task: "Ask if there's anything else and close the call.",
        sample:
          "You're welcome! Is there anything else I can help you with? Have a good day, Mang Ben!",
        needs: [ANYTHING_ELSE, GOODBYE],
      },
    ],
  },

  // ----------------------------------------------------------- Difficult
  {
    ...HARD,
    id: "spk-3-1",
    kind: "READ",
    title: "🎤 Technical Support",
    lines: [
      {
        text: "Please unplug the fiber modem, wait thirty seconds, and plug it back in.",
      },
      {
        text: "A blinking red light means the fiber signal is not reaching your modem.",
      },
      {
        text: "Fiber optic cables carry data as pulses of light through thin strands of glass.",
        tip: "OP-tic, not op-TIC.",
      },
      {
        text: "I have escalated your concern to our field technicians, who will visit within twenty-four hours.",
        tip: "es-ca-LAY-ted; tech-NI-shuns.",
      },
      {
        text: "Your reference number is four, seven, two, nine, one, so you can follow up anytime.",
        tip: "Read numbers one digit at a time, with a short pause between each.",
      },
      {
        text: "Thank you for your patience while we restore the service in your area.",
      },
    ],
  },
  {
    ...HARD,
    id: "spk-3-2",
    kind: "READ",
    title: "🎤 Clear Diction",
    lines: [
      {
        text: "She sells seashells by the seashore.",
        tip: "Keep “s” and “sh” apart: sells, SHELLS.",
      },
      { text: "Strong signals stream steadily through six small switches." },
      { text: "Fresh fiber, fast fiber, five fine fiber lines." },
      {
        text: "Thirty-three thirsty technicians thought thoroughly about the thick cables.",
        tip: "“th”: put your tongue lightly between your teeth.",
      },
      {
        text: "Unique New York, unique New York, you know you need unique New York.",
      },
      {
        text: "Very valuable voice calls verify every customer's account.",
        tip: "“v”: top teeth on your lower lip. Don't say “b”.",
      },
    ],
  },
  {
    ...HARD,
    id: "spk-3-3",
    kind: "CALL",
    title: "📞 Angry Customer",
    caller: "Mr. Ramos",
    setup: "Inbound · Home fiber · Repeat caller",
    agent: "Mia",
    steps: [
      opening("Momo Fiber", "Mia"),
      {
        skill: "De-escalate",
        customer:
          "This is the THIRD time I'm calling! My internet has been down for five days and nobody fixed it!",
        task: "Stay calm. Apologize, show you understand, and take ownership: say YOU will handle it.",
        sample:
          "I'm truly sorry, Mr. Ramos. I understand how frustrating it is to call three times. I will personally take care of this for you.",
        needs: [
          SORRY,
          EMPATHY,
          need(
            "Take ownership (I will…)",
            "i will",
            "ill",
            "let me",
            "personally",
            "make sure",
            "take care",
          ),
        ],
      },
      {
        skill: "Verification",
        customer: "Fine. What do you need?",
        task: "Politely ask for his account number and the name on the account.",
        sample:
          "Thank you. May I have your account number and the name on the account, please?",
        needs: [
          POLITE,
          need("Ask for the account number", "account number", "account"),
          need("Ask for the name on the account", "name"),
        ],
      },
      {
        skill: "Escalate",
        customer:
          "Account one one two two three three, Roberto Ramos. Five days, and the technician never came!",
        task: "Thank him. Say you are escalating to a supervisor or the field team as urgent, and give a time frame.",
        sample:
          "Thank you, Mr. Ramos. Since the repair is overdue, I'm escalating it as urgent to our supervisor and field team. A technician will visit within twenty four hours.",
        needs: [
          THANK,
          need("Escalate it", "escalat", "supervisor", "urgent", "priority"),
          need(
            "Give a time frame",
            "hour",
            "today",
            "tomorrow",
            "within",
            "day",
          ),
        ],
      },
      {
        skill: "Recovery",
        customer: "And what about the five days I paid for but couldn't use?",
        task: "Offer a rebate or credit on his bill for the days without service.",
        sample:
          "You're right. I'll give you a rebate for the five days without service; it will show on your next bill.",
        needs: [
          need(
            "Offer a rebate or credit",
            "rebate",
            "credit",
            "refund",
            "discount",
            "adjust",
          ),
          need("Mention the bill", "bill", "account", "statement"),
        ],
      },
      {
        skill: "Closing",
        customer: "Okay. I hope this time it really gets fixed.",
        task: "Give him a ticket number, thank him for his patience, and close the call.",
        sample:
          "It will, Mr. Ramos. Your ticket number is five, eight, one, two, zero. Thank you for your patience, and have a good day.",
        needs: [
          need("Give a ticket or reference number", "ticket", "reference"),
          need("Thank him for his patience", "patience", "thank"),
          GOODBYE,
        ],
      },
    ],
  },
  {
    ...HARD,
    id: "spk-3-4",
    kind: "CALL",
    title: "📞 Cancel My Plan",
    caller: "Ms. Torres",
    setup: "Inbound · Retention desk",
    agent: "Kim",
    steps: [
      opening("Momo Telco", "Kim"),
      {
        skill: "Acknowledge",
        customer: "I want to cancel my postpaid plan.",
        task: "Say you understand and that you're sorry to hear it, then ask her why she wants to cancel.",
        sample:
          "I'm sorry to hear that, Ms. Torres, and I understand. May I ask why you'd like to cancel your plan?",
        needs: [
          need("Acknowledge her request", "understand", "sorry", "i see"),
          need("Ask the reason", "why", "reason", "may i ask", "what made"),
        ],
      },
      {
        skill: "Probing",
        customer:
          "Another network offered me more data for less money. Your plan is too expensive.",
        task: "Ask how much data she uses each month, so you can find a better plan.",
        sample:
          "I see. So I can find a better plan for you, how much data do you usually use each month?",
        needs: [
          need("Ask about her data usage", "data", "use", "usage", "gigabyte"),
          need(
            "Say you'll find a better plan",
            "plan",
            "offer",
            "option",
            "better",
          ),
        ],
      },
      {
        skill: "Retention offer",
        customer: "About twenty gigabytes a month.",
        task: "Offer her a plan with more data for a lower price, or a discount for staying.",
        sample:
          "Thank you. I can offer you our Plan 999 with thirty gigabytes of data, which is lower than what you pay now, plus a discount for staying with us.",
        needs: [
          need("Make an offer", "offer", "plan", "upgrade", "promo"),
          need("More data", "data", "gigabyte", "gb"),
          need(
            "Lower price or discount",
            "discount",
            "lower",
            "less",
            "cheaper",
            "save",
            "free",
          ),
        ],
      },
      {
        skill: "Confirm",
        customer: "Hmm, that's actually better. Okay, I'll stay.",
        task: "Thank her for staying and confirm the change starts on her next billing cycle.",
        sample:
          "Thank you for staying with us, Ms. Torres! Your new plan will start on your next billing cycle.",
        needs: [
          need("Thank her for staying", "thank"),
          need(
            "Confirm when it starts",
            "next",
            "billing",
            "cycle",
            "start",
            "effective",
          ),
        ],
      },
      {
        skill: "Closing",
        customer: "Great. That's all, thanks.",
        task: "Ask if there's anything else and close the call.",
        sample:
          "Is there anything else I can help you with? Thank you for choosing Momo Telco, and have a wonderful day!",
        needs: [ANYTHING_ELSE, GOODBYE],
      },
    ],
  },
];

const byId = (id: string) => ORIGINAL.find((l) => l.id === id)!;

/**
 * Every level, in play order: for each category, its 20 Speech Tests, then
 * its 20 Voice Calls.
 */
export const SPEAK_LEVELS: SpeakLevel[] = [
  byId("spk-1-1"),
  byId("spk-1-2"),
  ...EASY_READS,
  byId("spk-1-3"),
  byId("spk-1-4"),
  ...EASY_CALLS,
  byId("spk-2-1"),
  byId("spk-2-2"),
  ...MIDDLE_READS,
  byId("spk-2-3"),
  byId("spk-2-4"),
  ...MIDDLE_CALLS,
  byId("spk-3-1"),
  byId("spk-3-2"),
  ...HARD_READS,
  byId("spk-3-3"),
  byId("spk-3-4"),
  ...HARD_CALLS,
];

// ------------------------------------------------------------------ Scoring

const ONES = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
];
const TENS = [
  "",
  "",
  "twenty",
  "thirty",
  "forty",
  "fifty",
  "sixty",
  "seventy",
  "eighty",
  "ninety",
];

/** 0 – 999,999 in words, e.g. 150 → "one hundred fifty". */
function numberWords(n: number): string {
  if (n < 20) return ONES[n]!;
  if (n < 100) {
    return `${TENS[Math.floor(n / 10)]}${n % 10 ? ` ${ONES[n % 10]}` : ""}`;
  }
  if (n < 1000) {
    return `${ONES[Math.floor(n / 100)]} hundred${n % 100 ? ` ${numberWords(n % 100)}` : ""}`;
  }
  return `${numberWords(Math.floor(n / 1000))} thousand${n % 1000 ? ` ${numberWords(n % 1000)}` : ""}`;
}

/** Words that sound alike and are heard either way. */
const SAME = new Map([
  ["two", "to"],
  ["too", "to"],
  ["four", "for"],
  ["ok", "okay"],
  ["alfa", "alpha"],
  ["juliett", "juliet"],
  ["xray", "x ray"],
]);

/** Lower case words only, with numbers spelled out: "150" → "one hundred fifty". */
export function normalizeSpeech(text: string): string {
  const words = text
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/(\d),(\d{3})/g, "$1$2")
    // A digit string longer than 6 (a phone number) is read digit by digit.
    .replace(/\d{7,}/g, (d) => d.split("").join(" "))
    .replace(/\d+/g, (d) => ` ${numberWords(Math.min(Number(d), 999999))} `)
    .replace(/'/g, "")
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => SAME.get(w) ?? w);
  return words
    .join(" ")
    .replace(/\band\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Words of a line, with a plural -s dropped so "cable" counts "cables". */
const words = (text: string) =>
  normalizeSpeech(text)
    .split(" ")
    .filter(Boolean)
    .map((w) => (w.length > 3 && /[^s]s$/.test(w) ? w.slice(0, -1) : w));

/** Longest run of the target's words heard in order (LCS). */
function inOrder(target: string[], heard: string[]) {
  const row = new Array<number>(heard.length + 1).fill(0);
  for (const t of target) {
    let diag = 0;
    for (let j = 1; j <= heard.length; j++) {
      const up = row[j]!;
      row[j] = t === heard[j - 1] ? diag + 1 : Math.max(row[j]!, row[j - 1]!);
      diag = up;
    }
  }
  return row[heard.length]!;
}

/** Speech Test: the percent of a line's words heard, in order (0 – 100). */
export function lineScore(line: string, heard: string): number {
  const target = words(line);
  if (target.length === 0) return 0;
  return Math.round((inOrder(target, words(heard)) / target.length) * 100);
}

/** Which of a step's needs a reply covers. */
export function needsMet(step: SpeakStep, heard: string): boolean[] {
  const said = ` ${normalizeSpeech(heard)} `;
  return step.needs.map((n) =>
    n.any.some((phrase) => {
      const p = normalizeSpeech(phrase);
      // A phrase matches from the start of a word: "thank" counts "thanks".
      return p.length > 0 && said.includes(` ${p}`);
    }),
  );
}

/** Voice Call: the percent of a step's needs a reply covers (0 – 100). */
export function stepScore(step: SpeakStep, heard: string): number {
  const met = needsMet(step, heard);
  return Math.round((met.filter(Boolean).length / met.length) * 100);
}

/** How many answers a level takes: its lines, or its call steps. */
export const itemsOf = (level: SpeakLevel) =>
  level.kind === "READ" ? level.lines.length : level.steps.length;

/** Score for one answer of a level. */
export function itemScore(level: SpeakLevel, index: number, heard: string) {
  return level.kind === "READ"
    ? lineScore(level.lines[index]!.text, heard)
    : stepScore(level.steps[index]!, heard);
}

/** Stars from the average: 90% → 3, 75% → 2, 60% → 1. */
export function speakStars(percent: number) {
  return percent >= 90 ? 3 : percent >= 75 ? 2 : percent >= 60 ? 1 : 0;
}

/** Scores a finished level from what the microphone heard for each item. */
export function scoreSpeak(level: SpeakLevel, heard: string[]) {
  const scores = heard.map((h, i) => itemScore(level, i, h));
  const percent = Math.round(
    scores.reduce((s, n) => s + n, 0) / Math.max(1, scores.length),
  );
  return { scores, percent, stars: speakStars(percent) };
}
