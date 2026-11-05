import { type Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TRPCError } from "@trpc/server";

import { ClipboardIcon } from "~/app/_components/icons";
import { PageHeader } from "~/app/_components/page-header";
import { Card, CardHeader } from "~/app/_components/ui";
import { api } from "~/trpc/server";
import { AssignmentForm, type ClassOption } from "../../new/assignment-form";

export const metadata: Metadata = { title: "Edit Assignment · Momo Smart" };
export const dynamic = "force-dynamic";

async function loadAssignment(assignmentId: string) {
  try {
    return await api.assignment.get({ assignmentId });
  } catch (error) {
    if (
      error instanceof TRPCError &&
      (error.code === "NOT_FOUND" || error.code === "FORBIDDEN")
    ) {
      notFound();
    }
    throw error;
  }
}

export default async function EditAssignmentPage({
  params,
}: {
  params: Promise<{ assignmentId: string }>;
}) {
  const { assignmentId } = await params;
  const [assignment, subjects] = await Promise.all([
    loadAssignment(assignmentId),
    api.course.teachingUnits(),
  ]);
  const { section } = assignment;
  const subject = subjects.find((s) => s.id === section.course.id);
  // The list of a teacher's subjects is the check that this class is theirs.
  if (!subject) notFound();

  const classes: ClassOption[] = [
    {
      id: section.id,
      label: `${section.course.name} — ${section.code}`,
      units: subject.units.map((unit) => ({ id: unit.id, label: unit.title })),
    },
  ];

  return (
    <div className="mx-auto max-w-[900px] space-y-6">
      <Link
        href={`/teacher/assignments?section=${section.id}`}
        className="text-brand text-sm font-semibold hover:underline"
      >
        ← Assignments
      </Link>
      <PageHeader
        title="Edit Assignment"
        subtitle={
          assignment.publishedAt
            ? "Students see your changes as soon as you save."
            : "This is a draft. Students can't see it until you publish it."
        }
      />
      <Card>
        <CardHeader
          icon={<ClipboardIcon className="size-[18px]" />}
          title="Assignment details"
        />
        <AssignmentForm
          classes={classes}
          initialSectionId={section.id}
          existing={{
            id: assignment.id,
            unitId: assignment.unit?.id ?? "",
            title: assignment.title,
            description: assignment.description ?? "",
            type: assignment.type,
            format: assignment.format,
            pointsPossible: assignment.pointsPossible,
            dueAt: assignment.dueAt.toISOString(),
            allowLate: assignment.allowLate,
            isPublished: !!assignment.publishedAt,
            submitted: assignment._count.submissions,
          }}
        />
      </Card>
    </div>
  );
}
