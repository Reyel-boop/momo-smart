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

type Result<T> = ({ ok: true } & T) | { ok: false; error: string };

const failure = (error: unknown, fallback: string) => ({
  ok: false as const,
  error: error instanceof Error ? error.message : fallback,
});

/** Starts (or resumes) a try at a unit's questions and opens question 1. */
export async function startUnitQuestions(
  assessmentId: string,
): Promise<Result<{ attemptId: string }>> {
  try {
    const { attemptId } = await api.assessment.startUnitQuiz({ assessmentId });
    await api.assessment.openUnitQuestion({ attemptId });
    return { ok: true, attemptId };
  } catch (error) {
    return failure(error, "Could not start the questions.");
  }
}

/** Opens the next question of a running try; its 2-minute clock starts now. */
export async function openNextUnitQuestion(
  attemptId: string,
): Promise<Result<object>> {
  try {
    await api.assessment.openUnitQuestion({ attemptId });
    return { ok: true };
  } catch (error) {
    return failure(error, "Could not open the next question.");
  }
}

type Feedback = Awaited<ReturnType<typeof api.assessment.answerUnitQuestion>>;

/**
 * Answers the open question (null when its time ran out) and returns the
 * verdict, the correct choice and the rationale.
 */
export async function answerUnitQuestion(
  attemptId: string,
  questionId: string,
  optionId: string | null,
): Promise<Result<{ feedback: Feedback }>> {
  try {
    const feedback = await api.assessment.answerUnitQuestion({
      attemptId,
      questionId,
      optionId,
    });
    if (feedback.finished) revalidatePath("/student", "layout");
    return { ok: true, feedback };
  } catch (error) {
    return failure(error, "Your answer could not be saved.");
  }
}

/** Records that the student left the quiz screen. */
export async function reportUnitQuizFocusLoss(attemptId: string) {
  try {
    await api.assessment.reportUnitQuizFocusLoss({ attemptId });
  } catch {
    // Best effort: a failed report must never interrupt the student.
  }
}

/** Joins a class with the code the teacher shared. */
export async function joinClass(
  code: string,
): Promise<{ ok: true; name: string } | { ok: false; error: string }> {
  try {
    const joined = await api.course.joinByCode({ code });
    revalidatePath("/student", "layout");
    return { ok: true, name: joined.name };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : "Could not join the class.",
    };
  }
}
