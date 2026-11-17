import type { Reminder } from "./whats-new";

/** "Wed, Nov 19, 11:59 PM" in Philippine time. */
const when = (d: Date) =>
  d.toLocaleString("en-PH", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Manila",
  });

/** A student's reminders for the welcome post, most urgent first. */
export function studentReminders({
  due,
  unread,
  email,
  image,
}: {
  due: {
    id: string;
    title: string;
    dueAt: Date;
    isOverdue: boolean;
    section: { course: { name: string } };
  }[];
  unread: number;
  email: string | null;
  image: string | null;
}): Reminder[] {
  const out: Reminder[] = [];
  const overdue = due.filter((d) => d.isOverdue);
  const upcoming = due.filter((d) => !d.isOverdue);
  for (const d of overdue.slice(0, 3)) {
    out.push({
      icon: "⏰",
      text: `Missing: ${d.title} (${d.section.course.name}) was due ${when(d.dueAt)}. Late work gets 5 points off, so hand it in soon.`,
      href: `/student/assignments?assignment=${d.id}#submit`,
      urgent: true,
    });
  }
  if (overdue.length > 3) {
    out.push({
      icon: "⏰",
      text: `…and ${overdue.length - 3} more missing assignment${overdue.length - 3 === 1 ? "" : "s"}.`,
      href: "/student/assignments",
      urgent: true,
    });
  }
  for (const d of upcoming.slice(0, 4)) {
    out.push({
      icon: "📅",
      text: `${d.title} (${d.section.course.name}) is due ${when(d.dueAt)}.`,
      href: `/student/assignments?assignment=${d.id}#submit`,
    });
  }
  if (upcoming.length > 4) {
    out.push({
      icon: "📅",
      text: `…and ${upcoming.length - 4} more due this week.`,
      href: "/student/assignments",
    });
  }
  if (unread > 0) {
    out.push({
      icon: "🔔",
      text: `You have ${unread} unread notification${unread === 1 ? "" : "s"}.`,
      href: "/student/notifications",
    });
  }
  if (!email) {
    out.push({
      icon: "✉️",
      text: "Add your email address to get school updates and reminders.",
      href: "/student/settings#email",
    });
  }
  if (!image) {
    out.push({
      icon: "📸",
      text: "Add a profile picture so your teachers know it's you.",
      href: "/student/settings#photo",
    });
  }
  return out;
}

/** A teacher's reminders for the welcome post. */
export function teacherReminders({
  ungraded,
  attendancePending,
  atRisk,
  unread,
  email,
  image,
}: {
  ungraded: number;
  attendancePending: number;
  atRisk: number;
  unread: number;
  email: string | null;
  image: string | null;
}): Reminder[] {
  const out: Reminder[] = [];
  if (attendancePending > 0) {
    out.push({
      icon: "🗓️",
      text: `Attendance is still open for ${attendancePending} class${attendancePending === 1 ? "" : "es"} today.`,
      href: "/teacher",
      urgent: true,
    });
  }
  if (atRisk > 0) {
    out.push({
      icon: "🚩",
      text: `${atRisk} student alert${atRisk === 1 ? " needs" : "s need"} your attention.`,
      href: "/teacher/alerts",
      urgent: true,
    });
  }
  if (ungraded > 0) {
    out.push({
      icon: "📥",
      text: `${ungraded} submission${ungraded === 1 ? " is" : "s are"} waiting for a grade.`,
      href: "/teacher/grading",
    });
  }
  out.push({
    icon: "📊",
    text: "See who needs help in each class on Class Progress.",
    href: "/teacher/progress",
  });
  if (unread > 0) {
    out.push({
      icon: "🔔",
      text: `You have ${unread} unread notification${unread === 1 ? "" : "s"}.`,
      href: "/teacher/notifications",
    });
  }
  if (!email) {
    out.push({
      icon: "✉️",
      text: "Add your email address for school updates and reminders.",
      href: "/teacher/settings#email",
    });
  }
  if (!image) {
    out.push({
      icon: "📸",
      text: "Add a profile picture so students recognise you.",
      href: "/teacher/settings#photo",
    });
  }
  return out;
}
