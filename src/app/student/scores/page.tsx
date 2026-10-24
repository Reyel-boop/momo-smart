import { type Metadata } from "next";
import Link from "next/link";

import { humanise, longDate } from "~/app/_components/format";
import {
  ClipboardIcon,
  StarIcon,
  TrendUpIcon,
  TrophyIcon,
} from "~/app/_components/icons";
import { PageHeader } from "~/app/_components/page-header";
import { Card, CardHeader, EmptyState, Pill } from "~/app/_components/ui";
import { courseTone } from "~/app/student/_components/format";
import { api } from "~/trpc/server";
import type { RouterOutputs } from "~/trpc/react";

export const metadata: Metadata = { title: "Scores · Momo Smart" };
export const dynamic = "force-dynamic";

const percentOf = (score: number, total: number) =>
  total > 0 ? Math.round((score / total) * 100) : 0;

const scoreTone = (percent: number) =>
  percent >= 90
    ? "green"
    : percent >= 75
      ? "blue"
      : percent >= 60
        ? "amber"
        : "rose";

/**
 * Everything the student has been scored on: the star leaderboard, each
 * course's current grade, graded work with released scores, Unit
 * Questions, and the star ledger.
 */
export default async function ScoresPage({
  searchParams,
}: {
  searchParams: Promise<{ board?: string }>;
}) {
  const { board } = await searchParams;
  const scope =
    board === "grade" || board === "section" ? board : ("all" as const);
  const [overview, sections, submissions, stars, leaderboard] =
    await Promise.all([
      api.dashboard.studentOverview(),
      api.course.mySections(),
      api.submission.mine({ limit: 100 }),
      api.dashboard.studentStars(),
      api.dashboard.leaderboard({ scope }),
    ]);
  const quizzes = await Promise.all(
    sections.map(async (section) => ({
      section,
      quizzes: await api.assessment.unitQuizzes({
        courseId: section.course.id,
      }),
    })),
  );

  const graded = submissions.filter(
    (s) => s.grade?.status === "RELEASED" && s.grade.score !== null,
  );
  const answeredQuizzes = quizzes.flatMap(({ section, quizzes }) =>
    quizzes
      .filter((quiz) => quiz.bestScore !== null)
      .map((quiz) => ({ ...quiz, section })),
  );

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <PageHeader
        title="Scores"
        subtitle="Earn a star for every correct answer and climb the leaderboard. Your grades, graded work and Unit Questions are here too."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat
          icon={<TrendUpIcon className="size-5" />}
          label="Current GPA"
          value={overview.gpa != null ? overview.gpa.toFixed(2) : "—"}
        />
        <Stat
          icon={<ClipboardIcon className="size-5" />}
          label="Graded items"
          value={`${graded.length + answeredQuizzes.length}`}
        />
        <Stat
          icon={<StarIcon className="size-5" />}
          label="Star points"
          value={`${stars.total.toLocaleString()}`}
          note={`Rank #${stars.rank} of ${stars.cohortSize} in Grade ${stars.gradeLevel}`}
        />
      </div>

      <Leaderboard board={leaderboard} />

      <Card>
        <CardHeader
          icon={<TrophyIcon className="size-[18px]" />}
          title="Course grades"
          subtitle="Your current standing in each enrolled course"
        />
        {sections.length === 0 ? (
          <EmptyState>
            You are not enrolled in any courses this term.
          </EmptyState>
        ) : (
          <ul className="divide-line divide-y">
            {sections.map((section) => {
              const tone = courseTone(section.course.colorToken);
              const percent = section.myGrade?.currentPercent ?? null;
              return (
                <li
                  key={section.id}
                  className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3.5"
                >
                  <span
                    className={`h-9 w-1.5 shrink-0 rounded-full ${tone.bar}`}
                  />
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/student/courses?course=${section.course.id}`}
                      className="text-ink text-sm font-bold hover:underline"
                    >
                      {section.course.name}
                    </Link>
                    <p className="text-muted text-xs">
                      {section.course.code} · Period {section.period}
                    </p>
                  </div>
                  <div className="w-40">
                    <div className="bg-line h-2 overflow-hidden rounded-full">
                      <div
                        className={`h-full rounded-full ${tone.bar}`}
                        style={{ width: `${Math.min(100, percent ?? 0)}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-ink w-16 text-right text-sm font-extrabold tabular-nums">
                    {percent != null
                      ? `${Math.round(percent * 10) / 10}%`
                      : "—"}
                  </span>
                  <span className="w-10 text-right">
                    {section.myGrade?.currentLetter && (
                      <Pill tone={scoreTone(percent ?? 0)}>
                        {section.myGrade.currentLetter}
                      </Pill>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader
            icon={<ClipboardIcon className="size-[18px]" />}
            title="Graded work"
            subtitle="Assignments, labs and tests with released scores"
          />
          {graded.length === 0 ? (
            <EmptyState>No graded work has been released yet.</EmptyState>
          ) : (
            <ul className="divide-line divide-y">
              {graded.map((submission) => {
                const score = submission.grade!.score!;
                const total = submission.assignment.pointsPossible;
                const percent = percentOf(score, total);
                return (
                  <li
                    key={submission.id}
                    className="flex items-center gap-3 px-5 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-ink truncate text-sm font-semibold">
                        {submission.assignment.title}
                      </p>
                      <p className="text-muted text-xs">
                        {submission.assignment.section.course.name} ·{" "}
                        {humanise(submission.assignment.type)}
                        {submission.grade?.releasedAt &&
                          ` · ${longDate(submission.grade.releasedAt)}`}
                      </p>
                    </div>
                    <span className="text-ink text-sm font-bold tabular-nums">
                      {score}/{total}
                    </span>
                    <Pill tone={scoreTone(percent)}>{percent}%</Pill>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <Card>
          <CardHeader
            icon={<ClipboardIcon className="size-[18px]" />}
            title="Unit Questions"
            subtitle="Your best score on each unit's questions"
          />
          {answeredQuizzes.length === 0 ? (
            <EmptyState>
              You haven&apos;t answered any Unit Questions yet.
            </EmptyState>
          ) : (
            <ul className="divide-line divide-y">
              {answeredQuizzes.map((quiz) => {
                const percent = percentOf(quiz.bestScore!, quiz.totalPoints);
                return (
                  <li
                    key={quiz.id}
                    className="flex items-center gap-3 px-5 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/student/courses/questions/${quiz.id}`}
                        className="text-ink truncate text-sm font-semibold hover:underline"
                      >
                        {quiz.title}
                      </Link>
                      <p className="text-muted text-xs">
                        {quiz.section.course.name} · {quiz.attemptsUsed} of{" "}
                        {quiz.maxAttempts} tries used
                      </p>
                    </div>
                    <span className="text-ink text-sm font-bold tabular-nums">
                      {quiz.bestScore}/{quiz.totalPoints}
                    </span>
                    <Pill tone={scoreTone(percent)}>{percent}%</Pill>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>

      <section id="stars" className="scroll-mt-24">
        <Card>
          <CardHeader
            icon={<StarIcon className="size-[18px]" />}
            title="Star ledger"
            subtitle={`${stars.total.toLocaleString()} stars · 1 star per correct Unit Question answer and per graded point`}
          />
          {stars.ledger.length === 0 ? (
            <EmptyState>No stars earned yet.</EmptyState>
          ) : (
            <ul className="divide-line divide-y">
              {stars.ledger.map((entry) => (
                <li
                  key={entry.id}
                  className="flex items-center gap-3 px-5 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-ink truncate text-sm font-semibold">
                      {entry.title}
                      {entry.isPerfect && (
                        <span className="ml-2 text-xs font-bold text-amber-600">
                          Perfect
                        </span>
                      )}
                    </p>
                    <p className="text-muted text-xs">
                      {entry.courseName} · {humanise(entry.type)}
                      {entry.releasedAt && ` · ${longDate(entry.releasedAt)}`}
                    </p>
                  </div>
                  <span className="text-muted text-xs tabular-nums">
                    {entry.score}/{entry.pointsPossible}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm font-extrabold text-amber-600 tabular-nums">
                    +{entry.stars}
                    <StarIcon className="size-4" />
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  note,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <Card className="flex items-center gap-4 p-5">
      <span className="bg-brand-soft text-brand flex size-11 shrink-0 items-center justify-center rounded-xl">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-muted text-[11px] font-bold tracking-wide uppercase">
          {label}
        </p>
        <p className="text-ink text-2xl font-extrabold tabular-nums">{value}</p>
        {note && <p className="text-muted text-xs">{note}</p>}
      </div>
    </Card>
  );
}

type Board = RouterOutputs["dashboard"]["leaderboard"];
type BoardRow = Board["top"][number];

const MEDALS = ["text-amber-500", "text-slate-400", "text-orange-700"];

/** The star leaderboard, with All students / My grade / My section tabs. */
function Leaderboard({ board }: { board: Board }) {
  const tabs = [
    { scope: "all", label: "All students" },
    { scope: "grade", label: `Grade ${board.gradeLevel}` },
    { scope: "section", label: board.section ?? "My section" },
  ] as const;

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
      </div>

      {board.top.length === 0 ? (
        <EmptyState>
          {board.scope === "section" && !board.section
            ? "You aren't in a section yet."
            : "No students here yet."}
        </EmptyState>
      ) : (
        <ol className="divide-line mt-4 divide-y">
          {board.top.map((row) => (
            <LeaderboardRow key={row.studentId} row={row} />
          ))}
          {board.me && (
            <>
              <li
                aria-hidden="true"
                className="text-muted px-5 py-1 text-center text-xs"
              >
                ⋯
              </li>
              <LeaderboardRow row={board.me} />
            </>
          )}
        </ol>
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
