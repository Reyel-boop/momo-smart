"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

import { Card } from "~/app/_components/ui";
import type { RouterOutputs } from "~/trpc/react";
import {
  answerUnitQuestion,
  openNextUnitQuestion,
  reportUnitQuizFocusLoss,
  startUnitQuestions,
} from "../actions";

type Quiz = RouterOutputs["assessment"]["unitQuiz"];
type Running = NonNullable<Quiz["running"]>;
type OpenQuestion = NonNullable<NonNullable<Running["current"]>["question"]>;
type Feedback = Extract<
  Awaited<ReturnType<typeof answerUnitQuestion>>,
  { ok: true }
>["feedback"];

const mmss = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

/**
 * A unit's questions in focus mode: one question at a time on a full-screen
 * panel with a 2-minute clock (kept by the server, so reloading does not
 * reset it). Every answer — right, wrong or timed out — is followed at once
 * by the verdict, the correct answer and the rationale. After a try, the
 * whole try can be reviewed.
 */
export function UnitQuestionsForm({
  quiz,
  courseHref,
}: {
  quiz: Quiz;
  courseHref: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const start = () => {
    setError(null);
    startTransition(async () => {
      const result = await startUnitQuestions(quiz.id);
      if (!result.ok) setError(result.error);
      router.refresh();
    });
  };

  if (quiz.running) {
    return (
      <FocusMode
        key={`${quiz.running.id}-${quiz.running.answeredCount}`}
        running={quiz.running}
        total={quiz.questionCount}
        questionSeconds={quiz.questionSeconds}
      />
    );
  }

  if (!quiz.latest) {
    return (
      <Card className="p-6">
        <h2 className="text-ink text-lg font-extrabold">Before you start</h2>
        <Rules quiz={quiz} />
        {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
        <button
          type="button"
          onClick={start}
          disabled={pending || quiz.triesLeft === 0}
          className="bg-brand mt-5 rounded-xl px-5 py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Starting…" : "Start — Question 1"}
        </button>
      </Card>
    );
  }

  return (
    <Review
      quiz={quiz}
      latest={quiz.latest}
      courseHref={courseHref}
      onRetry={start}
      pending={pending}
      error={error}
    />
  );
}

function Rules({ quiz }: { quiz: Quiz }) {
  return (
    <ul className="text-muted mt-3 list-disc space-y-1.5 pl-5 text-sm">
      <li>
        {quiz.questionCount} questions, shown <b>one at a time</b>. You
        can&apos;t go back to a question once it&apos;s answered.
      </li>
      <li>
        You have <b>{mmss(quiz.questionSeconds)} minutes per question</b>. When
        time runs out, the question counts as wrong and the next one opens.
      </li>
      <li>
        After each answer you see right away whether you got it, the correct
        answer and the rationale.
      </li>
      <li>
        Stay on this screen. Leaving it (another tab or app) is recorded and
        your teacher can see it.
      </li>
      <li>
        {quiz.triesLeft} of {quiz.maxAttempts} tries left. Your best score
        counts.
      </li>
    </ul>
  );
}

/** The full-screen panel for a running try. */
function FocusMode({
  running,
  total,
  questionSeconds,
}: {
  running: Running;
  total: number;
  questionSeconds: number;
}) {
  const router = useRouter();
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [focusLosses, setFocusLosses] = useState(running.focusLosses);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const current = running.current;
  const questionOpen = Boolean(current?.question) && !feedback;

  // Leaving the screen while a question is open is reported to the teacher.
  useEffect(() => {
    if (!questionOpen) return;
    const onHide = () => {
      if (document.visibilityState !== "hidden") return;
      setFocusLosses((n) => n + 1);
      void reportUnitQuizFocusLoss(running.id);
    };
    const onUnload = (event: BeforeUnloadEvent) => event.preventDefault();
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("beforeunload", onUnload);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("beforeunload", onUnload);
    };
  }, [questionOpen, running.id]);

  const openNext = () => {
    setError(null);
    startTransition(async () => {
      const result = await openNextUnitQuestion(running.id);
      if (!result.ok) setError(result.error);
      router.refresh();
    });
  };

  const number = current?.number ?? total;
  return (
    <div className="bg-canvas fixed inset-0 z-50 overflow-y-auto">
      <div className="mx-auto flex min-h-full max-w-2xl flex-col px-4 py-8">
        <div className="flex items-center justify-between gap-3">
          <p className="text-muted text-xs font-bold tracking-wide uppercase">
            Focus mode · Try {running.attempt}
          </p>
          <p className="text-muted text-xs font-semibold">
            Correct so far: {running.score + (feedback?.isCorrect ? 1 : 0)} of{" "}
            {running.answeredCount + (feedback ? 1 : 0)}
          </p>
        </div>
        <ol className="mt-3 flex gap-1.5" aria-label="Progress">
          {Array.from({ length: total }, (_, i) => (
            <li
              key={i}
              className={`h-1.5 flex-1 rounded-full ${
                i < number - 1 || (i === number - 1 && feedback)
                  ? "bg-brand"
                  : i === number - 1
                    ? "bg-brand/40"
                    : "bg-line"
              }`}
            />
          ))}
        </ol>
        {focusLosses > 0 && (
          <p
            role="status"
            className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800"
          >
            You left the quiz screen {focusLosses} time
            {focusLosses === 1 ? "" : "s"}. Your teacher can see this.
          </p>
        )}

        <div className="my-auto py-6">
          {feedback ? (
            <FeedbackCard
              feedback={feedback}
              number={number}
              total={total}
              pending={pending}
              onNext={feedback.finished ? () => router.refresh() : openNext}
            />
          ) : current?.question ? (
            <QuestionCard
              key={current.question.id}
              attemptId={running.id}
              question={current.question}
              number={number}
              total={total}
              secondsLeft={current.secondsLeft}
              questionSeconds={questionSeconds}
              onAnswered={setFeedback}
            />
          ) : (
            <Card className="p-6 text-center">
              <p className="text-muted text-xs font-bold tracking-wide uppercase">
                Question {number} of {total}
              </p>
              <p className="text-ink mt-2 text-lg font-bold">
                Ready? The {mmss(questionSeconds)} clock starts when you open
                the question.
              </p>
              <button
                type="button"
                onClick={openNext}
                disabled={pending}
                className="bg-brand mt-5 rounded-xl px-5 py-3 text-sm font-bold text-white hover:opacity-90 disabled:opacity-50"
              >
                {pending ? "Opening…" : "Show question"}
              </button>
            </Card>
          )}
          {error && (
            <p role="alert" className="mt-3 text-center text-sm text-rose-600">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/** The open question with its countdown. */
function QuestionCard({
  attemptId,
  question,
  number,
  total,
  secondsLeft,
  questionSeconds,
  onAnswered,
}: {
  attemptId: string;
  question: OpenQuestion;
  number: number;
  total: number;
  secondsLeft: number;
  questionSeconds: number;
  onAnswered: (feedback: Feedback) => void;
}) {
  const [chosen, setChosen] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const deadline = useRef(Date.now() + secondsLeft * 1000);
  const [left, setLeft] = useState(secondsLeft);
  const sent = useRef(false);
  const chosenRef = useRef(chosen);
  chosenRef.current = chosen;

  const send = (optionId: string | null) => {
    if (sent.current) return;
    sent.current = true;
    setError(null);
    startTransition(async () => {
      const result = await answerUnitQuestion(attemptId, question.id, optionId);
      if (result.ok) {
        onAnswered(result.feedback);
      } else {
        sent.current = false;
        setError(result.error);
      }
    });
  };
  const sendRef = useRef(send);
  sendRef.current = send;

  // Counts down from the server's deadline; at zero, whatever is selected
  // (or nothing) is sent.
  useEffect(() => {
    const tick = () => {
      const remaining = Math.max(
        0,
        Math.ceil((deadline.current - Date.now()) / 1000),
      );
      setLeft(remaining);
      if (remaining === 0) sendRef.current(chosenRef.current);
    };
    tick();
    const timer = setInterval(tick, 250);
    return () => clearInterval(timer);
  }, []);

  const urgent = left <= 20;
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-muted text-xs font-bold tracking-wide uppercase">
          Question {number} of {total}
        </p>
        <p
          role="timer"
          aria-live={urgent ? "assertive" : "off"}
          className={`rounded-lg px-3 py-1 font-mono text-lg font-extrabold tabular-nums ${
            urgent ? "bg-rose-100 text-rose-700" : "bg-canvas text-ink"
          }`}
        >
          {mmss(left)}
        </p>
      </div>
      <div className="bg-line mt-3 h-1 overflow-hidden rounded-full">
        <div
          className={`h-full rounded-full transition-[width] duration-300 ${urgent ? "bg-rose-500" : "bg-brand"}`}
          style={{ width: `${(left / questionSeconds) * 100}%` }}
        />
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (chosen) send(chosen);
        }}
      >
        <fieldset disabled={pending || left === 0}>
          <legend className="text-ink mt-5 text-lg font-bold">
            {question.prompt}
          </legend>
          <div className="mt-4 grid gap-2">
            {question.options.map((option) => {
              const checked = chosen === option.id;
              return (
                <label
                  key={option.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-sm transition ${
                    checked
                      ? "border-brand bg-brand-soft text-ink"
                      : "border-line text-ink hover:bg-canvas"
                  }`}
                >
                  <input
                    type="radio"
                    name="answer"
                    value={option.id}
                    checked={checked}
                    onChange={() => setChosen(option.id)}
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
        {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
        <button
          type="submit"
          disabled={!chosen || pending || left === 0}
          className="bg-brand mt-5 w-full rounded-xl px-5 py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Checking…" : left === 0 ? "Time's up" : "Submit answer"}
        </button>
      </form>
    </Card>
  );
}

/** Shown right after each answer: verdict, correct answer, rationale. */
function FeedbackCard({
  feedback,
  number,
  total,
  pending,
  onNext,
}: {
  feedback: Feedback;
  number: number;
  total: number;
  pending: boolean;
  onNext: () => void;
}) {
  return (
    <Card className="p-6">
      <p className="text-muted text-xs font-bold tracking-wide uppercase">
        Question {number} of {total}
      </p>
      <p
        className={`mt-2 text-2xl font-extrabold ${feedback.isCorrect ? "text-emerald-600" : "text-rose-600"}`}
      >
        {feedback.isCorrect
          ? "✓ Correct!"
          : feedback.timedOut
            ? "⏱ Time's up"
            : "✗ Wrong"}
      </p>
      <Rationale
        correct={feedback.isCorrect}
        timedOut={feedback.timedOut}
        chosen={feedback.chosen}
        answer={feedback.correct}
        explanation={feedback.explanation}
      />
      {feedback.finished && (
        <p className="text-ink mt-4 text-sm font-semibold">
          That was the last question. Your score: {feedback.score}/
          {feedback.totalPoints}
        </p>
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={pending}
        autoFocus
        className="bg-navy hover:bg-navy-deep mt-5 w-full rounded-xl px-5 py-3 text-sm font-bold text-white transition disabled:opacity-50"
      >
        {pending
          ? "Opening…"
          : feedback.finished
            ? "See my results"
            : `Next question (${number + 1} of ${total}) — the clock starts`}
      </button>
    </Card>
  );
}

/** Review of the last finished try, every question with its rationale. */
function Review({
  quiz,
  latest,
  courseHref,
  onRetry,
  pending,
  error,
}: {
  quiz: Quiz;
  latest: NonNullable<Quiz["latest"]>;
  courseHref: string;
  onRetry: () => void;
  pending: boolean;
  error: string | null;
}) {
  const score = latest.totalScore ?? 0;
  const perfect = score >= quiz.totalPoints;
  const responses = new Map(latest.responses.map((r) => [r.questionId, r]));

  return (
    <div className="space-y-4">
      <Card
        className={`p-5 ${perfect ? "border-emerald-200 bg-emerald-50" : ""}`}
      >
        <p className="text-muted text-[11px] font-bold tracking-wide uppercase">
          Try {latest.attempt} of {quiz.maxAttempts}
        </p>
        <p className="text-ink mt-1 text-3xl font-extrabold">
          {score}/{quiz.totalPoints}
          <span className="text-muted ml-2 text-base font-semibold">
            {perfect
              ? "Perfect! Great job."
              : score / quiz.totalPoints >= 0.6
                ? "Good work."
                : "Review the discussion and try again."}
          </span>
        </p>
        {latest.focusLosses > 0 && (
          <p className="mt-1 text-xs font-semibold text-amber-700">
            You left the quiz screen {latest.focusLosses} time
            {latest.focusLosses === 1 ? "" : "s"} during this try.
          </p>
        )}
        {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {quiz.triesLeft > 0 && !perfect && (
            <button
              type="button"
              onClick={onRetry}
              disabled={pending}
              className="bg-brand rounded-xl px-4 py-2.5 text-sm font-bold text-white hover:opacity-90 disabled:opacity-50"
            >
              {pending ? "Starting…" : `Try again (${quiz.triesLeft} left)`}
            </button>
          )}
          <Link
            href={courseHref}
            className="border-line bg-surface text-ink hover:bg-canvas rounded-xl border px-4 py-2.5 text-sm font-semibold"
          >
            Back to the course
          </Link>
        </div>
      </Card>

      <ol className="space-y-3">
        {quiz.questions.map((question) => {
          const response = responses.get(question.id);
          const chosenId = response?.selectedOptionIds[0];
          const chosen = question.options.find((o) => o.id === chosenId);
          const answer = question.options.find((o) => o.isCorrect);
          return (
            <li key={question.id}>
              <Card className="p-5">
                <p className="text-ink font-semibold">
                  {question.order}. {question.prompt}
                </p>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {question.options.map((option) => {
                    const isChosen = option.id === chosenId;
                    const tone = option.isCorrect
                      ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                      : isChosen
                        ? "border-rose-300 bg-rose-50 text-rose-800"
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
                <Rationale
                  correct={response?.isCorrect === true}
                  timedOut={!chosen}
                  chosen={chosen ?? null}
                  answer={answer ?? null}
                  explanation={question.explanation}
                />
              </Card>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

type Choice = { label: string; text: string } | null;

/** The explanation shown for every answered question, right or wrong. */
function Rationale({
  correct,
  timedOut,
  chosen,
  answer,
  explanation,
}: {
  correct: boolean;
  timedOut: boolean;
  chosen: Choice;
  answer: Choice;
  explanation: string | null;
}) {
  return (
    <div
      className={`mt-3 rounded-xl border px-4 py-3 text-sm ${
        correct
          ? "border-emerald-200 bg-emerald-50 text-emerald-900"
          : "border-rose-200 bg-rose-50 text-rose-900"
      }`}
    >
      <p className="font-bold">
        {correct && chosen
          ? `Correct! ${chosen.label}. ${chosen.text} is the right answer.`
          : timedOut || !chosen
            ? "No answer was given in time."
            : `Not quite. You chose ${chosen.label}. ${chosen.text}`}
      </p>
      {!correct && answer && (
        <p className="mt-1 font-semibold">
          The correct answer is {answer.label}. {answer.text}
        </p>
      )}
      {explanation && (
        <p className="mt-1.5">
          <span className="font-bold">Rationale: </span>
          {explanation}
        </p>
      )}
    </div>
  );
}
