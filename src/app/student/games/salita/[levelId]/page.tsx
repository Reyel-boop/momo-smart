import { type Metadata } from "next";
import { notFound } from "next/navigation";

import { SALITA_LEVELS } from "~/lib/games/salita-sprint";
import { SpeedScreen } from "../../_components/speed-game";

export const metadata: Metadata = { title: "Salita Sprint · Momo Smart" };
export const dynamic = "force-dynamic";

export default async function SalitaLevelPage({
  params,
}: {
  params: Promise<{ levelId: string }>;
}) {
  const { levelId } = await params;
  if (!SALITA_LEVELS.some((l) => l.id === levelId)) notFound();
  return <SpeedScreen key={levelId} game="salita" levelId={levelId} />;
}
