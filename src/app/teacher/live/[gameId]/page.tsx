import { type Metadata } from "next";

import { HostScreen } from "./host-screen";

export const metadata: Metadata = { title: "Live Quiz · Momo Smart" };
export const dynamic = "force-dynamic";

/** The projector screen of a live game. */
export default async function LiveGamePage({
  params,
}: {
  params: Promise<{ gameId: string }>;
}) {
  const { gameId } = await params;
  return <HostScreen gameId={gameId} />;
}
