import { type Metadata } from "next";
import { notFound } from "next/navigation";

import { BUG_LEVELS } from "~/lib/games/bug-hunt";
import { BugScreen } from "./bug-screen";

export const metadata: Metadata = { title: "Bug Hunt · Momo Smart" };
export const dynamic = "force-dynamic";

export default async function BugLevelPage({
  params,
}: {
  params: Promise<{ levelId: string }>;
}) {
  const { levelId } = await params;
  if (!BUG_LEVELS.some((l) => l.id === levelId)) notFound();
  return <BugScreen key={levelId} levelId={levelId} />;
}
