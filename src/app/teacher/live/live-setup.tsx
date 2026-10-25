"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";

import { PlayFillIcon } from "~/app/_components/icons";
import { Card, EmptyState } from "~/app/_components/ui";
import { api, type RouterOutputs } from "~/trpc/react";

type Classes = RouterOutputs["live"]["setupOptions"];

const field =
  "border-line bg-canvas text-ink focus:border-brand focus:bg-surface focus:ring-brand/10 mt-1 w-full rounded-lg border px-3 py-2.5 text-sm transition outline-none focus:ring-4";

const COUNTS = [5, 10, 15, 20] as const;
type QuestionCount = (typeof COUNTS)[number];
const ALL_UNITS = "all";

/**
 * Choose the class, where the questions come from (one unit or all units),
 * how many (5–20), the timer and the mode.
 */
export function LiveSetup({ classes }: { classes: Classes }) {
  const router = useRouter();
  const id = useId();
  const playable = classes.filter((c) => c.quizzes.length > 0);
  const [sectionId, setSectionId] = useState(playable[0]?.id ?? "");
  const current = playable.find((c) => c.id === sectionId);
  const [assessmentId, setAssessmentId] = useState(
    current?.quizzes[0]?.id ?? "",
  );
  const [seconds, setSeconds] = useState("20");
  const [teamMode, setTeamMode] = useState(false);
  const [count, setCount] = useState<QuestionCount>(5);
  // Questions available: one unit's, or every unit's for a mixed review.
  const allUnits =
    current?.quizzes.reduce((sum, q) => sum + q.questions, 0) ?? 0;
  const available =
    assessmentId === ALL_UNITS
      ? allUnits
      : (current?.quizzes.find((q) => q.id === assessmentId)?.questions ?? 0);
  /** Picking more than one unit holds switches to the mixed review. */
  const chooseCount = (n: QuestionCount) => {
    setCount(n);
    if (n > available && n <= allUnits) setAssessmentId(ALL_UNITS);
  };
  const playableCount =
    count <= available
      ? count
      : ([...COUNTS].reverse().find((n) => n <= available) ?? count);
  const [error, setError] = useState<string | null>(null);
  const create = api.live.create.useMutation({
    onSuccess: ({ gameId }) => router.push(`/teacher/live/${gameId}`),
    onError: (e) => setError(e.message),
  });

  if (playable.length === 0) {
    return (
      <Card>
        <EmptyState>
          You don&apos;t have a class with Unit Questions yet. Start a class
          from{" "}
          <Link href="/teacher/courses" className="text-brand font-bold">
            Courses
          </Link>{" "}
          first.
        </EmptyState>
      </Card>
    );
  }

  return (
    <Card className="space-y-5 p-6">
      {current?.activeGameId && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-amber-50 px-4 py-3 text-sm">
          <span className="font-semibold text-amber-900">
            A live quiz is still open for this class.
          </span>
          <Link
            href={`/teacher/live/${current.activeGameId}`}
            className="font-bold text-amber-900 underline"
          >
            Go back to it
          </Link>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-class`} className="text-ink text-xs font-bold">
            Class
          </label>
          <select
            id={`${id}-class`}
            value={sectionId}
            onChange={(e) => {
              setSectionId(e.target.value);
              const next = playable.find((c) => c.id === e.target.value);
              setAssessmentId(next?.quizzes[0]?.id ?? "");
            }}
            className={field}
          >
            {playable.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label} ({c.students} students)
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${id}-unit`} className="text-ink text-xs font-bold">
            Questions from
          </label>
          <select
            id={`${id}-unit`}
            value={assessmentId}
            onChange={(e) => setAssessmentId(e.target.value)}
            className={field}
          >
            {current?.quizzes.map((q) => (
              <option key={q.id} value={q.id}>
                {q.label} — {q.questions} questions
              </option>
            ))}
            {(current?.quizzes.length ?? 0) > 1 && (
              <option value={ALL_UNITS}>
                All units (mixed review) —{" "}
                {current?.quizzes.reduce((sum, q) => sum + q.questions, 0)}{" "}
                questions
              </option>
            )}
          </select>
        </div>
        <fieldset className="sm:col-span-2">
          <legend className="text-ink text-xs font-bold">
            Number of questions
          </legend>
          <div className="mt-1 grid grid-cols-4 gap-2">
            {COUNTS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => chooseCount(n)}
                disabled={n > allUnits}
                aria-pressed={playableCount === n}
                className={`rounded-lg border px-3 py-2.5 text-base font-extrabold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                  playableCount === n
                    ? "border-navy bg-navy text-white"
                    : "border-line bg-canvas text-ink hover:bg-surface"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <p className="text-muted mt-1 text-xs">
            {assessmentId === ALL_UNITS
              ? `Mixed from all ${current?.quizzes.length ?? 0} units (${allUnits} questions). `
              : `This unit has ${available} questions; 10, 15 or 20 mix in questions from all units. `}
            Questions are picked at random.
          </p>
        </fieldset>
        <div>
          <label htmlFor={`${id}-time`} className="text-ink text-xs font-bold">
            Time per question
          </label>
          <select
            id={`${id}-time`}
            value={seconds}
            onChange={(e) => setSeconds(e.target.value)}
            className={field}
          >
            {[10, 15, 20, 30, 45, 60].map((s) => (
              <option key={s} value={s}>
                {s} seconds
              </option>
            ))}
          </select>
        </div>
        <fieldset>
          <legend className="text-ink text-xs font-bold">Play as</legend>
          <div className="mt-1 grid grid-cols-2 gap-2">
            {[
              { value: false, label: "Everyone for themselves" },
              { value: true, label: "Team A vs Team B" },
            ].map((mode) => (
              <button
                key={mode.label}
                type="button"
                onClick={() => setTeamMode(mode.value)}
                aria-pressed={teamMode === mode.value}
                className={`rounded-lg border px-3 py-2.5 text-sm font-semibold transition ${
                  teamMode === mode.value
                    ? "border-navy bg-navy text-white"
                    : "border-line bg-canvas text-ink hover:bg-surface"
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </fieldset>
      </div>
      {error && (
        <p role="alert" className="text-sm text-rose-600">
          {error}
        </p>
      )}
      <button
        type="button"
        disabled={!assessmentId || available < 5 || create.isPending}
        onClick={() => {
          setError(null);
          create.mutate({
            sectionId,
            assessmentId: assessmentId === ALL_UNITS ? null : assessmentId,
            questionCount: playableCount,
            secondsPerQuestion: Number(seconds),
            teamMode,
          });
        }}
        className="bg-brand hover:bg-brand/90 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-base font-extrabold text-white transition disabled:opacity-60"
      >
        <PlayFillIcon className="size-5" />
        {create.isPending ? "Opening the game…" : "Open the game lobby"}
      </button>
    </Card>
  );
}
