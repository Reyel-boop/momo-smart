import { type Metadata } from "next";

import { Inbox } from "~/app/_components/messaging/inbox";
import type { Contact } from "~/app/_components/messaging/new-message";
import { api } from "~/trpc/server";

export const metadata: Metadata = { title: "Messages · Momo Smart" };
export const dynamic = "force-dynamic";

type SearchParams = Promise<{ thread?: string }>;

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { thread } = await searchParams;

  // Anyone on the teacher's rosters can be messaged.
  const sections = await api.course.mySections();
  const rosters = await Promise.all(
    sections.map(async (section) => ({
      section,
      roster: await api.course.roster({ sectionId: section.id }),
    })),
  );
  const contacts = new Map<string, Contact>();
  for (const { section, roster } of rosters) {
    for (const enrollment of roster) {
      const user = enrollment.student.user;
      if (!contacts.has(user.id)) {
        contacts.set(user.id, {
          id: user.id,
          name: user.name ?? "Student",
          detail: `${section.code} · Grade ${enrollment.student.gradeLevel}`,
        });
      }
    }
  }

  return (
    <Inbox
      basePath="/teacher/messages"
      threadParam={thread}
      contacts={[...contacts.values()].sort((a, b) =>
        a.name.localeCompare(b.name),
      )}
      scopeNote="You can message students on your roster."
      emptyNote="No conversations yet. Use New message to write to a student."
    />
  );
}
