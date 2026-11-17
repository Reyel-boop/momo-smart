"use server";

import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";

import { env } from "~/env";
import { auth } from "~/server/auth";

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

/** Changes the email (also a sign-in name); the password confirms it. */
export async function changeEmail(input: {
  email: string;
  password: string;
}): Promise<Result> {
  const email = input.email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return { ok: false, error: "Enter a valid email address." };
  }
  if (!input.password) return { ok: false, error: "Enter your password." };
  try {
    await api.user.changeEmail({ email, password: input.password });
  } catch (error) {
    return failure(error, "Your email was not changed.");
  }
  revalidatePath("/", "layout");
  return { ok: true };
}

/** Max size of the (already shrunk) picture the browser sends. */
const PHOTO_MAX_BYTES = 400 * 1024;

/**
 * Saves a profile picture. The browser shrinks it to a small square JPEG
 * first; it's kept in the private file store and shown through
 * /api/avatar/<userId> to signed-in people only.
 */
export async function uploadPhoto(form: FormData): Promise<Result> {
  const file = form.get("photo");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Choose a picture first." };
  }
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    return { ok: false, error: "Use a JPG, PNG or WebP picture." };
  }
  if (file.size > PHOTO_MAX_BYTES) {
    return { ok: false, error: "That picture is too big. Try another one." };
  }
  const session = await auth();
  if (!session?.user) return { ok: false, error: "Please sign in again." };
  if (env.DEMO_MODE) {
    return { ok: false, error: "Pictures can't be changed in the demo." };
  }
  try {
    await put(`avatars/${session.user.id}.jpg`, file, {
      access: "private",
      allowOverwrite: true,
      contentType: file.type,
    });
    await api.user.setImage({
      image: `/api/avatar/${session.user.id}?v=${Date.now()}`,
    });
  } catch (error) {
    return failure(error, "Your picture was not saved.");
  }
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function removePhoto(): Promise<Result> {
  try {
    await api.user.setImage({ image: null });
  } catch (error) {
    return failure(error, "Your picture was not removed.");
  }
  revalidatePath("/", "layout");
  return { ok: true };
}
