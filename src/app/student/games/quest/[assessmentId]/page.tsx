import { type Metadata } from "next";

import { Card, EmptyState } from "~/app/_components/ui";
import { api } from "~/trpc/server";
import { Battle } from "./battle";

export const metadata: Metadata = { title: "Momo's Quest · Momo Smart" };
export const dynamic = "force-dynamic";

/** One unit's quest. */
export default async function QuestBattlePage({
  params,
}: {
  params: Promise<{ assessmentId: string }>;
}) {
  const { assessmentId } = await params;
  const arena = { kind: "unit" as const, id: assessmentId };
  const data = await api.game.questQuestions({ arena }).catch(() => null);
  if (!data || data.questions.length === 0) {
    return (
      <Card className="mx-auto max-w-lg">
        <EmptyState>
          This quest isn&apos;t available. Pick another from Momo&apos;s Quest.
        </EmptyState>
      </Card>
    );
  }
  return <Battle key={assessmentId} arena={arena} data={data} />;
}
