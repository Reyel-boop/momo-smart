"use server";

import { revalidatePath } from "next/cache";

import { api } from "~/trpc/server";

/** Saves a lesson's lecture video link and written lecture. */
export async function saveLecture(
  lessonId: string,
  videoUrl: string,
  lecture: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await api.lesson.setLecture({ lessonId, videoUrl, lecture });
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : "The lecture was not saved.",
    };
  }
  revalidatePath("/teacher/courses");
  revalidatePath("/student/courses");
  return { ok: true };
}
