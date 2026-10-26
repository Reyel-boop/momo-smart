import type { EnemyKind } from "~/lib/games/quest";

/**
 * Momo's Quest artwork in a bright chibi-anime style: the adventurer (big
 * eyes, spiky golden hair, red headband, sword), Momo the golden-retriever
 * super pet (cape and mask), and the jelly monsters. Parts carry classes the
 * battle screen animates (hair, scarf, sword, tail, wings).
 */

export function Hero({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 170" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="hero-skin" cx=".45" cy=".4" r=".7">
          <stop offset="0" stopColor="#fff1e2" />
          <stop offset="1" stopColor="#ffd9b8" />
        </radialGradient>
        <linearGradient id="hero-hair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe27a" />
          <stop offset="1" stopColor="#f0a92a" />
        </linearGradient>
        <linearGradient id="hero-eye" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1e6b45" />
          <stop offset="1" stopColor="#5fd39a" />
        </linearGradient>
        <linearGradient id="hero-blade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#f8fafc" />
          <stop offset=".5" stopColor="#cbd5e1" />
          <stop offset="1" stopColor="#ffffff" />
        </linearGradient>
        <linearGradient id="hero-tunic" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbfaf3" />
          <stop offset="1" stopColor="#e6e2d0" />
        </linearGradient>
      </defs>
      {/* Ground shadow */}
      <ellipse cx="66" cy="164" rx="34" ry="5" fill="#000" opacity=".18" />
      {/* Scarf tails flowing back */}
      <g className="hero-scarf">
        <path
          d="M52 92 C 36 96, 22 92, 10 100 C 22 104, 30 104, 40 102 C 30 110, 22 112, 14 120 C 30 118, 44 110, 56 100 Z"
          fill="#e23b4e"
        />
      </g>
      {/* Back hair */}
      <path
        className="hero-hair"
        d="M30 52 C 22 30, 40 10, 66 10 C 92 10, 108 28, 104 52 C 112 62, 108 78, 100 84 L 34 84 C 24 76, 22 62, 30 52 Z"
        fill="url(#hero-hair)"
      />
      {/* Legs and boots */}
      <rect x="50" y="128" width="12" height="24" rx="5" fill="#f5e7d0" />
      <rect x="68" y="128" width="12" height="24" rx="5" fill="#f5e7d0" />
      <path
        d="M46 146 h18 v10 a4 4 0 0 1 -4 4 h-16 a4 4 0 0 1 -2 -6 z"
        fill="#7a4a1c"
      />
      <path
        d="M66 146 h18 v10 a4 4 0 0 1 -4 4 h-12 a4 4 0 0 1 -4 -4 z"
        fill="#6b3f17"
      />
      {/* Body: tunic, trim, belt */}
      <path
        d="M42 96 C 42 88, 50 84, 66 84 C 82 84, 90 88, 90 96 L 94 132 C 80 138, 52 138, 38 132 Z"
        fill="url(#hero-tunic)"
      />
      <path
        d="M40 126 C 54 132, 78 132, 92 126 L 94 132 C 80 138, 52 138, 38 132 Z"
        fill="#3f8f5a"
      />
      <path
        d="M58 86 L66 100 L74 86"
        fill="none"
        stroke="#3f8f5a"
        strokeWidth="3"
      />
      <rect x="40" y="112" width="52" height="7" rx="3" fill="#7a4a1c" />
      <rect
        x="61"
        y="110.5"
        width="10"
        height="10"
        rx="2"
        fill="#facc15"
        stroke="#a16207"
        strokeWidth="1.5"
      />
      {/* Back arm */}
      <path
        d="M44 96 C 34 104, 32 114, 36 122"
        stroke="#f5e7d0"
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="36" cy="123" r="6" fill="#8b5a2b" />
      {/* Scarf knot */}
      <path
        d="M50 88 C 58 94, 74 94, 82 88 L 80 96 C 72 100, 60 100, 52 96 Z"
        fill="#e23b4e"
      />
      {/* Head */}
      <ellipse cx="68" cy="56" rx="32" ry="30" fill="url(#hero-skin)" />
      {/* Ear */}
      <ellipse cx="38" cy="60" rx="5" ry="7" fill="#ffd9b8" />
      {/* Eyes: big anime eyes */}
      <g>
        <ellipse cx="60" cy="62" rx="7.5" ry="10" fill="#ffffff" />
        <ellipse cx="84" cy="62" rx="6.5" ry="9.5" fill="#ffffff" />
        <ellipse cx="61" cy="64" rx="6" ry="8" fill="url(#hero-eye)" />
        <ellipse cx="85" cy="64" rx="5.2" ry="7.6" fill="url(#hero-eye)" />
        <ellipse cx="61.5" cy="65" rx="3" ry="4.4" fill="#0b2e1e" />
        <ellipse cx="85.5" cy="65" rx="2.6" ry="4.2" fill="#0b2e1e" />
        <circle cx="59" cy="60" r="2.4" fill="#fff" />
        <circle cx="83" cy="60" r="2.1" fill="#fff" />
        <circle cx="63.5" cy="68.5" r="1.1" fill="#fff" />
        <circle cx="87.2" cy="68.5" r="1" fill="#fff" />
        <path
          d="M51 52 Q 60 48 68 52"
          stroke="#a16207"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M78 52 Q 85 48 92 52"
          stroke="#a16207"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />
      </g>
      {/* Blush and mouth */}
      <ellipse cx="52" cy="73" rx="5" ry="2.6" fill="#fb7185" opacity=".45" />
      <ellipse cx="92" cy="73" rx="4.5" ry="2.4" fill="#fb7185" opacity=".45" />
      <path d="M71 76 Q 75 81 79 76 Q 75 78 71 76 Z" fill="#b91c1c" />
      {/* Front hair spikes and headband */}
      <path
        className="hero-hair"
        d="M34 46 C 36 24, 54 14, 70 16 C 88 16, 102 28, 102 46 L 96 40 L 92 50 L 86 38 L 80 48 L 74 36 L 68 46 L 60 34 L 56 46 L 48 36 L 44 48 Z"
        fill="url(#hero-hair)"
      />
      <path
        d="M58 8 L 64 20 L 70 4 L 74 18 L 84 8 L 82 22 Z"
        fill="#ffd34d"
        className="hero-hair"
      />
      <path
        d="M36 44 C 52 38, 84 38, 102 44 L 101 50 C 84 44, 52 44, 37 50 Z"
        fill="#e23b4e"
      />
      <path
        d="M36 46 C 28 46, 22 52, 18 58 M36 48 C 30 52, 28 58, 26 64"
        stroke="#e23b4e"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        className="hero-scarf"
      />
      {/* Sword arm (animated group) */}
      <g className="hero-sword">
        <path
          d="M86 98 C 96 100, 102 96, 106 88"
          stroke="#f5e7d0"
          strokeWidth="9"
          strokeLinecap="round"
          fill="none"
        />
        <g transform="translate(106 86) rotate(28)">
          <rect x="-3" y="-4" width="6" height="14" rx="2" fill="#7a4a1c" />
          <rect
            x="-10"
            y="-8"
            width="20"
            height="5"
            rx="2"
            fill="#facc15"
            stroke="#a16207"
            strokeWidth="1"
          />
          <path
            d="M-4 -8 L -4 -52 L 0 -60 L 4 -52 L 4 -8 Z"
            fill="url(#hero-blade)"
            stroke="#94a3b8"
            strokeWidth="1"
          />
          <path
            d="M0 -12 L 0 -54"
            stroke="#ffffff"
            strokeWidth="1.2"
            opacity=".9"
          />
        </g>
        <circle cx="106" cy="88" r="6.5" fill="#8b5a2b" />
      </g>
    </svg>
  );
}

/** Momo, the golden-retriever super pet: chibi, caped and masked. */
export function MomoPet({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 110 100" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="pet-fur" cx=".5" cy=".35" r=".75">
          <stop offset="0" stopColor="#f7c86e" />
          <stop offset="1" stopColor="#dc9a3c" />
        </radialGradient>
      </defs>
      <ellipse cx="56" cy="95" rx="28" ry="4" fill="#000" opacity=".15" />
      {/* Cape */}
      <path
        className="pet-cape"
        d="M40 62 C 26 62, 14 70, 6 82 C 20 84, 30 82, 38 86 C 44 78, 50 72, 58 68 Z"
        fill="#e23b4e"
      />
      {/* Tail */}
      <path
        className="pet-tail"
        d="M30 74 C 18 70, 14 58, 20 50 C 22 60, 28 66, 36 68 Z"
        fill="#dc9a3c"
      />
      {/* Body and paws */}
      <ellipse cx="58" cy="76" rx="24" ry="16" fill="url(#pet-fur)" />
      <ellipse cx="46" cy="90" rx="7" ry="5" fill="#f3cf8a" />
      <ellipse cx="68" cy="90" rx="7" ry="5" fill="#f3cf8a" />
      <circle
        cx="62"
        cy="74"
        r="6"
        fill="#2563eb"
        stroke="#fde047"
        strokeWidth="1.6"
      />
      <path
        d="M63.5 69 L59.5 75 L62.5 75 L60.5 80 L65.5 73 L62.5 73 Z"
        fill="#fde047"
      />
      {/* Head */}
      <ellipse cx="66" cy="40" rx="27" ry="25" fill="url(#pet-fur)" />
      <path
        d="M44 22 C 32 22, 28 40, 32 54 C 36 60, 44 56, 46 46 Z"
        fill="#c07f2c"
        className="pet-ear"
      />
      <path
        d="M88 22 C 100 22, 104 40, 100 54 C 96 60, 88 56, 86 46 Z"
        fill="#c07f2c"
      />
      <ellipse cx="66" cy="52" rx="13" ry="10" fill="#f8dca2" />
      {/* Mask and big eyes */}
      <path
        d="M44 38 C 50 30, 60 30, 66 35 C 72 30, 82 30, 88 38 C 86 46, 78 48, 72 45 L 66 42 L 60 45 C 54 48, 46 46, 44 38 Z"
        fill="#1d4ed8"
      />
      <ellipse cx="56" cy="39" rx="5" ry="6" fill="#fff" />
      <ellipse cx="76" cy="39" rx="5" ry="6" fill="#fff" />
      <circle cx="56.5" cy="40" r="3.6" fill="#3b2412" />
      <circle cx="76.5" cy="40" r="3.6" fill="#3b2412" />
      <circle cx="55" cy="38" r="1.4" fill="#fff" />
      <circle cx="75" cy="38" r="1.4" fill="#fff" />
      <ellipse cx="66" cy="49" rx="4.5" ry="3.2" fill="#2b1b0e" />
      <path
        d="M66 52 v3 m0 0 c-2 2 -5 2 -6 0 m6 0 c2 2 5 2 6 0"
        stroke="#7a4a1c"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M63 57 c0 4 1.5 6 3 6 s3 -2 3 -6 z" fill="#f472b6" />
      <ellipse cx="50" cy="50" rx="3.5" ry="2" fill="#fb7185" opacity=".4" />
      <ellipse cx="82" cy="50" rx="3.5" ry="2" fill="#fb7185" opacity=".4" />
    </svg>
  );
}

/** The jelly monsters: round, glossy and a little cheeky. */
export function Monster({
  kind,
  className = "",
}: {
  kind: EnemyKind;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 140 140" className={className} aria-hidden="true">
      <ellipse
        cx="70"
        cy="132"
        rx={kind === "boss" ? 46 : 34}
        ry="5"
        fill="#000"
        opacity=".18"
      />
      {kind === "pink" && (
        <Jelly body="#ff8fb1" shade="#f0567f" tuft="#ff8fb1" />
      )}
      {kind === "leaf" && <Jelly body="#86e07a" shade="#45b04a" leaf />}
      {kind === "bat" && <BubbleBat />}
      {kind === "ghost" && <Ghosty />}
      {kind === "boss" && <JellyKing />}
    </svg>
  );
}

function CuteFace({
  cx,
  cy,
  angry = false,
}: {
  cx: number;
  cy: number;
  angry?: boolean;
}) {
  return (
    <g>
      <ellipse cx={cx - 14} cy={cy} rx="4.2" ry="5.6" fill="#2b1b2e" />
      <ellipse cx={cx + 14} cy={cy} rx="4.2" ry="5.6" fill="#2b1b2e" />
      <circle cx={cx - 15.5} cy={cy - 2} r="1.6" fill="#fff" />
      <circle cx={cx + 12.5} cy={cy - 2} r="1.6" fill="#fff" />
      {angry && (
        <g stroke="#2b1b2e" strokeWidth="3" strokeLinecap="round">
          <path d={`M${cx - 21} ${cy - 11} L${cx - 9} ${cy - 7}`} />
          <path d={`M${cx + 21} ${cy - 11} L${cx + 9} ${cy - 7}`} />
        </g>
      )}
      <path
        d={`M${cx - 6} ${cy + 9} q 3 4 6 0 q 3 4 6 0`}
        stroke="#2b1b2e"
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse
        cx={cx - 22}
        cy={cy + 8}
        rx="5"
        ry="3"
        fill="#ff5c8a"
        opacity=".45"
      />
      <ellipse
        cx={cx + 22}
        cy={cy + 8}
        rx="5"
        ry="3"
        fill="#ff5c8a"
        opacity=".45"
      />
    </g>
  );
}

function Jelly({
  body,
  shade,
  tuft,
  leaf = false,
}: {
  body: string;
  shade: string;
  tuft?: string;
  leaf?: boolean;
}) {
  const id = `jelly-${body.slice(1)}`;
  return (
    <g>
      <defs>
        <radialGradient id={id} cx=".38" cy=".3" r=".8">
          <stop offset="0" stopColor="#ffffff" stopOpacity=".9" />
          <stop offset=".25" stopColor={body} />
          <stop offset="1" stopColor={shade} />
        </radialGradient>
      </defs>
      <path
        d="M70 28 C 104 28, 122 70, 120 100 C 118 124, 96 130, 70 130 C 44 130, 22 124, 20 100 C 18 70, 36 28, 70 28 Z"
        fill={`url(#${id})`}
      />
      {tuft && (
        <path
          d="M70 30 C 64 18, 72 12, 76 8 C 74 16, 80 22, 72 30 Z"
          fill={tuft}
        />
      )}
      {leaf && (
        <g className="monster-leaf">
          <path
            d="M70 30 C 70 22, 72 16, 74 12"
            stroke="#2f7d32"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M74 14 C 86 4, 100 8, 102 14 C 92 22, 80 22, 74 14 Z"
            fill="#4caf50"
          />
          <path
            d="M72 18 C 62 8, 50 10, 48 16 C 56 22, 66 22, 72 18 Z"
            fill="#66bb6a"
          />
        </g>
      )}
      <ellipse
        cx="52"
        cy="54"
        rx="10"
        ry="6"
        fill="#fff"
        opacity=".7"
        transform="rotate(-30 52 54)"
      />
      <CuteFace cx={70} cy={86} />
    </g>
  );
}

function BubbleBat() {
  return (
    <g>
      <defs>
        <radialGradient id="bat-body" cx=".4" cy=".3" r=".8">
          <stop offset="0" stopColor="#e9d5ff" />
          <stop offset=".35" stopColor="#b388ff" />
          <stop offset="1" stopColor="#7c4dff" />
        </radialGradient>
      </defs>
      <g className="monster-wing-l">
        <path
          d="M44 70 C 28 48, 10 46, 2 56 C 12 60, 10 70, 2 78 C 14 78, 20 84, 18 94 C 30 86, 40 86, 48 88 Z"
          fill="#9575cd"
        />
      </g>
      <g className="monster-wing-r">
        <path
          d="M96 70 C 112 48, 130 46, 138 56 C 128 60, 130 70, 138 78 C 126 78, 120 84, 122 94 C 110 86, 100 86, 92 88 Z"
          fill="#9575cd"
        />
      </g>
      <path
        d="M50 44 L 46 26 L 62 40 Z M90 44 L 94 26 L 78 40 Z"
        fill="#7c4dff"
      />
      <circle cx="70" cy="76" r="36" fill="url(#bat-body)" />
      <ellipse
        cx="56"
        cy="60"
        rx="8"
        ry="5"
        fill="#fff"
        opacity=".7"
        transform="rotate(-30 56 60)"
      />
      <CuteFace cx={70} cy={76} angry />
      <path d="M64 88 l3 6 l3 -5 z" fill="#fff" />
    </g>
  );
}

function Ghosty() {
  return (
    <g>
      <ellipse
        cx="70"
        cy="22"
        rx="18"
        ry="5"
        fill="none"
        stroke="#fde047"
        strokeWidth="4"
        className="monster-halo"
      />
      <path
        d="M24 124 L24 74 C 24 44, 44 30, 70 30 C 96 30, 116 44, 116 74 L116 124 L104 114 L92 126 L80 114 L70 126 L60 114 L48 126 L36 114 Z"
        fill="#f8fafc"
        stroke="#cbd5e1"
        strokeWidth="2"
      />
      <ellipse
        cx="52"
        cy="54"
        rx="9"
        ry="5"
        fill="#fff"
        transform="rotate(-30 52 54)"
      />
      <CuteFace cx={70} cy={76} />
      <path d="M74 88 q 4 10 8 0 z" fill="#fb7185" />
    </g>
  );
}

function JellyKing() {
  return (
    <g>
      <defs>
        <radialGradient id="king-body" cx=".38" cy=".3" r=".85">
          <stop offset="0" stopColor="#fffbe6" />
          <stop offset=".3" stopColor="#ffd54f" />
          <stop offset="1" stopColor="#f59e0b" />
        </radialGradient>
      </defs>
      <g className="monster-wing-l">
        <path
          d="M30 70 C 10 52, -2 60, 2 72 C 8 76, 2 84, 8 90 C 16 88, 20 94, 26 96 C 26 88, 30 80, 36 78 Z"
          fill="#fff"
          stroke="#e2e8f0"
          strokeWidth="2"
        />
      </g>
      <g className="monster-wing-r">
        <path
          d="M110 70 C 130 52, 142 60, 138 72 C 132 76, 138 84, 132 90 C 124 88, 120 94, 114 96 C 114 88, 110 80, 104 78 Z"
          fill="#fff"
          stroke="#e2e8f0"
          strokeWidth="2"
        />
      </g>
      <path
        d="M70 32 C 110 32, 128 76, 126 102 C 124 126, 100 132, 70 132 C 40 132, 16 126, 14 102 C 12 76, 30 32, 70 32 Z"
        fill="url(#king-body)"
      />
      <ellipse
        cx="48"
        cy="58"
        rx="12"
        ry="7"
        fill="#fff"
        opacity=".75"
        transform="rotate(-30 48 58)"
      />
      {/* Crown */}
      <path
        d="M46 36 L 50 12 L 60 26 L 70 6 L 80 26 L 90 12 L 94 36 Z"
        fill="#facc15"
        stroke="#a16207"
        strokeWidth="2.5"
      />
      <circle cx="70" cy="24" r="3.5" fill="#ef4444" />
      <circle cx="56" cy="30" r="2.5" fill="#3b82f6" />
      <circle cx="84" cy="30" r="2.5" fill="#3b82f6" />
      <CuteFace cx={70} cy={88} angry />
    </g>
  );
}
