import { type Metadata } from "next";

import { Inbox } from "~/app/_components/messaging/inbox";
import type { Contact } from "~/app/_components/messaging/new-message";
import { teacherFullName } from "~/app/student/_components/format";
import { api } from "~/trpc/server";

export const metadata: Metadata = { title: "Messages · Momo Smart" };
export const dynamic = "force-dynamic";

type SearchParams = Promise<{ thread?: string }>;

export default async function StudentMessagesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { thread } = await searchParams;

  // Students can write to the teachers of their courses.
  const sections = await api.course.mySections();
  const contacts = new Map<string, Contact>();
  for (const section of sections) {
    const user = section.teacher.user;
    const existing = contacts.get(user.id);
    contacts.set(user.id, {
      id: user.id,
      name: teacherFullName(user),
      detail: existing
        ? `${existing.detail}, ${section.course.name}`
        : section.course.name,
    });
  }

  return (
    <Inbox
      basePath="/student/messages"
      threadParam={thread}
      contacts={[...contacts.values()]}
      scopeNote="You can message the teachers of your courses."
      emptyNote="No conversations yet. Use New message to ask your teacher a question."
    />
  );
}
