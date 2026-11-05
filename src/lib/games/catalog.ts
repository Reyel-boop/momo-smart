/**
 * Every course game with fixed levels: which courses it belongs to, its
 * title, and its levels. The games hub, level access, the dashboard and
 * Group Race all read from here. (Momo's Quest is separate: its levels are
 * each class's own unit quizzes.)
 */

import { BAKE_LEVELS } from "./bake-shop";
import { BANSA_LEVELS } from "./bansa-quiz";
import { runLevelsOf } from "./block-run";
import { BUG_LEVELS } from "./bug-hunt";
import { CALL_LEVELS } from "./call-sim";
import { CODE_LEVELS } from "./code-quest";
import { GRAMMAR_LEVELS } from "./grammar-hunt";
import { KARINDERYA_LEVELS } from "./karinderya";
import { LAB_LEVELS } from "./lab-sorter";
import { LAVA_LEVELS } from "./lava-climb";
import { MATH_LEVELS } from "./number-rush";
import { SALITA_LEVELS } from "./salita-sprint";
import { TAMA_LEVELS } from "./tama-o-mali";
import { SPRINT_LEVELS } from "./tag-sprint";
import { TICKET_LEVELS } from "./ticket-rush";
import { TOOL_LEVELS } from "./tool-shed";
import { turboLevelsOf } from "./turbo-takbo";
import { huntLevelsOf } from "./word-hunt";
import {
  WORDS_AP,
  WORDS_CP,
  WORDS_ENG,
  WORDS_FIL,
  WORDS_MATH,
  WORDS_SCI,
  WORDS_TEL,
  WORDS_TLE,
} from "./word-scramble";

type CatalogLevel = {
  id: string;
  unit: number;
  unitTitle: string;
  title: string;
};

const isCP = (code: string) => /-CP$/i.test(code);
const isTEL = (code: string) => /-TEL$/i.test(code);
const isMath = (code: string) => /^MATH\b/i.test(code);
const isSci = (code: string) => /^SCI\b/i.test(code);
const isAP = (code: string) => /^AP\b/i.test(code);
const isEng = (code: string) => /^ENG\b/i.test(code);
const isFil = (code: string) => /^FIL\b/i.test(code);
/** Every TLE course except the two ICT strands with their own games. */
const isOtherTLE = (code: string) =>
  /^TLE\b/i.test(code) && !isCP(code) && !isTEL(code);

/** Courses that teach baking, and courses that teach cooking. */
const isBaking = (code: string) => /-(BAKE|PREP)$/i.test(code);
const isCooking = (code: string) => /-(COOK|PREP|FBO)$/i.test(code);
/** Built but not offered yet: these open for other subjects later. */
const notYet = (_code: string) => false;

export const GAMES = {
  code: {
    title: "Code Quest",
    course: "Computer Programming",
    forCourse: isCP,
    levels: CODE_LEVELS,
  },
  bug: {
    title: "Bug Hunt",
    course: "Computer Programming",
    forCourse: isCP,
    levels: BUG_LEVELS,
  },
  sprint: {
    title: "Tag Sprint",
    course: "Computer Programming",
    forCourse: isCP,
    levels: SPRINT_LEVELS,
  },
  call: {
    title: "Call Simulator",
    course: "Telecommunications",
    forCourse: isTEL,
    levels: CALL_LEVELS,
  },
  ticket: {
    title: "Ticket Rush",
    course: "Telecommunications",
    forCourse: isTEL,
    levels: TICKET_LEVELS,
  },
  math: {
    title: "Number Rush",
    course: "Mathematics",
    forCourse: isMath,
    levels: MATH_LEVELS,
  },
  lab: {
    title: "Lab Sorter",
    course: "Science",
    forCourse: isSci,
    levels: LAB_LEVELS,
  },
  tama: {
    title: "Tama o Mali",
    course: "Araling Panlipunan",
    forCourse: isAP,
    levels: TAMA_LEVELS,
  },
  grammar: {
    title: "Grammar Hunt",
    course: "English",
    forCourse: isEng,
    levels: GRAMMAR_LEVELS,
  },
  salita: {
    title: "Salita Sprint",
    course: "Filipino",
    forCourse: isFil,
    levels: SALITA_LEVELS,
  },
  tools: {
    title: "Tool Shed",
    course: "TLE",
    forCourse: isOtherTLE,
    levels: TOOL_LEVELS,
  },
  // Word Scramble: one set of levels per subject, on one shared screen.
  wcode: {
    title: "Code Scramble",
    course: "Computer Programming",
    forCourse: isCP,
    levels: WORDS_CP,
  },
  wtel: {
    title: "Call Center Scramble",
    course: "Telecommunications",
    forCourse: isTEL,
    levels: WORDS_TEL,
  },
  wmath: {
    title: "Math Scramble",
    course: "Mathematics",
    forCourse: isMath,
    levels: WORDS_MATH,
  },
  wsci: {
    title: "Science Scramble",
    course: "Science",
    forCourse: isSci,
    levels: WORDS_SCI,
  },
  wap: {
    title: "Ayusin ang Titik",
    course: "Araling Panlipunan",
    forCourse: isAP,
    levels: WORDS_AP,
  },
  weng: {
    title: "Word Scramble",
    course: "English",
    forCourse: isEng,
    levels: WORDS_ENG,
  },
  wfil: {
    title: "Buuin ang Salita",
    course: "Filipino",
    forCourse: isFil,
    levels: WORDS_FIL,
  },
  wtle: {
    title: "Tool Scramble",
    course: "TLE",
    forCourse: isOtherTLE,
    levels: WORDS_TLE,
  },
  // Block Run: a 3D obstacle course per subject, on the Word Scramble words.
  rcode: {
    title: "Block Run",
    course: "Computer Programming",
    forCourse: isCP,
    levels: runLevelsOf(WORDS_CP),
  },
  rtel: {
    title: "Block Run",
    course: "Telecommunications",
    forCourse: isTEL,
    levels: runLevelsOf(WORDS_TEL),
  },
  rmath: {
    title: "Block Run",
    course: "Mathematics",
    forCourse: isMath,
    levels: runLevelsOf(WORDS_MATH),
  },
  rsci: {
    title: "Block Run",
    course: "Science",
    forCourse: isSci,
    levels: runLevelsOf(WORDS_SCI),
  },
  rap: {
    title: "Block Run",
    course: "Araling Panlipunan",
    forCourse: isAP,
    levels: runLevelsOf(WORDS_AP),
  },
  reng: {
    title: "Block Run",
    course: "English",
    forCourse: isEng,
    levels: runLevelsOf(WORDS_ENG),
  },
  rfil: {
    title: "Block Run",
    course: "Filipino",
    forCourse: isFil,
    levels: runLevelsOf(WORDS_FIL),
  },
  rtle: {
    title: "Block Run",
    course: "TLE",
    forCourse: isOtherTLE,
    levels: runLevelsOf(WORDS_TLE),
  },
  lava: {
    title: "Lava Climb",
    course: "Mathematics",
    forCourse: notYet,
    levels: LAVA_LEVELS,
  },
  bansa: {
    title: "Bansa Quiz",
    course: "Araling Panlipunan",
    forCourse: notYet,
    levels: BANSA_LEVELS,
  },
  kusina: {
    title: "Karinderya Rush",
    course: "TLE",
    forCourse: isCooking,
    levels: KARINDERYA_LEVELS,
  },
  bake: {
    title: "Bake Shop",
    course: "TLE",
    forCourse: isBaking,
    levels: BAKE_LEVELS,
  },
  // Word Hunt: a word search per subject, on the Word Scramble words.
  hcode: {
    title: "Word Hunt",
    course: "Computer Programming",
    forCourse: isCP,
    levels: huntLevelsOf(WORDS_CP),
  },
  htel: {
    title: "Word Hunt",
    course: "Telecommunications",
    forCourse: isTEL,
    levels: huntLevelsOf(WORDS_TEL),
  },
  hmath: {
    title: "Word Hunt",
    course: "Mathematics",
    forCourse: notYet,
    levels: huntLevelsOf(WORDS_MATH),
  },
  hsci: {
    title: "Word Hunt",
    course: "Science",
    forCourse: notYet,
    levels: huntLevelsOf(WORDS_SCI),
  },
  hap: {
    title: "Word Hunt",
    course: "Araling Panlipunan",
    forCourse: notYet,
    levels: huntLevelsOf(WORDS_AP),
  },
  heng: {
    title: "Word Hunt",
    course: "English",
    forCourse: notYet,
    levels: huntLevelsOf(WORDS_ENG),
  },
  hfil: {
    title: "Word Hunt",
    course: "Filipino",
    forCourse: notYet,
    levels: huntLevelsOf(WORDS_FIL),
  },
  htle: {
    title: "Word Hunt",
    course: "TLE",
    forCourse: notYet,
    levels: huntLevelsOf(WORDS_TLE),
  },
  // Turbo Takbo: a tap-for-speed run per subject, on the same words.
  tcode: {
    title: "Turbo Takbo",
    course: "Computer Programming",
    forCourse: isCP,
    levels: turboLevelsOf(WORDS_CP),
  },
  ttel: {
    title: "Turbo Takbo",
    course: "Telecommunications",
    forCourse: isTEL,
    levels: turboLevelsOf(WORDS_TEL),
  },
  tmath: {
    title: "Turbo Takbo",
    course: "Mathematics",
    forCourse: notYet,
    levels: turboLevelsOf(WORDS_MATH),
  },
  tsci: {
    title: "Turbo Takbo",
    course: "Science",
    forCourse: notYet,
    levels: turboLevelsOf(WORDS_SCI),
  },
  tap: {
    title: "Turbo Takbo",
    course: "Araling Panlipunan",
    forCourse: notYet,
    levels: turboLevelsOf(WORDS_AP),
  },
  teng: {
    title: "Turbo Takbo",
    course: "English",
    forCourse: notYet,
    levels: turboLevelsOf(WORDS_ENG),
  },
  tfil: {
    title: "Turbo Takbo",
    course: "Filipino",
    forCourse: notYet,
    levels: turboLevelsOf(WORDS_FIL),
  },
  ttle: {
    title: "Turbo Takbo",
    course: "TLE",
    forCourse: notYet,
    levels: turboLevelsOf(WORDS_TLE),
  },
} satisfies Record<
  string,
  {
    title: string;
    course: string;
    forCourse: (code: string) => boolean;
    levels: readonly CatalogLevel[];
  }
>;

export type GameId = keyof typeof GAMES;
export const GAME_IDS = Object.keys(GAMES) as [GameId, ...GameId[]];

/** The games for one course code, e.g. "TLE 10-CP" → code, bug, sprint. */
export function gamesForCourse(code: string): GameId[] {
  return GAME_IDS.filter((game) => GAMES[game].forCourse(code));
}

/** The Word Scramble games, which share one screen and one finish call. */
export const SCRAMBLE_GAMES = [
  "wcode",
  "wtel",
  "wmath",
  "wsci",
  "wap",
  "weng",
  "wfil",
  "wtle",
] as const satisfies readonly GameId[];

/** The Block Run games, which share one screen and one finish call. */
export const RUN_GAMES = [
  "rcode",
  "rtel",
  "rmath",
  "rsci",
  "rap",
  "reng",
  "rfil",
  "rtle",
] as const satisfies readonly GameId[];

/** The Word Hunt games, which share one screen and one finish call. */
export const HUNT_GAMES = [
  "hcode",
  "htel",
  "hmath",
  "hsci",
  "hap",
  "heng",
  "hfil",
  "htle",
] as const satisfies readonly GameId[];

/** The Turbo Takbo games, which share one screen and one finish call. */
export const TURBO_GAMES = [
  "tcode",
  "ttel",
  "tmath",
  "tsci",
  "tap",
  "teng",
  "tfil",
  "ttle",
] as const satisfies readonly GameId[];

export function levelsOf(game: GameId): readonly CatalogLevel[] {
  return GAMES[game].levels;
}
