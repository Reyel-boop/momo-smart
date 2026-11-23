import { type Metadata } from "next";
import { redirect } from "next/navigation";

import { PageHeader } from "~/app/_components/page-header";
import { auth } from "~/server/auth";
import { api } from "~/trpc/server";
import { SponsorsManager } from "./sponsors-manager";

export const metadata: Metadata = { title: "Sponsors · Momo Smart" };
export const dynamic = "force-dynamic";

/** The Momo owner's sponsor cards: the switch, each card and its numbers. */
export default async function SponsorsPage() {
  const session = await auth();
  if (!session?.user.isOwner) redirect("/admin");
  const data = await api.sponsor.list();

  return (
    <div className="mx-auto max-w-[1200px] space-y-6">
      <PageHeader
        title="Sponsors"
        subtitle="Short educational messages from sponsors, shown to students on the results screen after they finish Unit Questions. Every card is labeled “Sponsored”."
      />
      <SponsorsManager data={data} />
    </div>
  );
}
