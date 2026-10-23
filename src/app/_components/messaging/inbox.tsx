import Link from "next/link";

import { timeAgo } from "~/app/_components/format";
import { ChatIcon, MailIcon } from "~/app/_components/icons";
import { PageHeader } from "~/app/_components/page-header";
import { Avatar, Card, CardHeader, EmptyState } from "~/app/_components/ui";
import { api } from "~/trpc/server";
import { NewMessage, type Contact } from "./new-message";
import { ReplyForm } from "./reply-form";

/**
 * The Messages page for either portal: thread list, the open conversation
 * with a reply box, and a "New message" button for the given contacts.
 */
export async function Inbox({
  basePath,
  threadParam,
  contacts,
  scopeNote,
  emptyNote,
}: {
  /** "/student/messages" or "/teacher/messages". */
  basePath: string;
  threadParam: string | undefined;
  contacts: Contact[];
  scopeNote: string;
  emptyNote: string;
}) {
  const [me, threads] = await Promise.all([
    api.user.me(),
    api.message.threads({ limit: 30 }),
  ]);

  const active =
    threads.find((thread) => thread.id === threadParam) ?? threads[0] ?? null;
  const messages = active
    ? await api.message.thread({ conversationId: active.id, limit: 100 })
    : [];
  // Opening a thread reads it.
  if (active && active.unread > 0) {
    await api.message.markRead({ conversationId: active.id });
  }

  const unreadTotal = threads.reduce(
    (sum, thread) => sum + (thread.id === active?.id ? 0 : thread.unread),
    0,
  );

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <PageHeader
        title="Messages"
        subtitle={`${threads.length} conversation${threads.length === 1 ? "" : "s"}${unreadTotal > 0 ? ` • ${unreadTotal} unread` : ""}. ${scopeNote}`}
        action={<NewMessage contacts={contacts} basePath={basePath} />}
      />

      {threads.length === 0 ? (
        <Card>
          <EmptyState>{emptyNote}</EmptyState>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
          <Card className="overflow-hidden">
            <CardHeader
              icon={<MailIcon className="size-[18px]" />}
              title="Inbox"
              subtitle={`${threads.length} thread${threads.length === 1 ? "" : "s"}`}
            />
            <ul className="divide-line max-h-[640px] divide-y overflow-y-auto">
              {threads.map((thread) => {
                const other = thread.others[0];
                const isActive = active?.id === thread.id;
                const name = other?.name ?? "Conversation";
                const unread = isActive ? 0 : thread.unread;

                return (
                  <li key={thread.id}>
                    <Link
                      href={`${basePath}?thread=${thread.id}`}
                      className={`flex w-full items-start gap-3 px-4 py-3.5 text-left transition ${
                        isActive ? "bg-brand-soft" : "hover:bg-canvas"
                      }`}
                    >
                      <Avatar name={name} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <p className="text-ink truncate text-sm font-bold">
                            {other?.title ? `${other.title} ` : ""}
                            {name}
                          </p>
                          <span className="text-muted shrink-0 text-[11px]">
                            {timeAgo(thread.latestMessage?.sentAt)}
                          </span>
                        </div>
                        {thread.subject && (
                          <p className="text-ink/70 truncate text-xs font-semibold">
                            {thread.subject}
                          </p>
                        )}
                        <p className="text-muted mt-0.5 line-clamp-2 text-xs">
                          {thread.latestMessage?.body ?? "No messages yet"}
                        </p>
                      </div>
                      {unread > 0 && (
                        <span className="bg-brand mt-1 shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold text-white">
                          {unread}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Card>

          <Card className="flex flex-col overflow-hidden">
            {active ? (
              <>
                <CardHeader
                  icon={<ChatIcon className="size-[18px]" />}
                  title={
                    active.others.map((person) => person.name).join(", ") ||
                    "Conversation"
                  }
                  subtitle={active.subject ?? "Direct message"}
                />

                <ol className="max-h-[520px] flex-1 space-y-3 overflow-y-auto px-5 py-4">
                  {messages.map((message) => {
                    const mine = message.sender.id === me.id;
                    return (
                      <li
                        key={message.id}
                        className={`flex gap-3 ${mine ? "flex-row-reverse" : ""}`}
                      >
                        <Avatar name={message.sender.name} size="sm" />
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                            mine
                              ? "bg-navy text-white"
                              : "border-line bg-canvas text-ink border"
                          }`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {message.body}
                          </p>
                          <p
                            className={`mt-1 text-[11px] ${mine ? "text-white/55" : "text-muted"}`}
                          >
                            {mine ? "You" : message.sender.name} ·{" "}
                            {timeAgo(message.sentAt)}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                  {messages.length === 0 && (
                    <li>
                      <EmptyState>No messages in this thread yet.</EmptyState>
                    </li>
                  )}
                </ol>

                <ReplyForm conversationId={active.id} basePath={basePath} />
              </>
            ) : (
              <EmptyState>Select a conversation to read it.</EmptyState>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
