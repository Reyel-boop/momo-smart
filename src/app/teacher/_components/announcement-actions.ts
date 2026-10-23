"use server";

import { revalidatePath } from "next/cache";

import { api } from "~/trpc/server";

/**
 * Posts an announcement to one section, or (with no section) broadcasts it
 * to every section the teacher owns. Students are notified either way.
 */
export async function publishAnnouncement(input: {
  sectionId: string | null;
  title: string;
  body: string;
  isPinned: boolean;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const title = input.title.trim();
  const body = input.body.trim();
  if (!title || !body) {
    return { ok: false, error: "Write a title and a message." };
  }
  try {
    if (input.sectionId) {
      await api.announcement.post({
        scope: "SECTION",
        sectionId: input.sectionId,
        title,
        body,
        isPinned: input.isPinned,
      });
    } else {
      await api.announcement.broadcast({
        title,
        body,
        isPinned: input.isPinned,
      });
    }
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "The announcement wasn't sent.",
    };
  }
  revalidatePath("/teacher");
  revalidatePath("/student");
  return { ok: true };
}
