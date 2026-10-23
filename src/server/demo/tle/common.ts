import type { DemoLesson } from "../grade10";
import type { QuizItem } from "../grade10-quiz";

export const TLE_DEPARTMENT = "Technology and Livelihood Education";

/** A TLE lesson with its lecture video, written lecture, reading and self-check. */
export const tleLesson = (
  title: string,
  summary: string,
  videoId: string,
  lecture: string,
  reading: string,
  questions: string[],
): DemoLesson => ({
  title,
  summary,
  reading,
  questions,
  lecture: { videoId, lecture },
});

/** One Unit Question: four choices, the 0-based right one, and the rationale. */
export const q = (
  prompt: string,
  choices: [string, string, string, string],
  answer: 0 | 1 | 2 | 3,
  why: string,
): QuizItem => ({ q: prompt, choices, answer, why });
