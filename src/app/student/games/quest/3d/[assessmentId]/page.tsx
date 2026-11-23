import { type Metadata } from "next";

import { Card, EmptyState } from "~/app/_components/ui";
import { api } from "~/trpc/server";
import { Battle3D } from "./battle-3d";

export const metadata: Metadata = { title: "3D Battle · Momo Smart" };
export const dynamic = "force-dynamic";

/** One unit's 3D Battle, on the unit's quest questions. */
export default async function Battle3DPage({
  params,
}: {
  params: Promise<{ assessmentId: string }>;
}) {
  const { assessmentId } = await params;
  const data = await api.game
    .questQuestions({ arena: { kind: "unit", id: assessmentId } })
    .catch(() => null);
  if (!data || data.questions.length === 0) {
    return (
      <Card className="mx-auto max-w-lg">
        <EmptyState>
          This battle isn&apos;t available. Pick a unit from Momo&apos;s Quest.
        </EmptyState>
      </Card>
    );
  }
  return (
    <Battle3D key={assessmentId} assessmentId={assessmentId} data={data} />
  );
}
