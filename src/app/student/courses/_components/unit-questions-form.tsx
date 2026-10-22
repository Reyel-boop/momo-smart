"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Card } from "~/app/_components/ui";
import type { RouterOutputs } from "~/trpc/react";
import { submitUnitQuestions } from "../actions";

type Quiz = RouterOutputs["assessment"]["unitQuiz"];

/**
 * Answer sheet for a unit's questions. After a try it shows the score and
 * which answers were right; the correct choices and explanations appear once
 * no tries are left.
 */
export function UnitQuestionsForm({
  assessmentId,
  questions,
  latest,
  totalPoints,
  triesLeft,
  maxAttempts,
  revealed,
  courseHref,
}: {
  assessmentId: string;
  questions: Quiz["questions"];
  latest: Quiz["latest"];
  totalPoints: number;
  triesLeft: number;
  maxAttempts: number;
  revealed: boolean;
  courseHref: string;
}) {
  const router = useRouter();
  const [answering, setAnswering] = useState(latest === null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const answeredCount = questions.filter((q) => answers[q.id]).length;
  const chosenInLatest = new Map(
    latest?.responses.map((r) => [r.questionId, r]) ?? [],
  );

  const submit = () => {
    setError(null);
    startTransition(async () => {
      const result = await submitUnitQuestions(assessmentId, answers);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  };

  if (!answering && latest) {
    const score = latest.totalScore ?? 0;
    const perfect = score >= totalPoints;
    return (
      <div className="space-y-4">
        <Card
          className={`p-5 ${perfect ? "border-emerald-200 bg-emerald-50" : ""}`}
        >
          <p className="text-muted text-[11px] font-bold tracking-wide uppercase">
            Try {latest.attempt} of {maxAttempts}
          </p>
          <p className="text-ink mt-1 text-3xl font-extrabold">
            {score}/{totalPoints}
            <span className="text-muted ml-2 text-base font-semibold">
              {perfect
                ? "Perfect! Great job."
                : score / totalPoints >= 0.6
                  ? "Good work."
                  : "Review the discussion and try again."}
            </span>
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {triesLeft > 0 && !perfect && (
              <button
                type="button"
                onClick={() => {
                  setAnswers({});
                  setAnswering(true);
                }}
                className="bg-brand rounded-xl px-4 py-2.5 text-sm font-bold text-white hover:opacity-90"
              >
                Try again ({triesLeft} left)
              </button>
            )}
            <Link
              href={courseHref}
              className="border-line bg-surface text-ink hover:bg-canvas rounded-xl border px-4 py-2.5 text-sm font-semibold"
            >
              Back to the course
            </Link>
            {!revealed && (
              <span className="text-muted text-xs">
                The correct answers are shown after your last try.
              </span>
            )}
          </div>
        </Card>

        <ol className="space-y-3">
          {questions.map((question) => {
            const response = chosenInLatest.get(question.id);
            const chosen = response?.selectedOptionIds[0];
            return (
              <li key={question.id}>
                <Card className="p-5">
                  <p className="text-ink font-semibold">
                    {question.order}. {question.prompt}
                    <span
                      className={`ml-2 text-xs font-bold ${response?.isCorrect ? "text-emerald-600" : "text-rose-600"}`}
                    >
                      {response?.isCorrect ? "✓ Correct" : "✗ Wrong"}
                    </span>
                  </p>
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {question.options.map((option) => {
                      const isChosen = option.id === chosen;
                      const tone = option.isCorrect
                        ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                        : isChosen
                          ? response?.isCorrect
                            ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                            : "border-rose-300 bg-rose-50 text-rose-800"
                          : "border-line text-muted";
                      return (
                        <li
                          key={option.id}
                          className={`rounded-xl border px-3 py-2 text-sm ${tone}`}
                        >
                          <span className="font-bold">{option.label}.</span>{" "}
                          {option.text}
                          {isChosen && (
                            <span className="ml-1 text-xs font-bold">
                              (your answer)
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                  {question.explanation && (
                    <p className="text-muted mt-2 text-xs">
                      <span className="font-bold">Why: </span>
                      {question.explanation}
                    </p>
                  )}
                </Card>
              </li>
            );
          })}
        </ol>
      </div>
    );
  }

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <ol className="space-y-3">
        {questions.map((question) => (
          <li key={question.id}>
            <Card className="p-5">
              <fieldset>
                <legend className="text-ink font-semibold">
                  {question.order}. {question.prompt}
                </legend>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {question.options.map((option) => {
                    const checked = answers[question.id] === option.id;
                    return (
                      <label
                        key={option.id}
                        className={`flex cursor-pointer items-start gap-2.5 rounded-xl border px-3 py-2.5 text-sm transition ${
                          checked
                            ? "border-brand bg-brand-soft text-ink"
                            : "border-line text-ink hover:bg-canvas"
                        }`}
                      >
                        <input
                          type="radio"
                          name={question.id}
                          value={option.id}
                          checked={checked}
                          onChange={() =>
                            setAnswers((prev) => ({
                              ...prev,
                              [question.id]: option.id,
                            }))
                          }
                          className="accent-brand mt-0.5"
                        />
                        <span>
                          <span className="font-bold">{option.label}.</span>{" "}
                          {option.text}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            </Card>
          </li>
        ))}
      </ol>

      <Card className="sticky bottom-4 flex flex-wrap items-center justify-between gap-3 p-4">
        <p className="text-muted text-sm font-semibold">
          {answeredCount} of {questions.length} answered
          {error && <span className="ml-3 text-rose-600">{error}</span>}
        </p>
        <div className="flex items-center gap-2">
          {latest && (
            <button
              type="button"
              onClick={() => setAnswering(false)}
              className="border-line text-ink hover:bg-canvas rounded-xl border px-4 py-2.5 text-sm font-semibold"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={pending || answeredCount < questions.length}
            className="bg-brand rounded-xl px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? "Checking…" : "Submit answers"}
          </button>
        </div>
      </Card>
    </form>
  );
}
