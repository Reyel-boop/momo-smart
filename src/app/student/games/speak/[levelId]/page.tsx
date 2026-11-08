import { type Metadata } from "next";
import { notFound } from "next/navigation";

import { SPEAK_LEVELS } from "~/lib/games/speak-up";
import { SpeakScreen } from "./speak-screen";

export const metadata: Metadata = { title: "Speak Up! · Momo Smart" };
export const dynamic = "force-dynamic";

export default async function SpeakLevelPage({
  params,
}: {
  params: Promise<{ levelId: string }>;
}) {
  const { levelId } = await params;
  if (!SPEAK_LEVELS.some((l) => l.id === levelId)) notFound();
  return <SpeakScreen key={levelId} levelId={levelId} />;
}
