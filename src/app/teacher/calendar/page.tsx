import { type Metadata } from "next";

import { CalendarView } from "~/app/_components/calendar-view";
import { api } from "~/trpc/server";
import { NewEvent } from "./new-event";

export const metadata: Metadata = { title: "Calendar · Momo Smart" };
export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const sections = await api.course.mySections();
  return (
    <CalendarView
      scope="your sections"
      showAdminDeadlines
      action={
        <NewEvent
          sections={sections.map((section) => ({
            id: section.id,
            label: `${section.course.name} — ${section.code}`,
          }))}
        />
      }
    />
  );
}
