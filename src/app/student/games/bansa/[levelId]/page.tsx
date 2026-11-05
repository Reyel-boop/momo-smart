import { type Metadata } from "next";
import { notFound } from "next/navigation";

import { BANSA_LEVELS } from "~/lib/games/bansa-quiz";
import { SpeedScreen } from "../../_components/speed-game";

export const metadata: Metadata = { title: "Bansa Quiz · Momo Smart" };
export const dynamic = "force-dynamic";

export default async function LevelPage({
  params,
}: {
  params: Promise<{ levelId: string }>;
}) {
  const { levelId } = await params;
  if (!BANSA_LEVELS.some((l) => l.id === levelId)) notFound();
  return <SpeedScreen key={levelId} game="bansa" levelId={levelId} />;
}
