import Link from "next/link";

import { StarIcon, TrophyIcon } from "~/app/_components/icons";
import { Card, EmptyState } from "~/app/_components/ui";
import type { RouterOutputs } from "~/trpc/react";

type Board = RouterOutputs["dashboard"]["leaderboard"];
type BoardRow = Board["top"][number];

const MEDALS = ["text-amber-500", "text-slate-400", "text-orange-700"];

/**
 * The star leaderboard. On Scores it has All students / My grade / My section
 * tabs; on the dashboard (`compact`) it shows the top 10 and links to Scores.
 */
export function Leaderboard({
  board,
  compact = false,
}: {
  board: Board;
  compact?: boolean;
}) {
  const tabs = [
    { scope: "all", label: "All students" },
    { scope: "grade", label: `Grade ${board.gradeLevel}` },
    { scope: "section", label: board.section ?? "My section" },
  ] as const;
  const top = compact ? board.top.slice(0, 10) : board.top;
  // On the dashboard, the viewer's own row shows below the top 10 if lower.
  const me =
    board.me ??
    (compact ? (board.top.slice(10).find((r) => r.isMe) ?? null) : null);

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5">
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
            <TrophyIcon className="size-5" />
          </span>
          <div>
            <h2 className="text-ink text-[17px] font-bold">Leaderboard</h2>
            <p className="text-muted text-xs">
              1 <StarIcon className="inline size-3.5 text-amber-500" /> for
              every correct answer
              {board.myRank &&
                ` · You are #${board.myRank} of ${board.count} with ${board.myStars.toLocaleString()} stars`}
            </p>
          </div>
        </div>
        {!compact && (
          <nav aria-label="Leaderboard" className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <Link
                key={tab.scope}
                href={
                  tab.scope === "all"
                    ? "/student/scores"
                    : `/student/scores?board=${tab.scope}`
                }
                scroll={false}
                aria-current={board.scope === tab.scope ? "page" : undefined}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  board.scope === tab.scope
                    ? "bg-navy text-white"
                    : "border-line bg-surface text-ink hover:bg-canvas border"
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        )}
      </div>

      {top.length === 0 ? (
        <EmptyState>
          {board.scope === "section" && !board.section
            ? "You aren't in a section yet."
            : "No students here yet."}
        </EmptyState>
      ) : (
        <ol className="divide-line mt-4 divide-y">
          {top.map((row) => (
            <LeaderboardRow key={row.studentId} row={row} />
          ))}
          {me && (
            <>
              <li
                aria-hidden="true"
                className="text-muted px-5 py-1 text-center text-xs"
              >
                ⋯
              </li>
              <LeaderboardRow row={me} />
            </>
          )}
        </ol>
      )}

      {compact && (
        <div className="border-line flex items-center justify-between gap-3 border-t px-5 py-3">
          <span className="text-muted text-[11px]">Updates every minute</span>
          <Link
            href="/student/scores"
            className="text-brand text-sm font-bold hover:underline"
          >
            See full leaderboard →
          </Link>
        </div>
      )}
    </Card>
  );
}

function LeaderboardRow({ row }: { row: BoardRow }) {
  const medal = row.stars > 0 ? MEDALS[row.rank - 1] : undefined;
  return (
    <li
      className={`flex items-center gap-3 px-5 py-2.5 ${row.isMe ? "bg-brand-soft/60" : ""}`}
      aria-current={row.isMe ? "true" : undefined}
    >
      <span className="flex w-8 shrink-0 justify-center">
        {medal ? (
          <TrophyIcon
            className={`size-5 ${medal}`}
            aria-label={`#${row.rank}`}
          />
        ) : (
          <span className="text-muted text-sm font-bold tabular-nums">
            {row.rank}
          </span>
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-ink truncate text-sm font-semibold">
          {row.name}
          {row.isMe && (
            <span className="text-brand ml-2 text-xs font-bold">You</span>
          )}
        </p>
        <p className="text-muted truncate text-xs">
          Grade {row.gradeLevel}
          {row.section && ` — ${row.section}`}
        </p>
      </div>
      <span className="inline-flex items-center gap-1 text-sm font-extrabold text-amber-600 tabular-nums">
        {row.stars.toLocaleString()}
        <StarIcon className="size-4" />
      </span>
    </li>
  );
}
