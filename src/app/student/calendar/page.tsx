import { type Metadata } from "next";

import { CalendarView } from "~/app/_components/calendar-view";

export const metadata: Metadata = { title: "Calendar · Momo Smart" };
export const dynamic = "force-dynamic";

export default function StudentCalendarPage() {
  return <CalendarView scope="your courses" />;
}
