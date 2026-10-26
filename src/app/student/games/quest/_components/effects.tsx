import type { Element } from "~/lib/games/quest";

/**
 * Element skill effects for Momo's Quest. `ElementCast` flies from the hero
 * to the monster (Earth instead erupts under it); `ElementImpact` plays on
 * the monster when the skill lands.
 */

export function ElementCast({ element }: { element: Element }) {
  if (element === "earth") return null;
  if (element === "air") {
    return (
      <>
        {[0, 1, 2].map((i) => (
          <svg
            key={i}
            viewBox="0 0 40 40"
            className="fx-blade absolute bottom-[34%] left-[30%] z-30 w-12"
            style={{ animationDelay: `${i * 0.08}s`, marginTop: i * 18 }}
            aria-hidden="true"
          >
            <path
              d="M4 34 Q 20 -6 38 14 Q 20 6 4 34 Z"
              fill="#dcfce7"
              stroke="#22c55e"
              strokeWidth="2"
            />
          </svg>
        ))}
      </>
    );
  }
  return (
    <div
      className={`fx-orb fx-orb-${element} absolute bottom-[36%] left-[30%] z-30 rounded-full`}
    />
  );
}

export function ElementImpact({ element }: { element: Element }) {
  switch (element) {
    case "fire":
      return (
        <div className="pointer-events-none absolute inset-0 z-20">
          <div className="fx-core absolute top-1/2 left-1/2 size-32 rounded-full bg-[radial-gradient(circle,#fff7ed_0_20%,#fdba74_40%,rgba(249,115,22,.8)_60%,transparent_72%)]" />
          {Array.from({ length: 9 }, (_, i) => (
            <svg
              key={i}
              viewBox="0 0 20 30"
              className="fx-flame absolute bottom-[10%] w-8"
              style={{
                left: `${8 + i * 10}%`,
                animationDelay: `${(i % 4) * 0.06}s`,
              }}
              aria-hidden="true"
            >
              <path
                d="M10 0 C 2 10, 0 18, 4 24 C 6 28, 14 28, 16 24 C 20 18, 18 10, 10 0 Z"
                fill="#fb923c"
              />
              <path
                d="M10 10 C 6 16, 6 20, 8 24 C 9 26, 11 26, 12 24 C 14 20, 14 16, 10 10 Z"
                fill="#fde047"
              />
            </svg>
          ))}
        </div>
      );
    case "water":
      return (
        <div className="pointer-events-none absolute inset-0 z-20">
          <div className="fx-ring absolute top-1/2 left-1/2 size-32 rounded-full border-[6px] border-sky-300" />
          <svg
            viewBox="0 0 120 40"
            className="fx-wave absolute bottom-[4%] left-[-15%] w-[130%]"
            aria-hidden="true"
          >
            <path
              d="M0 30 C 15 10, 30 10, 40 26 C 50 8, 70 8, 80 26 C 90 8, 110 8, 120 30 L 120 40 L 0 40 Z"
              fill="#38bdf8"
              opacity=".85"
            />
            <path
              d="M0 30 C 15 14, 30 14, 40 28 C 50 12, 70 12, 80 28"
              stroke="#e0f2fe"
              strokeWidth="3"
              fill="none"
            />
          </svg>
          {Array.from({ length: 12 }, (_, i) => (
            <span
              key={i}
              className="fx-drop absolute top-1/3 left-1/2 block size-3 rounded-full bg-sky-200 ring-2 ring-sky-400"
              style={{ ["--a" as string]: `${i * 30}deg` }}
            />
          ))}
        </div>
      );
    case "air":
      return (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-end justify-center">
          <div className="fx-tornado relative mb-[6%] h-[90%] w-[70%]">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className="absolute left-1/2 block -translate-x-1/2 rounded-[50%] border-4 border-emerald-200/90"
                style={{
                  bottom: `${i * 18}%`,
                  width: `${36 + i * 16}%`,
                  height: "16%",
                  animationDelay: `${i * 0.05}s`,
                }}
              />
            ))}
          </div>
          {Array.from({ length: 6 }, (_, i) => (
            <span
              key={i}
              className="fx-leaf absolute top-1/2 left-1/2 text-lg"
              style={{ ["--a" as string]: `${i * 60}deg` }}
            >
              🍃
            </span>
          ))}
        </div>
      );
    case "earth":
      return (
        <div className="pointer-events-none absolute inset-0 z-20">
          {[0, 1, 2, 3, 4].map((i) => (
            <svg
              key={i}
              viewBox="0 0 30 60"
              className="fx-spike absolute bottom-[2%]"
              style={{
                left: `${4 + i * 19}%`,
                width: i === 2 ? "26%" : "18%",
                animationDelay: `${Math.abs(2 - i) * 0.06}s`,
              }}
              aria-hidden="true"
            >
              <path
                d="M15 0 L 30 60 L 0 60 Z"
                fill="#a16207"
                stroke="#713f12"
                strokeWidth="2"
              />
              <path d="M15 0 L 20 60 L 12 60 Z" fill="#ca8a04" opacity=".7" />
            </svg>
          ))}
          {Array.from({ length: 8 }, (_, i) => (
            <span
              key={i}
              className="fx-rock absolute top-1/2 left-1/2 block size-3 rotate-45 bg-amber-800"
              style={{ ["--a" as string]: `${200 + i * 18}deg` }}
            />
          ))}
        </div>
      );
  }
}

/** The CSS for every element effect. */
export function EffectStyles() {
  return (
    <style>{`
      .fx-orb { width: 48px; height: 48px; animation: fx-fly .42s cubic-bezier(.5,0,.9,.6) forwards; }
      .fx-orb-fire { background: radial-gradient(circle, #fff 0 20%, #fde047 38%, #f97316 62%, transparent 70%); box-shadow: 0 0 26px 10px rgba(249,115,22,.75), -34px 0 26px -4px rgba(251,146,60,.7), -70px 0 26px -8px rgba(253,224,71,.4); }
      .fx-orb-water { background: radial-gradient(circle, #fff 0 18%, #bae6fd 36%, #0ea5e9 62%, transparent 70%); box-shadow: 0 0 22px 8px rgba(56,189,248,.75), -34px 4px 18px -4px rgba(186,230,253,.8), -66px -4px 16px -8px rgba(56,189,248,.5); }
      @keyframes fx-fly { 0% { transform: translateX(0) scale(.4) } 100% { transform: translateX(min(42vw, 400px)) scale(1.25) } }
      .fx-blade { animation: fx-blade .45s cubic-bezier(.4,0,.8,.6) both; filter: drop-shadow(0 0 6px #86efac); }
      @keyframes fx-blade { 0% { transform: translateX(0) rotate(0) scale(.5); opacity: 0 } 15% { opacity: 1 } 100% { transform: translateX(min(42vw, 400px)) rotate(-360deg) scale(1.2); opacity: 1 } }
      .fx-core { margin: -64px; animation: fx-core .7s ease-out forwards; }
      @keyframes fx-core { 0% { transform: scale(.2); opacity: 1 } 100% { transform: scale(2); opacity: 0 } }
      .fx-flame { transform-origin: 50% 100%; animation: fx-flame .8s ease-out forwards; filter: drop-shadow(0 0 6px #fb923c); }
      @keyframes fx-flame { 0% { transform: scaleY(.1) translateY(0); opacity: 0 } 30% { transform: scaleY(1.3) translateY(-10px); opacity: 1 } 100% { transform: scaleY(.6) translateY(-60px); opacity: 0 } }
      .fx-ring { margin: -64px; animation: fx-ring .6s ease-out forwards; box-shadow: 0 0 16px #38bdf8; }
      @keyframes fx-ring { 0% { transform: scale(.1); opacity: 1 } 100% { transform: scale(2.2); opacity: 0 } }
      .fx-wave { animation: fx-wave .8s ease-out forwards; }
      @keyframes fx-wave { 0% { transform: translateY(60%) scaleY(.2); opacity: 0 } 35% { transform: translateY(0) scaleY(1.2); opacity: 1 } 100% { transform: translateY(20%) scaleY(.6); opacity: 0 } }
      .fx-drop { margin: -6px; animation: fx-drop .8s ease-out forwards; }
      @keyframes fx-drop { 0% { transform: rotate(var(--a)) translateX(0); opacity: 1 } 60% { transform: rotate(var(--a)) translateX(70px) translateY(-10px) } 100% { transform: rotate(var(--a)) translateX(90px) translateY(30px); opacity: 0 } }
      .fx-tornado { animation: fx-tornado .8s ease-out forwards; }
      .fx-tornado > span { animation: fx-spin .25s linear infinite; }
      @keyframes fx-tornado { 0% { transform: scale(.3, 0); opacity: 0 } 30% { transform: scale(1, 1); opacity: 1 } 100% { transform: scale(1.2, 1.1) translateY(-20px); opacity: 0 } }
      @keyframes fx-spin { 0% { transform: translateX(-50%) rotate(0) } 100% { transform: translateX(-50%) rotate(360deg) } }
      .fx-leaf { margin: -10px; animation: fx-leaf .9s ease-out forwards; }
      @keyframes fx-leaf { 0% { transform: rotate(var(--a)) translateX(0) rotate(0); opacity: 1 } 100% { transform: rotate(var(--a)) translateX(90px) rotate(540deg); opacity: 0 } }
      .fx-spike { transform-origin: 50% 100%; animation: fx-spike .75s cubic-bezier(.2,1.6,.4,1) forwards; filter: drop-shadow(0 4px 2px rgba(0,0,0,.3)); }
      @keyframes fx-spike { 0% { transform: scaleY(0); opacity: 1 } 35% { transform: scaleY(1.15) } 75% { transform: scaleY(1); opacity: 1 } 100% { transform: scaleY(.9); opacity: 0 } }
      .fx-rock { margin: -6px; animation: fx-rock .8s ease-out forwards; }
      @keyframes fx-rock { 0% { transform: rotate(var(--a)) translateX(0) rotate(0); opacity: 1 } 100% { transform: rotate(var(--a)) translateX(100px) rotate(400deg); opacity: 0 } }
      @media (prefers-reduced-motion: reduce) { .fx-orb, .fx-blade, .fx-core, .fx-flame, .fx-ring, .fx-wave, .fx-drop, .fx-tornado, .fx-leaf, .fx-spike, .fx-rock { animation-duration: .01s; } }
    `}</style>
  );
}
