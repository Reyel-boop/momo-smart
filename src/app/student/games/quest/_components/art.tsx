import type { EnemyKind } from "~/lib/games/quest";

/**
 * Momo, the golden-retriever superhero (red cape, blue mask, lightning
 * emblem), drawn facing right toward the enemies. The cape, tail and body
 * carry classes the battle screen animates.
 */
export function MomoHero({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 200" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="momo-cape" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ef4444" />
          <stop offset="1" stopColor="#991b1b" />
        </linearGradient>
        <radialGradient id="momo-body" cx=".55" cy=".35" r=".8">
          <stop offset="0" stopColor="#f2bf62" />
          <stop offset="1" stopColor="#d9963a" />
        </radialGradient>
      </defs>
      {/* Cape, flowing back from the neck */}
      <g className="momo-cape">
        <path
          d="M128 92 C 96 88, 58 96, 22 118 C 40 124, 30 138, 14 150 C 44 152, 60 146, 74 156 C 84 140, 108 124, 136 112 Z"
          fill="url(#momo-cape)"
        />
        <path
          d="M128 92 C 100 94, 76 104, 52 120"
          stroke="#fca5a5"
          strokeWidth="2"
          fill="none"
          opacity=".5"
        />
      </g>
      {/* Tail */}
      <g className="momo-tail">
        <path
          d="M58 124 C 40 116, 30 96, 38 80 C 44 96, 52 106, 66 112 Z"
          fill="#d9963a"
        />
        <path
          d="M40 84 C 42 96, 50 106, 60 112"
          stroke="#f3cf8a"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </g>
      {/* Back legs, body, front legs */}
      <rect x="66" y="142" width="16" height="36" rx="8" fill="#c88733" />
      <rect x="128" y="142" width="16" height="36" rx="8" fill="#c88733" />
      <ellipse cx="104" cy="132" rx="56" ry="32" fill="url(#momo-body)" />
      <ellipse cx="112" cy="146" rx="34" ry="12" fill="#f3cf8a" opacity=".7" />
      <rect x="82" y="146" width="16" height="36" rx="8" fill="#e3a64a" />
      <rect x="144" y="144" width="16" height="38" rx="8" fill="#e3a64a" />
      <ellipse cx="90" cy="182" rx="11" ry="6" fill="#f3cf8a" />
      <ellipse cx="152" cy="182" rx="11" ry="6" fill="#f3cf8a" />
      <ellipse cx="74" cy="178" rx="10" ry="5" fill="#e3b46a" />
      <ellipse cx="136" cy="178" rx="10" ry="5" fill="#e3b46a" />
      {/* Hero emblem */}
      <circle
        cx="146"
        cy="126"
        r="11"
        fill="#2563eb"
        stroke="#fde047"
        strokeWidth="2.5"
      />
      <path
        d="M148 117 L141 128 L146 128 L143 136 L151 124 L146 124 Z"
        fill="#fde047"
      />
      {/* Neck and head */}
      <ellipse cx="150" cy="104" rx="22" ry="20" fill="#e3a64a" />
      <g transform="translate(118 26) scale(1.45)">
        <path
          fill="#e3a64a"
          d="M26 13.5c1.2-4.5 3.4-2.2 4.2-5 .9 2.8 2.9 1 3.6 4.4 1.4-2.4 3.3-1.2 3.7 1.4z"
        />
        <path
          fill="#e3a64a"
          d="M14 30c0-12 8-19 18-19s18 7 18 19v4c0 11-8 18-18 18s-18-7-18-18z"
        />
        <path
          fill="#c07f2c"
          d="M21 14c-9.5-.5-15 9.5-14 22 .6 7.6 6.2 10.6 10.2 7.5 3-2.3 3.6-7.6 3.8-13z"
        />
        <path
          fill="#c07f2c"
          d="M43 14c9.5-.5 15 9.5 14 22-.6 7.6-6.2 10.6-10.2 7.5-3-2.3-3.6-7.6-3.8-13z"
        />
        <path
          fill="#f3cf8a"
          d="M32 33c-6.8 0-11.5 3.6-11.5 8.6S25.2 51 32 51s11.5-4.4 11.5-9.4S38.8 33 32 33z"
        />
        {/* Hero mask */}
        <path
          fill="#1d4ed8"
          d="M17 27.5c4-4.6 10-5 15-1.6 5-3.4 11-3 15 1.6-.6 5.2-4.4 7.4-8.2 6.4-3-.8-4.8-2.6-6.8-2.6s-3.8 1.8-6.8 2.6c-3.8 1-7.6-1.2-8.2-6.4z"
        />
        <path
          fill="none"
          stroke="#7a4a1c"
          strokeLinecap="round"
          strokeWidth="1.6"
          d="M21.5 23.2l6 1.4m14.5-1.4l-6 1.4"
        />
        <circle cx="25.6" cy="29.4" r="2.6" fill="#fff" />
        <circle cx="38.4" cy="29.4" r="2.6" fill="#fff" />
        <circle cx="26.1" cy="29.6" r="1.7" fill="#2b1b0e" />
        <circle cx="38.9" cy="29.6" r="1.7" fill="#2b1b0e" />
        <path
          fill="#e8707a"
          d="M29.6 44c0 4.2 1.1 6.4 2.4 6.4s2.4-2.2 2.4-6.4z"
        />
        <path
          fill="#2b1b0e"
          d="M27.8 36.8c0-2.2 8.4-2.2 8.4 0 0 2.3-2.3 4-4.2 4s-4.2-1.7-4.2-4z"
        />
        <path
          fill="none"
          stroke="#7a4a1c"
          strokeLinecap="round"
          strokeWidth="1.4"
          d="M32 40.8v2.6m0 0c-1.4 2-3.8 2.2-5.2.6m5.2-.6c1.4 2 3.8 2.2 5.2.6"
        />
      </g>
    </svg>
  );
}

/** The enemies Momo battles, each with its own look. */
export function Enemy({
  kind,
  className = "",
}: {
  kind: EnemyKind;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 160 160" className={className} aria-hidden="true">
      {kind === "bug" && <BugBot />}
      {kind === "slime" && <GlitchSlime />}
      {kind === "bat" && <SpamBat />}
      {kind === "ghost" && <ErrorGhost />}
      {kind === "boss" && <KingVirus />}
    </svg>
  );
}

const AngryEyes = ({
  x1,
  x2,
  y,
  r = 8,
  color = "#fef08a",
}: {
  x1: number;
  x2: number;
  y: number;
  r?: number;
  color?: string;
}) => (
  <g>
    <circle cx={x1} cy={y} r={r} fill={color} />
    <circle cx={x2} cy={y} r={r} fill={color} />
    <circle cx={x1 - 2} cy={y + 1} r={r * 0.45} fill="#111827" />
    <circle cx={x2 - 2} cy={y + 1} r={r * 0.45} fill="#111827" />
    <path
      d={`M${x1 - r - 2} ${y - r - 4} L${x1 + r} ${y - r + 3}`}
      stroke="#111827"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <path
      d={`M${x2 + r + 2} ${y - r - 4} L${x2 - r} ${y - r + 3}`}
      stroke="#111827"
      strokeWidth="4"
      strokeLinecap="round"
    />
  </g>
);

function BugBot() {
  return (
    <g>
      <path
        d="M58 40 L44 14 M102 40 L116 14"
        stroke="#14532d"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="44" cy="14" r="6" fill="#ef4444" />
      <circle cx="116" cy="14" r="6" fill="#ef4444" />
      {[60, 80, 100].map((y) => (
        <g key={y} stroke="#14532d" strokeWidth="6" strokeLinecap="round">
          <path d={`M42 ${y} L18 ${y + 10}`} />
          <path d={`M118 ${y} L142 ${y + 10}`} />
        </g>
      ))}
      <ellipse cx="80" cy="88" rx="44" ry="50" fill="#22c55e" />
      <path d="M80 40 L80 136" stroke="#15803d" strokeWidth="4" />
      <ellipse cx="80" cy="54" rx="34" ry="22" fill="#16a34a" />
      <AngryEyes x1={66} x2={94} y={52} r={8} color="#fca5a5" />
      <rect x="62" y="98" width="36" height="16" rx="4" fill="#14532d" />
      <text
        x="80"
        y="110"
        textAnchor="middle"
        fontSize="11"
        fontWeight="900"
        fill="#86efac"
        fontFamily="monospace"
      >
        BUG
      </text>
    </g>
  );
}

function GlitchSlime() {
  return (
    <g>
      <path
        d="M20 132 C 14 96, 34 50, 80 46 C 126 50, 146 96, 140 132 C 132 140, 124 128, 118 140 C 108 150, 100 132, 90 142 C 80 152, 72 134, 62 144 C 50 152, 44 132, 34 142 C 26 146, 22 140, 20 132 Z"
        fill="#a855f7"
      />
      <ellipse
        cx="58"
        cy="72"
        rx="14"
        ry="8"
        fill="#e9d5ff"
        opacity=".6"
        transform="rotate(-25 58 72)"
      />
      <rect x="96" y="60" width="18" height="6" fill="#22d3ee" opacity=".8" />
      <rect x="30" y="100" width="12" height="5" fill="#f472b6" opacity=".8" />
      <AngryEyes x1={64} x2={98} y={88} r={11} color="#ffffff" />
      <path d="M58 116 Q 80 104 102 116 Q 80 130 58 116 Z" fill="#3b0764" />
      <path d="M66 114 l4 6 l4 -7 l4 7 l4 -7 l4 7 l4 -6" fill="#fff" />
    </g>
  );
}

function SpamBat() {
  return (
    <g>
      <g className="enemy-wing-l">
        <path
          d="M60 78 C 40 50, 14 44, 4 56 C 16 62, 12 74, 2 84 C 18 84, 24 92, 22 104 C 36 94, 50 96, 60 100 Z"
          fill="#4c1d95"
        />
      </g>
      <g className="enemy-wing-r">
        <path
          d="M100 78 C 120 50, 146 44, 156 56 C 144 62, 148 74, 158 84 C 142 84, 136 92, 138 104 C 124 94, 110 96, 100 100 Z"
          fill="#4c1d95"
        />
      </g>
      <path
        d="M58 52 L54 30 L70 46 Z M102 52 L106 30 L90 46 Z"
        fill="#3b0764"
      />
      <ellipse cx="80" cy="84" rx="30" ry="36" fill="#6d28d9" />
      <AngryEyes x1={68} x2={92} y={74} r={8} color="#fde047" />
      <path
        d="M68 98 Q 80 106 92 98"
        stroke="#1e1b4b"
        strokeWidth="3"
        fill="none"
      />
      <path d="M72 99 L75 108 L78 100 Z M88 99 L85 108 L82 100 Z" fill="#fff" />
      <rect x="62" y="112" width="36" height="12" rx="3" fill="#fde047" />
      <text
        x="80"
        y="121"
        textAnchor="middle"
        fontSize="9"
        fontWeight="900"
        fill="#4c1d95"
        fontFamily="monospace"
      >
        SPAM
      </text>
    </g>
  );
}

function ErrorGhost() {
  return (
    <g>
      <ellipse cx="80" cy="90" rx="60" ry="64" fill="#a5f3fc" opacity=".25" />
      <path
        d="M30 140 L30 76 C 30 44, 52 24, 80 24 C 108 24, 130 44, 130 76 L130 140 L116 128 L102 142 L88 128 L74 142 L60 128 L46 142 Z"
        fill="#f8fafc"
      />
      <AngryEyes x1={62} x2={98} y={72} r={11} color="#1e293b" />
      <ellipse cx="80" cy="104" rx="12" ry="14" fill="#1e293b" />
      <rect x="54" y="36" width="52" height="14" rx="3" fill="#ef4444" />
      <text
        x="80"
        y="47"
        textAnchor="middle"
        fontSize="11"
        fontWeight="900"
        fill="#fff"
        fontFamily="monospace"
      >
        ERROR
      </text>
    </g>
  );
}

function KingVirus() {
  const spikes = Array.from({ length: 12 }, (_, i) => (i * Math.PI * 2) / 12);
  return (
    <g>
      <circle cx="80" cy="88" r="70" fill="#ef4444" opacity=".18" />
      {spikes.map((a, i) => {
        const x1 = 80 + Math.cos(a) * 44;
        const y1 = 90 + Math.sin(a) * 44;
        const x2 = 80 + Math.cos(a) * 64;
        const y2 = 90 + Math.sin(a) * 64;
        return (
          <g key={i}>
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#991b1b"
              strokeWidth="6"
            />
            <circle
              cx={x2}
              cy={y2}
              r="7"
              fill="#fb7185"
              stroke="#991b1b"
              strokeWidth="3"
            />
          </g>
        );
      })}
      <circle cx="80" cy="90" r="46" fill="#dc2626" />
      <circle cx="62" cy="108" r="6" fill="#b91c1c" />
      <circle cx="104" cy="70" r="5" fill="#b91c1c" />
      <AngryEyes x1={64} x2={96} y={84} r={10} color="#fef08a" />
      <path
        d="M58 108 Q 80 96 102 108 L98 118 Q 80 110 62 118 Z"
        fill="#450a0a"
      />
      <path d="M64 108 l4 7 l4 -8 l4 8 l4 -8 l4 8 l4 -8 l4 7" fill="#fff" />
      {/* Crown */}
      <path
        d="M52 40 L58 18 L70 32 L80 12 L90 32 L102 18 L108 40 Z"
        fill="#facc15"
        stroke="#a16207"
        strokeWidth="3"
      />
      <circle cx="80" cy="30" r="4" fill="#3b82f6" />
      <circle cx="64" cy="34" r="3" fill="#22c55e" />
      <circle cx="96" cy="34" r="3" fill="#22c55e" />
    </g>
  );
}
