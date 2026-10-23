import { env } from "~/env";
import { humanise } from "~/app/_components/format";
import { LockIcon, SettingsIcon, UsersIcon } from "~/app/_components/icons";
import { PageHeader } from "~/app/_components/page-header";
import { Card, CardHeader } from "~/app/_components/ui";
import { logout } from "~/app/login/actions";
import { api } from "~/trpc/server";
import { PasswordForm, ProfileForm } from "./forms";

/** The Settings page for either portal: profile, account details, password. */
export async function SettingsView() {
  const me = await api.user.me();
  const isTeacher = me.role === "TEACHER";
  const student = me.studentProfile;
  const teacher = me.teacherProfile;

  const details: Array<[string, string]> = [
    ["Email", me.email ?? "—"],
    ["Role", humanise(me.role)],
    ...(student
      ? ([
          ["Student number", student.studentNumber],
          ["Grade level", `Grade ${student.gradeLevel}`],
          ["Expected graduation", `${student.graduationYear}`],
        ] as Array<[string, string]>)
      : []),
    ...(teacher
      ? ([
          ["Employee number", teacher.employeeNumber ?? "—"],
          ["Department", teacher.department?.name ?? "—"],
        ] as Array<[string, string]>)
      : []),
  ];

  return (
    <div className="mx-auto max-w-[900px] space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Your profile, account details and password."
      />

      <Card>
        <CardHeader
          icon={<SettingsIcon className="size-[18px]" />}
          title="Profile"
          subtitle={
            isTeacher
              ? "How students and parents see you"
              : "How your teachers and classmates see you"
          }
        />
        <ProfileForm
          name={me.name ?? ""}
          title={me.title ?? ""}
          officeLocation={teacher?.officeLocation ?? ""}
          bio={teacher?.bio ?? ""}
          isTeacher={isTeacher}
        />
      </Card>

      <Card>
        <CardHeader
          icon={<UsersIcon className="size-[18px]" />}
          title="Account"
          subtitle="Managed by the school registrar"
        />
        <dl className="divide-line divide-y">
          {details.map(([term, value]) => (
            <div key={term} className="flex justify-between gap-4 px-5 py-3">
              <dt className="text-muted text-sm">{term}</dt>
              <dd className="text-ink text-sm font-semibold">{value}</dd>
            </div>
          ))}
        </dl>
      </Card>

      <Card>
        <CardHeader
          icon={<LockIcon className="size-[18px]" />}
          title="Password"
          subtitle="At least 8 characters"
        />
        <PasswordForm locked={env.DEMO_MODE} />
      </Card>

      <form action={logout} className="flex justify-end">
        <button
          type="submit"
          className="border-line text-ink hover:bg-canvas rounded-xl border px-4 py-2.5 text-sm font-semibold transition"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}
