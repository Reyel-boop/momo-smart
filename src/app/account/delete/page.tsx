import { type Metadata } from "next";
import Link from "next/link";

import { Wordmark } from "~/app/_components/brand";
import { auth } from "~/server/auth";
import { homeForRole } from "~/server/auth/home";
import { db } from "~/server/db";
import { env } from "~/env";
import { DeletionRequest } from "./deletion-request";

export const metadata: Metadata = {
  title: "Delete your account · Momo Smart",
  description: "How to ask for your Momo Smart account and data to be deleted.",
};
export const dynamic = "force-dynamic";

/**
 * How to delete a Momo account (required by Google Play): signed-in people
 * ask here, and their school's admin completes the deletion. Works on the
 * website and inside the Android app.
 */
export default async function DeleteAccountPage() {
  const session = await auth();
  const user = session?.user
    ? await db.user.findUnique({
        where: { id: session.user.id },
        select: {
          name: true,
          deletionRequestedAt: true,
          school: { select: { name: true } },
        },
      })
    : null;

  return (
    <main className="bg-canvas flex min-h-screen items-center justify-center p-4">
      <div className="border-line bg-surface shadow-card w-full max-w-lg space-y-5 rounded-2xl border p-8">
        <Wordmark label="Learning Management" />
        <div>
          <h1 className="text-ink text-2xl font-extrabold">
            Delete your account
          </h1>
          <p className="text-muted mt-1 text-sm">
            You can ask for your Momo Smart account and its data to be deleted
            at any time.
          </p>
        </div>

        <div className="text-ink space-y-2 text-sm">
          <p className="font-bold">What gets deleted</p>
          <ul className="text-muted list-disc space-y-1 pl-5">
            <li>Your account: name, email or LRN, and password.</li>
            <li>
              Your work in Momo: answers, quiz and game results, stars,
              submissions, notes and messages you sent.
            </li>
            <li>Your class enrollments and section (homeroom).</li>
          </ul>
          <p className="text-muted">
            Your school admin deletes the account within 30 days of your
            request. Official school records that your school must keep (such as
            report card grades held by the school itself) are kept by the
            school, not by Momo.
          </p>
        </div>

        {user ? (
          <DeletionRequest
            name={user.name ?? "your account"}
            school={user.school?.name ?? null}
            requestedAt={user.deletionRequestedAt}
            home={homeForRole(session!.user.role)}
            isOwner={session!.user.isOwner}
          />
        ) : (
          <div className="bg-canvas space-y-3 rounded-xl p-4 text-sm">
            <p className="text-ink font-bold">How to ask</p>
            <ol className="text-muted list-decimal space-y-1 pl-5">
              <li>Sign in to Momo (on the website or in the app).</li>
              <li>
                Open this page again — or go to <b>Settings</b> and tap{" "}
                <b>Delete my account</b>.
              </li>
              <li>
                Tap <b>Ask to delete my account</b>.
              </li>
            </ol>
            <p className="text-muted">
              Can&apos;t sign in? Ask your school admin to delete your account
              {env.SUPPORT_EMAIL ? (
                <>
                  , or write to{" "}
                  <a
                    href={`mailto:${env.SUPPORT_EMAIL}?subject=Delete my Momo account`}
                    className="text-brand font-semibold"
                  >
                    {env.SUPPORT_EMAIL}
                  </a>{" "}
                  with your name, school and LRN
                </>
              ) : null}
              .
            </p>
            <Link
              href="/login"
              className="bg-navy inline-flex rounded-lg px-4 py-2 text-sm font-bold text-white"
            >
              Sign in
            </Link>
          </div>
        )}

        <p className="text-muted text-xs">
          See also our{" "}
          <Link href="/privacy" className="text-brand font-semibold">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
