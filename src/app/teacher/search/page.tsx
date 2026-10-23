import { type Metadata } from "next";

import {
  matches,
  SearchResults,
  type SearchGroup,
} from "~/app/_components/search-results";
import { api } from "~/trpc/server";

export const metadata: Metadata = { title: "Search · Momo Smart" };
export const dynamic = "force-dynamic";

const LIMIT = 25;

export default async function TeacherSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const query = ((await searchParams).q ?? "").trim().slice(0, 80);
  let groups: SearchGroup[] = [];

  if (query) {
    const [students, sections, subjects] = await Promise.all([
      api.user.searchStudents({ query, limit: LIMIT }),
      api.course.mySections(),
      api.course.teachingUnits(),
    ]);
    const assignments = (
      await Promise.all(
        sections.map(async (section) =>
          (await api.assignment.listForSection({ sectionId: section.id })).map(
            (assignment) => ({ ...assignment, section }),
          ),
        ),
      )
    ).flat();

    groups = [
      {
        title: "Students",
        items: students.map((student) => ({
          id: student.id,
          title: student.user.name ?? "Student",
          detail: `${student.studentNumber} · Grade ${student.gradeLevel}`,
          href: `/teacher/students/${student.id}`,
        })),
      },
      {
        title: "Assignments",
        items: assignments
          .filter((a) => matches(query, a.title, a.description))
          .slice(0, LIMIT)
          .map((a) => ({
            id: a.id,
            title: a.title,
            detail: `${a.section.course.name} — ${a.section.code} · Due ${a.dueAt.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
            href: `/teacher/assignments?section=${a.section.id}`,
          })),
      },
      {
        title: "Lessons",
        items: subjects
          .flatMap((subject) =>
            subject.units.flatMap((unit) =>
              unit.lessons
                .filter((lesson) =>
                  matches(query, lesson.title, lesson.summary, unit.title),
                )
                .map((lesson) => ({
                  id: lesson.id,
                  title: `${unit.order}.${lesson.order} ${lesson.title}`,
                  detail: `${subject.name} · ${unit.title}`,
                  href: `/teacher/courses?subject=${subject.id}`,
                })),
            ),
          )
          .slice(0, LIMIT),
      },
    ];
  }

  return (
    <SearchResults
      action="/teacher/search"
      query={query}
      groups={groups}
      placeholder="Search students, assignments, lessons…"
    />
  );
}
