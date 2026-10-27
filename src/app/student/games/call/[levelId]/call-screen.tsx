"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { LockIcon } from "~/app/_components/icons";
import { SoundToggle } from "~/app/_components/race/race-view";
import { sfx, unlock } from "~/app/_components/sfx";
import { Card } from "~/app/_components/ui";
import {
  genderOf,
  hush,
  loadVoices,
  say,
  type Gender,
  type Speaker,
} from "~/app/_components/voice";
import { CALL_LEVELS, type CallLevel } from "~/lib/games/call-sim";
import { api } from "~/trpc/react";
import { Stars } from "../../_components/stars";

/** A fixed shuffle of a step's replies, so the best one isn't always first. */
function order(levelId: string, step: number, count: number) {
  const key = (i: number) => {
    let h = 7;
    for (const ch of `${levelId}:${step}:${i}`)
      h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    return h;
  };
  return Array.from({ length: count }, (_, i) => i).sort(
    (a, b) => key(a) - key(b),
  );
}

/** Agent names in the scripts that take a female voice. */
const FEMALE_AGENTS = new Set([
  "ana",
  "mia",
  "lea",
  "bea",
  "kim",
  "ivy",
  "rina",
  "sam",
]);

/** The agent's voice, from the name in the call's opening ("this is Ana"). */
function agentGender(level: CallLevel): Gender {
  const name = level.steps[0]?.options
    .map((o) => /this is (\w+)/i.exec(o.text)?.[1])
    .find(Boolean);
  return name && FEMALE_AGENTS.has(name.toLowerCase()) ? "female" : "male";
}

const clock = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

const TONE = {
  10: {
    box: "border-emerald-200 bg-emerald-50 text-emerald-900",
    tag: "bg-emerald-500",
    label: "Great reply! +10",
  },
  5: {
    box: "border-amber-200 bg-amber-50 text-amber-900",
    tag: "bg-amber-500",
    label: "Okay reply +5",
  },
  0: {
    box: "border-rose-200 bg-rose-50 text-rose-900",
    tag: "bg-rose-500",
    label: "Not the best reply +0",
  },
} as const;

/**
 * One Call Simulator call: the customer speaks, the student picks what the
 * agent says, and feedback explains each choice. Satisfaction and handle
 * time update as the call goes; the server scores the finished call.
 */
export function CallScreen({ levelId }: { levelId: string }) {
  const level = CALL_LEVELS.find((l) => l.id === levelId)!;
  const access = api.game.level.useQuery(
    { game: "call", levelId },
    { retry: false },
  );
  const [attempt, setAttempt] = useState(0);

  if (access.error) {
    return (
      <Card className="mx-auto max-w-lg px-6 py-10 text-center">
        <LockIcon className="text-muted mx-auto size-10" />
        <p className="text-ink mt-3 text-lg font-extrabold">Call locked</p>
        <p className="text-muted mt-1 text-sm">{access.error.message}</p>
        <Link
          href="/student/games"
          className="bg-navy mt-5 inline-flex rounded-lg px-4 py-2 text-sm font-bold text-white"
        >
          Back to Games
        </Link>
      </Card>
    );
  }

  return (
    <Call
      key={attempt}
      level={level}
      best={access.data?.best ?? 0}
      ready={!!access.data}
      onRetry={() => setAttempt((n) => n + 1)}
    />
  );
}

function Call({
  level,
  best,
  ready,
  onRetry,
}: {
  level: CallLevel;
  best: number;
  ready: boolean;
  onRetry: () => void;
}) {
  const router = useRouter();
  const utils = api.useUtils();
  const [choices, setChoices] = useState<number[]>([]);
  // The step whose feedback is showing (picked, not yet moved on).
  const [reviewing, setReviewing] = useState(false);
  const finish = api.game.finishCall.useMutation({
    onSuccess: () => {
      void utils.game.hub.invalidate();
      router.refresh();
    },
  });
  const bottom = useRef<HTMLDivElement>(null);
  // The call rings until the student answers it.
  const [connected, setConnected] = useState(false);
  const [speaking, setSpeaking] = useState<"customer" | "agent" | null>(null);
  const spoken = useRef(-1);
  const hungUp = useRef(false);
  const customer: Speaker = {
    role: "customer",
    gender: genderOf(level.caller),
  };
  const agent: Speaker = { role: "agent", gender: agentGender(level) };

  const speak = (text: string, who: Speaker) => {
    setSpeaking(who.role);
    void say(text, who).then(() =>
      setSpeaking((now) => (now === who.role ? null : now)),
    );
  };

  const stepIndex = reviewing ? choices.length - 1 : choices.length;
  const done = choices.length === level.steps.length && !reviewing;
  const picked = choices.map((c, i) => level.steps[i]!.options[c]!);
  const points = picked.reduce((s, o) => s + o.points, 0);
  const seconds = picked.reduce((s, o) => s + o.seconds, 0);
  const satisfaction =
    picked.length === 0
      ? 70
      : Math.round((points / (picked.length * 10)) * 100);
  const index = CALL_LEVELS.indexOf(level);
  const next = CALL_LEVELS[index + 1];

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [choices.length, reviewing, finish.data]);

  useEffect(() => {
    if (done && ready && !finish.data && !finish.isPending && !finish.error) {
      finish.mutate({ levelId: level.id, choices });
    }
  }, [done, ready, finish, level.id, choices]);

  // Ring while waiting to be answered.
  useEffect(() => {
    if (connected) return;
    sfx.ring();
    const t = setInterval(() => sfx.ring(), 2600);
    return () => clearInterval(t);
  }, [connected]);

  // The customer says each new line once.
  useEffect(() => {
    if (!connected || reviewing || done) return;
    const line = level.steps[stepIndex]?.customer;
    if (line && spoken.current !== stepIndex) {
      spoken.current = stepIndex;
      const t = setTimeout(() => speak(line, customer), 350);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, reviewing, done, stepIndex]);

  // The line goes dead when the call ends; silence when leaving the page.
  useEffect(() => {
    if (done && !hungUp.current) {
      hungUp.current = true;
      hush();
      sfx.hangup();
    }
  }, [done]);
  useEffect(() => () => hush(), []);

  const mood =
    satisfaction >= 85
      ? "😊"
      : satisfaction >= 60
        ? "🙂"
        : satisfaction >= 40
          ? "😐"
          : "😠";

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <Link
            href="/student/games"
            className="text-brand text-sm font-semibold hover:underline"
          >
            ← Games
          </Link>
          <p className="text-muted mt-1 text-xs font-bold tracking-wide uppercase">
            Call Simulator · Unit {level.unit} · {level.unitTitle} · Call{" "}
            {index + 1} of {CALL_LEVELS.length}
          </p>
          <h1 className="text-ink text-2xl font-extrabold tracking-tight">
            {level.title}
          </h1>
        </div>
        <div className="text-right">
          <p className="text-muted text-[11px] font-semibold">Your best</p>
          <Stars count={best} className="size-6" />
        </div>
      </div>

      {/* Agent console */}
      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 px-5 py-4 text-white">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-full bg-emerald-500 text-xl">
              {done ? "✓" : "☎"}
            </span>
            <div>
              <p className="font-bold">{level.caller}</p>
              <p className="text-xs text-slate-300">{level.setup}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-5 text-sm">
            <SoundToggle />
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase">
                Satisfaction
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-lg">{mood}</span>
                <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-700">
                  <div
                    className={`h-full transition-all duration-500 ${
                      satisfaction >= 70
                        ? "bg-emerald-400"
                        : satisfaction >= 50
                          ? "bg-amber-400"
                          : "bg-rose-400"
                    }`}
                    style={{ width: `${satisfaction}%` }}
                  />
                </div>
              </div>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase">
                Handle time
              </p>
              <p
                className={`mt-1 font-mono text-lg font-bold ${
                  seconds > level.targetSeconds ? "text-rose-300" : "text-white"
                }`}
              >
                {clock(seconds)}
                <span className="text-xs font-normal text-slate-400">
                  {" "}
                  / {clock(level.targetSeconds)}
                </span>
              </p>
            </div>
          </div>
        </div>

        {!connected && (
          <div className="flex flex-col items-center gap-4 px-5 py-10 text-center">
            <span className="ring-phone flex size-20 items-center justify-center rounded-full bg-emerald-500 text-4xl text-white shadow-lg">
              ☎
            </span>
            <div>
              <p className="text-muted text-xs font-bold tracking-[0.2em] uppercase">
                Incoming call…
              </p>
              <p className="text-ink text-2xl font-black">{level.caller}</p>
              <p className="text-muted text-sm">{level.setup}</p>
            </div>
            <button
              type="button"
              onPointerDown={unlock}
              onClick={() => {
                unlock();
                sfx.pickup();
                void loadVoices();
                setConnected(true);
              }}
              className="answer-btn rounded-full bg-emerald-500 px-8 py-3 text-lg font-black text-white shadow-lg hover:bg-emerald-600"
            >
              📞 Answer
            </button>
            <p className="text-muted max-w-sm text-xs">
              Turn your sound on: the customer speaks, and your replies are read
              back in the agent&apos;s voice.
            </p>
          </div>
        )}

        {connected && (
          <>
            {/* Call flow */}
            <div className="border-line flex flex-wrap gap-1.5 border-b px-5 py-3">
              {level.steps.map((s, i) => (
                <span
                  key={i}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                    i < choices.length
                      ? `${TONE[picked[i]!.points].tag} text-white`
                      : i === stepIndex
                        ? "bg-navy text-white"
                        : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {i + 1}. {s.skill}
                </span>
              ))}
            </div>

            {/* Transcript */}
            <div className="space-y-3 px-5 py-5">
              {level.steps.slice(0, stepIndex + 1).map((s, i) => {
                const chosen = picked[i];
                return (
                  <div key={i} className="space-y-3">
                    {s.customer ? (
                      <Bubble
                        who={level.caller}
                        side="left"
                        talking={speaking === "customer" && i === stepIndex}
                        onReplay={() => speak(s.customer, customer)}
                      >
                        {s.customer}
                      </Bubble>
                    ) : (
                      <p className="text-muted text-center text-xs font-semibold">
                        📞 Call connected — greet the customer.
                      </p>
                    )}
                    {chosen && (
                      <Bubble
                        who="You (agent)"
                        side="right"
                        talking={
                          speaking === "agent" && i === choices.length - 1
                        }
                        onReplay={() => speak(chosen.text, agent)}
                      >
                        {chosen.text}
                      </Bubble>
                    )}
                    {chosen && (i < choices.length - 1 || reviewing) && (
                      <div
                        className={`rounded-xl border px-4 py-2.5 text-sm ${TONE[chosen.points].box}`}
                      >
                        <span className="font-bold">
                          {TONE[chosen.points].label}
                        </span>{" "}
                        — {chosen.feedback}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Replies for the current step */}
              {!done && !reviewing && (
                <div className="space-y-2 pt-2">
                  <p className="text-muted text-xs font-bold tracking-wide uppercase">
                    {level.steps[stepIndex]!.skill} — what do you say?
                  </p>
                  {order(
                    level.id,
                    stepIndex,
                    level.steps[stepIndex]!.options.length,
                  ).map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => {
                        setChoices((c) => [...c, k]);
                        setReviewing(true);
                        speak(level.steps[stepIndex]!.options[k]!.text, agent);
                      }}
                      className="border-line hover:border-brand hover:bg-brand-soft/40 text-ink block w-full rounded-xl border px-4 py-3 text-left text-sm font-semibold transition"
                    >
                      “{level.steps[stepIndex]!.options[k]!.text}”
                    </button>
                  ))}
                </div>
              )}
              {reviewing && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setReviewing(false)}
                    className="bg-navy hover:bg-navy-deep rounded-lg px-5 py-2 text-sm font-bold text-white"
                  >
                    {choices.length === level.steps.length
                      ? "End call"
                      : "Continue →"}
                  </button>
                </div>
              )}

              {/* Result */}
              {done && (
                <div className="rounded-xl bg-gradient-to-r from-amber-50 to-emerald-50 px-5 py-5 text-center">
                  {!finish.data ? (
                    <p className="text-muted text-sm">
                      {finish.error
                        ? finish.error.message
                        : "Scoring your call…"}
                    </p>
                  ) : (
                    <>
                      <p className="text-ink text-xl font-black">
                        {finish.data.stars > 0
                          ? "📞 Call complete!"
                          : "Call failed — try again"}
                      </p>
                      <div className="mt-2 flex justify-center">
                        <Stars count={finish.data.stars} className="size-9" />
                      </div>
                      <div className="mt-3 flex flex-wrap justify-center gap-6 text-sm">
                        <p>
                          <span className="text-muted block text-xs">
                            Quality score
                          </span>
                          <span className="text-ink text-lg font-black">
                            {finish.data.percent}%
                          </span>
                        </p>
                        <p>
                          <span className="text-muted block text-xs">
                            Handle time
                          </span>
                          <span
                            className={`text-lg font-black ${finish.data.overTime ? "text-rose-600" : "text-ink"}`}
                          >
                            {clock(finish.data.seconds)}
                          </span>
                        </p>
                      </div>
                      <p className="text-muted mt-2 text-sm">
                        {finish.data.overTime &&
                          "You went well over the target handle time, so you lost a star. "}
                        {finish.data.stars === 0
                          ? "You need at least 50% to pass this call."
                          : finish.data.newStars > 0
                            ? `+${finish.data.newStars} Star${finish.data.newStars === 1 ? "" : "s"} on the leaderboard`
                            : `Your best is still ${finish.data.best} star${finish.data.best === 1 ? "" : "s"}`}
                      </p>
                      <div className="mt-4 flex flex-wrap justify-center gap-2">
                        {finish.data.stars > 0 && next && (
                          <Link
                            href={`/student/games/call/${next.id}`}
                            className="bg-navy hover:bg-navy-deep rounded-lg px-5 py-2 text-sm font-bold text-white"
                          >
                            Next call →
                          </Link>
                        )}
                        {finish.data.stars > 0 && !next && (
                          <p className="text-ink self-center text-sm font-bold">
                            🏆 You handled every call!
                          </p>
                        )}
                        {finish.data.stars < 3 && (
                          <button
                            type="button"
                            onClick={onRetry}
                            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700"
                          >
                            Try again
                          </button>
                        )}
                        <Link
                          href="/student/games"
                          className="border-line text-ink hover:bg-surface rounded-lg border px-4 py-2 text-sm font-semibold"
                        >
                          All calls
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}
              <div ref={bottom} />
            </div>
          </>
        )}
      </Card>
      <style>{`
        .ring-phone { animation: ring-phone .9s ease-in-out infinite; box-shadow: 0 0 0 0 rgba(16,185,129,.6); }
        @keyframes ring-phone { 0%,100% { transform: rotate(0); box-shadow: 0 0 0 0 rgba(16,185,129,.55) } 10% { transform: rotate(-14deg) } 20% { transform: rotate(14deg) } 30% { transform: rotate(-10deg) } 40% { transform: rotate(10deg) } 50% { transform: rotate(0); box-shadow: 0 0 0 18px rgba(16,185,129,0) } }
        .answer-btn { animation: answer-btn 1.2s ease-in-out infinite; }
        @keyframes answer-btn { 0%,100% { transform: scale(1) } 50% { transform: scale(1.06) } }
        .talk-bar { animation: talk-bar .5s ease-in-out infinite alternate; transform-origin: 50% 100%; }
        @keyframes talk-bar { from { transform: scaleY(.3) } to { transform: scaleY(1) } }
        @media (prefers-reduced-motion: reduce) { .ring-phone, .answer-btn, .talk-bar { animation: none } }
      `}</style>
    </div>
  );
}

function Bubble({
  who,
  side,
  talking = false,
  onReplay,
  children,
}: {
  who: string;
  side: "left" | "right";
  talking?: boolean;
  onReplay?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex ${side === "right" ? "justify-end" : ""}`}>
      <div className="max-w-[85%]">
        <p
          className={`text-muted mb-0.5 flex items-center gap-1.5 text-[11px] font-bold ${side === "right" ? "justify-end" : ""}`}
        >
          {who}
          {talking && (
            <span className="flex h-3 items-end gap-0.5" aria-label="Speaking">
              {[0, 1, 2, 3].map((b) => (
                <span
                  key={b}
                  className="talk-bar bg-brand block h-3 w-0.5 rounded-full"
                  style={{ animationDelay: `${b * 0.12}s` }}
                />
              ))}
            </span>
          )}
          {onReplay && (
            <button
              type="button"
              onClick={onReplay}
              className="text-brand hover:bg-brand-soft rounded px-1 text-[11px] font-black"
              aria-label="Play this line again"
              title="Play this line again"
            >
              ▶
            </button>
          )}
        </p>
        <p
          className={`rounded-2xl px-4 py-2.5 text-sm ${
            side === "right"
              ? "bg-navy rounded-tr-sm text-white"
              : "rounded-tl-sm bg-slate-100 text-slate-800"
          }`}
        >
          {children}
        </p>
      </div>
    </div>
  );
}
