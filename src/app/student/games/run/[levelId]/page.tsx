import { type Metadata } from "next";
import { notFound } from "next/navigation";

import { GAMES, RUN_GAMES } from "~/lib/games/catalog";
import { RunScreen } from "./run-screen";

export const metadata: Metadata = { title: "Block Run · Momo Smart" };
export const dynamic = "force-dynamic";

/** One Block Run level; the subject's game is found from the level. */
export default async function RunLevelPage({
  params,
}: {
  params: Promise<{ levelId: string }>;
}) {
  const { levelId } = await params;
  const game = RUN_GAMES.find((g) =>
    GAMES[g].levels.some((l) => l.id === levelId),
  );
  if (!game) notFound();
  return <RunScreen key={levelId} game={game} levelId={levelId} />;
}
