import { type Metadata } from "next";
import { notFound } from "next/navigation";

import { BAKE_LEVELS } from "~/lib/games/bake-shop";
import { BakeScreen } from "./bake-screen";

export const metadata: Metadata = { title: "Bake Shop · Momo Smart" };
export const dynamic = "force-dynamic";

export default async function BakeLevelPage({
  params,
}: {
  params: Promise<{ levelId: string }>;
}) {
  const { levelId } = await params;
  if (!BAKE_LEVELS.some((l) => l.id === levelId)) notFound();
  return <BakeScreen key={levelId} levelId={levelId} />;
}
