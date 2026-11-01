"use server";

import { revalidatePath } from "next/cache";

import { api } from "~/trpc/server";

type Result<T> = ({ ok: true } & T) | { ok: false; error: string };

const failure = (error: unknown, fallback: string) => ({
  ok: false as const,
  error: error instanceof Error ? error.message : fallback,
});

/** Starts (or resumes) a try at a CB-NAT test and opens question 1. */
export async function startNatTest(
  testId: string,
): Promise<Result<{ attemptId: string }>> {
  try {
    const { attemptId } = await api.nat.start({ testId });
    await api.nat.open({ attemptId });
    return { ok: true, attemptId };
  } catch (error) {
    return failure(error, "Could not start the test.");
  }
}

/** Opens the next question; only once the last one's 2 minutes are up. */
export async function openNextNatQuestion(
  attemptId: string,
): Promise<Result<object>> {
  try {
    await api.nat.open({ attemptId });
    return { ok: true };
  } catch (error) {
    return failure(error, "Could not open the next question.");
  }
}

type Feedback = Awaited<ReturnType<typeof api.nat.answer>>;

/** Answers the open question (null when time ran out). */
export async function answerNatQuestion(
  attemptId: string,
  questionId: string,
  optionId: string | null,
): Promise<Result<{ feedback: Feedback }>> {
  try {
    const feedback = await api.nat.answer({ attemptId, questionId, optionId });
    if (feedback.finished) revalidatePath("/student/nat");
    return { ok: true, feedback };
  } catch (error) {
    return failure(error, "Your answer could not be saved.");
  }
}

/** Records that the student left the test screen. */
export async function reportNatFocusLoss(attemptId: string) {
  try {
    await api.nat.focusLoss({ attemptId });
  } catch {
    // Best effort: a failed report must never interrupt the student.
  }
}
