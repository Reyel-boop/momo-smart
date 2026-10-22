"use server";

import { revalidatePath } from "next/cache";

import { api } from "~/trpc/server";

/**
 * Lecture-player autosave. Not revalidated: it fires every few seconds of
 * playback, and nothing on screen depends on the stored position until the
 * next visit.
 */
export async function saveLessonProgress(
  lessonId: string,
  positionSeconds: number,
  durationSeconds: number | null = null,
) {
  await api.lesson.saveProgress({
    lessonId,
    positionSeconds,
    durationSeconds: durationSeconds ?? undefined,
  });
}

/** The "Mark as Completed" checkbox; also moves the dashboard and syllabus. */
export async function setLessonCompleted(lessonId: string, completed: boolean) {
  await api.lesson.setCompleted({ lessonId, completed });
  revalidatePath("/student", "layout");
}

export async function addLessonNote(
  lessonId: string,
  body: string,
  timestampSeconds: number | null,
) {
  await api.lesson.addNote({
    lessonId,
    body: body.trim(),
    timestampSeconds: timestampSeconds ?? undefined,
  });
  revalidatePath("/student/courses");
}

/** Submits one try at a unit's questions; returns the score or the reason it failed. */
export async function submitUnitQuestions(
  assessmentId: string,
  answers: Record<string, string>,
): Promise<
  | { ok: true; score: number; totalPoints: number; triesLeft: number }
  | { ok: false; error: string }
> {
  try {
    const result = await api.assessment.submitUnitQuiz({
      assessmentId,
      answers,
    });
    revalidatePath("/student", "layout");
    return { ok: true, ...result };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : "Could not submit answers.",
    };
  }
}
