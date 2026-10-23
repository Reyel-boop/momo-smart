import Link from "next/link";

import { longDate } from "~/app/_components/format";
import { CapIcon, CheckCircleIcon, UsersIcon } from "~/app/_components/icons";
import { PageHeader } from "~/app/_components/page-header";
import { Card, CardHeader } from "~/app/_components/ui";
import { api } from "~/trpc/server";

export const dynamic = "force-dynamic";

/** Admin home: the school at a glance and the setup steps. */
export default async function AdminHome() {
  const o = await api.admin.overview();
  const steps = [
    {
      done: o.teachers > 0,
      title: "Add your teachers",
      text: "Each teacher gets a temporary password to change at first sign-in.",
      href: "/admin/people?role=TEACHER",
    },
    {
      done: o.students > 0,
      title: "Add your students",
      text: "One at a time, or many at once from a CSV list.",
      href: "/admin/people?role=STUDENT",
    },
    {
      done: o.classes > 0,
      title: "Create classes",
      text: "Pick a course and a teacher. Its lessons, lectures and Unit Questions are ready immediately.",
      href: "/admin/classes",
    },
    {
      done: false,
      title: "Enroll students in classes",
      text: "Open a class and add its students.",
      href: "/admin/classes",
    },
  ];

  return (
    <div className="mx-auto max-w-[1100px] space-y-6">
      <PageHeader
        title="School overview"
        subtitle={
          o.term
            ? `${o.term.name} · ${longDate(o.term.startDate)} to ${longDate(o.term.endDate)}`
            : "No current term is set up."
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Teachers", o.teachers, "/admin/people?role=TEACHER"],
          ["Students", o.students, "/admin/people?role=STUDENT"],
          ["Classes this term", o.classes, "/admin/classes"],
          ["Courses", o.courses, "/admin/classes"],
        ].map(([label, value, href]) => (
          <Link key={label as string} href={href as string}>
            <Card className="hover:border-brand p-5 transition">
              <p className="text-muted text-[11px] font-bold tracking-wide uppercase">
                {label}
              </p>
              <p className="text-ink mt-1 text-3xl font-extrabold tabular-nums">
                {value}
              </p>
            </Card>
          </Link>
        ))}
      </div>

      {o.pendingFirstLogin > 0 && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
          {o.pendingFirstLogin} account{o.pendingFirstLogin === 1 ? "" : "s"}{" "}
          still {o.pendingFirstLogin === 1 ? "has" : "have"} a temporary
          password and {o.pendingFirstLogin === 1 ? "hasn't" : "haven't"} signed
          in yet.
        </p>
      )}

      <Card>
        <CardHeader
          icon={<CapIcon className="size-[18px]" />}
          title="Getting started"
          subtitle="Set up the school in four steps"
        />
        <ol className="divide-line divide-y">
          {steps.map((step, index) => (
            <li key={step.title}>
              <Link
                href={step.href}
                className="hover:bg-canvas flex items-start gap-4 px-5 py-4 transition"
              >
                <span
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${
                    step.done
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-brand-soft text-brand"
                  }`}
                >
                  {step.done ? (
                    <CheckCircleIcon className="size-4" />
                  ) : (
                    index + 1
                  )}
                </span>
                <span>
                  <span className="text-ink block text-sm font-bold">
                    {step.title}
                  </span>
                  <span className="text-muted block text-xs">{step.text}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </Card>

      <p className="text-muted flex items-center gap-2 text-xs">
        <UsersIcon className="size-4" />
        Teachers and students sign in at /login with their school email.
      </p>
    </div>
  );
}
