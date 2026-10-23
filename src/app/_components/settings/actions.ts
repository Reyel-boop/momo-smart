"use server";

import { revalidatePath } from "next/cache";

import { api } from "~/trpc/server";

type Result = { ok: true } | { ok: false; error: string };

const failure = (error: unknown, fallback: string): Result => ({
  ok: false,
  error: error instanceof Error ? error.message : fallback,
});

/** Saves the name (and, for teachers, title, office and bio). */
export async function saveProfile(input: {
  name: string;
  title?: string;
  officeLocation?: string;
  bio?: string;
}): Promise<Result> {
  if (!input.name.trim()) return { ok: false, error: "Enter your name." };
  try {
    await api.user.updateProfile({
      name: input.name.trim(),
      title: input.title?.trim(),
      officeLocation: input.officeLocation?.trim(),
      bio: input.bio?.trim(),
    });
  } catch (error) {
    return failure(error, "Your profile was not saved.");
  }
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function changePassword(input: {
  currentPassword: string;
  newPassword: string;
}): Promise<Result> {
  if (input.newPassword.length < 8) {
    return { ok: false, error: "Use at least 8 characters." };
  }
  try {
    await api.user.changePassword(input);
  } catch (error) {
    return failure(error, "Your password was not changed.");
  }
  return { ok: true };
}
