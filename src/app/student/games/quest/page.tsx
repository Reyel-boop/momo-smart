import { type Metadata } from "next";
import Link from "next/link";

import { LockIcon } from "~/app/_components/icons";
import { PageHeader } from "~/app/_components/page-header";
import { Card, EmptyState } from "~/app/_components/ui";
import { api } from "~/trpc/server";
import { Stars } from "../_components/stars";
import { Hero, MomoPet, Monster } from "./_components/art";

export const metadata: Metadata = { title: "Momo's Quest · Momo Smart" };
export const dynamic = "force-dynamic";

/**
 * Momo's Quest: each class's unit quests with their best stars, and the
 * class's Boss Level, which opens after a few unit quests are won.
 */
export default async function QuestPage() {
  const { units, bosses } = await api.game.questUnits();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <Link
        href="/student/games"
        className="text-brand text-sm font-semibold hover:underline"
      >
        ← Games
      </Link>
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-violet-700 to-fuchsia-700 px-6 py-6 text-white shadow-xl">
        <div className="relative z-10 max-w-xl">
          <p className="text-xs font-black tracking-[0.25em] text-amber-300 uppercase">
            Elements · Skills · Boss Levels
          </p>
          <h1 className="text-3xl font-black">Momo&apos;s Quest</h1>
          <p className="mt-1 text-sm text-white/85">
            Pick an element skill — 💧 Water, 🔥 Fire, 🌪️ Air or 🪨 Earth — and
            answer right to cast it. Every monster has a hidden weakness.
            Correct answers charge 💎 mana; don&apos;t know an answer? Spend
            mana to attack anyway, or let Momo heal you. Earn ⭐ 1 star for
            every new correct answer, plus bonus stars for winning.
          </p>
        </div>
        <Hero className="absolute right-28 -bottom-4 hidden w-32 sm:block" />
        <MomoPet className="absolute right-[13.5rem] bottom-1 hidden w-20 sm:block" />
        <Monster
          kind="dragon"
          className="absolute right-2 bottom-2 hidden w-28 sm:block"
        />
      </div>

      {units.length === 0 && (
        <Card>
          <EmptyState>
            Join a class with its class code to start a quest.
          </EmptyState>
        </Card>
      )}

      {bosses.map((boss) => (
        <div key={boss.sectionId}>
          <PageHeader title={boss.className} />

          {/* Boss Level */}
          {boss.unlocked ? (
            <Link
              href={`/student/games/quest/boss/${boss.sectionId}`}
              className="group relative mt-3 flex items-center gap-4 overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-purple-950 to-red-900 p-4 text-white shadow-lg ring-2 ring-amber-300/60 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              <Monster
                kind="dragon3"
                className="w-24 shrink-0 transition group-hover:scale-110"
              />
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] font-black tracking-[0.25em] text-amber-300 uppercase">
                  Boss Level · 3 phases
                </span>
                <span className="block text-xl font-black">
                  The Shadow Dragon
                </span>
                <span className="block text-xs text-white/75">
                  Questions from every unit ({boss.questions}) · timers in
                  phases 2 and 3 · up to 5 bonus stars
                </span>
                <span className="mt-1 flex items-center gap-2 text-xs font-bold text-amber-200">
                  <Stars count={Math.min(3, boss.stars)} className="size-3.5" />
                  {boss.stars}/5
                </span>
              </span>
              <span className="rounded-xl bg-gradient-to-b from-rose-400 to-red-600 px-4 py-2 text-sm font-black shadow">
                {boss.stars > 0 ? "Rematch" : "⚔️ Fight"}
              </span>
            </Link>
          ) : (
            <div className="border-line mt-3 flex items-center gap-4 rounded-2xl border border-dashed bg-slate-50 p-4">
              <span className="relative w-20 shrink-0 opacity-40 grayscale">
                <Monster kind="dragon" className="w-full" />
                <LockIcon className="absolute inset-0 m-auto size-8 text-slate-700" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="text-ink block text-sm font-black">
                  Boss Level: The Shadow Dragon
                </span>
                <span className="text-muted block text-xs">
                  Win {boss.needed} unit quests in this class to unlock it.
                </span>
                <span className="mt-1.5 block h-2 overflow-hidden rounded-full bg-slate-200">
                  <span
                    className="block h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                    style={{
                      width: `${(boss.wins / Math.max(1, boss.needed)) * 100}%`,
                    }}
                  />
                </span>
                <span className="text-muted mt-0.5 block text-[11px] font-bold">
                  {boss.wins}/{boss.needed} won
                </span>
              </span>
            </div>
          )}

          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {units
              .filter((u) => u.sectionId === boss.sectionId)
              .map((u) => (
                <Link
                  key={u.assessmentId}
                  href={`/student/games/quest/${u.assessmentId}`}
                  className="border-line bg-surface hover:border-brand group flex items-center gap-3 rounded-2xl border p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-lg font-black text-white shadow">
                    {u.unit}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="text-ink block truncate text-sm font-bold">
                      {u.unitTitle}
                    </span>
                    <span className="text-muted block text-xs">
                      {u.questions} questions
                    </span>
                    <Stars count={u.stars} className="mt-0.5 size-3.5" />
                  </span>
                  <span className="rounded-lg bg-amber-400 px-2.5 py-1 text-xs font-black text-slate-900 transition group-hover:bg-amber-300">
                    {u.stars > 0 ? "Replay" : "Play"}
                  </span>
                </Link>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
