"use client";

import { EventType, Fit, Layout, Rive, type Event } from "@rive-app/canvas";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { SoundToggle } from "~/app/_components/race/race-view";
import { sfx, soundOn, unlock } from "~/app/_components/sfx";
import { Card } from "~/app/_components/ui";
import { wordLabel } from "~/lib/games/block-run";
import { GAMES, type STUDIO_GAMES } from "~/lib/games/catalog";
import { api } from "~/trpc/react";
import { loadFile } from "../../_components/hero-rive";
import {
  LevelHeader,
  LevelResult,
  LockedLevel,
  shuffled,
} from "../../_components/shared";

type StudioGame = (typeof STUDIO_GAMES)[number];
const SM = "STATE MACHINE";

/**
 * One Studio Run level. The whole StudioRun game (title, hero pick, the run)
 * plays from the Rive file's "Control" artboard; this screen listens to it.
 * Grabbing an item pauses the run and asks the next word; the run goes on
 * after the right answer. Words not reached are asked when the run ends or
 * when the student taps "Finish".
 */
export function StudioScreen({
  game,
  levelId,
}: {
  game: StudioGame;
  levelId: string;
}) {
  const access = api.game.level.useQuery({ game, levelId }, { retry: false });
  const [attempt, setAttempt] = useState(0);

  if (access.error) {
    return <LockedLevel what="Level" message={access.error.message} />;
  }
  return (
    <Run
      key={attempt}
      game={game}
      levelId={levelId}
      best={access.data?.best ?? 0}
      number={access.data?.number}
      count={access.data?.count}
      nextId={access.data?.nextId ?? null}
      ready={!!access.data}
      onRetry={() => setAttempt((n) => n + 1)}
    />
  );
}

function Run({
  game,
  levelId,
  best,
  number,
  count,
  nextId,
  ready,
  onRetry,
}: {
  game: StudioGame;
  levelId: string;
  best: number;
  number?: number;
  count?: number;
  nextId: string | null;
  ready: boolean;
  onRetry: () => void;
}) {
  const router = useRouter();
  const utils = api.useUtils();
  const level = GAMES[game].levels.find((l) => l.id === levelId)!;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const riveRef = useRef<Rive | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  /** Answered words, in order, with every guess. */
  const [gates, setGates] = useState<{ id: string; guesses: string[] }[]>([]);
  const [wrong, setWrong] = useState<string[]>([]);
  /** Why a question is open: an item grabbed mid-run, or the run is over. */
  const [asking, setAsking] = useState<null | "item" | "end">(null);
  const [done, setDone] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const answeredRef = useRef(0);
  answeredRef.current = gates.length;

  const finish = api.game.finishTurbo.useMutation({
    onSuccess: () => {
      void utils.game.hub.invalidate();
      router.refresh();
    },
  });

  const word = level.words[gates.length];
  const choices = useMemo(() => {
    if (!word) return [];
    const others = shuffled(level.words.filter((w) => w.id !== word.id));
    return shuffled([word, ...others.slice(0, 3)].map((w) => w.word));
  }, [word, level.words]);

  const flash = (text: string) => {
    setToast(text);
    window.setTimeout(() => setToast(null), 2200);
  };

  /** An item was grabbed: pause the run and ask the next word. */
  const onItem = useCallback(() => {
    if (answeredRef.current >= level.words.length) return;
    riveRef.current?.pause();
    setAsking((a) => a ?? "item");
  }, [level.words.length]);

  /** The run ended (finish line or time's up): ask what's left. */
  const onEnd = useCallback(() => {
    if (answeredRef.current >= level.words.length) setDone(true);
    else setAsking("end");
  }, [level.words.length]);

  // Load the game and listen to it.
  useEffect(() => {
    let gone = false;
    let poll = 0;
    void loadFile()
      .then((buffer) => {
        if (gone || !canvasRef.current) return;
        const r = new Rive({
          buffer,
          canvas: canvasRef.current,
          artboard: "Control",
          stateMachines: SM,
          autoplay: true,
          layout: new Layout({ fit: Fit.Contain }),
          onLoad: () => {
            r.resizeDrawingSurfaceToCanvas();
            r.volume = soundOn() ? 1 : 0;
            setLoaded(true);
          },
          onLoadError: () => setFailed(true),
        });
        riveRef.current = r;

        // Items: the file reports each pick as an event ("coin 1"…), and
        // also counts them on its "CoinCounter" / "Coin Collected n" inputs.
        let seen = 0;
        const count = () => {
          const inputs = r.stateMachineInputs(SM) ?? [];
          const counter = Number(
            inputs.find((i) => i.name === "CoinCounter")?.value ?? 0,
          );
          const flags = inputs.filter(
            (i) => /^Coin Collected \d$/.test(i.name) && i.value === true,
          ).length;
          return Math.max(counter, flags);
        };
        const picked = () => {
          seen += 1;
          onItem();
        };
        r.on(EventType.RiveEvent, (e: Event) => {
          const name = String(
            (e.data as { name?: string } | undefined)?.name ?? "",
          ).toLowerCase();
          if (/^coin ?\d$|coin\d?_?pick/.test(name)) picked();
          else if (name.includes("death")) seen = 0;
          else if (/win|all coins collected|timesup/.test(name)) onEnd();
        });
        r.on(EventType.StateChange, (e: Event) => {
          const states = ([] as unknown[])
            .concat(e.data)
            .map((s) => String(s).toLowerCase());
          if (states.some((s) => /^congrats(_| c|$)/.test(s))) onEnd();
        });
        poll = window.setInterval(() => {
          const n = count();
          if (n < seen)
            seen = n; // a new run started
          else if (n > seen) picked();
        }, 150);
      })
      .catch(() => setFailed(true));
    const onResize = () => riveRef.current?.resizeDrawingSurfaceToCanvas();
    window.addEventListener("resize", onResize);
    return () => {
      gone = true;
      window.clearInterval(poll);
      window.removeEventListener("resize", onResize);
      riveRef.current?.cleanup();
      riveRef.current = null;
    };
  }, [onItem, onEnd]);

  // Sound follows the Momo sound switch.
  useEffect(() => {
    const id = window.setInterval(() => {
      const r = riveRef.current;
      if (r) r.volume = soundOn() ? 1 : 0;
    }, 500);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (done && ready && !finish.data && !finish.isPending && !finish.error) {
      riveRef.current?.pause();
      finish.mutate({ game, levelId, gates });
    }
  }, [done, ready, finish, game, levelId, gates]);

  useEffect(() => {
    if (finish.data) sfx.fanfare();
  }, [finish.data]);

  const guess = (choice: string) => {
    if (!word || wrong.includes(choice)) return;
    if (choice !== word.word) {
      setWrong((w) => [...w, choice]);
      sfx.hurt();
      return;
    }
    sfx.coin();
    const next = [...gates, { id: word.id, guesses: [...wrong, choice] }];
    setGates(next);
    setWrong([]);
    const all = next.length >= level.words.length;
    if (asking === "item") {
      setAsking(null);
      flash(
        all ? "All 6 words! Now reach the finish 🏁" : "Correct! Keep running!",
      );
      riveRef.current?.play();
    } else if (all) {
      setAsking(null);
      setDone(true);
    }
  };

  const mistakes = gates.reduce((n, g) => n + g.guesses.length - 1, 0);
  const total = level.words.length;

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <LevelHeader
        game="Studio Run"
        unit={level.unit}
        unitTitle={level.unitTitle}
        title={level.title}
        number={number}
        count={count}
        best={best}
      >
        <SoundToggle tone="light" />
      </LevelHeader>

      {!done && (
        <Card className="overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 bg-indigo-950 px-4 py-2.5 text-sm font-black text-white">
            <span>🚀 Grab an item to get a question</span>
            <span
              className="flex gap-1"
              aria-label={`${gates.length} of ${total} words`}
            >
              {level.words.map((w, i) => (
                <span
                  key={w.id}
                  className={`size-3.5 rounded-full ${
                    i < gates.length ? "bg-amber-300" : "bg-white/20"
                  }`}
                />
              ))}
            </span>
          </div>
          <div
            className="relative aspect-video w-full bg-[#0a0730]"
            onPointerDown={unlock}
          >
            <canvas
              ref={canvasRef}
              className="absolute inset-0 size-full touch-none select-none"
            />
            {!loaded && !failed && (
              <p className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white/70">
                Loading the game…
              </p>
            )}
            {failed && (
              <p className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm font-bold text-white/80">
                The game could not load. Tap “Finish” to answer the words
                instead.
              </p>
            )}
            {toast && (
              <p className="pop-in absolute top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500 px-4 py-1.5 text-sm font-black whitespace-nowrap text-white shadow-lg">
                {toast}
              </p>
            )}
            {asking && word && (
              <div className="absolute inset-0 flex items-center justify-center bg-indigo-950/70 p-3 backdrop-blur-[2px]">
                <div className="pop-in w-full max-w-lg rounded-2xl bg-white p-4 shadow-2xl sm:p-5">
                  <p className="text-xs font-black tracking-wide text-indigo-600 uppercase">
                    {asking === "item" ? "✨ Item " : "🏁 Word "}
                    {gates.length + 1} of {total}
                  </p>
                  <p className="text-ink mt-1 text-lg leading-snug font-black sm:text-xl">
                    {word.clue}
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {choices.map((choice) => (
                      <button
                        key={choice}
                        type="button"
                        disabled={wrong.includes(choice)}
                        onClick={() => guess(choice)}
                        className={`rounded-xl border-2 px-3 py-2.5 font-black break-words ${
                          wrong.includes(choice)
                            ? "border-rose-300 bg-rose-50 text-rose-400 line-through"
                            : "border-line text-ink hover:border-indigo-400 hover:bg-indigo-50"
                        }`}
                      >
                        {wordLabel(choice)}
                      </button>
                    ))}
                  </div>
                  {wrong.length > 0 && (
                    <p className="mt-2 text-center text-xs font-bold text-rose-500">
                      Not that one. Try again!
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
            <p className="text-muted text-sm">
              Tap the game to jump; keep tapping to go higher. {gates.length} of{" "}
              {total} words answered.
            </p>
            <button
              type="button"
              disabled={!!asking}
              onClick={() => {
                riveRef.current?.pause();
                onEnd();
              }}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-black text-white hover:bg-indigo-500 disabled:opacity-40"
            >
              {gates.length >= total
                ? "Finish level"
                : "Finish & answer the rest"}
            </button>
          </div>
        </Card>
      )}

      {done && (
        <Card className="px-4 py-4">
          {!finish.data ? (
            <p className="text-muted text-center text-sm">
              {finish.error ? finish.error.message : "Checking your run…"}
            </p>
          ) : (
            <LevelResult
              heading={
                finish.data.stars === 3 ? "🚀 Perfect run!" : "🚀 Run complete!"
              }
              stars={finish.data.stars}
              newStars={finish.data.newStars}
              best={finish.data.best}
              failNote=""
              stats={[
                { label: "Words", value: String(finish.data.gates) },
                { label: "Mistakes", value: String(mistakes) },
              ]}
              nextHref={nextId ? `/student/games/studio/${nextId}` : null}
              onRetry={onRetry}
            />
          )}
        </Card>
      )}

      <p className="text-muted text-center text-[11px]">
        Game: “StudioRun” by thelittlelabs on the Rive Marketplace (CC BY 4.0),
        with questions added by Momo Smart.
      </p>
    </div>
  );
}
