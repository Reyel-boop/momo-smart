"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { CheckIcon, StarIcon, TrophyIcon } from "~/app/_components/icons";
import {
  points,
  secondsLeft,
  TEAM_NAMES,
  TEAM_STYLES,
  tileStyle,
} from "~/app/_components/live-quiz";
import { api, type RouterOutputs } from "~/trpc/react";

type State = RouterOutputs["live"]["playerState"];

/**
 * The student's Live Quiz screen: join the class's game, tap a colored
 * answer before time runs out, and see right/wrong, points and rank after
 * each question.
 */
export function PlayerScreen() {
  const mine = api.live.mine.useQuery(undefined, { refetchInterval: 3000 });
  const game = mine.data;
  const join = api.live.join.useMutation({
    onSuccess: () => void mine.refetch(),
  });
  // Stay on the joined game after it ends, to show the final results (a
  // finished game is no longer listed as running). A new game replaces it.
  const [joinedId, setJoinedId] = useState<string | null>(null);
  useEffect(() => {
    if (game?.joined) setJoinedId(game.gameId);
  }, [game?.joined, game?.gameId]);

  if (joinedId && (!game || game.gameId === joinedId)) {
    return <Playing gameId={joinedId} />;
  }
  if (mine.isLoading) {
    return <Panel>Looking for a live quiz…</Panel>;
  }
  if (!game) {
    return (
      <Panel>
        <TrophyIcon className="mx-auto size-12 text-amber-400" />
        <p className="text-ink mt-3 text-xl font-extrabold">
          No live quiz right now
        </p>
        <p className="text-muted mt-1">
          When your teacher starts a Live Quiz for your class, it will appear
          here. Keep this page open.
        </p>
      </Panel>
    );
  }
  if (!game.joined) {
    return (
      <Panel>
        <p className="text-muted text-sm font-bold tracking-wide uppercase">
          Live Quiz
        </p>
        <p className="text-ink mt-1 text-2xl font-extrabold">{game.title}</p>
        <button
          type="button"
          onClick={() => join.mutate({ gameId: game.gameId })}
          disabled={join.isPending}
          className="mt-6 w-full rounded-2xl bg-amber-400 px-6 py-4 text-2xl font-black text-[#0b1437] shadow transition hover:bg-amber-300 disabled:opacity-60"
        >
          {join.isPending ? "Joining…" : "Join"}
        </button>
        {join.error && (
          <p className="mt-3 text-sm text-rose-600">{join.error.message}</p>
        )}
      </Panel>
    );
  }
  return <Playing gameId={game.gameId} />;
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-line bg-surface mx-auto mt-6 max-w-md rounded-2xl border p-8 text-center shadow-sm">
      {children}
    </div>
  );
}

function useCountdown(remainingMs: number, receivedAt: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(timer);
  }, []);
  return Math.max(0, remainingMs - (now - receivedAt));
}

function Playing({ gameId }: { gameId: string }) {
  const query = api.live.playerState.useQuery(
    { gameId },
    { refetchInterval: 1000 },
  );
  const answer = api.live.answer.useMutation({
    onSuccess: () => void query.refetch(),
  });
  const state = query.data;
  const remaining = useCountdown(state?.remainingMs ?? 0, query.dataUpdatedAt);

  if (!state) return <Panel>Connecting…</Panel>;

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <StatusBar state={state} />

      {state.status === "LOBBY" && (
        <Panel>
          <p className="text-ink text-2xl font-extrabold">You&apos;re in!</p>
          {state.me?.team !== null && state.me?.team !== undefined && (
            <p
              className={`mx-auto mt-3 w-fit rounded-full px-4 py-1.5 font-bold text-white ${TEAM_STYLES[state.me.team]}`}
            >
              {TEAM_NAMES[state.me.team]}
            </p>
          )}
          <p className="text-muted mt-3">
            Waiting for your teacher to start… {state.playerCount} joined.
          </p>
        </Panel>
      )}

      {state.status === "QUESTION" && state.question && (
        <QuestionPad
          state={state}
          remaining={remaining}
          pending={answer.isPending}
          error={answer.error?.message ?? null}
          onAnswer={(optionId) => answer.mutate({ gameId, optionId })}
        />
      )}

      {state.status === "REVEAL" && <Result state={state} />}

      {state.status === "FINISHED" && <Final state={state} />}
    </div>
  );
}

function StatusBar({ state }: { state: State }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-[#0b1437] px-4 py-3 text-white">
      <span className="truncate text-sm font-bold">{state.title}</span>
      <span className="flex items-center gap-3 text-sm font-bold">
        {state.index >= 0 && state.status !== "FINISHED" && (
          <span>
            Round {state.index + 1}/{state.total}
          </span>
        )}
        {state.me && (
          <span className="rounded-full bg-white/15 px-3 py-1 tabular-nums">
            {points(state.me.score)} pts
          </span>
        )}
      </span>
    </div>
  );
}

function QuestionPad({
  state,
  remaining,
  pending,
  error,
  onAnswer,
}: {
  state: State;
  remaining: number;
  pending: boolean;
  error: string | null;
  onAnswer: (optionId: string) => void;
}) {
  const question = state.question!;
  const chosen = state.answer?.optionId ?? null;
  const timeUp = remaining <= 0;

  return (
    <div className="space-y-4">
      <div className="bg-surface border-line flex items-start gap-3 rounded-2xl border p-4 shadow-sm">
        <p className="text-ink flex-1 text-lg font-extrabold">
          {question.prompt}
        </p>
        <span
          className={`flex size-12 shrink-0 items-center justify-center rounded-full border-4 text-lg font-black tabular-nums ${
            remaining <= 5000
              ? "border-rose-400 text-rose-600"
              : "border-amber-400 text-[#0b1437]"
          }`}
        >
          {secondsLeft(remaining)}
        </span>
      </div>

      {chosen ? (
        <Panel>
          <CheckIcon className="mx-auto size-12 text-emerald-500" />
          <p className="text-ink mt-2 text-xl font-extrabold">
            Answer locked in!
          </p>
          <p className="text-muted mt-1">Wait for the answer on the screen…</p>
        </Panel>
      ) : timeUp ? (
        <Panel>
          <p className="text-ink text-xl font-extrabold">Time&apos;s up!</p>
        </Panel>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {question.options.map((option, i) => (
            <button
              key={option.id}
              type="button"
              disabled={pending}
              onClick={() => onAnswer(option.id)}
              className={`flex min-h-32 flex-col items-center justify-center gap-1 rounded-2xl p-3 text-white shadow-lg transition active:scale-95 disabled:opacity-70 ${tileStyle(i)}`}
            >
              <span className="text-3xl font-black">{option.label}</span>
              <span className="text-sm leading-tight font-semibold">
                {option.text}
              </span>
            </button>
          ))}
        </div>
      )}
      {error && <p className="text-center text-sm text-rose-600">{error}</p>}
    </div>
  );
}

function Result({ state }: { state: State }) {
  const right = state.answer?.isCorrect === true;
  const correct = state.question?.options.find((o) => o.isCorrect);
  return (
    <div
      className={`rounded-2xl p-8 text-center text-white shadow-lg ${
        right ? "bg-emerald-600" : "bg-rose-600"
      }`}
    >
      <p className="text-3xl font-black">
        {!state.answer ? "No answer" : right ? "Correct!" : "Not quite"}
      </p>
      {right && (
        <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xl font-black">
          +{points(state.answer?.points ?? 0)} points
          <StarIcon className="size-5" />
        </p>
      )}
      {!right && correct && (
        <p className="mt-2 text-lg font-semibold">
          Answer: {correct.label}. {correct.text}
        </p>
      )}
      {state.me && (
        <p className="mt-4 text-white/90">
          You&apos;re #{state.me.rank} of {state.playerCount} ·{" "}
          {points(state.me.score)} pts
        </p>
      )}
      {state.teamMode && (
        <p className="mt-1 text-sm text-white/80">
          Team A {points(state.teams[0] ?? 0)} · Team B{" "}
          {points(state.teams[1] ?? 0)}
        </p>
      )}
    </div>
  );
}

function Final({ state }: { state: State }) {
  return (
    <Panel>
      <TrophyIcon className="mx-auto size-14 text-amber-400" />
      <p className="text-ink mt-2 text-2xl font-extrabold">Game over!</p>
      {state.me && (
        <p className="text-ink mt-2 text-lg">
          You finished <b>#{state.me.rank}</b> of {state.playerCount} with{" "}
          <b>{points(state.me.score)}</b> points.
        </p>
      )}
      <ol className="mt-4 space-y-1 text-left">
        {state.podium.map((p) => (
          <li
            key={p.playerId}
            className="bg-canvas flex items-center gap-3 rounded-lg px-3 py-2"
          >
            <span className="w-6 text-center font-black text-amber-500">
              {p.rank}
            </span>
            <span className="text-ink flex-1 truncate font-semibold">
              {p.name}
            </span>
            <span className="text-ink font-bold tabular-nums">
              {points(p.score)}
            </span>
          </li>
        ))}
      </ol>
      <Link
        href="/student/scores"
        className="text-brand mt-4 inline-block font-bold hover:underline"
      >
        See your stars on the leaderboard
      </Link>
    </Panel>
  );
}
