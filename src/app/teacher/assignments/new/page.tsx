import { type Metadata } from "next";

import { ClipboardIcon } from "~/app/_components/icons";
import { PageHeader } from "~/app/_components/page-header";
import { Card, CardHeader, EmptyState } from "~/app/_components/ui";
import { api } from "~/trpc/server";
import { AssignmentForm, type ClassOption } from "./assignment-form";

export const metadata: Metadata = { title: "New Assignment · Momo Smart" };
export const dynamic = "force-dynamic";

export default async function NewAssignmentPage({
  searchParams,
}: {
  searchParams: Promise<{ section?: string }>;
}) {
  const { section } = await searchParams;
  const [sections, subjects] = await Promise.all([
    api.course.mySections(),
    api.course.teachingUnits(),
  ]);
  const classes: ClassOption[] = sections.map((s) => ({
    id: s.id,
    label: `${s.course.name} — ${s.code}`,
    units:
      subjects
        .find((subject) => subject.id === s.course.id)
        ?.units.map((unit) => ({ id: unit.id, label: unit.title })) ?? [],
  }));
  const initial = classes.find((c) => c.id === section)?.id ?? classes[0]?.id;

  return (
    <div className="mx-auto max-w-[900px] space-y-6">
      <PageHeader
        title="New Assignment"
        subtitle="Publish it now so students see it on their dashboard, or save a draft to finish later."
      />
      <Card>
        <CardHeader
          icon={<ClipboardIcon className="size-[18px]" />}
          title="Assignment details"
        />
        {initial ? (
          <AssignmentForm classes={classes} initialSectionId={initial} />
        ) : (
          <EmptyState>You have no class sections to assign work to.</EmptyState>
        )}
      </Card>
    </div>
  );
}
