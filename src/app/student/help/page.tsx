import { type Metadata } from "next";
import Link from "next/link";

import { HelpView, type HelpTopic } from "~/app/_components/help-view";

export const metadata: Metadata = { title: "Help · Momo Smart" };

const link = "text-brand font-semibold hover:underline";

const TOPICS: HelpTopic[] = [
  {
    question: "How do I join a class?",
    answer:
      "Open Courses and, under Join a class, enter the class code from your teacher or the course code (for example MATH 10) — the course code puts you in your own section's class. You can also enter a class code when you create your account.",
  },
  {
    question: "How do I study a lesson?",
    answer: (
      <>
        Open{" "}
        <Link href="/student/courses" className={link}>
          Courses
        </Link>
        , pick a course and press Start or Continue. Each lesson has a lecture
        video, a written Lecture tab, a short Reading and a Self-Check. Tick
        &quot;Mark as Completed&quot; when you&apos;re done.
      </>
    ),
  },
  {
    question: "How do Unit Questions work?",
    answer: (
      <>
        After a unit&apos;s lessons, answer its five Unit Questions. They come
        one at a time and you have 2 minutes for each. When time runs out the
        question counts as wrong. After every answer you see whether it was
        right, the correct answer and why. You get two tries and your best score
        counts. Stay on the quiz screen — leaving it is recorded.
      </>
    ),
  },
  {
    question: "How do I submit an assignment?",
    answer: (
      <>
        Go to{" "}
        <Link href="/student/assignments" className={link}>
          Assignments
        </Link>
        , open the assignment and attach your work before the due time. Late
        work may lose points, depending on your teacher&apos;s rules.
      </>
    ),
  },
  {
    question: "Where can I see my grades?",
    answer: (
      <>
        <Link href="/student/scores" className={link}>
          Scores
        </Link>{" "}
        shows your grade in every course, your graded work, Unit Questions and
        every star you have earned.
      </>
    ),
  },
  {
    question: "What are star points?",
    answer:
      "You earn 1 star for every point on graded tests and coursework. Stars unlock rewards such as a homework pass, and you can see your rank in your grade level on the Dashboard.",
  },
  {
    question: "How do I ask my teacher a question?",
    answer: (
      <>
        Open{" "}
        <Link href="/student/messages" className={link}>
          Messages
        </Link>{" "}
        and press New message, then choose your teacher.
      </>
    ),
  },
  {
    question: "I forgot my password.",
    answer:
      "Ask your adviser or the school registrar to reset it. You can change your password any time in Settings.",
  },
];

export default function StudentHelpPage() {
  return (
    <HelpView
      topics={TOPICS}
      contact={{
        text: "Still stuck? Message your teacher.",
        href: "/student/messages",
        label: "Open Messages",
      }}
    />
  );
}
