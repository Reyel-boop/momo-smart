import "server-only";

import { api } from "~/trpc/server";
import type { Tutor } from "./alert-action";

/**
 * Possible peer tutors for each section an alert belongs to: classmates,
 * strongest current grade first.
 */
export async function tutorsFor(
  alerts: Array<{ section: { id: string } | null }>,
): Promise<Record<string, Tutor[]>> {
  const sectionIds = [
    ...new Set(
      alerts.flatMap((alert) => (alert.section ? [alert.section.id] : [])),
    ),
  ];
  const rosters = await Promise.all(
    sectionIds.map(async (sectionId) => ({
      sectionId,
      roster: await api.course.roster({ sectionId }),
    })),
  );
  return Object.fromEntries(
    rosters.map(({ sectionId, roster }) => [
      sectionId,
      [...roster]
        .sort((a, b) => (b.currentPercent ?? 0) - (a.currentPercent ?? 0))
        .map((enrollment) => ({
          id: enrollment.student.id,
          name: `${enrollment.student.user.name ?? "Student"}${enrollment.currentPercent != null ? ` (${Math.round(enrollment.currentPercent)}%)` : ""}`,
        })),
    ]),
  );
}
