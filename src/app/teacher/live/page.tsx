import { type Metadata } from "next";

import { PageHeader } from "~/app/_components/page-header";
import { api } from "~/trpc/server";
import { LiveSetup } from "./live-setup";

export const metadata: Metadata = { title: "Live Quiz · Momo Smart" };
export const dynamic = "force-dynamic";

/** Live Quiz: pick a class and a unit, then host the game on the projector. */
export default async function LiveQuizPage() {
  const classes = await api.live.setupOptions();

  return (
    <div className="mx-auto max-w-[900px] space-y-6">
      <PageHeader
        title="Live Quiz"
        subtitle="Play a unit's questions as a live game, like Kahoot. Show this on the projector; students answer on their phones from Momo Smart → Live Quiz. Faster correct answers earn more points, and every correct answer earns a star."
      />
      <LiveSetup classes={classes} />
    </div>
  );
}
