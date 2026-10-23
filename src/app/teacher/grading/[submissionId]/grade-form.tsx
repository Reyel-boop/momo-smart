"use client";

import { useRouter } from "next/navigation";
import { useId, useState, useTransition } from "react";

import { returnForRevision, saveGrade } from "../actions";

type Criterion = {
  id: string;
  title: string;
  description: string | null;
  maxPoints: number;
  levels: Array<{
    id: string;
    label: string;
    points: number;
    description: string | null;
  }>;
};

/**
 * Score entry for one submission: a rubric (pick a level per criterion) or a
 * single score, a late penalty and feedback. Release publishes the grade.
 */
export function GradeForm({
  submissionId,
  pointsPossible,
  criteria,
  initial,
  nextHref,
}: {
  submissionId: string;
  pointsPossible: number;
  /** Empty when the work is graded with a single score. */
  criteria: Criterion[];
  initial: {
    score: number | null;
    latePenalty: number;
    feedback: string;
    levels: Record<string, string>;
  };
  /** Where to go after saving: the queue. */
  nextHref: string;
}) {
  const router = useRouter();
  const id = useId();
  const usesRubric = criteria.length > 0;
  const [levels, setLevels] = useState<Record<string, string>>(initial.levels);
  const [score, setScore] = useState(
    initial.score != null ? String(initial.score) : "",
  );
  const [penalty, setPenalty] = useState(String(initial.latePenalty));
  const [feedback, setFeedback] = useState(initial.feedback);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const rubricScores = criteria.flatMap((criterion) => {
    const level = criterion.levels.find((l) => l.id === levels[criterion.id]);
    return level
      ? [{ criterionId: criterion.id, levelId: level.id, points: level.points }]
      : [];
  });
  const raw = usesRubric
    ? rubricScores.reduce((sum, entry) => sum + entry.points, 0)
    : Number(score) || 0;
  const late = Math.max(0, Number(penalty) || 0);
  const total = Math.max(0, raw - late);

  const submit = (release: boolean) => {
    setError(null);
    if (usesRubric && rubricScores.length < criteria.length) {
      setError("Pick a level for every criterion.");
      return;
    }
    if (!usesRubric && score.trim() === "") {
      setError("Enter a score.");
      return;
    }
    startTransition(async () => {
      const result = await saveGrade({
        submissionId,
        score: usesRubric ? undefined : Number(score),
        rubricScores,
        latePenalty: late,
        feedback,
        release,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push(nextHref);
    });
  };

  const sendBack = () => {
    setError(null);
    startTransition(async () => {
      const result = await returnForRevision({ submissionId, feedback });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push(nextHref);
    });
  };

  const field =
    "border-line bg-canvas text-ink focus:border-brand focus:bg-surface focus:ring-brand/10 mt-1 w-full rounded-lg border px-3 py-2 text-sm transition outline-none focus:ring-4";

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit(true);
      }}
      className="space-y-5 p-5"
    >
      {usesRubric ? (
        <div className="space-y-4">
          {criteria.map((criterion) => (
            <fieldset key={criterion.id}>
              <legend className="text-ink text-sm font-bold">
                {criterion.title}{" "}
                <span className="text-muted font-normal">
                  (/{criterion.maxPoints})
                </span>
              </legend>
              {criterion.description && (
                <p className="text-muted text-xs">{criterion.description}</p>
              )}
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {criterion.levels.map((level) => {
                  const checked = levels[criterion.id] === level.id;
                  return (
                    <label
                      key={level.id}
                      className={`flex cursor-pointer gap-2.5 rounded-xl border px-3 py-2 text-sm transition ${
                        checked
                          ? "border-brand bg-brand-soft"
                          : "border-line hover:bg-canvas"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`${id}-${criterion.id}`}
                        checked={checked}
                        onChange={() =>
                          setLevels((prev) => ({
                            ...prev,
                            [criterion.id]: level.id,
                          }))
                        }
                        className="accent-brand mt-1"
                      />
                      <span>
                        <span className="text-ink font-semibold">
                          {level.label} · {level.points} pts
                        </span>
                        {level.description && (
                          <span className="text-muted block text-xs">
                            {level.description}
                          </span>
                        )}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>
      ) : (
        <div className="max-w-xs">
          <label htmlFor={`${id}-score`} className="text-ink text-xs font-bold">
            Score (out of {pointsPossible})
          </label>
          <input
            id={`${id}-score`}
            type="number"
            min={0}
            max={pointsPossible}
            step="0.5"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            className={field}
          />
        </div>
      )}

      <div className="max-w-xs">
        <label htmlFor={`${id}-late`} className="text-ink text-xs font-bold">
          Late penalty (points)
        </label>
        <input
          id={`${id}-late`}
          type="number"
          min={0}
          step="0.5"
          value={penalty}
          onChange={(e) => setPenalty(e.target.value)}
          className={field}
        />
      </div>

      <div>
        <label
          htmlFor={`${id}-feedback`}
          className="text-ink text-xs font-bold"
        >
          Feedback for the student
        </label>
        <textarea
          id={`${id}-feedback`}
          rows={5}
          maxLength={20_000}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="What went well, and what to work on next."
          className={`${field} resize-y`}
        />
      </div>

      <div className="bg-canvas flex items-center justify-between rounded-xl px-4 py-3">
        <span className="text-muted text-sm font-semibold">Final score</span>
        <span className="text-ink text-2xl font-extrabold tabular-nums">
          {Math.round(total * 100) / 100}
          <span className="text-muted text-base">/{pointsPossible}</span>
        </span>
      </div>

      {error && (
        <p role="alert" className="text-sm text-rose-600">
          {error}
        </p>
      )}
      <div className="flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={sendBack}
          disabled={pending}
          className="border-line text-ink hover:bg-canvas rounded-lg border px-4 py-2 text-sm font-semibold disabled:opacity-60"
        >
          Return for revision
        </button>
        <button
          type="button"
          onClick={() => submit(false)}
          disabled={pending}
          className="border-line text-ink hover:bg-canvas rounded-lg border px-4 py-2 text-sm font-semibold disabled:opacity-60"
        >
          Save without releasing
        </button>
        <button
          type="submit"
          disabled={pending}
          className="bg-navy hover:bg-navy-deep rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save and release"}
        </button>
      </div>
    </form>
  );
}
