import { type Metadata } from "next";
import { redirect } from "next/navigation";

import { PageHeader } from "~/app/_components/page-header";
import { auth } from "~/server/auth";
import { NatManager } from "./nat-manager";

export const metadata: Metadata = { title: "CB-NAT Review · Momo Smart" };
export const dynamic = "force-dynamic";

/** The owner's CB-NAT question sets, shared by every school's Grade 10. */
export default async function NatAdminPage() {
  const session = await auth();
  if (!session?.user.isOwner) redirect("/admin");

  return (
    <div className="mx-auto max-w-[1200px] space-y-6">
      <PageHeader
        title="CB-NAT Review"
        subtitle="Practice tests for Grade 10 in every school. Fill in the question template, upload it, check the preview, then publish each test when it's ready."
      />
      <NatManager />
    </div>
  );
}
