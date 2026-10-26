import { type Metadata } from "next";
import Link from "next/link";

import { LockIcon, PlayIcon, StarIcon } from "~/app/_components/icons";
import { PageHeader } from "~/app/_components/page-header";
import { Card, EmptyState, Pill } from "~/app/_components/ui";
import { api } from "~/trpc/server";
import { Stars } from "./_components/stars";
import { Hero, MomoPet, Monster } from "./quest/_components/art";

export const metadata: Metadata = { title: "Games · Momo Smart" };
export const dynamic = "force-dynamic";

const LOOK = {
  code: {
    href: "/student/games/code",
    blurb:
      "Type real HTML and CSS, watch it run, and clear each mission to unlock the next.",
    banner: "from-blue-600 to-indigo-700",
    emoji: "</>",
  },
  call: {
    href: "/student/games/call",
    blurb:
      "Take customer calls: choose what to say at each step, keep the customer happy and finish on time.",
    banner: "from-emerald-600 to-teal-700",
    emoji: "☎",
  },
} as const;

/**
 * The student's course games: Code Quest for Computer Programming and Call
 * Simulator for Telecommunications, each listed only for students in that
 * course. Every level shows its stars, and locked levels wait for the one
 * before.
 */
export default async function GamesPage() {
  const games = await api.game.hub();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Games"
        subtitle="Learn by playing. Each level gives up to 3 Stars, and your stars count on the leaderboard."
      />

      <Link
        href="/student/games/quest"
        className="group relative block overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-violet-700 to-fuchsia-700 px-6 py-6 text-white shadow-xl transition hover:-translate-y-0.5 hover:shadow-2xl"
      >
        <div className="relative z-10 max-w-lg">
          <p className="text-xs font-black tracking-[0.25em] text-amber-300 uppercase">
            Every class · every unit
          </p>
          <h2 className="text-3xl font-black">Momo&apos;s Quest</h2>
          <p className="mt-1 text-sm text-white/85">
            Team up with Momo the super pup and defeat the Jelly King with your
            units&apos; questions. Earn ⭐ 1 star for every new correct answer,
            plus up to 3 for winning. Miss 5 and you faint!
          </p>
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2 text-sm font-black text-slate-900 group-hover:bg-amber-300">
            <PlayIcon className="size-4" /> Play
          </span>
        </div>
        <Hero className="absolute right-28 -bottom-4 hidden w-32 transition group-hover:-translate-y-1 sm:block" />
        <MomoPet className="absolute right-[13.5rem] bottom-1 hidden w-20 sm:block" />
        <Monster
          kind="boss"
          className="absolute right-2 bottom-2 hidden w-24 sm:block"
        />
      </Link>

      {games.length === 0 && (
        <Card>
          <EmptyState>
            Code Quest and Call Simulator appear here when you join Computer
            Programming or Telecommunications.
          </EmptyState>
        </Card>
      )}

      {games.map((g) => {
        const look = LOOK[g.game];
        const units = [...new Set(g.levels.map((l) => l.unit))];
        const next = g.levels.find((l) => l.unlocked && !l.stars);
        return (
          <Card key={g.game} className="overflow-hidden">
            <div
              className={`flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r ${look.banner} px-6 py-5 text-white`}
            >
              <div className="flex min-w-0 items-center gap-4">
                <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 font-mono text-2xl font-black">
                  {look.emoji}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold tracking-wide text-white/70 uppercase">
                    {g.course}
                  </p>
                  <h2 className="text-2xl font-extrabold">{g.title}</h2>
                  <p className="mt-0.5 max-w-xl text-sm text-white/85">
                    {look.blurb}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="flex items-center justify-end gap-1.5 text-2xl font-black">
                  <StarIcon className="size-6 text-amber-300" />
                  {g.stars}
                  <span className="text-base font-bold text-white/70">
                    / {g.maxStars}
                  </span>
                </p>
                <p className="text-xs text-white/80">
                  {g.cleared} of {g.levels.length} levels cleared
                </p>
                {next && (
                  <Link
                    href={`${look.href}/${next.id}`}
                    className="text-navy mt-2 inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-sm font-bold hover:bg-white/90"
                  >
                    <PlayIcon className="size-4" />
                    {g.cleared === 0 ? "Start" : "Continue"}
                  </Link>
                )}
              </div>
            </div>
            <div className="h-1.5 bg-slate-100">
              <div
                className="h-full bg-amber-400 transition-all"
                style={{ width: `${(g.stars / g.maxStars) * 100}%` }}
              />
            </div>

            <div className="space-y-5 px-5 py-5">
              {units.map((unit) => {
                const levels = g.levels.filter((l) => l.unit === unit);
                return (
                  <div key={unit}>
                    <p className="text-muted mb-2 text-xs font-bold tracking-wide uppercase">
                      Unit {unit} · {levels[0]!.unitTitle}
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {levels.map((level) => {
                        const n = g.levels.indexOf(level) + 1;
                        const body = (
                          <>
                            <span
                              className={`flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
                                level.stars
                                  ? "bg-amber-100 text-amber-700"
                                  : level.unlocked
                                    ? "bg-brand-soft text-brand"
                                    : "bg-slate-100 text-slate-400"
                              }`}
                            >
                              {level.unlocked ? (
                                n
                              ) : (
                                <LockIcon className="size-4" />
                              )}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="text-ink block truncate text-sm font-bold">
                                {level.title}
                              </span>
                              <span className="mt-0.5 block">
                                <Stars
                                  count={level.stars ?? 0}
                                  className="size-3.5"
                                />
                              </span>
                            </span>
                            {level.unlocked && !level.stars && (
                              <Pill tone="blue">Play</Pill>
                            )}
                          </>
                        );
                        return level.unlocked ? (
                          <Link
                            key={level.id}
                            href={`${look.href}/${level.id}`}
                            className="border-line hover:border-brand hover:bg-brand-soft/40 flex items-center gap-3 rounded-xl border px-3 py-2.5 transition"
                          >
                            {body}
                          </Link>
                        ) : (
                          <div
                            key={level.id}
                            title="Finish the level before this one to unlock it"
                            className="border-line flex items-center gap-3 rounded-xl border px-3 py-2.5 opacity-60"
                          >
                            {body}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
