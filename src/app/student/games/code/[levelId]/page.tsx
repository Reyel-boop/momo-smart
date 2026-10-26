import { type Metadata } from "next";
import { notFound } from "next/navigation";

import { CODE_LEVELS } from "~/lib/games/code-quest";
import { CodeScreen } from "./code-screen";

export const metadata: Metadata = { title: "Code Quest · Momo Smart" };
export const dynamic = "force-dynamic";

export default async function CodeLevelPage({
  params,
}: {
  params: Promise<{ levelId: string }>;
}) {
  const { levelId } = await params;
  if (!CODE_LEVELS.some((l) => l.id === levelId)) notFound();
  return <CodeScreen key={levelId} levelId={levelId} />;
}
