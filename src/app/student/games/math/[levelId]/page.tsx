import { type Metadata } from "next";
import { notFound } from "next/navigation";

import { MATH_LEVELS } from "~/lib/games/number-rush";
import { MathScreen } from "./math-screen";

export const metadata: Metadata = { title: "Number Rush · Momo Smart" };
export const dynamic = "force-dynamic";

export default async function MathLevelPage({
  params,
}: {
  params: Promise<{ levelId: string }>;
}) {
  const { levelId } = await params;
  if (!MATH_LEVELS.some((l) => l.id === levelId)) notFound();
  return <MathScreen key={levelId} levelId={levelId} />;
}
