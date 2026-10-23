"use server";

import { revalidatePath } from "next/cache";

import { api } from "~/trpc/server";

type Result = { ok: true } | { ok: false; error: string };

const failure = (error: unknown, fallback: string): Result => ({
  ok: false,
  error: error instanceof Error ? error.message : fallback,
});

const refresh = () => {
  revalidatePath("/teacher", "layout");
  revalidatePath("/student", "layout");
};

/** Saves a grade; `release` makes it visible to the student right away. */
export async function saveGrade(input: {
  submissionId: string;
  score?: number;
  rubricScores: Array<{
    criterionId: string;
    levelId?: string;
    points: number;
  }>;
  latePenalty: number;
  feedback: string;
  release: boolean;
}): Promise<Result> {
  try {
    await api.grading.gradeSubmission({
      submissionId: input.submissionId,
      score: input.score,
      rubricScores: input.rubricScores,
      latePenalty: input.latePenalty,
      feedback: input.feedback.trim() || undefined,
      release: input.release,
    });
  } catch (error) {
    return failure(error, "The grade was not saved.");
  }
  refresh();
  return { ok: true };
}

/** Sends the work back to the student with feedback to revise it. */
export async function returnForRevision(input: {
  submissionId: string;
  feedback: string;
}): Promise<Result> {
  if (!input.feedback.trim()) {
    return { ok: false, error: "Tell the student what to revise." };
  }
  try {
    await api.grading.returnForRevision({
      submissionId: input.submissionId,
      feedback: input.feedback.trim(),
    });
  } catch (error) {
    return failure(error, "The work was not returned.");
  }
  refresh();
  return { ok: true };
}
