"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import {
  listen,
  listenErrorText,
  listenSupported,
  type Listener,
} from "~/app/_components/listen";
import { SoundToggle } from "~/app/_components/race/race-view";
import { sfx, unlock } from "~/app/_components/sfx";
import { Card } from "~/app/_components/ui";
import {
  genderOf,
  hush,
  loadVoices,
  say,
  type Speaker,
} from "~/app/_components/voice";
import {
  SPEAK_LEVELS,
  itemScore,
  itemsOf,
  needsMet,
  normalizeSpeech,
  type SpeakLevel,
} from "~/lib/games/speak-up";
import { api } from "~/trpc/react";
import { LevelResult, LockedLevel } from "../../_components/shared";
import { Stars } from "../../_components/stars";

type Answer = { heard: string; score: number };

const FEMALE_AGENTS = new Set(["ana", "bea", "mia", "kim"]);

const tone = (score: number) =>
  score >= 90
    ? {
        text: "text-emerald-700",
        box: "border-emerald-200 bg-emerald-50",
        label: "Excellent!",
      }
    : score >= 75
      ? {
          text: "text-sky-700",
          box: "border-sky-200 bg-sky-50",
          label: "Good job!",
        }
      : score >= 60
        ? {
            text: "text-amber-700",
            box: "border-amber-200 bg-amber-50",
            label: "Almost there",
          }
        : {
            text: "text-rose-700",
            box: "border-rose-200 bg-rose-50",
            label: "Try again",
          };

/** Heard words, with a plural -s dropped (as the scoring does). */
const wordSet = (text: string) =>
  new Set(
    normalizeSpeech(text)
      .split(" ")
      .filter(Boolean)
      .map((w) => (w.length > 3 && /[^s]s$/.test(w) ? w.slice(0, -1) : w)),
  );

/**
 * Speak Up!: Speech Tests (read each line aloud) and Voice Calls (answer
 * the customer out loud). The microphone's text is scored on the device for
 * feedback, and again on the server when the level is finished.
 */
export function SpeakScreen({ levelId }: { levelId: string }) {
  const level = SPEAK_LEVELS.find((l) => l.id === levelId)!;
  const access = api.game.level.useQuery(
    { game: "speak", levelId },
    { retry: false },
  );
  const [attempt, setAttempt] = useState(0);
  // Known only in the browser, so decided after the first render.
  const [supported, setSupported] = useState<boolean | null>(null);
  useEffect(() => setSupported(listenSupported()), []);

  if (access.error) {
    return <LockedLevel what="Level" message={access.error.message} />;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <Link
            href="/student/games"
            className="text-brand text-sm font-semibold hover:underline"
          >
            ← All games
          </Link>
          <p className="text-muted mt-1 text-xs font-bold tracking-wide uppercase">
            Speak Up! · {level.unitTitle} ·{" "}
            {level.kind === "READ" ? "Speech Test" : "Voice Call"}
          </p>
          <h1 className="text-ink text-2xl font-extrabold tracking-tight">
            {level.title.replace(/^\S+ /, "")}
          </h1>
        </div>
        <div className="text-right">
          <p className="text-muted text-[11px] font-semibold">Your best</p>
          <Stars count={access.data?.best ?? 0} className="size-5" />
        </div>
      </div>

      {supported === false ? (
        <Card className="px-6 py-8 text-center">
          <p className="text-4xl">🎤</p>
          <p className="text-ink mt-2 text-lg font-extrabold">
            This browser can&apos;t listen to your voice
          </p>
          <p className="text-muted mx-auto mt-1 max-w-md text-sm">
            Speak Up! needs a browser that understands speech. Open Momo Smart
            in <b>Google Chrome</b> or <b>Microsoft Edge</b> on a computer, or
            in <b>Chrome</b> on an Android phone. On an iPhone or iPad, update
            to the newest iOS and use Safari.
          </p>
        </Card>
      ) : (
        <Play
          key={attempt}
          level={level}
          ready={!!access.data && supported === true}
          best={access.data?.best ?? 0}
          nextId={access.data?.nextId ?? null}
          onRetry={() => setAttempt((n) => n + 1)}
        />
      )}
    </div>
  );
}

function Play({
  level,
  ready,
  best,
  nextId,
  onRetry,
}: {
  level: SpeakLevel;
  ready: boolean;
  best: number;
  nextId: string | null;
  onRetry: () => void;
}) {
  const router = useRouter();
  const utils = api.useUtils();
  const count = itemsOf(level);
  const isCall = level.kind === "CALL";

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(Answer | undefined)[]>([]);
  const [phase, setPhase] = useState<"ready" | "listening" | "review">("ready");
  const [interim, setInterim] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(!isCall);
  const [talking, setTalking] = useState(false);
  const [finished, setFinished] = useState(false);
  const listener = useRef<Listener | null>(null);
  const spoken = useRef(-1);
  const bottom = useRef<HTMLDivElement>(null);

  const finish = api.game.finishSpeak.useMutation({
    onSuccess: () => {
      void utils.game.hub.invalidate();
      router.refresh();
    },
  });

  const customer: Speaker = {
    role: "customer",
    gender: isCall ? genderOf(level.caller) : "female",
  };
  const agent: Speaker = {
    role: "agent",
    gender:
      !isCall || FEMALE_AGENTS.has(level.agent.toLowerCase())
        ? "female"
        : "male",
  };
  const current = answers[index];

  const speak = (text: string, who: Speaker) => {
    listener.current?.cancel();
    setTalking(true);
    // Some devices never report the end of speech: free the mic anyway.
    const limit = setTimeout(() => setTalking(false), 2500 + text.length * 80);
    void say(text, who).then(() => {
      clearTimeout(limit);
      setTalking(false);
    });
  };

  // Stop listening and speaking when leaving the page.
  useEffect(
    () => () => {
      listener.current?.cancel();
      hush();
    },
    [],
  );

  // Ring until the call is answered.
  useEffect(() => {
    if (connected) return;
    sfx.ring();
    const t = setInterval(() => sfx.ring(), 2600);
    return () => clearInterval(t);
  }, [connected]);

  // The customer says each new line once.
  useEffect(() => {
    if (!isCall || !connected || finished) return;
    const line = level.steps[index]?.customer;
    if (line && spoken.current !== index) {
      spoken.current = index;
      const t = setTimeout(() => speak(line, customer), 400);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, index, finished]);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [index, phase, finish.data]);

  const startListening = () => {
    unlock();
    hush();
    setTalking(false);
    setError(null);
    setInterim("");
    const done = (fallback: "ready" | "review") => setPhase(fallback);
    const started = listen({
      onInterim: setInterim,
      onError: (code) => {
        setError(listenErrorText(code));
        done(current ? "review" : "ready");
      },
      onDone: (guesses) => {
        listener.current = null;
        if (guesses.length === 0) {
          setError(listenErrorText("no-speech"));
          done(current ? "review" : "ready");
          return;
        }
        // The guess that fits best is what the student meant.
        const scored = guesses
          .map((heard) => ({ heard, score: itemScore(level, index, heard) }))
          .sort((a, b) => b.score - a.score)[0]!;
        // Keep the best of the student's tries at this item.
        const keep = !current || scored.score >= current.score;
        if (keep) {
          setAnswers((list) => {
            const next = [...list];
            next[index] = scored;
            return next;
          });
        }
        setInterim(scored.heard);
        if (scored.score >= 75) sfx.coin();
        else sfx.select();
        done("review");
      },
    });
    if (!started) {
      setError(listenErrorText("start"));
      return;
    }
    listener.current = started;
    setPhase("listening");
  };

  const goNext = () => {
    listener.current?.cancel();
    if (index < count - 1) {
      setIndex(index + 1);
      setPhase("ready");
      setInterim("");
      setError(null);
      return;
    }
    setFinished(true);
    hush();
    if (isCall) sfx.hangup();
    finish.mutate({
      levelId: level.id,
      heard: answers.map((a) => a?.heard ?? ""),
    });
  };

  const total = answers.reduce((s, a) => s + (a?.score ?? 0), 0);
  const average = Math.round(total / count);

  if (finished) {
    return (
      <Card className="px-4 py-4">
        {!finish.data ? (
          <p className="text-muted px-4 py-8 text-center text-sm">
            {finish.error ? finish.error.message : "Checking your answers…"}
          </p>
        ) : (
          <LevelResult
            heading={
              finish.data.stars > 0
                ? isCall
                  ? "📞 Call complete!"
                  : "🎤 Speech Test complete!"
                : "Keep practicing!"
            }
            stars={finish.data.stars}
            newStars={finish.data.newStars}
            best={Math.max(best, finish.data.best)}
            failNote="You need at least 60% for a star. Listen to the model, then try again!"
            stats={[
              { label: "Score", value: `${finish.data.percent}%` },
              {
                label: isCall ? "Steps" : "Lines",
                value: String(count),
              },
            ]}
            nextHref={nextId ? `/student/games/speak/${nextId}` : null}
            onRetry={onRetry}
          >
            <ul className="mx-auto mt-4 max-w-md space-y-1 text-left text-sm">
              {finish.data.scores.map((score, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between gap-3 rounded-lg bg-white/70 px-3 py-1.5"
                >
                  <span className="text-ink min-w-0 truncate">
                    {i + 1}.{" "}
                    {level.kind === "READ"
                      ? level.lines[i]!.text
                      : level.steps[i]!.skill}
                  </span>
                  <span className={`shrink-0 font-bold ${tone(score).text}`}>
                    {score}%
                  </span>
                </li>
              ))}
            </ul>
          </LevelResult>
        )}
      </Card>
    );
  }

  if (!connected && isCall) {
    return (
      <Card className="overflow-hidden">
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
            disabled={!ready}
            onPointerDown={unlock}
            onClick={() => {
              unlock();
              sfx.pickup();
              void loadVoices();
              setConnected(true);
            }}
            className="answer-btn rounded-full bg-emerald-500 px-8 py-3 text-lg font-black text-white shadow-lg hover:bg-emerald-600 disabled:opacity-50"
          >
            📞 Answer
          </button>
          <p className="text-muted max-w-sm text-xs">
            Turn your sound on. The customer talks first; then tap the
            microphone and <b>say your reply out loud</b>. You are {level.agent}
            , the agent.
          </p>
        </div>
        <Styles />
      </Card>
    );
  }

  const score = current?.score ?? 0;
  const t = tone(score);

  return (
    <Card className="overflow-hidden">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 px-5 py-3 text-white">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-lg">
            {isCall ? "☎" : "🎤"}
          </span>
          <div className="min-w-0">
            <p className="truncate font-bold">
              {isCall ? level.caller : "Read each line aloud"}
            </p>
            <p className="truncate text-xs text-slate-300">
              {isCall
                ? level.setup
                : "Tap the microphone, then read the line clearly."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <SoundToggle />
          <div className="text-right">
            <p className="text-[11px] font-semibold text-slate-400 uppercase">
              Score so far
            </p>
            <p className="text-lg font-black tabular-nums">
              {answers.some(Boolean) ? `${average}%` : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="border-line flex flex-wrap gap-1.5 border-b px-5 py-3">
        {Array.from({ length: count }, (_, i) => {
          const a = answers[i];
          return (
            <span
              key={i}
              className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                i === index
                  ? "bg-navy text-white"
                  : a
                    ? a.score >= 75
                      ? "bg-emerald-500 text-white"
                      : a.score >= 60
                        ? "bg-amber-500 text-white"
                        : "bg-rose-500 text-white"
                    : "bg-slate-100 text-slate-500"
              }`}
            >
              {level.kind === "CALL"
                ? `${i + 1}. ${level.steps[i]!.skill}`
                : `Line ${i + 1}`}
            </span>
          );
        })}
      </div>

      <div className="space-y-4 px-5 py-5">
        {/* Call transcript so far */}
        {level.kind === "CALL" &&
          level.steps.slice(0, index + 1).map((step, i) => (
            <div key={i} className="space-y-3">
              {step.customer ? (
                <Bubble
                  who={level.caller}
                  side="left"
                  talking={talking && i === index}
                  onReplay={() => speak(step.customer, customer)}
                >
                  {step.customer}
                </Bubble>
              ) : (
                <p className="text-muted text-center text-xs font-semibold">
                  📞 Call connected — greet the customer.
                </p>
              )}
              {i < index && answers[i] && (
                <Bubble who={`You (${level.agent})`} side="right">
                  {answers[i].heard}
                </Bubble>
              )}
            </div>
          ))}

        {/* What to say now */}
        {level.kind === "READ" ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 px-5 py-6 text-center">
            <p className="text-muted text-xs font-bold tracking-wide uppercase">
              Line {index + 1} of {count} — read this aloud
            </p>
            <p className="text-ink mt-2 text-xl leading-relaxed font-extrabold sm:text-2xl">
              {phase === "review" && current ? (
                <MarkedLine
                  text={level.lines[index]!.text}
                  heard={current.heard}
                />
              ) : (
                level.lines[index]!.text
              )}
            </p>
            {level.lines[index]!.tip && (
              <p className="text-muted mt-2 text-sm">
                💡 {level.lines[index]!.tip}
              </p>
            )}
            <button
              type="button"
              onClick={() => speak(level.lines[index]!.text, agent)}
              className="text-brand hover:bg-brand-soft mt-3 rounded-lg px-3 py-1.5 text-sm font-bold"
            >
              ▶ Hear it first
            </button>
          </div>
        ) : (
          <div className="bg-brand-soft/50 rounded-xl px-4 py-3">
            <p className="text-brand text-xs font-black tracking-wide uppercase">
              {level.steps[index]!.skill} — your turn to speak
            </p>
            <p className="text-ink mt-0.5 text-sm font-semibold">
              {level.steps[index]!.task}
            </p>
          </div>
        )}

        {/* Microphone */}
        <div className="flex flex-col items-center gap-2 pt-1">
          {phase === "listening" ? (
            <button
              type="button"
              onClick={() => listener.current?.stop()}
              className="mic-on flex size-20 items-center justify-center rounded-full bg-rose-500 text-3xl text-white shadow-lg"
              aria-label="Stop listening"
            >
              ■
            </button>
          ) : (
            <button
              type="button"
              onClick={startListening}
              disabled={!ready || (isCall && talking)}
              className="bg-navy hover:bg-navy-deep flex size-20 items-center justify-center rounded-full text-3xl text-white shadow-lg transition disabled:opacity-40"
              aria-label={current ? "Speak again" : "Tap and speak"}
            >
              🎤
            </button>
          )}
          <p className="text-muted text-center text-sm font-semibold">
            {phase === "listening"
              ? "Listening… speak now. Tap ■ when you're done."
              : isCall && talking
                ? `${level.caller} is talking…`
                : current
                  ? "Tap 🎤 to try again — your best try counts."
                  : "Tap 🎤 and speak."}
          </p>
          {phase === "listening" && (
            <p className="text-ink min-h-6 max-w-lg text-center text-base italic">
              {interim || "…"}
            </p>
          )}
          {error && (
            <p className="max-w-md rounded-lg bg-rose-50 px-3 py-2 text-center text-sm text-rose-700">
              {error}
            </p>
          )}
        </div>

        {/* Feedback */}
        {phase === "review" && current && (
          <div className={`pop-in rounded-xl border px-4 py-3 ${t.box}`}>
            <div className="flex items-center justify-between gap-3">
              <p className={`text-base font-black ${t.text}`}>{t.label}</p>
              <p className={`text-2xl font-black tabular-nums ${t.text}`}>
                {score}%
              </p>
            </div>
            <p className="text-ink mt-1 text-sm">
              <span className="text-muted font-semibold">Momo heard: </span>“
              {current.heard}”
            </p>
            {level.kind === "CALL" && (
              <>
                <ul className="mt-2 space-y-1 text-sm">
                  {needsMet(level.steps[index]!, current.heard).map((ok, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span
                        className={`flex size-5 shrink-0 items-center justify-center rounded text-xs font-black ${ok ? "bg-emerald-500 text-white" : "bg-rose-100 text-rose-600"}`}
                      >
                        {ok ? "✓" : "✗"}
                      </span>
                      <span className={ok ? "text-ink" : "text-rose-700"}>
                        {level.steps[index]!.needs[i]!.label}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="text-ink mt-2 rounded-lg bg-white/70 px-3 py-2 text-sm">
                  <span className="text-muted font-semibold">
                    A model reply:{" "}
                  </span>
                  “{level.steps[index]!.sample}”{" "}
                  <button
                    type="button"
                    onClick={() => speak(level.steps[index]!.sample, agent)}
                    className="text-brand hover:bg-brand-soft rounded px-1 text-xs font-black"
                  >
                    ▶ Hear it
                  </button>
                </p>
              </>
            )}
            {level.kind === "READ" && score < 100 && (
              <p className="text-muted mt-1 text-xs">
                Words in red were not heard. Speak a bit slower and clearer.
              </p>
            )}
          </div>
        )}

        {phase === "review" && current && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={goNext}
              className="bg-navy hover:bg-navy-deep rounded-lg px-5 py-2.5 text-sm font-bold text-white"
            >
              {index < count - 1
                ? isCall
                  ? "Continue the call →"
                  : "Next line →"
                : isCall
                  ? "End call"
                  : "Finish"}
            </button>
          </div>
        )}
        <div ref={bottom} />
      </div>
      <Styles />
    </Card>
  );
}

/** A line with each word green when heard and red when missed. */
function MarkedLine({ text, heard }: { text: string; heard: string }) {
  const said = wordSet(heard);
  return (
    <>
      {text.split(" ").map((token, i) => {
        const parts = [...wordSet(token)];
        const ok = parts.length === 0 || parts.every((w) => said.has(w));
        return (
          <span
            key={i}
            className={
              ok
                ? "text-emerald-700"
                : "text-rose-600 underline decoration-wavy"
            }
          >
            {token}{" "}
          </span>
        );
      })}
    </>
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
          {talking && <span aria-label="Speaking">🔊</span>}
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

function Styles() {
  return (
    <style>{`
      .ring-phone { animation: ring-phone .9s ease-in-out infinite; }
      @keyframes ring-phone { 0%,100% { transform: rotate(0) } 10% { transform: rotate(-14deg) } 20% { transform: rotate(14deg) } 30% { transform: rotate(-10deg) } 40% { transform: rotate(10deg) } 50% { transform: rotate(0) } }
      .answer-btn { animation: answer-btn 1.2s ease-in-out infinite; }
      @keyframes answer-btn { 0%,100% { transform: scale(1) } 50% { transform: scale(1.06) } }
      .mic-on { animation: mic-on 1.1s ease-in-out infinite; }
      @keyframes mic-on { 0%,100% { box-shadow: 0 0 0 0 rgba(244,63,94,.55) } 50% { box-shadow: 0 0 0 16px rgba(244,63,94,0) } }
      .pop-in { animation: pop-in .35s cubic-bezier(.2,1.4,.4,1) both; }
      @keyframes pop-in { from { transform: scale(.94); opacity: 0 } to { transform: scale(1); opacity: 1 } }
      @media (prefers-reduced-motion: reduce) { .ring-phone, .answer-btn, .mic-on, .pop-in { animation: none } }
    `}</style>
  );
}
