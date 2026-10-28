import { type Metadata } from "next";
import { notFound } from "next/navigation";

import { GAMES, SCRAMBLE_GAMES } from "~/lib/games/catalog";
import { WordsScreen } from "./words-screen";

export const metadata: Metadata = { title: "Word Scramble · Momo Smart" };
export const dynamic = "force-dynamic";

/** One Word Scramble level; the subject's game is found from the level. */
export default async function WordsLevelPage({
  params,
}: {
  params: Promise<{ levelId: string }>;
}) {
  const { levelId } = await params;
  const game = SCRAMBLE_GAMES.find((g) =>
    GAMES[g].levels.some((l) => l.id === levelId),
  );
  if (!game) notFound();
  return <WordsScreen key={levelId} game={game} levelId={levelId} />;
}
