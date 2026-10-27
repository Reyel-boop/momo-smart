import { type Metadata } from "next";
import { notFound } from "next/navigation";

import { TAMA_LEVELS } from "~/lib/games/tama-o-mali";
import { TamaScreen } from "./tama-screen";

export const metadata: Metadata = { title: "Tama o Mali · Momo Smart" };
export const dynamic = "force-dynamic";

export default async function TamaLevelPage({
  params,
}: {
  params: Promise<{ levelId: string }>;
}) {
  const { levelId } = await params;
  if (!TAMA_LEVELS.some((l) => l.id === levelId)) notFound();
  return <TamaScreen key={levelId} levelId={levelId} />;
}
