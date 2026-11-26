import Link from "next/link";

import { ArrowRightIcon } from "~/app/_components/icons";
import { Card } from "~/app/_components/ui";
import { BLOOM_LEVELS, examForCourse } from "~/server/demo/tle/exams";

const LABELS = ["A", "B", "C", "D"];

/**
 * The course Exam (Telecommunications, Computer Programming) for the
 * teacher: where students find it, where the scores are, and all 50
 * questions with their answers and Bloom's levels.
 */
export function CourseExam({
  courseCode,
  sections,
}: {
  courseCode: string;
  sections: { id: string; code: string }[];
}) {
  const items = examForCourse(courseCode);
  if (!items) return null;

  let number = 0;
  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-5 text-white">
        <p className="text-xs font-black tracking-wide text-white/80 uppercase">
          📝 Course Exam · {items.length} questions · Bloom&apos;s Taxonomy
        </p>
        <p className="mt-1 max-w-3xl text-sm text-white/90">
          Your students find it on their <b>Courses</b> page: the purple{" "}
          <b>Take the Exam</b> button on this course. It opens only when a
          student has finished the whole course (every lesson and every
          unit&apos;s Unit Questions). One question at a time, 1 minute each,
          one try. The scores show on Class Progress.
        </p>
        {sections.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {sections.map((section) => (
              <Link
                key={section.id}
                href={`/teacher/progress?section=${section.id}`}
                className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-sm font-black text-indigo-700 shadow hover:bg-white/90"
              >
                {section.code}: Exam scores
                <ArrowRightIcon className="size-4" />
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-xs text-white/70">
            Start teaching this course to a section and its students get the
            Exam.
          </p>
        )}
      </div>

      <details className="group">
        <summary className="text-brand hover:bg-canvas flex cursor-pointer list-none items-center gap-1 px-6 py-4 text-sm font-bold [&::-webkit-details-marker]:hidden">
          <span className="inline-block transition group-open:rotate-90">
            ›
          </span>
          See the {items.length} questions and answers
        </summary>
        <div className="space-y-5 px-6 pb-6">
          {BLOOM_LEVELS.map((level) => {
            const group = items.filter((item) => item.level === level);
            if (group.length === 0) return null;
            const first = number + 1;
            number += group.length;
            return (
              <section key={level}>
                <h3 className="text-ink text-sm font-extrabold">
                  {level}{" "}
                  <span className="text-muted font-semibold">
                    · items {first}–{number} ({group.length})
                  </span>
                </h3>
                <ol start={first} className="mt-2 space-y-3">
                  {group.map((item, i) => (
                    <li
                      key={item.q}
                      className="border-line rounded-xl border px-4 py-3 text-sm"
                    >
                      <p className="text-ink font-bold">
                        {first + i}. {item.q}
                      </p>
                      <ul className="mt-1.5 grid gap-1 sm:grid-cols-2">
                        {item.choices.map((choice, k) => (
                          <li
                            key={k}
                            className={
                              k === item.answer
                                ? "font-bold text-emerald-700"
                                : "text-muted"
                            }
                          >
                            {LABELS[k]}. {choice}
                            {k === item.answer && " ✓"}
                          </li>
                        ))}
                      </ul>
                      <p className="text-muted mt-1.5 text-xs">{item.why}</p>
                    </li>
                  ))}
                </ol>
              </section>
            );
          })}
        </div>
      </details>
    </Card>
  );
}
