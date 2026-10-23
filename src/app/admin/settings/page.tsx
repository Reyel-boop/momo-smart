import { type Metadata } from "next";

import { SettingsView } from "~/app/_components/settings/settings-view";

export const metadata: Metadata = { title: "Settings · Momo Smart" };
export const dynamic = "force-dynamic";

export default function AdminSettingsPage() {
  return <SettingsView />;
}
