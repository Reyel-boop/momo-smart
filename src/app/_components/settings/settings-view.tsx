import Link from "next/link";

import { env } from "~/env";
import { humanise } from "~/app/_components/format";
import {
  BellIcon,
  LockIcon,
  SettingsIcon,
  UsersIcon,
} from "~/app/_components/icons";
import { PageHeader } from "~/app/_components/page-header";
import { Card, CardHeader } from "~/app/_components/ui";
import { logout } from "~/app/login/actions";
import { api } from "~/trpc/server";
import { EmailForm, PasswordForm, PhotoForm, ProfileForm } from "./forms";

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
        subtitle="Your profile, picture, email, account details and password."
      />

      <Card id="photo" className="scroll-mt-24">
        <CardHeader
          icon={<UsersIcon className="size-[18px]" />}
          title="Profile picture"
          subtitle="Shown beside your name in Momo"
        />
        <PhotoForm
          name={me.name ?? ""}
          image={me.image ?? null}
          locked={env.DEMO_MODE}
        />
      </Card>

      <Card id="email" className="scroll-mt-24">
        <CardHeader
          icon={<BellIcon className="size-[18px]" />}
          title="Email address"
          subtitle="For school updates and reminders; you can also sign in with it"
        />
        <EmailForm email={me.email ?? null} locked={env.DEMO_MODE} />
      </Card>

      <Card id="profile" className="scroll-mt-24">
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

      <Card id="password" className="scroll-mt-24">
        <CardHeader
          icon={<LockIcon className="size-[18px]" />}
          title="Password"
          subtitle="At least 8 characters"
        />
        <PasswordForm locked={env.DEMO_MODE} />
      </Card>

      <div className="text-muted flex flex-wrap items-center justify-between gap-3 text-sm">
        <span>
          <Link href="/privacy" className="hover:text-ink font-semibold">
            Privacy Policy
          </Link>
          {" · "}
          <Link
            href="/account/delete"
            className="font-semibold text-rose-600 hover:text-rose-700"
          >
            Delete my account
          </Link>
        </span>
        <form action={logout} className="flex justify-end">
          <button
            type="submit"
            className="border-line text-ink hover:bg-canvas rounded-xl border px-4 py-2.5 text-sm font-semibold transition"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
