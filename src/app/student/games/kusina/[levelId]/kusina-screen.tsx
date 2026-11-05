"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { SoundToggle } from "~/app/_components/race/race-view";
import { sfx, unlock } from "~/app/_components/sfx";
import { Card } from "~/app/_components/ui";
import {
  isRightPlate,
  KARINDERYA_LEVELS,
  KARINDERYA_SECONDS,
  KARINDERYA_STARS,
  trayFor,
  type KarinderyaLevel,
} from "~/lib/games/karinderya";
import { api } from "~/trpc/react";
import {
  LevelHeader,
  LevelResult,
  LockedLevel,
  shuffled,
} from "../../_components/shared";

const CUSTOMERS = ["👵", "👨‍🌾", "👩‍🏫", "🧑‍🔧", "👮", "👩‍⚕️"];

/** One Karinderya Rush shift: six customers, one dish each. */
export function KusinaScreen({ levelId }: { levelId: string }) {
  const level = KARINDERYA_LEVELS.find((l) => l.id === levelId)!;
  const access = api.game.level.useQuery(
    { game: "kusina", levelId },
    { retry: false },
  );
  const [attempt, setAttempt] = useState(0);

  if (access.error) {
    return <LockedLevel what="Level" message={access.error.message} />;
  }
  return (
    <Shift
      key={attempt}
      level={level}
      best={access.data?.best ?? 0}
      number={access.data?.number}
      count={access.data?.count}
      nextId={access.data?.nextId ?? null}
      ready={!!access.data}
      onRetry={() => setAttempt((n) => n + 1)}
    />
  );
}

function Shift({
  level,
  best,
  number,
  count,
  nextId,
  ready,
  onRetry,
}: {
  level: KarinderyaLevel;
  best: number;
  number?: number;
  count?: number;
  nextId: string | null;
  ready: boolean;
  onRetry: () => void;
}) {
  const router = useRouter();
  const utils = api.useUtils();
  const [phase, setPhase] = useState<"intro" | "play" | "done">("intro");
  const [orders, setOrders] = useState(level.dishes);
  const [index, setIndex] = useState(0);
  const [tray, setTray] = useState<string[]>([]);
  const [picks, setPicks] = useState<string[]>([]);
  const [plates, setPlates] = useState<{ id: string; picks: string[] }[]>([]);
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const served = useRef(-1);
  const finish = api.game.finishKarinderya.useMutation({
    onSuccess: () => {
      void utils.game.hub.invalidate();
      router.refresh();
    },
  });

  const dish = orders[index];

  const begin = () => {
    unlock();
    sfx.select();
    const order = shuffled(level.dishes);
    setOrders(order);
    setTray(trayFor(level, order[0]!));
    setPhase("play");
  };

  const serve = (plate: string[]) => {
    if (!dish || served.current === index || feedback !== null) return;
    served.current = index;
    const ok = isRightPlate(dish, plate);
    setPlates((p) => [...p, { id: dish.id, picks: plate }]);
    setFeedback(ok);
    if (ok) sfx.coin();
    else sfx.hurt();
  };

  useEffect(() => {
    if (phase !== "play" || feedback !== null) return;
    const t = setTimeout(() => serve([]), KARINDERYA_SECONDS * 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, index, feedback]);

  useEffect(() => {
    if (feedback === null) return;
    const t = setTimeout(
      () => {
        setFeedback(null);
        setPicks([]);
        if (index + 1 >= orders.length) setPhase("done");
        else {
          setTray(trayFor(level, orders[index + 1]!));
          setIndex((i) => i + 1);
        }
      },
      feedback ? 1000 : 2800,
    );
    return () => clearTimeout(t);
  }, [feedback, index, orders, level]);

  useEffect(() => {
    if (
      phase === "done" &&
      ready &&
      !finish.data &&
      !finish.isPending &&
      !finish.error
    ) {
      finish.mutate({ levelId: level.id, plates });
    }
  }, [phase, ready, finish, level.id, plates]);

  useEffect(() => {
    if (finish.data && finish.data.stars > 0) sfx.fanfare();
  }, [finish.data]);

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <LevelHeader
        game="Karinderya Rush"
        unit={level.unit}
        unitTitle={level.unitTitle}
        title={level.title}
        number={number}
        count={count}
        best={best}
      >
        <SoundToggle tone="light" />
      </LevelHeader>

      {phase === "intro" && (
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-br from-orange-500 via-rose-500 to-red-600 px-6 py-8 text-center text-white">
            <p className="text-5xl">🍲</p>
            <h2 className="mt-2 text-3xl font-black">{level.title}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-white/85">
              Six hungry customers are coming. Pick the right ingredients for
              each order, then tap Serve. They wait {KARINDERYA_SECONDS}{" "}
              seconds.
            </p>
            <div className="mt-4 flex justify-center gap-4 text-xs font-bold text-white/85">
              <span>⭐ {KARINDERYA_STARS[0]} right</span>
              <span>⭐⭐ {KARINDERYA_STARS[1]}</span>
              <span>⭐⭐⭐ {KARINDERYA_STARS[2]}</span>
            </div>
            <button
              type="button"
              onPointerDown={unlock}
              onClick={begin}
              className="mt-6 rounded-2xl bg-white px-10 py-3 text-xl font-black text-slate-900 shadow-lg hover:bg-amber-100"
            >
              OPEN SHOP
            </button>
          </div>
        </Card>
      )}

      {phase === "play" && dish && (
        <Card className="overflow-hidden">
          <div className="h-2 bg-slate-100">
            <div
              key={index}
              className="patience h-full bg-gradient-to-r from-rose-500 to-amber-400"
              style={{
                animationDuration: `${KARINDERYA_SECONDS}s`,
                animationPlayState: feedback === null ? "running" : "paused",
              }}
            />
          </div>
          <div className="p-5 max-sm:p-3">
            <div className="flex items-center gap-4">
              <span className="text-5xl" aria-hidden="true">
                {CUSTOMERS[index % CUSTOMERS.length]}
              </span>
              <div className="min-w-0">
                <p className="text-muted text-xs font-bold uppercase">
                  Customer {index + 1} of {orders.length}
                </p>
                <p className="text-ink text-2xl font-black">
                  Isang {dish.name}, please!
                </p>
                <p className="text-muted text-sm">
                  Pick {dish.ingredients.length} ingredients ({picks.length}{" "}
                  picked)
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {tray.map((item) => {
                const picked = picks.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    disabled={feedback !== null}
                    onClick={() => {
                      sfx.select();
                      setPicks((p) =>
                        picked ? p.filter((x) => x !== item) : [...p, item],
                      );
                    }}
                    className={`rounded-xl border-2 px-3 py-2.5 text-sm font-bold transition ${
                      picked
                        ? "border-orange-500 bg-orange-50 text-orange-800"
                        : "border-line text-ink hover:border-orange-300"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              disabled={feedback !== null || picks.length === 0}
              onClick={() => serve(picks)}
              className="mt-4 w-full rounded-xl bg-orange-500 px-4 py-3 text-lg font-black text-white hover:bg-orange-600 disabled:opacity-50"
            >
              🍽 Serve
            </button>
            {feedback !== null && (
              <p
                className={`mt-3 rounded-xl px-4 py-2.5 text-center text-sm font-black ${feedback ? "bg-emerald-500 text-white" : "bg-rose-50 text-rose-700"}`}
              >
                {feedback
                  ? "Ang sarap! Salamat!"
                  : `Not quite. ${dish.name} needs: ${dish.ingredients.join(", ")}.`}
              </p>
            )}
          </div>
        </Card>
      )}

      {phase === "done" && (
        <Card className="px-4 py-4">
          {!finish.data ? (
            <p className="text-muted text-center text-sm">
              {finish.error ? finish.error.message : "Counting your sales…"}
            </p>
          ) : (
            <LevelResult
              heading={
                finish.data.stars === 3
                  ? "🍲 Best karinderya in town!"
                  : finish.data.stars > 0
                    ? "🍲 Shift done!"
                    : "Not yet — try again"
              }
              stars={finish.data.stars}
              newStars={finish.data.newStars}
              best={finish.data.best}
              failNote={`Serve at least ${KARINDERYA_STARS[0]} dishes right for a star.`}
              stats={[
                {
                  label: "Served right",
                  value: `${finish.data.right}/${finish.data.total}`,
                },
              ]}
              nextHref={nextId ? `/student/games/kusina/${nextId}` : null}
              onRetry={onRetry}
            />
          )}
        </Card>
      )}

      <style>{`
        .patience { width: 100%; animation-name: patience; animation-timing-function: linear; animation-fill-mode: forwards; }
        @keyframes patience { to { width: 0 } }
      `}</style>
    </div>
  );
}
