import { type Metadata } from "next";
import Link from "next/link";

import { LockIcon } from "~/app/_components/icons";
import { Card } from "~/app/_components/ui";
import { api } from "~/trpc/server";
import { Battle } from "../../[assessmentId]/battle";

export const metadata: Metadata = { title: "Boss Level · Momo Smart" };
export const dynamic = "force-dynamic";

/** A class's Boss Level: the Shadow Dragon, with every unit's questions. */
export default async function BossLevelPage({
  params,
}: {
  params: Promise<{ sectionId: string }>;
}) {
  const { sectionId } = await params;
  const arena = { kind: "boss" as const, id: sectionId };
  let message: string | null = null;
  const data = await api.game.questQuestions({ arena }).catch((e: unknown) => {
    message =
      e instanceof Error ? e.message : "This Boss Level isn't available.";
    return null;
  });
  if (!data || data.questions.length === 0) {
    return (
      <Card className="mx-auto max-w-lg px-6 py-10 text-center">
        <LockIcon className="text-muted mx-auto size-10" />
        <p className="text-ink mt-3 text-lg font-extrabold">
          Boss Level locked
        </p>
        <p className="text-muted mt-1 text-sm">
          {message ?? "This Boss Level isn't available."}
        </p>
        <Link
          href="/student/games/quest"
          className="bg-navy mt-5 inline-flex rounded-lg px-4 py-2 text-sm font-bold text-white"
        >
          Back to quests
        </Link>
      </Card>
    );
  }
  return <Battle key={sectionId} arena={arena} data={data} />;
}
