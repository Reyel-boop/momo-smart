import { cache } from "react";

import { api } from "~/trpc/server";

/*
 * Data the student layout and the dashboard page both need. React's `cache`
 * makes each one run once per page load instead of once per caller, which
 * halves the database work for the most-visited page in Momo.
 */

export const getStudentOverview = cache(() => api.dashboard.studentOverview());

/** Two weeks of due work (the dashboard's course cards need the second week). */
export const getDueTwoWeeks = cache(() =>
  api.assignment.dueSoon({ withinDays: 14 }),
);

/** Only the work due within the next 7 days (or already overdue). */
export function withinAWeek<T extends { dueAt: Date }>(items: T[]) {
  const weekAhead = Date.now() + 7 * 24 * 60 * 60 * 1000;
  return items.filter((item) => item.dueAt.getTime() <= weekAhead);
}
