"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * The welcome post: a full-screen page that opens every time someone opens
 * their account (once per sign-in and once per browser visit), with their
 * own reminders on top and "What's new in Momo" below. It closes with ✕,
 * "Got it!" or Escape. The account menu's "What's new" opens it again.
 *
 * To announce a new update, add an entry at the top of UPDATES with a new id.
 */

export type Reminder = {
  icon: string;
  text: string;
  href?: string;
  /** Shown in red: overdue or missing work. */
  urgent?: boolean;
};

type Item = {
  icon: string;
  title: string;
  text: string;
  /** Where "Try it" goes; omit for news without a page. */
  href?: string;
  cta?: string;
};
type Update = {
  id: string;
  date: string;
  student: Item[];
  teacher: Item[];
};

const UPDATES: Update[] = [
  {
    id: "2026-11-17",
    date: "November 17, 2026",
    student: [
      {
        icon: "👤",
        title: "Your own profile page",
        text: "See your big profile picture, GPA, stars, and your status in every class: On track, Watch, Needs help or Just started.",
        href: "/student/profile",
        cta: "Open My Profile",
      },
      {
        icon: "📸",
        title: "Add a profile picture",
        text: "Upload a clear photo of your face. It shows beside your name everywhere in Momo.",
        href: "/student/settings#photo",
        cta: "Add a picture",
      },
      {
        icon: "✉️",
        title: "Add your email address",
        text: "Get school updates and reminders. You can also sign in with your email. Use the same email as in the School Hub.",
        href: "/student/settings#email",
        cta: "Add my email",
      },
      {
        icon: "☰",
        title: "Click your name for the menu",
        text: "Your name at the top now opens a menu: My profile, picture, email, settings and Sign out. No more signing out by accident!",
      },
      {
        icon: "✅",
        title: "Assignments are checked right away",
        text: "When you submit on time you get full points at once. Late work gets 5 points off, so submit before the due date!",
        href: "/student/assignments",
        cta: "See my assignments",
      },
      {
        icon: "🚀",
        title: "New game: Studio Run",
        text: "Run, jump over obstacles and grab items. Every item asks a question from your unit. (For classes that have it.)",
        href: "/student/games",
        cta: "Play",
      },
    ],
    teacher: [
      {
        icon: "📊",
        title: "Class Progress",
        text: "Every student of a section in one glance: grade, lessons, Unit Questions, assignments, attendance and stars. Students who need help are listed first.",
        href: "/teacher/progress",
        cta: "Open Class Progress",
      },
      {
        icon: "✅",
        title: "Assignments check themselves",
        text: "Every hand-in is graded automatically: full points on time, minus 5 if late. You can still change any grade.",
        href: "/teacher/assignments",
        cta: "See assignments",
      },
      {
        icon: "📸",
        title: "Profile picture and email",
        text: "Click your picture at the top for your profile, picture, email, settings and Sign out.",
        href: "/teacher/settings#photo",
        cta: "Open settings",
      },
      {
        icon: "🧮",
        title: "A more accurate dashboard",
        text: "Students are counted once, attendance compares with the previous school day, and 'attendance pending' no longer names classes later in the day.",
        href: "/teacher",
        cta: "Go to dashboard",
      },
    ],
  },
];

const OPEN_EVENT = "momo:whats-new";
/** Opens the post (used by the account menu). */
export function openWhatsNew() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function WhatsNew({
  userId,
  role,
  firstName,
  signedInAt,
  reminders,
}: {
  userId: string;
  role: "student" | "teacher";
  firstName: string;
  /** The last sign-in time: a new sign-in shows the post again. */
  signedInAt: string | null;
  reminders: Reminder[];
}) {
  const latest = UPDATES[0]!;
  // Once per sign-in, and once per browser visit (sessionStorage).
  const key = `momo-opened:${userId}:${signedInAt ?? ""}`;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let seen: string | null = null;
    try {
      seen = sessionStorage.getItem(key);
    } catch {}
    if (!seen) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, reopen);
    return () => window.removeEventListener(OPEN_EVENT, reopen);
  }, [key, latest.id]);

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", esc);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = overflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function close() {
    try {
      sessionStorage.setItem(key, "1");
    } catch {}
    setOpen(false);
  }

  if (!open) return null;
  const items = latest[role];
  const today = new Date().toLocaleDateString("en-PH", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="whats-new-title"
      className="bg-canvas fixed inset-0 z-[60] overflow-y-auto"
    >
      <button
        type="button"
        onClick={close}
        aria-label="Close"
        className="text-ink fixed top-4 right-4 z-10 flex size-12 items-center justify-center rounded-full bg-white text-2xl font-bold shadow-lg ring-1 ring-black/5 transition hover:scale-105 hover:bg-slate-50"
      >
        ✕
      </button>

      <div className="from-navy to-brand bg-gradient-to-br px-6 pt-14 pb-24 text-center text-white">
        <p className="text-5xl" aria-hidden="true">
          👋
        </p>
        <p className="mt-3 text-xs font-bold tracking-[0.25em] text-amber-300 uppercase">
          {today}
        </p>
        <h1
          id="whats-new-title"
          className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl"
        >
          Welcome back, {firstName}!
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-white/85 sm:text-base">
          Here are your reminders and what&apos;s new in Momo.
        </p>
      </div>

      <section className="mx-auto -mt-16 max-w-5xl px-4">
        <div className="border-line bg-surface shadow-card rounded-2xl border p-5">
          <h2 className="text-ink flex items-center gap-2 text-lg font-extrabold">
            <span aria-hidden="true">🔔</span> Your reminders
          </h2>
          {reminders.length === 0 ? (
            <p className="mt-2 text-sm font-semibold text-emerald-700">
              ✅ You&apos;re all caught up. Nothing needs your attention right
              now!
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {reminders.map((r) => {
                const body = (
                  <>
                    <span className="text-lg" aria-hidden="true">
                      {r.icon}
                    </span>
                    <span className="min-w-0 flex-1">{r.text}</span>
                    {r.href && (
                      <span className="text-brand shrink-0 text-xs font-bold">
                        Open →
                      </span>
                    )}
                  </>
                );
                const cls = `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold ${
                  r.urgent ? "bg-rose-50 text-rose-800" : "bg-canvas text-ink"
                }`;
                return (
                  <li key={r.text}>
                    {r.href ? (
                      <Link
                        href={r.href}
                        onClick={close}
                        className={`${cls} hover:ring-brand/30 transition hover:ring-2`}
                      >
                        {body}
                      </Link>
                    ) : (
                      <div className={cls}>{body}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      <h2 className="text-ink mx-auto mt-8 max-w-5xl px-4 text-lg font-extrabold">
        🎉 What&apos;s new in Momo{" "}
        <span className="text-muted text-sm font-semibold">
          · {latest.date}
        </span>
      </h2>
      <div className="mx-auto mt-3 grid max-w-5xl gap-4 px-4 pb-10 sm:grid-cols-2">
        {items.map((item) => (
          <article
            key={item.title}
            className="border-line bg-surface shadow-card flex gap-4 rounded-2xl border p-5"
          >
            <span
              className="bg-brand-soft flex size-12 shrink-0 items-center justify-center rounded-2xl text-2xl"
              aria-hidden="true"
            >
              {item.icon}
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-ink text-base font-extrabold">
                {item.title}
              </h2>
              <p className="text-muted mt-1 text-sm leading-relaxed">
                {item.text}
              </p>
              {item.href && (
                <Link
                  href={item.href}
                  onClick={close}
                  className="text-brand mt-2 inline-flex text-sm font-bold hover:underline"
                >
                  {item.cta ?? "Try it"} →
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>

      <div className="pb-14 text-center">
        <button
          type="button"
          onClick={close}
          className="bg-navy hover:bg-navy-deep rounded-2xl px-10 py-3.5 text-base font-bold text-white shadow-lg transition"
        >
          Got it!
        </button>
        <p className="text-muted mt-3 text-xs">
          This opens each time you open Momo. To see it again now, click your
          name at the top, then &ldquo;What&apos;s new&rdquo;.
        </p>
      </div>
    </div>
  );
}
