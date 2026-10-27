/**
 * Every course game with fixed levels: which courses it belongs to, its
 * title, and its levels. The games hub, level access, the dashboard and
 * Group Race all read from here. (Momo's Quest is separate: its levels are
 * each class's own unit quizzes.)
 */

import { BUG_LEVELS } from "./bug-hunt";
import { CALL_LEVELS } from "./call-sim";
import { CODE_LEVELS } from "./code-quest";
import { GRAMMAR_LEVELS } from "./grammar-hunt";
import { LAB_LEVELS } from "./lab-sorter";
import { MATH_LEVELS } from "./number-rush";
import { SALITA_LEVELS } from "./salita-sprint";
import { TAMA_LEVELS } from "./tama-o-mali";
import { SPRINT_LEVELS } from "./tag-sprint";
import { TICKET_LEVELS } from "./ticket-rush";
import { TOOL_LEVELS } from "./tool-shed";

type CatalogLevel = {
  id: string;
  unit: number;
  unitTitle: string;
  title: string;
};

const isCP = (code: string) => /-CP$/i.test(code);
const isTEL = (code: string) => /-TEL$/i.test(code);

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
    forCourse: (code: string) => /^MATH\b/i.test(code),
    levels: MATH_LEVELS,
  },
  lab: {
    title: "Lab Sorter",
    course: "Science",
    forCourse: (code: string) => /^SCI\b/i.test(code),
    levels: LAB_LEVELS,
  },
  tama: {
    title: "Tama o Mali",
    course: "Araling Panlipunan",
    forCourse: (code: string) => /^AP\b/i.test(code),
    levels: TAMA_LEVELS,
  },
  grammar: {
    title: "Grammar Hunt",
    course: "English",
    forCourse: (code: string) => /^ENG\b/i.test(code),
    levels: GRAMMAR_LEVELS,
  },
  salita: {
    title: "Salita Sprint",
    course: "Filipino",
    forCourse: (code: string) => /^FIL\b/i.test(code),
    levels: SALITA_LEVELS,
  },
  tools: {
    title: "Tool Shed",
    course: "TLE",
    // Every TLE course except the two ICT strands with their own games.
    forCourse: (code: string) =>
      /^TLE\b/i.test(code) && !isCP(code) && !isTEL(code),
    levels: TOOL_LEVELS,
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

export function levelsOf(game: GameId): readonly CatalogLevel[] {
  return GAMES[game].levels;
}
