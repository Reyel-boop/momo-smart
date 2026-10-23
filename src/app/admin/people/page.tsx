import { type Metadata } from "next";
import Link from "next/link";

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
  searchParams: Promise<{ role?: string; q?: string }>;
}) {
  const params = await searchParams;
  const role = params.role === "TEACHER" ? "TEACHER" : "STUDENT";
  const query = params.q?.trim() ?? "";
  const [people, options, classes] = await Promise.all([
    api.admin.people({ role, query: query || undefined }),
    api.admin.options(),
    api.admin.classes(),
  ]);

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

      <Card className="overflow-hidden">
        <CardHeader
          icon={<UsersIcon className="size-[18px]" />}
          title={role === "TEACHER" ? "Teachers" : "Students"}
          subtitle={`${people.length} account${people.length === 1 ? "" : "s"}${query ? ` matching “${query}”` : ""}`}
        />
        {people.length === 0 ? (
          <EmptyState>
            {query
              ? "Nobody matches that search."
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
                  <th className="px-4 py-2.5">Classes</th>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-5 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-line divide-y">
                {people.map((person) => {
                  const name =
                    [person.title, person.name].filter(Boolean).join(" ") ||
                    "—";
                  return (
                    <tr
                      key={person.id}
                      className={person.isActive ? "" : "opacity-60"}
                    >
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
