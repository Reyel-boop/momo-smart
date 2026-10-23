"use server";

import { revalidatePath } from "next/cache";

import { api } from "~/trpc/server";

export type AssignmentType =
  | "LAB_REPORT"
  | "ESSAY"
  | "QUIZ"
  | "EXAM"
  | "DIAGRAM"
  | "WORKSHEET"
  | "PRACTICUM"
  | "PROBLEM_SET"
  | "DISCUSSION"
  | "PROJECT";

export type SubmissionFormat =
  "FILE_UPLOAD" | "TEXT_ENTRY" | "EXTERNAL_LINK" | "ON_PAPER";

export async function createAssignment(input: {
  sectionId: string;
  unitId: string;
  title: string;
  description: string;
  type: AssignmentType;
  format: SubmissionFormat;
  pointsPossible: number;
  /** ISO timestamp, converted from the form in the browser's time zone. */
  dueAt: string;
  allowLate: boolean;
  publish: boolean;
}): Promise<{ ok: true; sectionId: string } | { ok: false; error: string }> {
  const dueAt = new Date(input.dueAt);
  if (!input.title.trim()) return { ok: false, error: "Give it a title." };
  if (!input.sectionId) return { ok: false, error: "Choose a class." };
  if (Number.isNaN(dueAt.getTime())) {
    return { ok: false, error: "Pick the due date and time." };
  }
  if (!(input.pointsPossible >= 0 && input.pointsPossible <= 1000)) {
    return { ok: false, error: "Points must be between 0 and 1000." };
  }
  try {
    await api.assignment.create({
      sectionId: input.sectionId,
      unitId: input.unitId || undefined,
      title: input.title.trim(),
      description: input.description.trim() || undefined,
      type: input.type,
      format: input.format,
      pointsPossible: input.pointsPossible,
      dueAt,
      allowLate: input.allowLate,
      publish: input.publish,
    });
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : "The assignment wasn't saved.",
    };
  }
  revalidatePath("/teacher", "layout");
  revalidatePath("/student", "layout");
  return { ok: true, sectionId: input.sectionId };
}
