/**
 * Live Quiz question banks for the core subjects: per unit, extra questions
 * beyond the five Unit Questions, so one unit can fill a 10-, 15- or
 * 20-question Live Quiz. TLE courses keep theirs on each unit (`bank`).
 */
import type { QuizItem } from "../grade10-quiz";
import { AP_BANK } from "./ap";
import { MATH_BANK } from "./math";
import { SCIENCE_BANK } from "./science";

export const QUESTION_BANKS: Record<string, QuizItem[][]> = {
  MATH: MATH_BANK,
  SCI: SCIENCE_BANK,
  AP: AP_BANK,
};
