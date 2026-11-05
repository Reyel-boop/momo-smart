import { type Metadata } from "next";
import Link from "next/link";

import { LockIcon, PlayIcon, StarIcon } from "~/app/_components/icons";
import { PageHeader } from "~/app/_components/page-header";
import { Card, EmptyState, Pill } from "~/app/_components/ui";
import { type GameId } from "~/lib/games/catalog";
import { api } from "~/trpc/server";
import { Stars } from "./_components/stars";
import { Hero, MomoPet, Monster } from "./quest/_components/art";

export const metadata: Metadata = { title: "Games · Momo Smart" };
export const dynamic = "force-dynamic";

/** The Block Run race stays hidden until it has passed its test. */
const RACE_OPEN = false as boolean;

/** Block Run looks the same in every subject. */
const RUN_LOOK = {
  href: "/student/games/run",
  blurb:
    "A 3D obstacle course: dodge rolling balls and spinning bars, ride moving blocks, and land on the right answer at every gate.",
  banner: "from-lime-500 to-sky-600",
  emoji: "🧱",
};

/** Word Hunt looks the same in every subject. */
const HUNT_LOOK = {
  href: "/student/games/hunt",
  blurb:
    "A word search with a twist: you only get the clues, so work out each word, then find it in the letters.",
  banner: "from-violet-600 to-fuchsia-700",
  emoji: "🔍",
};

/** Turbo Takbo looks the same in every subject. */
const TURBO_LOOK = {
  href: "/student/games/turbo",
  blurb:
    "Tap as fast as you can to build speed, then answer the clue to open each gate. A wrong answer drops your speed!",
  banner: "from-yellow-500 to-orange-600",
  emoji: "💨",
};

const LOOK = {
  code: {
    href: "/student/games/code",
    blurb:
      "Type real HTML and CSS, watch it run, and clear each mission to unlock the next.",
    banner: "from-blue-600 to-indigo-700",
    emoji: "</>",
  },
  bug: {
    href: "/student/games/bug",
    blurb:
      "Find the bugs in broken pages: tap the buggy line, pick the fix, and watch the page heal.",
    banner: "from-rose-600 to-orange-600",
    emoji: "🐞",
  },
  sprint: {
    href: "/student/games/sprint",
    blurb:
      "60 seconds, as many tags as you can: match each description to its tag or CSS property.",
    banner: "from-fuchsia-600 to-violet-700",
    emoji: "⚡",
  },
  call: {
    href: "/student/games/call",
    blurb:
      "Take customer calls: choose what to say at each step, keep the customer happy and finish on time.",
    banner: "from-emerald-600 to-teal-700",
    emoji: "☎",
  },
  ticket: {
    href: "/student/games/ticket",
    blurb:
      "Work a shift at the queue: sort every customer ticket before they run out of patience.",
    banner: "from-cyan-600 to-emerald-700",
    emoji: "🎧",
  },
  math: {
    href: "/student/games/math",
    blurb:
      "Answers float up in balloons: solve the problem and pop the right one before it drifts away.",
    banner: "from-sky-600 to-indigo-700",
    emoji: "🎈",
  },
  lab: {
    href: "/student/games/lab",
    blurb:
      "Sort samples on the lab bench: plate boundaries, waves, lenses, biomolecules, gas laws and more.",
    banner: "from-indigo-600 to-violet-700",
    emoji: "🧪",
  },
  tama: {
    href: "/student/games/tama",
    blurb:
      "I-swipe pakanan kung TAMA, pakaliwa kung MALI — bawat pahayag ay may paliwanag.",
    banner: "from-amber-500 to-rose-600",
    emoji: "🇵🇭",
  },
  grammar: {
    href: "/student/games/grammar",
    blurb:
      "Every sentence hides one wrong word. Tap it, fix it, and learn the rule behind it.",
    banner: "from-blue-600 to-sky-600",
    emoji: "🔎",
  },
  salita: {
    href: "/student/games/salita",
    blurb:
      "60 segundo: itugma ang paglalarawan sa tamang diyos, tayutay, epiko o tauhan ng El Fili.",
    banner: "from-rose-600 to-amber-500",
    emoji: "📜",
  },
  tools: {
    href: "/student/games/tools",
    blurb:
      "Put every tool and habit where it belongs: computer parts, kitchen, food safety, farm and wiring.",
    banner: "from-amber-600 to-red-600",
    emoji: "🧰",
  },
  wcode: {
    href: "/student/games/words",
    blurb:
      "Unscramble the letter tiles to spell each coding word from its clue. Hints help, but cost a star.",
    banner: "from-teal-600 to-blue-700",
    emoji: "🔤",
  },
  wtel: {
    href: "/student/games/words",
    blurb:
      "Unscramble the letter tiles to spell each contact center word from its clue.",
    banner: "from-teal-600 to-emerald-700",
    emoji: "🔤",
  },
  wmath: {
    href: "/student/games/words",
    blurb:
      "Unscramble the letter tiles to spell each math word: sequences, polynomials, circles and more.",
    banner: "from-teal-600 to-sky-700",
    emoji: "🔤",
  },
  wsci: {
    href: "/student/games/words",
    blurb:
      "Unscramble the letter tiles to spell each science word: plates, waves, light, cells and genes.",
    banner: "from-teal-600 to-indigo-700",
    emoji: "🔤",
  },
  wap: {
    href: "/student/games/words",
    blurb:
      "Ayusin ang mga titik para mabuo ang salitang tinutukoy ng bawat clue.",
    banner: "from-teal-600 to-amber-600",
    emoji: "🔤",
  },
  weng: {
    href: "/student/games/words",
    blurb:
      "Unscramble the letter tiles to spell each English word: myths, arguments, essays and research.",
    banner: "from-teal-600 to-cyan-700",
    emoji: "🔤",
  },
  wfil: {
    href: "/student/games/words",
    blurb:
      "Buuin ang salita mula sa mga titik: mitolohiya, tayutay, epiko, tula at El Fili.",
    banner: "from-teal-600 to-rose-600",
    emoji: "🔤",
  },
  wtle: {
    href: "/student/games/words",
    blurb:
      "Unscramble the letter tiles to spell each tool and term: computers, kitchen, farm and wiring.",
    banner: "from-teal-600 to-orange-600",
    emoji: "🔤",
  },
  rcode: RUN_LOOK,
  rtel: RUN_LOOK,
  rmath: RUN_LOOK,
  rsci: RUN_LOOK,
  rap: RUN_LOOK,
  reng: RUN_LOOK,
  rfil: RUN_LOOK,
  rtle: RUN_LOOK,
  lava: {
    href: "/student/games/lava",
    blurb:
      "The lava is rising! Solve each problem to climb a floor. Miss five and the lava catches you.",
    banner: "from-orange-600 to-red-700",
    emoji: "🌋",
  },
  bansa: {
    href: "/student/games/bansa",
    blurb:
      "60 segundo: hulaan ang bansa mula sa kabisera at watawat, at ang lalawigan mula sa pasyalan at pista.",
    banner: "from-emerald-600 to-sky-700",
    emoji: "🌏",
  },
  kusina: {
    href: "/student/games/kusina",
    blurb:
      "Serve the customers at your karinderya: pick the right ingredients for each Filipino dish before they lose patience.",
    banner: "from-orange-500 to-rose-600",
    emoji: "🍲",
  },
  hcode: HUNT_LOOK,
  htel: HUNT_LOOK,
  hmath: HUNT_LOOK,
  hsci: HUNT_LOOK,
  hap: HUNT_LOOK,
  heng: HUNT_LOOK,
  hfil: HUNT_LOOK,
  htle: HUNT_LOOK,
  tcode: TURBO_LOOK,
  ttel: TURBO_LOOK,
  tmath: TURBO_LOOK,
  tsci: TURBO_LOOK,
  tap: TURBO_LOOK,
  teng: TURBO_LOOK,
  tfil: TURBO_LOOK,
  ttle: TURBO_LOOK,
} as const satisfies Record<
  GameId,
  { href: string; blurb: string; banner: string; emoji: string }
>;

/**
 * The student's course games: at least one for every subject they're
 * enrolled in (see ~/lib/games/catalog), each listed only for students in
 * that course. Every level shows its stars, and locked levels wait for the
 * one before.
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
            Your subject games appear here when you join a class.
          </EmptyState>
        </Card>
      )}

      {games.map((g) => {
        const look = LOOK[g.game];
        const units = [...new Set(g.levels.map((l) => l.unit))];
        // Games with one level per unit show every level in one grid.
        const single = units.length === g.levels.length;
        const groups = single
          ? [{ key: "all", label: null, levels: g.levels }]
          : units.map((unit) => {
              const levels = g.levels.filter((l) => l.unit === unit);
              return {
                key: String(unit),
                label: `Unit ${unit} · ${levels[0]!.unitTitle}`,
                levels,
              };
            });
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
                {RACE_OPEN && look === RUN_LOOK && (
                  <Link
                    href="/student/games/run/room"
                    className="mt-2 ml-2 inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-3 py-1.5 text-sm font-bold text-slate-900 hover:bg-amber-300"
                  >
                    🏁 Race classmates
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
              {groups.map(({ key, label, levels }) => {
                return (
                  <div key={key}>
                    {label && (
                      <p className="text-muted mb-2 text-xs font-bold tracking-wide uppercase">
                        {label}
                      </p>
                    )}
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
                              {single && (
                                <span className="text-muted block truncate text-[10px] font-bold tracking-wide uppercase">
                                  Unit {level.unit} · {level.unitTitle}
                                </span>
                              )}
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
