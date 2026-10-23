"use server";

import { revalidatePath } from "next/cache";

import { api } from "~/trpc/server";

export type InterventionType =
  | "CONTACT_GUARDIAN"
  | "SCHEDULE_MAKEUP"
  | "ASSIGN_PEER_TUTOR"
  | "COUNSELOR_REFERRAL"
  | "STUDENT_CONFERENCE"
  | "NOTE";

/** Records a follow-up on an alert and acknowledges it. */
export async function actOnAlert(input: {
  alertId: string;
  type: InterventionType;
  notes: string;
  tutorId?: string;
  /** ISO timestamp for a make-up slot. */
  scheduledFor?: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await api.alert.act({
      alertId: input.alertId,
      type: input.type,
      notes: input.notes.trim() || undefined,
      tutorId: input.tutorId === "" ? undefined : input.tutorId,
      scheduledFor: input.scheduledFor
        ? new Date(input.scheduledFor)
        : undefined,
    });
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Nothing was saved.",
    };
  }
  revalidatePath("/teacher");
  revalidatePath("/teacher/alerts");
  return { ok: true };
}

/** Closes an alert without further action. */
export async function resolveAlert(alertId: string) {
  await api.alert.setStatus({ alertId, status: "RESOLVED" });
  revalidatePath("/teacher");
  revalidatePath("/teacher/alerts");
}
