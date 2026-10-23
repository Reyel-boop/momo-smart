import { type Metadata } from "next";
import Link from "next/link";

import { UsersIcon } from "~/app/_components/icons";
import { PageHeader, SectionTabs } from "~/app/_components/page-header";
import {
  Avatar,
  Card,
  CardHeader,
  EmptyState,
  Pill,
} from "~/app/_components/ui";
import { Sf1Upload } from "~/app/_components/sf1-upload";
import { api } from "~/trpc/server";

export const metadata: Metadata = { title: "Roster · Momo Smart" };
export const dynamic = "force-dynamic";
// Uploading School Form 1 hashes a password per new student.
export const maxDuration = 60;

const gradeTone = (percent: number | null) =>
  percent == null
    ? "slate"
    : percent >= 90
      ? "green"
      : percent >= 75
        ? "blue"
        : percent >= 70
          ? "amber"
          : "rose";

/** Master roster: every student in each of the teacher's sections. */
export default async function RosterPage({
  searchParams,
}: {
  searchParams: Promise<{ section?: string }>;
}) {
  const { section: sectionParam } = await searchParams;
  const sections = await api.course.mySections();
  const activeId =
    sectionParam && sections.some((s) => s.id === sectionParam)
      ? sectionParam
      : null;
  const visible = activeId
    ? sections.filter((s) => s.id === activeId)
    : sections;
  const rosters = await Promise.all(
    visible.map(async (section) => ({
      section,
      roster: await api.course.roster({ sectionId: section.id }),
    })),
  );
  const studentCount = new Set(
    rosters.flatMap(({ roster }) => roster.map((e) => e.student.id)),
  ).size;

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <PageHeader
        title="Roster"
        subtitle={`${studentCount} student${studentCount === 1 ? "" : "s"} across ${visible.length} class section${visible.length === 1 ? "" : "s"}. Open a student to see their grades, attendance and family contacts.`}
        action={
          sections.length > 0 && (
            <Sf1Upload
              classes={(activeId
                ? sections.filter((s) => s.id === activeId)
                : sections
              ).map((s) => ({
                id: s.id,
                label: `${s.course.name} — ${s.code}`,
              }))}
              allowNoClass={false}
              mode="teacher"
              buttonClassName="bg-navy hover:bg-navy-deep rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition"
            />
          )
        }
      />
      <SectionTabs
        sections={sections.map((s) => ({
          id: s.id,
          label: `${s.course.name} — ${s.code}`,
        }))}
        activeId={activeId}
        basePath="/teacher/roster"
        allLabel="All sections"
      />

      {rosters.length === 0 ? (
        <Card>
          <EmptyState>You have no class sections this term.</EmptyState>
        </Card>
      ) : (
        rosters.map(({ section, roster }) => (
          <Card key={section.id} className="overflow-hidden">
            <CardHeader
              icon={<UsersIcon className="size-[18px]" />}
              title={`${section.course.name} — ${section.code}`}
              subtitle={`Period ${section.period}${section.room ? ` · ${section.room}` : ""} · ${roster.length} student${roster.length === 1 ? "" : "s"}`}
            />
            {roster.length === 0 ? (
              <EmptyState>
                No students yet. Use Upload School Form 1, or share the class
                code {section.joinCode} with your students.
              </EmptyState>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-canvas text-muted text-[11px] font-bold tracking-wide uppercase">
                    <tr>
                      <th className="px-5 py-2.5">Student</th>
                      <th className="px-4 py-2.5">Number</th>
                      <th className="px-4 py-2.5">Grade</th>
                      <th className="px-4 py-2.5">Lessons done</th>
                      <th className="px-5 py-2.5 text-right">Current</th>
                    </tr>
                  </thead>
                  <tbody className="divide-line divide-y">
                    {roster.map((enrollment) => (
                      <tr key={enrollment.id} className="hover:bg-canvas">
                        <td className="px-5 py-3">
                          <Link
                            href={`/teacher/students/${enrollment.student.id}`}
                            className="flex items-center gap-3"
                          >
                            <Avatar
                              name={enrollment.student.user.name}
                              size="sm"
                            />
                            <span className="text-ink font-semibold hover:underline">
                              {enrollment.student.user.name}
                            </span>
                          </Link>
                        </td>
                        <td className="text-muted px-4 py-3">
                          {enrollment.student.studentNumber}
                        </td>
                        <td className="text-muted px-4 py-3">
                          Grade {enrollment.student.gradeLevel}
                        </td>
                        <td className="text-muted px-4 py-3">
                          {Math.round(enrollment.syllabusPercent ?? 0)}%
                        </td>
                        <td className="px-5 py-3 text-right">
                          <Pill tone={gradeTone(enrollment.currentPercent)}>
                            {enrollment.currentPercent != null
                              ? `${Math.round(enrollment.currentPercent * 10) / 10}%${enrollment.currentLetter ? ` ${enrollment.currentLetter}` : ""}`
                              : "No grade"}
                          </Pill>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        ))
      )}
    </div>
  );
}
