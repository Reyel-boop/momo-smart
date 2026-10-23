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

export default async function StudentSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const query = ((await searchParams).q ?? "").trim().slice(0, 80);
  let groups: SearchGroup[] = [];

  if (query) {
    const [sections, assignments] = await Promise.all([
      api.course.mySections(),
      api.assignment.mine(),
    ]);
    const syllabi = await Promise.all(
      sections.map(async (section) => ({
        section,
        units: await api.course.syllabus({ courseId: section.course.id }),
      })),
    );

    groups = [
      {
        title: "Courses",
        items: sections
          .filter((s) => matches(query, s.course.name, s.course.code))
          .map((s) => ({
            id: s.id,
            title: s.course.name,
            detail: `${s.course.code} · Period ${s.period}`,
            href: `/student/courses?course=${s.course.id}`,
          })),
      },
      {
        title: "Lessons",
        items: syllabi
          .flatMap(({ section, units }) =>
            units.flatMap((unit) =>
              unit.lessons
                .filter((lesson) =>
                  matches(query, lesson.title, lesson.summary, unit.title),
                )
                .map((lesson) => ({
                  id: lesson.id,
                  title: `Lesson ${unit.order}.${lesson.order}: ${lesson.title}`,
                  detail: `${section.course.name} · ${unit.title}`,
                  href: `/student/courses?lesson=${lesson.id}`,
                })),
            ),
          )
          .slice(0, LIMIT),
      },
      {
        title: "Assignments",
        items: assignments
          .filter((a) => matches(query, a.title, a.description))
          .slice(0, LIMIT)
          .map((a) => ({
            id: a.id,
            title: a.title,
            detail: `${a.section.course.name} · Due ${a.dueAt.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
            href: "/student/assignments",
          })),
      },
    ];
  }

  return (
    <SearchResults
      action="/student/search"
      query={query}
      groups={groups}
      placeholder="Search courses, lessons, assignments…"
    />
  );
}
