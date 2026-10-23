"use server";

import { revalidatePath } from "next/cache";

import { api } from "~/trpc/server";

export type EventType =
  "CLASS" | "EXAM" | "OFFICE_HOURS" | "SCHOOL_EVENT" | "ADMIN_DEADLINE";

/** Adds an event to one of the teacher's sections. */
export async function createEvent(input: {
  title: string;
  type: EventType;
  /** ISO timestamp, converted from the form in the browser's time zone. */
  startAt: string;
  location: string;
  description: string;
  sectionId: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const startAt = new Date(input.startAt);
  if (!input.title.trim())
    return { ok: false, error: "Give the event a title." };
  if (!input.sectionId) return { ok: false, error: "Choose a class." };
  if (Number.isNaN(startAt.getTime())) {
    return { ok: false, error: "Pick a date and time." };
  }
  try {
    await api.calendar.createEvent({
      title: input.title.trim(),
      type: input.type,
      startAt,
      location: input.location.trim() || undefined,
      description: input.description.trim() || undefined,
      sectionId: input.sectionId,
    });
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : "The event was not saved.",
    };
  }
  revalidatePath("/teacher/calendar");
  revalidatePath("/student/calendar");
  return { ok: true };
}
