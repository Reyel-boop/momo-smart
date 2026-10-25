import { type Metadata } from "next";

import { PlayerScreen } from "./player-screen";

export const metadata: Metadata = { title: "Live Quiz · Momo Smart" };
export const dynamic = "force-dynamic";

/** The student's side of a Live Quiz: join, answer, see the result. */
export default function StudentLivePage() {
  return <PlayerScreen />;
}
