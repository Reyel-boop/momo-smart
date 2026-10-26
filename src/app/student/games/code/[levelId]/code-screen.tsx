"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { CheckIcon, LockIcon } from "~/app/_components/icons";
import { Card } from "~/app/_components/ui";
import { CODE_LEVELS } from "~/lib/games/code-quest";
import { api } from "~/trpc/react";
import { Stars } from "../../_components/stars";

/**
 * One Code Quest level: the mission on top, a code editor beside a live
 * preview, and a checklist that ticks itself as the code meets each goal.
 * The preview is a sandboxed frame with scripts off, so the checks can read
 * its page safely.
 */
export function CodeScreen({ levelId }: { levelId: string }) {
  const level = CODE_LEVELS.find((l) => l.id === levelId)!;
  const router = useRouter();
  const utils = api.useUtils();
  const access = api.game.level.useQuery(
    { game: "code", levelId },
    { retry: false },
  );

  const [code, setCode] = useState(level.starter);
  // The preview lags the editor a little so it doesn't flicker while typing.
  const [shown, setShown] = useState(level.starter);
  const [results, setResults] = useState<boolean[]>(() =>
    level.checks.map(() => false),
  );
  const [showHint, setShowHint] = useState(false);
  const [sawSolution, setSawSolution] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setShown(code), 350);
    return () => clearTimeout(t);
  }, [code]);

  const runChecks = useCallback(() => {
    const doc = frame.current?.contentDocument;
    const win = frame.current?.contentWindow;
    if (!doc || !win) return;
    setResults(
      level.checks.map((check) => {
        try {
          return check.test({ doc, win, code: shown });
        } catch {
          return false;
        }
      }),
    );
  }, [level, shown]);

  const finish = api.game.finishCode.useMutation({
    onSuccess: () => {
      void utils.game.hub.invalidate();
      router.refresh();
    },
  });

  const passed = results.filter(Boolean).length;
  const allPassed = passed === level.checks.length;
  const index = CODE_LEVELS.indexOf(level);
  const next = CODE_LEVELS[index + 1];

  if (access.error) {
    return (
      <Card className="mx-auto max-w-lg px-6 py-10 text-center">
        <LockIcon className="text-muted mx-auto size-10" />
        <p className="text-ink mt-3 text-lg font-extrabold">Level locked</p>
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
    <div className="mx-auto max-w-7xl space-y-4">
      {/* Mission */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <Link
            href="/student/games"
            className="text-brand text-sm font-semibold hover:underline"
          >
            ← Games
          </Link>
          <p className="text-muted mt-1 text-xs font-bold tracking-wide uppercase">
            Code Quest · Unit {level.unit} · {level.unitTitle} · Level{" "}
            {index + 1} of {CODE_LEVELS.length}
          </p>
          <h1 className="text-ink text-2xl font-extrabold tracking-tight">
            {level.title}
          </h1>
        </div>
        <div className="text-right">
          <p className="text-muted text-[11px] font-semibold">Your best</p>
          <Stars count={access.data?.best ?? 0} className="size-6" />
        </div>
      </div>

      <Card className="px-5 py-4">
        <p className="text-muted text-sm">{level.story}</p>
        <p className="text-ink mt-2 text-[15px] font-bold">
          🎯 Mission: <span className="font-semibold">{level.goal}</span>
        </p>
        {showHint && (
          <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
            💡 {level.hint}
          </p>
        )}
      </Card>

      {/* Editor and preview */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="flex min-h-[380px] flex-col overflow-hidden">
          <div className="flex items-center justify-between bg-slate-800 px-4 py-2">
            <span className="font-mono text-xs font-bold text-slate-300">
              index.html
            </span>
            <button
              type="button"
              onClick={() => setCode(level.starter)}
              className="text-xs font-semibold text-slate-300 hover:text-white"
            >
              Reset
            </button>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => {
              // Tab indents instead of leaving the editor.
              if (e.key !== "Tab") return;
              e.preventDefault();
              const el = e.currentTarget;
              const { selectionStart: a, selectionEnd: b } = el;
              const value = code.slice(0, a) + "  " + code.slice(b);
              setCode(value);
              requestAnimationFrame(() => {
                el.selectionStart = el.selectionEnd = a + 2;
              });
            }}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            aria-label="Your code"
            className="min-h-[340px] flex-1 resize-none bg-slate-900 p-4 font-mono text-[13px] leading-6 text-emerald-100 caret-amber-300 outline-none"
          />
        </Card>

        <Card className="flex min-h-[380px] flex-col overflow-hidden">
          <div className="border-line flex items-center gap-2 border-b bg-slate-50 px-4 py-2">
            <span className="size-2.5 rounded-full bg-rose-400" />
            <span className="size-2.5 rounded-full bg-amber-400" />
            <span className="size-2.5 rounded-full bg-emerald-400" />
            <span className="text-muted ml-2 text-xs font-semibold">
              Live preview
            </span>
          </div>
          <iframe
            ref={frame}
            title="Live preview"
            sandbox="allow-same-origin"
            srcDoc={shown}
            onLoad={runChecks}
            className="min-h-[340px] w-full flex-1 bg-white"
          />
        </Card>
      </div>

      {/* Checklist and actions */}
      <Card className="px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-ink text-sm font-bold">
            Goals: {passed} / {level.checks.length}
          </p>
          <div className="flex flex-wrap gap-2">
            {!showHint && (
              <button
                type="button"
                onClick={() => setShowHint(true)}
                className="rounded-lg border border-amber-300 px-3 py-1.5 text-sm font-semibold text-amber-700 hover:bg-amber-50"
              >
                💡 Hint (−1 star)
              </button>
            )}
            {!sawSolution && (
              <button
                type="button"
                onClick={() => {
                  if (
                    window.confirm(
                      "Show the answer? You can still finish the level, but only for 1 star.",
                    )
                  ) {
                    setSawSolution(true);
                    setCode(level.solution);
                  }
                }}
                className="border-line text-muted hover:bg-canvas rounded-lg border px-3 py-1.5 text-sm font-semibold"
              >
                Show answer
              </button>
            )}
          </div>
        </div>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {level.checks.map((check, i) => (
            <li
              key={check.label}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                results[i]
                  ? "bg-emerald-50 text-emerald-800"
                  : "bg-slate-50 text-slate-500"
              }`}
            >
              <span
                className={`flex size-5 shrink-0 items-center justify-center rounded-full ${
                  results[i] ? "bg-emerald-500 text-white" : "bg-slate-200"
                }`}
              >
                {results[i] && <CheckIcon className="size-3.5" />}
              </span>
              {check.label}
            </li>
          ))}
        </ul>

        {finish.data ? (
          <div className="mt-4 rounded-xl bg-gradient-to-r from-amber-50 to-emerald-50 px-5 py-4 text-center">
            <p className="text-ink text-xl font-black">🎉 Level cleared!</p>
            <div className="mt-2 flex justify-center">
              <Stars count={finish.data.stars} className="size-9" />
            </div>
            <p className="text-muted mt-1 text-sm">
              {finish.data.newStars > 0
                ? `+${finish.data.newStars} Star${finish.data.newStars === 1 ? "" : "s"} on the leaderboard`
                : `Your best is still ${finish.data.best} star${finish.data.best === 1 ? "" : "s"}`}
              {finish.data.stars < 3 &&
                " — play again without hints for 3 stars"}
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {next ? (
                <Link
                  href={`/student/games/code/${next.id}`}
                  className="bg-navy hover:bg-navy-deep rounded-lg px-5 py-2 text-sm font-bold text-white"
                >
                  Next level →
                </Link>
              ) : (
                <p className="text-ink text-sm font-bold">
                  🏆 You finished every Code Quest level!
                </p>
              )}
              <Link
                href="/student/games"
                className="border-line text-ink hover:bg-surface rounded-lg border px-4 py-2 text-sm font-semibold"
              >
                All levels
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-4 flex flex-wrap items-center justify-end gap-3">
            {finish.error && (
              <p className="text-sm text-rose-600">{finish.error.message}</p>
            )}
            <p className="text-muted text-sm">
              {allPassed
                ? "All goals met — finish the level!"
                : "Keep coding until every goal turns green."}
            </p>
            <button
              type="button"
              disabled={!allPassed || finish.isPending || !access.data}
              onClick={() =>
                finish.mutate({ levelId, usedHint: showHint, sawSolution })
              }
              className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {finish.isPending ? "Saving…" : "Finish level"}
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}
