"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { SoundToggle } from "~/app/_components/race/race-view";
import { sfx, unlock } from "~/app/_components/sfx";
import { Card } from "~/app/_components/ui";
import { GAMES, type HUNT_GAMES } from "~/lib/games/catalog";
import { buildHunt, type HuntPlacement } from "~/lib/games/word-hunt";
import { api } from "~/trpc/react";
import {
  LevelHeader,
  LevelResult,
  LockedLevel,
} from "../../_components/shared";

type HuntGame = (typeof HUNT_GAMES)[number];
type Cell = { row: number; col: number };

const cellsOf = (p: HuntPlacement) =>
  Array.from({ length: p.length }, (_, i) => ({
    row: p.row + p.dRow * i,
    col: p.col + p.dCol * i,
  }));
const key = (c: Cell) => `${c.row}.${c.col}`;

/** One Word Hunt level: find each word from its clue. */
export function HuntScreen({
  game,
  levelId,
}: {
  game: HuntGame;
  levelId: string;
}) {
  const access = api.game.level.useQuery({ game, levelId }, { retry: false });
  const [attempt, setAttempt] = useState(0);

  if (access.error) {
    return <LockedLevel what="Level" message={access.error.message} />;
  }
  return (
    <Hunt
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

function Hunt({
  game,
  levelId,
  best,
  number,
  count,
  nextId,
  ready,
  onRetry,
}: {
  game: HuntGame;
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
  // Built after mounting: the puzzle is random, so it can't render on the
  // server and match in the browser.
  const [puzzle, setPuzzle] = useState<ReturnType<typeof buildHunt> | null>(
    null,
  );
  useEffect(() => setPuzzle(buildHunt(level.words)), [level.words]);

  const [found, setFound] = useState<string[]>([]);
  const [start, setStart] = useState<Cell | null>(null);
  const [hints, setHints] = useState(0);
  const [hinted, setHinted] = useState<Cell | null>(null);
  const [miss, setMiss] = useState(false);
  const finish = api.game.finishHunt.useMutation({
    onSuccess: () => {
      void utils.game.hub.invalidate();
      router.refresh();
    },
  });

  const foundCells = useMemo(() => {
    const out = new Set<string>();
    for (const p of puzzle?.placed ?? []) {
      if (found.includes(p.wordId)) cellsOf(p).forEach((c) => out.add(key(c)));
    }
    return out;
  }, [puzzle, found]);

  const done = found.length === level.words.length;

  useEffect(() => {
    if (done && ready && !finish.data && !finish.isPending && !finish.error) {
      finish.mutate({ game, levelId, found, hints });
    }
  }, [done, ready, finish, game, levelId, found, hints]);

  useEffect(() => {
    if (finish.data) sfx.fanfare();
  }, [finish.data]);

  const tap = (cell: Cell) => {
    unlock();
    if (!puzzle) return;
    if (!start) {
      setStart(cell);
      sfx.select();
      return;
    }
    const match = puzzle.placed.find((p) => {
      const cells = cellsOf(p);
      const first = key(cells[0]!);
      const last = key(cells.at(-1)!);
      const ends = [key(start), key(cell)];
      return (
        !found.includes(p.wordId) && ends.includes(first) && ends.includes(last)
      );
    });
    setStart(null);
    setHinted(null);
    if (match) {
      setFound((f) => [...f, match.wordId]);
      sfx.coin();
    } else {
      setMiss(true);
      setTimeout(() => setMiss(false), 500);
      sfx.hurt();
    }
  };

  const hint = () => {
    const next = puzzle?.placed.find((p) => !found.includes(p.wordId));
    if (!next) return;
    setHinted({ row: next.row, col: next.col });
    setHints((n) => n + 1);
    sfx.select();
  };

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <LevelHeader
        game="Word Hunt"
        unit={level.unit}
        unitTitle={level.unitTitle}
        title={level.title}
        number={number}
        count={count}
        best={best}
      >
        <SoundToggle tone="light" />
      </LevelHeader>

      {done ? (
        <Card className="px-4 py-4">
          {!finish.data ? (
            <p className="text-muted text-center text-sm">
              {finish.error ? finish.error.message : "Checking your words…"}
            </p>
          ) : (
            <LevelResult
              heading={
                finish.data.stars === 3
                  ? "🔍 Sharp eyes!"
                  : "🔍 All words found!"
              }
              stars={finish.data.stars}
              newStars={finish.data.newStars}
              best={finish.data.best}
              failNote=""
              stats={[
                { label: "Words", value: String(finish.data.found) },
                { label: "Hints", value: String(finish.data.hints) },
              ]}
              nextHref={nextId ? `/student/games/hunt/${nextId}` : null}
              onRetry={onRetry}
            />
          )}
        </Card>
      ) : (
        <Card className="grid gap-5 p-4 md:grid-cols-[minmax(0,1fr)_280px]">
          <div
            className={`select-none ${miss ? "animate-pulse" : ""}`}
            style={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: `repeat(${puzzle?.size ?? 10}, minmax(0, 1fr))`,
            }}
          >
            {puzzle?.grid.flatMap((line, row) =>
              line.map((letter, col) => {
                const cell = { row, col };
                const isStart = start && key(start) === key(cell);
                const isHint = hinted && key(hinted) === key(cell);
                return (
                  <button
                    key={key(cell)}
                    type="button"
                    onClick={() => tap(cell)}
                    className={`aspect-square rounded text-xs font-black sm:text-base ${
                      isStart
                        ? "bg-brand text-white"
                        : isHint
                          ? "bg-amber-300 text-slate-900"
                          : foundCells.has(key(cell))
                            ? "bg-emerald-200 text-emerald-900"
                            : "bg-canvas text-ink hover:bg-brand-soft"
                    }`}
                  >
                    {letter}
                  </button>
                );
              }),
            )}
          </div>
          <div>
            <p className="text-muted text-xs font-semibold">
              Tap a word&apos;s first letter, then its last letter. Words go
              across, down or diagonally.
            </p>
            <ol className="mt-3 space-y-2">
              {level.words.map((word) => {
                const isFound = found.includes(word.id);
                return (
                  <li
                    key={word.id}
                    className={`rounded-lg border px-3 py-2 text-sm ${isFound ? "border-emerald-300 bg-emerald-50" : "border-line"}`}
                  >
                    <span className="text-ink">{word.clue}</span>
                    {isFound && (
                      <span className="mt-0.5 block font-black text-emerald-700">
                        ✓ {word.word}
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
            <button
              type="button"
              onClick={hint}
              className="border-line text-ink hover:bg-canvas mt-3 w-full rounded-xl border px-3 py-2 text-sm font-bold"
            >
              💡 Hint (costs stars) · used {hints}
            </button>
          </div>
        </Card>
      )}
    </div>
  );
}
