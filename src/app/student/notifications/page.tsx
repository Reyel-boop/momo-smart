import { type Metadata } from "next";

import { NotificationsView } from "~/app/_components/notifications/notifications-view";

export const metadata: Metadata = { title: "Notifications · Momo Smart" };
export const dynamic = "force-dynamic";

export default function NotificationsPage() {
  return <NotificationsView portal="student" />;
}
