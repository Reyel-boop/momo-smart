import { type Metadata } from "next";
import { notFound } from "next/navigation";

import { GRAMMAR_LEVELS } from "~/lib/games/grammar-hunt";
import { GrammarScreen } from "./grammar-screen";

export const metadata: Metadata = { title: "Grammar Hunt · Momo Smart" };
export const dynamic = "force-dynamic";

export default async function GrammarLevelPage({
  params,
}: {
  params: Promise<{ levelId: string }>;
}) {
  const { levelId } = await params;
  if (!GRAMMAR_LEVELS.some((l) => l.id === levelId)) notFound();
  return <GrammarScreen key={levelId} levelId={levelId} />;
}
