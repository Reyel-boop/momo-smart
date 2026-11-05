import { type Metadata } from "next";
import Link from "next/link";

import { Wordmark } from "~/app/_components/brand";
import { env } from "~/env";

export const metadata: Metadata = {
  title: "Privacy Policy · Momo Smart",
  description: "What Momo Smart collects, why, and your choices.",
};

const UPDATED = "October 27, 2026";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2">
      <h2 className="text-ink text-lg font-extrabold">{title}</h2>
      <div className="text-muted space-y-2 text-[15px] leading-relaxed">
        {children}
      </div>
    </section>
  );
}

/** Momo's privacy policy (also linked from the Google Play listing). */
export default function PrivacyPage() {
  const contact = env.SUPPORT_EMAIL;
  return (
    <main className="bg-canvas min-h-screen px-4 py-10">
      <article className="border-line bg-surface shadow-card mx-auto max-w-3xl space-y-7 rounded-2xl border p-8">
        <Wordmark label="Learning Management" />
        <header>
          <h1 className="text-ink text-3xl font-extrabold tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-muted mt-1 text-sm">Last updated {UPDATED}</p>
        </header>

        <p className="text-muted text-[15px] leading-relaxed">
          Momo Smart is a learning management system that schools use for
          lessons, quizzes, games, grades and attendance. It is available on the
          web and as an Android app. This policy explains what we collect, why,
          and the choices students, teachers and parents have. Momo is used
          through a school: each school decides who gets an account and manages
          its own students and teachers.
        </p>

        <Section title="What we collect">
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <b>Account details:</b> name, email address or LRN (Learner
              Reference Number), grade level, section, school, and a password
              (stored only in scrambled, hashed form).
            </li>
            <li>
              <b>School work:</b> class enrollments, answers to questions and
              quizzes, game results and stars, assignment submissions and files
              you upload, notes, grades and feedback from teachers, and
              attendance.
            </li>
            <li>
              <b>Messages and announcements</b> sent inside Momo.
            </li>
            <li>
              <b>Support details</b> a school may add, such as learning
              accommodations or a guardian&apos;s contact information.
            </li>
            <li>
              <b>Technical data</b> needed to run the service: sign-in session
              cookies and the time of your last sign-in.
            </li>
          </ul>
          <p>
            We do not collect your location, contacts, or advertising IDs, and
            we do not use advertising or tracking cookies.
          </p>
        </Section>

        <Section title="How we use it">
          <p>
            Only to provide Momo to your school: to show lessons and classes,
            check answers, keep scores and leaderboards, let teachers grade and
            take attendance, and send in-app notices. We never sell personal
            information, and we don&apos;t use it for advertising.
          </p>
        </Section>

        <Section title="Who can see it">
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <b>Your teachers</b> see the work of students in their classes.
            </li>
            <li>
              <b>Your school&apos;s admins</b> manage accounts, sections and
              classes for their school only. Schools on Momo can&apos;t see each
              other&apos;s data.
            </li>
            <li>
              <b>Classmates</b> see names and stars on leaderboards and in Group
              Race, within the same school.
            </li>
            <li>
              <b>Service providers</b> that host Momo for us: Vercel (website
              and app hosting, and private storage for uploaded files) and Neon
              (database). Lesson videos are played from YouTube, which has its
              own privacy policy. They process data only to run Momo.
            </li>
          </ul>
          <p>
            We may share information if the law requires it, or to protect the
            safety of a student.
          </p>
        </Section>

        <Section title="How we protect it">
          <p>
            Data is sent over encrypted connections (HTTPS). Passwords are
            hashed. Each school&apos;s data is kept separate, and people only
            see what their role allows.
          </p>
        </Section>

        <Section title="How long we keep it">
          <p>
            We keep account and school-work data while the account is in use by
            the school. When an account is deleted, its data is deleted from
            Momo. A school may turn off an account instead of deleting it, for
            example at the end of a school year.
          </p>
        </Section>

        <Section title="Your choices">
          <ul className="list-disc space-y-1 pl-5">
            <li>
              See and update your profile in <b>Settings</b>, and change your
              password at any time.
            </li>
            <li>
              Ask for your account and data to be deleted on the{" "}
              <Link href="/account/delete" className="text-brand font-semibold">
                Delete your account
              </Link>{" "}
              page, inside the app or on the website.
            </li>
            <li>
              Parents and guardians can ask the school, or us, to see, correct
              or delete a student&apos;s information.
            </li>
          </ul>
        </Section>

        <Section title="Children">
          <p>
            Momo is used by students through their school. Student accounts are
            created or approved by the school, which is responsible for
            obtaining any consent required from parents or guardians. We handle
            student information following the Philippine Data Privacy Act of
            2012 (Republic Act 10173).
          </p>
        </Section>

        <Section title="Changes">
          <p>
            If this policy changes, we&apos;ll update the date above and, for
            important changes, tell schools inside Momo.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions or requests: ask your school&apos;s Momo admin
            {contact ? (
              <>
                , or write to us at{" "}
                <a
                  href={`mailto:${contact}`}
                  className="text-brand font-semibold"
                >
                  {contact}
                </a>
              </>
            ) : null}
            .
          </p>
        </Section>
      </article>
    </main>
  );
}
