import { type Metadata } from "next";
import { notFound } from "next/navigation";

import { SPRINT_LEVELS } from "~/lib/games/tag-sprint";
import { SpeedScreen } from "../../_components/speed-game";

export const metadata: Metadata = { title: "Tag Sprint · Momo Smart" };
export const dynamic = "force-dynamic";

export default async function SprintLevelPage({
  params,
}: {
  params: Promise<{ levelId: string }>;
}) {
  const { levelId } = await params;
  if (!SPRINT_LEVELS.some((l) => l.id === levelId)) notFound();
  return <SpeedScreen key={levelId} game="sprint" levelId={levelId} />;
}
