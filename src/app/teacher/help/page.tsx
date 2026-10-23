import { type Metadata } from "next";
import Link from "next/link";

import { HelpView, type HelpTopic } from "~/app/_components/help-view";

export const metadata: Metadata = { title: "Help · Momo Smart" };

const link = "text-brand font-semibold hover:underline";

const TOPICS: HelpTopic[] = [
  {
    question: "How do students join my class?",
    answer:
      "Each class has a class code, shown on your Courses page next to the section name. Share it with your students: they enter it when they create their account, or later with Join a class on their Courses page. They can also type the course code (for example MATH 10) to join the class for their own section, if the class is named after the section.",
  },
  {
    question: "How do I add or change a lecture?",
    answer: (
      <>
        In{" "}
        <Link href="/teacher/courses" className={link}>
          Courses
        </Link>
        , open a unit and press Add lecture (or Edit lecture) under a lesson.
        Paste a YouTube link or a video file link, and write the lecture text —
        use ## for headings, - for bullet points and **double asterisks** for
        bold.
      </>
    ),
  },
  {
    question: "How do Unit Questions work for students?",
    answer:
      "Students answer five questions per unit, one at a time, with 2 minutes each. The server keeps the clock, so reloading doesn't reset it. Every answer shows the student the correct answer and the rationale. They get two tries and the best score counts. On Courses, each unit shows its questions, answer key and each section's results — including how often students left the quiz screen.",
  },
  {
    question: "How do I create an assignment?",
    answer: (
      <>
        Open{" "}
        <Link href="/teacher/assignments" className={link}>
          Assignments
        </Link>{" "}
        and press New Assignment. Choose the class, type, points and due date,
        then publish it so students can see it.
      </>
    ),
  },
  {
    question: "How do I grade submissions?",
    answer: (
      <>
        The Grading Queue on the{" "}
        <Link href="/teacher" className={link}>
          Dashboard
        </Link>{" "}
        lists work waiting for a grade. Press Grade Now to open a submission,
        enter the score and feedback, and release it to the student.
      </>
    ),
  },
  {
    question: "How do I post an announcement?",
    answer:
      "Use Broadcast Announcement on the Dashboard to reach all your classes, or Post Announcement in Course Performance to post to one class.",
  },
  {
    question: "How do I export grades?",
    answer: (
      <>
        In{" "}
        <Link href="/teacher/grades" className={link}>
          Grades
        </Link>
        , choose a class and press Export CSV to download its gradebook for
        Excel or Google Sheets.
      </>
    ),
  },
  {
    question: "How do I message a student?",
    answer: (
      <>
        Open{" "}
        <Link href="/teacher/messages" className={link}>
          Messages
        </Link>
        , press New message and choose the student. You can message anyone on
        your rosters.
      </>
    ),
  },
];

export default function TeacherHelpPage() {
  return (
    <HelpView
      topics={TOPICS}
      contact={{
        text: "Need an account or class change? Contact the registrar.",
        href: "mailto:registrar@momosmart.edu",
        label: "Email the registrar",
      }}
    />
  );
}
