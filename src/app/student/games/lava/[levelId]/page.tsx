import { type Metadata } from "next";
import { notFound } from "next/navigation";

import { LAVA_LEVELS } from "~/lib/games/lava-climb";
import { LavaScreen } from "./lava-screen";

export const metadata: Metadata = { title: "Lava Climb · Momo Smart" };
export const dynamic = "force-dynamic";

export default async function LevelPage({
  params,
}: {
  params: Promise<{ levelId: string }>;
}) {
  const { levelId } = await params;
  if (!LAVA_LEVELS.some((l) => l.id === levelId)) notFound();
  return <LavaScreen key={levelId} levelId={levelId} />;
}
