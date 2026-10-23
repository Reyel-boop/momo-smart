import { type Metadata } from "next";
import Link from "next/link";

import { CapIcon } from "~/app/_components/icons";
import { PageHeader } from "~/app/_components/page-header";
import { Card, CardHeader, EmptyState } from "~/app/_components/ui";
import { api } from "~/trpc/server";
import { NewClassButton } from "./class-forms";

export const metadata: Metadata = { title: "Classes · Momo Smart" };
export const dynamic = "force-dynamic";

export default async function ClassesPage() {
  const [classes, options] = await Promise.all([
    api.admin.classes(),
    api.admin.options(),
  ]);

  return (
    <div className="mx-auto max-w-[1200px] space-y-6">
      <PageHeader
        title="Classes"
        subtitle={`${options.term?.name ?? "No current term"} · A class is one course taught by one teacher to one section. Its lessons and Unit Questions are ready as soon as it's created.`}
        action={
          <NewClassButton
            courses={options.courses.map((c) => ({
              id: c.id,
              label: `${c.code} — ${c.name}`,
            }))}
            teachers={options.teachers.map((t) => ({
              id: t.id,
              label: [t.user.title, t.user.name].filter(Boolean).join(" "),
            }))}
          />
        }
      />

      <Card className="overflow-hidden">
        <CardHeader
          icon={<CapIcon className="size-[18px]" />}
          title="This term's classes"
          subtitle={`${classes.length} class${classes.length === 1 ? "" : "es"}`}
        />
        {classes.length === 0 ? (
          <EmptyState>
            No classes yet. Add your teachers, then create a class for each
            course and section they teach.
          </EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-canvas text-muted text-[11px] font-bold tracking-wide uppercase">
                <tr>
                  <th className="px-5 py-2.5">Course</th>
                  <th className="px-4 py-2.5">Section</th>
                  <th className="px-4 py-2.5">Class code</th>
                  <th className="px-4 py-2.5">Teacher</th>
                  <th className="px-4 py-2.5">Period / room</th>
                  <th className="px-5 py-2.5 text-right">Students</th>
                </tr>
              </thead>
              <tbody className="divide-line divide-y">
                {classes.map((c) => (
                  <tr key={c.id} className="hover:bg-canvas">
                    <td className="px-5 py-3">
                      <Link
                        href={`/admin/classes/${c.id}`}
                        className="text-ink font-semibold hover:underline"
                      >
                        {c.course.name}
                      </Link>
                      <p className="text-muted text-xs">{c.course.code}</p>
                    </td>
                    <td className="text-ink px-4 py-3">{c.code}</td>
                    <td className="text-ink px-4 py-3 font-mono font-bold tracking-wider">
                      {c.joinCode}
                    </td>
                    <td className="text-muted px-4 py-3">
                      {[c.teacher.user.title, c.teacher.user.name]
                        .filter(Boolean)
                        .join(" ")}
                    </td>
                    <td className="text-muted px-4 py-3">
                      Period {c.period}
                      {c.room ? ` · ${c.room}` : ""}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        href={`/admin/classes/${c.id}`}
                        className="text-brand font-bold hover:underline"
                      >
                        {c._count.enrollments} / {c.capacity}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
