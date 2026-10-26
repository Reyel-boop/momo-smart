import { type Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "~/app/_components/page-header";
import { Card, EmptyState } from "~/app/_components/ui";
import { api } from "~/trpc/server";
import { Stars } from "../_components/stars";
import { Enemy, MomoHero } from "./_components/art";

export const metadata: Metadata = { title: "Momo's Quest · Momo Smart" };
export const dynamic = "force-dynamic";

/** Momo's Quest: one quest per unit of each class, with the best stars. */
export default async function QuestPage() {
  const units = await api.game.questUnits();
  const classes = [...new Set(units.map((u) => u.className))];

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
            New game
          </p>
          <h1 className="text-3xl font-black">Momo&apos;s Quest</h1>
          <p className="mt-1 text-sm text-white/85">
            Momo the super pup needs you! Answer a unit&apos;s questions to
            blast Bug Bot, Glitch Slime, Spam Bat, Error Ghost and the boss,
            King Virus. 3 right in a row unleashes a Super Bark. Miss 5 and Momo
            faints — then try again. Win for up to 3 Stars.
          </p>
        </div>
        <MomoHero className="absolute right-28 -bottom-4 hidden w-48 sm:block" />
        <Enemy
          kind="boss"
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

      {classes.map((name) => (
        <div key={name}>
          <PageHeader title={name} />
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {units
              .filter((u) => u.className === name)
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
