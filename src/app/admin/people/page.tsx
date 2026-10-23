import { type Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";

import { timeAgo } from "~/app/_components/format";
import { SearchIcon, UsersIcon } from "~/app/_components/icons";
import { PageHeader } from "~/app/_components/page-header";
import { Card, CardHeader, EmptyState, Pill } from "~/app/_components/ui";
import { Sf1Upload } from "~/app/_components/sf1-upload";
import { api } from "~/trpc/server";
import {
  AddPersonButton,
  ImportStudentsButton,
  PersonActions,
} from "./people-actions";

export const metadata: Metadata = { title: "People · Momo Smart" };
export const dynamic = "force-dynamic";
// Importing a class list hashes a password per student.
export const maxDuration = 60;

export default async function PeoplePage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; q?: string; section?: string }>;
}) {
  const params = await searchParams;
  const role = params.role === "TEACHER" ? "TEACHER" : "STUDENT";
  const query = params.q?.trim() ?? "";
  const section = role === "STUDENT" ? (params.section?.trim() ?? "") : "";
  const [found, options, classes] = await Promise.all([
    api.admin.people({
      role,
      query: query || undefined,
      section: section || undefined,
    }),
    api.admin.options(),
    api.admin.classes(),
  ]);

  // Students are listed by section (e.g. "Rizal"), then by name. A student
  // in classes of several sections is listed under the first of them.
  const sections = [...new Set(classes.map((c) => c.code))].sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true }),
  );
  const sectionsOf = (person: (typeof found)[number]) =>
    [
      ...new Set(
        person.studentProfile?.enrollments.map((e) => e.section.code) ?? [],
      ),
    ].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  const groupOf = (person: (typeof found)[number]) =>
    sectionsOf(person)[0] ?? "";
  const people =
    role === "STUDENT"
      ? [...found].sort(
          (a, b) =>
            Number(!groupOf(a)) - Number(!groupOf(b)) ||
            groupOf(a).localeCompare(groupOf(b), undefined, {
              numeric: true,
            }) ||
            Number(b.isActive) - Number(a.isActive) ||
            (a.name ?? "").localeCompare(b.name ?? ""),
        )
      : found;
  const grouped = role === "STUDENT" && !section;
  const sectionHref = (value: string) => {
    const search = new URLSearchParams({ role });
    if (query) search.set("q", query);
    if (value) search.set("section", value);
    return `/admin/people?${search.toString()}`;
  };
  const chip = (value: string, label: string) => (
    <Link
      key={value || "all"}
      href={sectionHref(value)}
      aria-current={section === value ? "page" : undefined}
      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
        section === value
          ? "bg-brand text-white"
          : "border-line bg-surface text-ink hover:bg-canvas border"
      }`}
    >
      {label}
    </Link>
  );

  const tab = (value: "STUDENT" | "TEACHER", label: string) => (
    <Link
      href={`/admin/people?role=${value}`}
      aria-current={role === value ? "page" : undefined}
      className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
        role === value
          ? "bg-navy text-white"
          : "border-line bg-surface text-ink hover:bg-canvas border"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <div className="mx-auto max-w-[1200px] space-y-6">
      <PageHeader
        title="People"
        subtitle="Add teachers and students. Each new account gets a temporary password they change the first time they sign in."
        action={
          <>
            {role === "STUDENT" && (
              <Sf1Upload
                classes={classes.map((c) => ({
                  id: c.id,
                  label: `${c.course.name} — ${c.code}`,
                }))}
                allowNoClass
                mode="admin"
                buttonClassName="bg-brand hover:bg-brand/90 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition"
              />
            )}
            {role === "STUDENT" && (
              <ImportStudentsButton
                classes={classes.map((c) => ({
                  id: c.id,
                  label: `${c.course.name} — ${c.code}`,
                }))}
              />
            )}
            <AddPersonButton role={role} departments={options.departments} />
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        {tab("STUDENT", "Students")}
        {tab("TEACHER", "Teachers")}
        <form
          action="/admin/people"
          className="relative ml-auto w-full max-w-xs"
        >
          <input type="hidden" name="role" value={role} />
          {section && <input type="hidden" name="section" value={section} />}
          <SearchIcon className="text-muted absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <label htmlFor="people-q" className="sr-only">
            Search
          </label>
          <input
            id="people-q"
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Name, email or number…"
            className="border-line bg-surface text-ink placeholder:text-muted focus:border-brand focus:ring-brand/10 w-full rounded-xl border py-2.5 pr-4 pl-9 text-sm transition outline-none focus:ring-4"
          />
        </form>
      </div>

      {role === "STUDENT" && sections.length > 0 && (
        <nav
          aria-label="Filter by section"
          className="flex flex-wrap items-center gap-2"
        >
          <span className="text-muted mr-1 text-xs font-bold">Section</span>
          {chip("", "All")}
          {sections.map((code) => chip(code, code))}
          {chip("none", "No section")}
        </nav>
      )}

      <Card className="overflow-hidden">
        <CardHeader
          icon={<UsersIcon className="size-[18px]" />}
          title={role === "TEACHER" ? "Teachers" : "Students"}
          subtitle={`${people.length} account${people.length === 1 ? "" : "s"}${
            section === "none"
              ? " in no section"
              : section
                ? ` in section ${section}`
                : ""
          }${query ? ` matching “${query}”` : ""}`}
        />
        {people.length === 0 ? (
          <EmptyState>
            {query
              ? "Nobody matches that search."
              : section
                ? "No students in this section."
                : role === "TEACHER"
                  ? "No teachers yet. Use Add teacher to create the first account."
                  : "No students yet. Add them one at a time or import a CSV list."}
          </EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-canvas text-muted text-[11px] font-bold tracking-wide uppercase">
                <tr>
                  <th className="px-5 py-2.5">Name</th>
                  <th className="px-4 py-2.5">
                    {role === "TEACHER" ? "Employee no." : "Student no."}
                  </th>
                  <th className="px-4 py-2.5">
                    {role === "TEACHER" ? "Department" : "Grade"}
                  </th>
                  {role === "STUDENT" && (
                    <th className="px-4 py-2.5">Section</th>
                  )}
                  <th className="px-4 py-2.5">Classes</th>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-5 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-line divide-y">
                {people.map((person, index) => {
                  const name =
                    [person.title, person.name].filter(Boolean).join(" ") ||
                    "—";
                  const group = groupOf(person);
                  const groupSize = people.filter(
                    (p) => groupOf(p) === group,
                  ).length;
                  const startsGroup =
                    grouped &&
                    (index === 0 || groupOf(people[index - 1]!) !== group);
                  return (
                    <Fragment key={person.id}>
                      {startsGroup && (
                        <tr className="bg-canvas/60">
                          <th
                            colSpan={7}
                            scope="rowgroup"
                            className="text-ink px-5 py-2 text-xs font-extrabold"
                          >
                            {group ? `Section ${group}` : "No section yet"}
                            <span className="text-muted ml-2 font-semibold">
                              {groupSize} student{groupSize === 1 ? "" : "s"}
                            </span>
                          </th>
                        </tr>
                      )}
                      <tr className={person.isActive ? "" : "opacity-60"}>
                        <td className="px-5 py-3">
                          <p className="text-ink font-semibold">{name}</p>
                          <p className="text-muted text-xs">
                            {person.email ?? "Signs in with LRN"}
                          </p>
                        </td>
                        <td className="text-muted px-4 py-3">
                          {person.studentProfile?.studentNumber ??
                            person.teacherProfile?.employeeNumber ??
                            "—"}
                        </td>
                        <td className="text-muted px-4 py-3">
                          {person.studentProfile
                            ? `Grade ${person.studentProfile.gradeLevel}`
                            : (person.teacherProfile?.department?.name ?? "—")}
                        </td>
                        {role === "STUDENT" && (
                          <td className="text-muted px-4 py-3">
                            {sectionsOf(person).join(", ") || "—"}
                          </td>
                        )}
                        <td className="text-muted px-4 py-3">
                          {person.studentProfile?._count.enrollments ??
                            person.teacherProfile?._count.sections ??
                            0}
                        </td>
                        <td className="px-4 py-3">
                          {!person.isActive ? (
                            <Pill tone="slate">Turned off</Pill>
                          ) : person.mustChangePassword ? (
                            <Pill tone="amber">Not signed in yet</Pill>
                          ) : (
                            <Pill tone="green">
                              Active
                              {person.lastLoginAt &&
                                ` · ${timeAgo(person.lastLoginAt)}`}
                            </Pill>
                          )}
                        </td>
                        <td className="px-5 py-3">
                          <PersonActions
                            userId={person.id}
                            name={name}
                            email={
                              person.email ??
                              person.studentProfile?.studentNumber ??
                              ""
                            }
                            active={person.isActive}
                          />
                        </td>
                      </tr>
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
