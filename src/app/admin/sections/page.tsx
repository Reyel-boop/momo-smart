import { type Metadata } from "next";

import { PageHeader } from "~/app/_components/page-header";
import { api } from "~/trpc/server";
import { SectionsManager } from "./sections-manager";

export const metadata: Metadata = { title: "Sections · Momo Smart" };
export const dynamic = "force-dynamic";

export default async function SectionsPage() {
  const sections = await api.admin.sections();

  return (
    <div className="mx-auto max-w-[1200px] space-y-6">
      <PageHeader
        title="Sections"
        subtitle="The sections (homerooms) students belong to, like Grade 10 — Rizal. Uploading a School Form 1 adds its section automatically."
      />
      <SectionsManager
        sections={sections.map((s) => ({
          id: s.id,
          name: s.name,
          gradeLevel: s.gradeLevel,
          students: s._count.students,
        }))}
      />
    </div>
  );
}
