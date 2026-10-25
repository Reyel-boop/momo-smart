"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";

import { PlusCircleIcon } from "~/app/_components/icons";
import { Card, CardHeader } from "~/app/_components/ui";
import { api } from "~/trpc/react";

const field =
  "border-line bg-canvas text-ink placeholder:text-muted focus:border-brand focus:bg-surface focus:ring-brand/10 mt-1 w-full rounded-lg border px-3 py-2 text-sm transition outline-none focus:ring-4";

/**
 * A unit's extra Live Quiz questions for this class: see them, add your own
 * multiple-choice questions, or remove them. The five Unit Questions that
 * students answer on their own are not changed.
 */
export function BankEditor({
  assessmentId,
  unitLabel,
}: {
  assessmentId: string;
  unitLabel: string;
}) {
  const router = useRouter();
  const id = useId();
  const bank = api.live.bank.useQuery({ assessmentId });
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [choices, setChoices] = useState(["", "", "", ""]);
  const [answer, setAnswer] = useState(0);
  const [explanation, setExplanation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const changed = () => {
    void bank.refetch();
    router.refresh();
  };
  const add = api.live.addQuestion.useMutation({
    onSuccess: () => {
      setPrompt("");
      setChoices(["", "", "", ""]);
      setAnswer(0);
      setExplanation("");
      changed();
    },
    onError: (e) => setError(e.message),
  });
  const remove = api.live.removeQuestion.useMutation({ onSuccess: changed });

  const questions = bank.data?.questions ?? [];
  const total = (bank.data?.unitQuestions ?? 0) + questions.length;

  return (
    <Card className="overflow-hidden">
      <CardHeader
        icon={<PlusCircleIcon className="size-[18px]" />}
        title="Questions for this unit"
        subtitle={
          bank.data
            ? `${unitLabel}: ${bank.data.unitQuestions} Unit Questions + ${questions.length} extra Live Quiz questions = ${total}`
            : "Loading…"
        }
      />
      <div className="space-y-4 px-5 pb-5">
        {questions.length > 0 && (
          <ol className="divide-line border-line divide-y rounded-xl border">
            {questions.map((q, i) => (
              <li key={q.id} className="flex items-start gap-3 px-4 py-3">
                <span className="text-muted w-6 shrink-0 text-sm font-bold">
                  {i + 1}.
                </span>
                <div className="min-w-0 flex-1 text-sm">
                  <p className="text-ink font-semibold">{q.prompt}</p>
                  <p className="text-muted mt-0.5 text-xs">
                    {q.options
                      .map(
                        (o) =>
                          `${o.label}. ${o.text}${o.isCorrect ? " ✓" : ""}`,
                      )
                      .join("   ")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm("Remove this question?")) {
                      remove.mutate({ questionId: q.id });
                    }
                  }}
                  disabled={remove.isPending}
                  className="shrink-0 text-xs font-semibold text-rose-600 hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ol>
        )}

        {!open ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="border-line text-brand hover:bg-canvas inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-bold"
          >
            <PlusCircleIcon className="size-4" />
            Add a question
          </button>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setError(null);
              const filled = choices.map((c) => c.trim());
              const used = filled.filter(Boolean);
              if (!filled[answer]) {
                setError("The correct choice can't be empty.");
                return;
              }
              add.mutate({
                assessmentId,
                prompt,
                choices: used,
                answer: filled.slice(0, answer).filter(Boolean).length,
                explanation: explanation.trim() || undefined,
              });
            }}
            className="bg-canvas/60 space-y-3 rounded-xl p-4"
          >
            <div>
              <label htmlFor={`${id}-q`} className="text-ink text-xs font-bold">
                Question
              </label>
              <textarea
                id={`${id}-q`}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={2}
                required
                maxLength={500}
                className={field}
              />
            </div>
            <fieldset className="grid gap-2 sm:grid-cols-2">
              <legend className="text-ink mb-1 text-xs font-bold">
                Choices — tick the correct one
              </legend>
              {choices.map((choice, k) => (
                <label
                  key={k}
                  className="border-line bg-surface flex items-center gap-2 rounded-lg border px-3 py-1.5"
                >
                  <input
                    type="radio"
                    name={`${id}-answer`}
                    checked={answer === k}
                    onChange={() => setAnswer(k)}
                    aria-label={`Choice ${"ABCD"[k]} is correct`}
                  />
                  <span className="text-muted text-xs font-bold">
                    {"ABCD"[k]}
                  </span>
                  <input
                    value={choice}
                    onChange={(e) =>
                      setChoices((all) =>
                        all.map((c, j) => (j === k ? e.target.value : c)),
                      )
                    }
                    maxLength={200}
                    required={k < 2}
                    placeholder={k < 2 ? "Required" : "Optional"}
                    className="text-ink min-w-0 flex-1 bg-transparent py-1 text-sm outline-none"
                  />
                </label>
              ))}
            </fieldset>
            <div>
              <label
                htmlFor={`${id}-why`}
                className="text-ink text-xs font-bold"
              >
                Rationale (shown after the answer)
              </label>
              <input
                id={`${id}-why`}
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                maxLength={500}
                className={field}
              />
            </div>
            {error && <p className="text-sm text-rose-600">{error}</p>}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="border-line text-ink hover:bg-surface rounded-lg border px-4 py-2 text-sm font-semibold"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={add.isPending}
                className="bg-navy hover:bg-navy-deep rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {add.isPending ? "Adding…" : "Add question"}
              </button>
            </div>
          </form>
        )}
      </div>
    </Card>
  );
}
