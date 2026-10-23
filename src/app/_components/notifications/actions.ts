"use server";

import { revalidatePath } from "next/cache";

import { api } from "~/trpc/server";

export async function markAllNotificationsRead() {
  await api.notification.markAllRead();
  revalidatePath("/", "layout");
}
