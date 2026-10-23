"use server";

import { revalidatePath } from "next/cache";

import { api } from "~/trpc/server";

/** Inbox pages that may be revalidated after a message is sent. */
const INBOXES = ["/teacher/messages", "/student/messages"] as const;
type Inbox = (typeof INBOXES)[number];
const inbox = (value: unknown): Inbox =>
  INBOXES.find((path) => path === value) ?? "/student/messages";

/** Posts a reply into an existing thread and marks it read. */
export async function sendReply(formData: FormData) {
  const conversationId = formData.get("conversationId");
  const body = formData.get("body");

  if (
    typeof conversationId !== "string" ||
    typeof body !== "string" ||
    body.trim().length === 0
  ) {
    return;
  }

  await api.message.send({ conversationId, body: body.trim() });
  await api.message.markRead({ conversationId });
  revalidatePath(inbox(formData.get("basePath")));
}

/** Starts (or continues) a 1:1 conversation; returns its id to open it. */
export async function startConversation(input: {
  recipientId: string;
  subject: string;
  body: string;
  basePath: string;
}): Promise<
  { ok: true; conversationId: string } | { ok: false; error: string }
> {
  const body = input.body.trim();
  if (!body) return { ok: false, error: "Write a message first." };
  try {
    const message = await api.message.start({
      recipientIds: [input.recipientId],
      subject: input.subject.trim() || undefined,
      body,
    });
    revalidatePath(inbox(input.basePath));
    return { ok: true, conversationId: message.conversationId };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : "The message was not sent.",
    };
  }
}
