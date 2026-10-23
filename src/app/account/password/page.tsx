import { type Metadata } from "next";
import { redirect } from "next/navigation";

import { Wordmark } from "~/app/_components/brand";
import { logout } from "~/app/login/actions";
import { auth } from "~/server/auth";
import { homeForRole } from "~/server/auth/home";
import { FirstPasswordForm } from "./first-password-form";

export const metadata: Metadata = {
  title: "Choose your password · Momo Smart",
};
export const dynamic = "force-dynamic";

/**
 * Shown after signing in with a temporary password from the registrar: the
 * user must choose their own password before using the app.
 */
export default async function ChoosePasswordPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!session.user.mustChangePassword) {
    redirect(homeForRole(session.user.role));
  }

  return (
    <main className="bg-canvas flex min-h-screen items-center justify-center p-4">
      <div className="border-line bg-surface shadow-card w-full max-w-md space-y-6 rounded-2xl border p-8">
        <Wordmark label="Learning Management" />
        <div>
          <h1 className="text-ink text-2xl font-extrabold">
            Choose your password
          </h1>
          <p className="text-muted mt-1 text-sm">
            Welcome{session.user.name ? `, ${session.user.name}` : ""}! You
            signed in with a temporary password from the school. Choose your own
            password to continue — at least 8 characters, and don&apos;t share
            it.
          </p>
        </div>
        <FirstPasswordForm home={homeForRole(session.user.role)} />
        <form action={logout}>
          <button
            type="submit"
            className="text-muted hover:text-ink text-xs font-semibold"
          >
            Sign out
          </button>
        </form>
      </div>
    </main>
  );
}
