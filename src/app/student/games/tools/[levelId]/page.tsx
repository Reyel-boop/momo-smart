import { type Metadata } from "next";
import { notFound } from "next/navigation";

import { TOOL_LEVELS } from "~/lib/games/tool-shed";
import { SortScreen } from "../../_components/sort-game";

export const metadata: Metadata = { title: "Tool Shed · Momo Smart" };
export const dynamic = "force-dynamic";

export default async function ToolsLevelPage({
  params,
}: {
  params: Promise<{ levelId: string }>;
}) {
  const { levelId } = await params;
  if (!TOOL_LEVELS.some((l) => l.id === levelId)) notFound();
  return <SortScreen key={levelId} game="tools" levelId={levelId} />;
}
