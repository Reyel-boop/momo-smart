import { TRPCError } from "@trpc/server";
import { type Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PlusCircleIcon, UsersIcon } from "~/app/_components/icons";
import { PageHeader } from "~/app/_components/page-header";
import { Card, CardHeader, EmptyState } from "~/app/_components/ui";
import { api } from "~/trpc/server";
import { EnrollStudents, RemoveStudentButton } from "../class-forms";

export const metadata: Metadata = { title: "Class · Momo Smart" };
export const dynamic = "force-dynamic";

export default async function ClassPage({
  params,
}: {
  params: Promise<{ sectionId: string }>;
}) {
  const { sectionId } = await params;
  const detail = await load(sectionId);
  const teacher = [detail.teacher.user.title, detail.teacher.user.name]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="mx-auto max-w-[1200px] space-y-6">
      <nav aria-label="Breadcrumb" className="text-muted text-xs font-semibold">
        <Link href="/admin/classes" className="hover:text-ink">
          Classes
        </Link>{" "}
        › {detail.course.name} — {detail.code}
      </nav>
      <PageHeader
        title={`${detail.course.name} — ${detail.code}`}
        subtitle={`${teacher} · Period ${detail.period}${detail.room ? ` · ${detail.room}` : ""} · ${detail.enrollments.length} of ${detail.capacity} seats filled · Students can join with class code ${detail.joinCode}`}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="overflow-hidden">
          <CardHeader
            icon={<UsersIcon className="size-[18px]" />}
            title="Enrolled students"
            subtitle={`${detail.enrollments.length} student${detail.enrollments.length === 1 ? "" : "s"}`}
          />
          {detail.enrollments.length === 0 ? (
            <EmptyState>No students yet. Add them on the right.</EmptyState>
          ) : (
            <ul className="divide-line divide-y">
              {detail.enrollments.map(({ student }) => (
                <li
                  key={student.id}
                  className="flex items-center gap-3 px-5 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-ink truncate text-sm font-semibold">
                      {student.user.name}
                    </p>
                    <p className="text-muted text-xs">
                      {student.studentNumber} · Grade {student.gradeLevel}
                    </p>
                  </div>
                  <RemoveStudentButton
                    sectionId={detail.id}
                    studentId={student.id}
                    name={student.user.name ?? "this student"}
                  />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardHeader
            icon={<PlusCircleIcon className="size-[18px]" />}
            title="Add students"
            subtitle="Pick students and enroll them in this class"
          />
          <EnrollStudents
            sectionId={detail.id}
            candidates={detail.available.map((s) => ({
              id: s.id,
              name: s.user.name ?? "Student",
              studentNumber: s.studentNumber,
              gradeLevel: s.gradeLevel,
            }))}
          />
        </Card>
      </div>
    </div>
  );
}

async function load(sectionId: string) {
  try {
    return await api.admin.classDetail({ sectionId });
  } catch (error) {
    if (error instanceof TRPCError && error.code === "NOT_FOUND") notFound();
    throw error;
  }
}
