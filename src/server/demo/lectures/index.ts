/**
 * Lectures for the Grade 10 demo: every lesson gets a YouTube lecture video
 * (chosen from DepEd-aligned Philippine channels where one exists) and a
 * written lecture shown as the lesson's first tab. Keyed by lesson title,
 * which is unique across the demo curriculum.
 */
import { AP_LECTURES } from "./ap";
import { ENGLISH_LECTURES } from "./english";
import { FILIPINO_LECTURES } from "./filipino";
import { MATH_LECTURES } from "./math";
import { SCIENCE_LECTURES } from "./science";
import type { DemoLecture } from "./types";

export type { DemoLecture } from "./types";

export const GRADE10_LECTURES: Record<string, DemoLecture> = {
  ...MATH_LECTURES,
  ...SCIENCE_LECTURES,
  ...FILIPINO_LECTURES,
  ...ENGLISH_LECTURES,
  ...AP_LECTURES,
};

export const lectureVideoUrl = (lecture: DemoLecture) =>
  `https://www.youtube.com/watch?v=${lecture.videoId}`;
