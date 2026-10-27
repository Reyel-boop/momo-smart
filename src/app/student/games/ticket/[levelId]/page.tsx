import { type Metadata } from "next";
import { notFound } from "next/navigation";

import { TICKET_LEVELS } from "~/lib/games/ticket-rush";
import { SortScreen } from "../../_components/sort-game";

export const metadata: Metadata = { title: "Ticket Rush · Momo Smart" };
export const dynamic = "force-dynamic";

export default async function TicketLevelPage({
  params,
}: {
  params: Promise<{ levelId: string }>;
}) {
  const { levelId } = await params;
  if (!TICKET_LEVELS.some((l) => l.id === levelId)) notFound();
  return <SortScreen key={levelId} game="ticket" levelId={levelId} />;
}
