import { type Metadata } from "next";
import { notFound } from "next/navigation";

import { GAMES, TURBO_GAMES } from "~/lib/games/catalog";
import { TurboScreen } from "./turbo-screen";

export const metadata: Metadata = { title: "Turbo Takbo · Momo Smart" };
export const dynamic = "force-dynamic";

/** One level; the subject's game is found from the level. */
export default async function LevelPage({
  params,
}: {
  params: Promise<{ levelId: string }>;
}) {
  const { levelId } = await params;
  const game = TURBO_GAMES.find((g) =>
    GAMES[g].levels.some((l) => l.id === levelId),
  );
  if (!game) notFound();
  return <TurboScreen key={levelId} game={game} levelId={levelId} />;
}
