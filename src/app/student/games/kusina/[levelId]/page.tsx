import { type Metadata } from "next";
import { notFound } from "next/navigation";

import { KARINDERYA_LEVELS } from "~/lib/games/karinderya";
import { KusinaScreen } from "./kusina-screen";

export const metadata: Metadata = { title: "Karinderya Rush · Momo Smart" };
export const dynamic = "force-dynamic";

export default async function LevelPage({
  params,
}: {
  params: Promise<{ levelId: string }>;
}) {
  const { levelId } = await params;
  if (!KARINDERYA_LEVELS.some((l) => l.id === levelId)) notFound();
  return <KusinaScreen key={levelId} levelId={levelId} />;
}
