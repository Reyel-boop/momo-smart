import { type Metadata } from "next";
import { redirect } from "next/navigation";

import { PageHeader } from "~/app/_components/page-header";
import { auth } from "~/server/auth";
import { api } from "~/trpc/server";
import { SchoolsManager } from "./schools-manager";

export const metadata: Metadata = { title: "Schools · Momo Smart" };
export const dynamic = "force-dynamic";

/** The Momo owner's list of schools. */
export default async function SchoolsPage() {
  const session = await auth();
  if (!session?.user.isOwner) redirect("/admin");
  const schools = await api.school.list();

  return (
    <div className="mx-auto max-w-[1200px] space-y-6">
      <PageHeader
        title="Schools"
        subtitle="Every school on Momo. Each school's sections, people and classes are kept apart; open a school to manage it."
      />
      <SchoolsManager schools={schools} />
    </div>
  );
}
