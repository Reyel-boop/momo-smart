import { type Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Wordmark } from "~/app/_components/brand";
import { env } from "~/env";
import { auth } from "~/server/auth";
import { homeForRole } from "~/server/auth/home";
import { SignUpForm } from "./signup-form";

export const metadata: Metadata = {
  title: "Create an account · Momo Smart",
  description: "Create a Momo Smart teacher or student account.",
};

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; code?: string }>;
}) {
  const session = await auth();
  if (session?.user) redirect(homeForRole(session.user.role));
  const params = await searchParams;
  const role = params.role === "teacher" ? "TEACHER" : "STUDENT";

  return (
    <main className="bg-canvas flex min-h-screen flex-col items-center px-6 py-10">
      <div className="w-full max-w-md">
        <Wordmark label="Learning Management" />
      </div>
      <div className="flex w-full flex-1 items-center justify-center py-10">
        {env.DEMO_MODE ? (
          <div className="border-line bg-surface w-full max-w-md rounded-2xl border p-8 text-center">
            <h1 className="text-ink text-2xl font-extrabold">
              This is the public demo
            </h1>
            <p className="text-muted mt-2 text-sm">
              New accounts can&apos;t be created in the demo, because it resets
              every day. You can explore it as a teacher or a student instead.
            </p>
            <Link
              href="/demo"
              className="bg-navy hover:bg-navy-deep mt-6 inline-block rounded-xl px-5 py-3 text-sm font-semibold text-white"
            >
              Try the demo
            </Link>
          </div>
        ) : (
          <SignUpForm initialRole={role} initialCode={params.code ?? ""} />
        )}
      </div>
    </main>
  );
}
