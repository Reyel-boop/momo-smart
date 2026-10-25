"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import {
  CheckIcon,
  ExpandIcon,
  StarIcon,
  TrophyIcon,
  UsersIcon,
} from "~/app/_components/icons";
import {
  points,
  secondsLeft,
  TEAM_NAMES,
  TEAM_STYLES,
  tileStyle,
} from "~/app/_components/live-quiz";
import { api, type RouterOutputs } from "~/trpc/react";

type State = RouterOutputs["live"]["hostState"];

/** Counts down locally between polls, from the server's remaining time. */
function useCountdown(remainingMs: number, receivedAt: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(timer);
  }, []);
  return Math.max(0, remainingMs - (now - receivedAt));
}

/**
 * The projector screen of a Live Quiz: lobby, each question with its
 * countdown and answer tiles, the reveal with the scoreboard, and the
 * podium. The game moves on when the teacher presses the big button; the
 * answer is revealed automatically when time is up or everyone answered.
 */
export function HostScreen({ gameId }: { gameId: string }) {
  const query = api.live.hostState.useQuery(
    { gameId },
    { refetchInterval: 1000, refetchIntervalInBackground: true },
  );
  const utils = api.useUtils();
  const refresh = () => void utils.live.hostState.invalidate({ gameId });
  const start = api.live.start.useMutation({ onSuccess: refresh });
  const reveal = api.live.reveal.useMutation({ onSuccess: refresh });
  const next = api.live.next.useMutation({ onSuccess: refresh });
  const end = api.live.end.useMutation({ onSuccess: refresh });

  const state = query.data;
  const remaining = useCountdown(state?.remainingMs ?? 0, query.dataUpdatedAt);

  // Reveal once per question: time is up, or every player has answered.
  const revealedFor = useRef(-1);
  useEffect(() => {
    if (state?.status !== "QUESTION") return;
    const everyone =
      state.players.length > 0 && state.answered >= state.players.length;
    if ((remaining <= 0 || everyone) && revealedFor.current !== state.index) {
      revealedFor.current = state.index;
      reveal.mutate({ gameId });
    }
  }, [state, remaining, reveal, gameId]);

  if (query.error) {
    return (
      <Shell>
        <p className="text-lg text-white/80">{query.error.message}</p>
        <Link
          href="/teacher/live"
          className="mt-4 font-bold text-white underline"
        >
          Back to Live Quiz
        </Link>
      </Shell>
    );
  }
  if (!state) {
    return (
      <Shell>
        <p className="text-lg text-white/70">Loading the game…</p>
      </Shell>
    );
  }

  const busy =
    start.isPending || reveal.isPending || next.isPending || end.isPending;

  return (
    <Shell>
      <Header
        state={state}
        remaining={remaining}
        onEnd={() => {
          if (window.confirm("End this live quiz now?")) end.mutate({ gameId });
        }}
      />
      <div className="flex min-h-0 flex-1 flex-col">
        {state.status === "LOBBY" && (
          <Lobby
            state={state}
            busy={busy}
            onStart={() => start.mutate({ gameId })}
          />
        )}
        {(state.status === "QUESTION" || state.status === "REVEAL") &&
          state.question && (
            <QuestionView
              state={state}
              busy={busy}
              onReveal={() => {
                revealedFor.current = state.index;
                reveal.mutate({ gameId });
              }}
              onNext={() => next.mutate({ gameId })}
            />
          )}
        {state.status === "FINISHED" && <Podium state={state} />}
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-gradient-to-br from-[#0b1437] via-[#14245c] to-[#0b1437] px-4 py-4 text-white sm:px-8 sm:py-6">
      {children}
    </div>
  );
}

function Header({
  state,
  remaining,
  onEnd,
}: {
  state: State;
  remaining: number;
  onEnd: () => void;
}) {
  const playing = state.status === "QUESTION" || state.status === "REVEAL";
  return (
    <header className="mb-5 flex flex-wrap items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-xs font-bold tracking-[0.18em] text-white/60 uppercase">
          Live Quiz · {state.title}
        </p>
        <p className="truncate text-lg font-extrabold">{state.unit}</p>
      </div>

      {state.teamMode && (
        <div className="flex items-center gap-3">
          {TEAM_NAMES.map((team, i) => (
            <div
              key={team}
              className={`rounded-xl px-4 py-2 text-center ${TEAM_STYLES[i]} ${i === 1 ? "order-3" : ""}`}
            >
              <p className="text-[11px] font-bold tracking-wide uppercase opacity-80">
                {team}
              </p>
              <p className="text-2xl font-black tabular-nums">
                {points(state.teams[i] ?? 0)}
              </p>
            </div>
          ))}
          <span className="order-2 text-2xl font-black text-amber-300 italic">
            VS
          </span>
        </div>
      )}

      <div className="flex items-center gap-3">
        {playing && (
          <span className="rounded-full bg-white/10 px-3 py-1.5 text-sm font-bold">
            Round {state.index + 1}/{state.total}
          </span>
        )}
        {state.status === "QUESTION" && (
          <span
            className={`flex size-16 flex-col items-center justify-center rounded-full border-4 text-2xl font-black tabular-nums ${
              remaining <= 5000
                ? "border-rose-400 text-rose-300"
                : "border-amber-300 text-white"
            }`}
            aria-label={`${secondsLeft(remaining)} seconds left`}
          >
            {secondsLeft(remaining)}
          </span>
        )}
        <button
          type="button"
          onClick={() => void document.documentElement.requestFullscreen?.()}
          className="rounded-lg bg-white/10 p-2.5 hover:bg-white/20"
          aria-label="Full screen"
        >
          <ExpandIcon className="size-5" />
        </button>
        {state.status !== "FINISHED" ? (
          <button
            type="button"
            onClick={onEnd}
            className="rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/20"
          >
            End
          </button>
        ) : (
          <Link
            href="/teacher/live"
            className="rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/20"
          >
            Close
          </Link>
        )}
      </div>
    </header>
  );
}

function Lobby({
  state,
  busy,
  onStart,
}: {
  state: State;
  busy: boolean;
  onStart: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
      <div>
        <h1 className="text-4xl font-black sm:text-6xl">Join the Live Quiz!</h1>
        <p className="mt-3 text-lg text-white/80 sm:text-2xl">
          On your phone: open <b>Momo Smart</b> → <b>Live Quiz</b> → <b>Join</b>
        </p>
        <p className="mt-1 text-white/60">
          {state.total} questions · {state.secondsPerQuestion} seconds each
          {state.teamMode && " · Team A vs Team B"}
        </p>
      </div>

      <div className="w-full max-w-5xl">
        <p className="mb-3 inline-flex items-center gap-2 text-xl font-bold">
          <UsersIcon className="size-6" />
          {state.players.length} joined
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {state.players.map((p) => (
            <span
              key={p.playerId}
              className={`rounded-full px-4 py-2 text-base font-bold ${
                p.team === null ? "bg-white/15" : TEAM_STYLES[p.team]
              }`}
            >
              {p.name}
            </span>
          ))}
          {state.players.length === 0 && (
            <p className="text-white/60">Waiting for students to join…</p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={onStart}
        disabled={busy || state.players.length === 0}
        className="rounded-2xl bg-amber-400 px-10 py-4 text-2xl font-black text-[#0b1437] shadow-lg transition hover:bg-amber-300 disabled:opacity-50"
      >
        Start
      </button>
    </div>
  );
}

function QuestionView({
  state,
  busy,
  onReveal,
  onNext,
}: {
  state: State;
  busy: boolean;
  onReveal: () => void;
  onNext: () => void;
}) {
  const question = state.question!;
  const revealing = state.status === "REVEAL";
  const last = state.index + 1 >= state.total;
  const top = state.players.slice(0, 5);

  return (
    <div className="flex flex-1 flex-col gap-5">
      <div className="rounded-2xl bg-white px-6 py-6 text-center text-[#0b1437] shadow-xl sm:py-8">
        <p className="text-2xl leading-snug font-extrabold sm:text-4xl">
          {question.prompt}
        </p>
      </div>

      <div className="grid flex-1 gap-3 sm:grid-cols-2 sm:gap-4">
        {question.options.map((option, i) => {
          const dim = revealing && !option.isCorrect;
          return (
            <div
              key={option.id}
              className={`relative flex min-h-24 items-center gap-4 rounded-2xl px-5 py-4 shadow-lg transition ${tileStyle(i)} ${dim ? "opacity-35" : ""} ${revealing && option.isCorrect ? "ring-4 ring-white" : ""}`}
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/25 text-2xl font-black">
                {option.label}
              </span>
              <span className="text-xl font-bold sm:text-2xl">
                {option.text}
              </span>
              {revealing && (
                <span className="ml-auto flex shrink-0 items-center gap-2 text-2xl font-black">
                  {option.isCorrect && <CheckIcon className="size-8" />}
                  {option.count}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {revealing ? (
        <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
          <div className="rounded-2xl bg-white/10 px-5 py-4">
            <p className="text-lg font-extrabold">
              {state.correct} of {state.answered} got it right
            </p>
            {question.explanation && (
              <p className="mt-1 text-white/80">{question.explanation}</p>
            )}
          </div>
          <div className="rounded-2xl bg-white/10 px-5 py-4">
            <p className="mb-2 text-xs font-bold tracking-wide text-white/60 uppercase">
              Top players
            </p>
            <ol className="space-y-1.5">
              {top.map((p) => (
                <li key={p.playerId} className="flex items-center gap-3">
                  <span className="w-6 text-center font-black text-amber-300">
                    {p.rank}
                  </span>
                  <span className="min-w-0 flex-1 truncate font-semibold">
                    {p.name}
                  </span>
                  <span className="font-black tabular-nums">
                    {points(p.score)}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      ) : (
        <p className="text-center text-lg font-bold text-white/80">
          {state.answered} of {state.players.length} answered
        </p>
      )}

      <div className="flex justify-center pb-2">
        {revealing ? (
          <button
            type="button"
            onClick={onNext}
            disabled={busy}
            className="rounded-2xl bg-amber-400 px-10 py-3.5 text-xl font-black text-[#0b1437] hover:bg-amber-300 disabled:opacity-50"
          >
            {last ? "Final results" : "Next question"}
          </button>
        ) : (
          <button
            type="button"
            onClick={onReveal}
            disabled={busy}
            className="rounded-xl bg-white/10 px-6 py-2.5 text-sm font-bold hover:bg-white/20 disabled:opacity-50"
          >
            Show the answer now
          </button>
        )}
      </div>
    </div>
  );
}

function Podium({ state }: { state: State }) {
  const [first, second, third] = state.players;
  const places = [
    { player: second, height: "h-40", color: "bg-slate-300", place: 2 },
    { player: first, height: "h-56", color: "bg-amber-400", place: 1 },
    { player: third, height: "h-28", color: "bg-orange-400", place: 3 },
  ];
  const winningTeam =
    state.teamMode && state.teams[0] !== state.teams[1]
      ? (state.teams[0] ?? 0) > (state.teams[1] ?? 0)
        ? 0
        : 1
      : null;

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
      <div>
        <TrophyIcon className="mx-auto size-14 text-amber-300" />
        <h1 className="mt-2 text-4xl font-black sm:text-5xl">Final results</h1>
        {state.teamMode && (
          <p className="mt-2 text-2xl font-extrabold text-amber-300">
            {winningTeam === null
              ? "It's a tie!"
              : `${TEAM_NAMES[winningTeam]} wins!`}
          </p>
        )}
      </div>
      <div className="flex items-end justify-center gap-3 sm:gap-6">
        {places.map(
          ({ player, height, color, place }) =>
            player && (
              <div
                key={place}
                className="flex w-32 flex-col items-center sm:w-44"
              >
                <p className="truncate text-lg font-extrabold">{player.name}</p>
                <p className="mb-2 font-bold text-white/80 tabular-nums">
                  {points(player.score)} pts
                </p>
                <div
                  className={`flex w-full items-start justify-center rounded-t-2xl pt-3 text-4xl font-black text-[#0b1437] ${height} ${color}`}
                >
                  {place}
                </div>
              </div>
            ),
        )}
      </div>
      <p className="inline-flex items-center gap-2 text-white/70">
        <StarIcon className="size-5 text-amber-300" />
        Every correct answer earned a star on the Scores leaderboard.
      </p>
      <Link
        href="/teacher/live"
        className="rounded-2xl bg-amber-400 px-8 py-3 text-lg font-black text-[#0b1437] hover:bg-amber-300"
      >
        Play another
      </Link>
    </div>
  );
}
