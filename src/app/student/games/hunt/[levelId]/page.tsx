import { type Metadata } from "next";
import { notFound } from "next/navigation";

import { GAMES, HUNT_GAMES } from "~/lib/games/catalog";
import { HuntScreen } from "./hunt-screen";

export const metadata: Metadata = { title: "Word Hunt · Momo Smart" };
export const dynamic = "force-dynamic";

/** One level; the subject's game is found from the level. */
export default async function LevelPage({
  params,
}: {
  params: Promise<{ levelId: string }>;
}) {
  const { levelId } = await params;
  const game = HUNT_GAMES.find((g) =>
    GAMES[g].levels.some((l) => l.id === levelId),
  );
  if (!game) notFound();
  return <HuntScreen key={levelId} game={game} levelId={levelId} />;
}
