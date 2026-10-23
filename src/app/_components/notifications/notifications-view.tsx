import Link from "next/link";

import { timeAgo } from "~/app/_components/format";
import { BellIcon } from "~/app/_components/icons";
import { PageHeader } from "~/app/_components/page-header";
import { Card, CardHeader, EmptyState } from "~/app/_components/ui";
import { api } from "~/trpc/server";
import { markAllNotificationsRead } from "./actions";

type Portal = "student" | "teacher";

/**
 * Notifications store role-neutral links ("/messages/<id>", "/assignments/…").
 * Map each one to the page that shows it in this portal.
 */
function resolveLink(portal: Portal, link: string | null): string | null {
  if (!link) return null;
  const base = `/${portal}`;
  const message = /^\/messages\/([^/?#]+)/.exec(link);
  if (message) return `${base}/messages?thread=${message[1]}`;
  if (link.startsWith("/assignments")) return `${base}/assignments`;
  if (link.startsWith("/assessments")) {
    return portal === "student" ? "/student/scores" : "/teacher/courses";
  }
  if (link.startsWith("/announcements") || link === "/dashboard") return base;
  return link.startsWith(base) ? link : base;
}

/** The notifications list behind the bell icon, for either portal. */
export async function NotificationsView({ portal }: { portal: Portal }) {
  const { items } = await api.notification.list({ limit: 50 });
  const unread = items.filter((item) => !item.readAt).length;

  return (
    <div className="mx-auto max-w-[900px] space-y-6">
      <PageHeader
        title="Notifications"
        subtitle={
          unread > 0
            ? `${unread} unread notification${unread === 1 ? "" : "s"}.`
            : "You're all caught up."
        }
        action={
          unread > 0 && (
            <form action={markAllNotificationsRead}>
              <button
                type="submit"
                className="border-line bg-surface text-ink hover:bg-canvas rounded-xl border px-4 py-2.5 text-sm font-semibold transition"
              >
                Mark all as read
              </button>
            </form>
          )
        }
      />

      <Card>
        <CardHeader
          icon={<BellIcon className="size-[18px]" />}
          title="Recent"
          subtitle="The latest 50 notifications"
        />
        {items.length === 0 ? (
          <EmptyState>No notifications yet.</EmptyState>
        ) : (
          <ul className="divide-line divide-y">
            {items.map((item) => {
              const href = resolveLink(portal, item.linkUrl);
              const content = (
                <>
                  <span
                    aria-hidden="true"
                    className={`mt-1.5 size-2 shrink-0 rounded-full ${item.readAt ? "bg-transparent" : "bg-orange-500"}`}
                  />
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block text-sm ${item.readAt ? "text-ink" : "text-ink font-bold"}`}
                    >
                      {item.title}
                    </span>
                    {item.body && (
                      <span className="text-muted mt-0.5 line-clamp-2 block text-xs">
                        {item.body}
                      </span>
                    )}
                  </span>
                  <span className="text-muted shrink-0 text-[11px]">
                    {timeAgo(item.createdAt)}
                  </span>
                </>
              );
              return (
                <li key={item.id}>
                  {href ? (
                    <Link
                      href={href}
                      className="hover:bg-canvas flex items-start gap-3 px-5 py-3.5 transition"
                    >
                      {content}
                    </Link>
                  ) : (
                    <div className="flex items-start gap-3 px-5 py-3.5">
                      {content}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
