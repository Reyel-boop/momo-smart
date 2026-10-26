import { type Metadata } from "next";
import { notFound } from "next/navigation";

import { CALL_LEVELS } from "~/lib/games/call-sim";
import { CallScreen } from "./call-screen";

export const metadata: Metadata = { title: "Call Simulator · Momo Smart" };
export const dynamic = "force-dynamic";

export default async function CallLevelPage({
  params,
}: {
  params: Promise<{ levelId: string }>;
}) {
  const { levelId } = await params;
  if (!CALL_LEVELS.some((l) => l.id === levelId)) notFound();
  return <CallScreen key={levelId} levelId={levelId} />;
}
