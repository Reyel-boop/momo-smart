import { type Metadata } from "next";
import { notFound } from "next/navigation";

import { LAB_LEVELS } from "~/lib/games/lab-sorter";
import { SortScreen } from "../../_components/sort-game";

export const metadata: Metadata = { title: "Lab Sorter · Momo Smart" };
export const dynamic = "force-dynamic";

export default async function LabLevelPage({
  params,
}: {
  params: Promise<{ levelId: string }>;
}) {
  const { levelId } = await params;
  if (!LAB_LEVELS.some((l) => l.id === levelId)) notFound();
  return <SortScreen key={levelId} game="lab" levelId={levelId} />;
}
