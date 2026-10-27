/**
 * Number Rush, the Mathematics game: answers float up in balloons and the
 * student pops the right one before they drift away. Problems are made up
 * fresh from a seed, so every play is different, and the server checks an
 * answer by making the same problem from the same seed. One level per unit
 * of Mathematics 10, twelve problems each.
 */

export type MathProblem = {
  prompt: string;
  answer: string;
  /** Four choices, the answer among them. */
  choices: string[];
};

export type MathLevel = {
  id: string;
  unit: number;
  unitTitle: string;
  title: string;
  topic: string;
  make: (rand: () => number) => {
    prompt: string;
    answer: string;
    wrong: string[];
  };
};

export const MATH_PROBLEMS = 12;
/** Seconds the balloons take to float away. */
export const MATH_SECONDS = 12;
/** Right answers out of twelve for 1, 2 and 3 stars. */
export const MATH_STARS = [6, 9, 11] as const;

/** A small seeded random generator (mulberry32). */
function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const int = (r: () => number, lo: number, hi: number) =>
  lo + Math.floor(r() * (hi - lo + 1));
const pick = <T>(r: () => number, items: readonly T[]) =>
  items[Math.floor(r() * items.length)]!;
const nonZero = (r: () => number, lo: number, hi: number) => {
  let n = 0;
  while (n === 0) n = int(r, lo, hi);
  return n;
};
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));
const frac = (n: number, d: number) => {
  const g = gcd(n, d) || 1;
  return d / g === 1 ? String(n / g) : `${n / g}/${d / g}`;
};
const fact = (n: number): number => (n <= 1 ? 1 : n * fact(n - 1));
const perm = (n: number, r: number) => fact(n) / fact(n - r);
const comb = (n: number, r: number) => perm(n, r) / fact(r);
/** "3x² − 2x + 5" from coefficients, highest power first. */
function poly(coefs: number[]) {
  const deg = coefs.length - 1;
  const sup = ["", "", "²", "³", "⁴", "⁵"];
  let out = "";
  coefs.forEach((c, i) => {
    if (c === 0) return;
    const p = deg - i;
    const abs = Math.abs(c);
    const body =
      p === 0 ? `${abs}` : `${abs === 1 ? "" : abs}x${p > 1 ? sup[p] : ""}`;
    out += out
      ? c < 0
        ? ` − ${body}`
        : ` + ${body}`
      : c < 0
        ? `−${body}`
        : body;
  });
  return out || "0";
}
const signed = (n: number) => (n < 0 ? `− ${-n}` : `+ ${n}`);
const num = (n: number) => (n < 0 ? `−${-n}` : String(n));

export const MATH_LEVELS: MathLevel[] = [
  {
    id: "math-1",
    unit: 1,
    unitTitle: "Arithmetic Sequences and Series",
    title: "Step by Step",
    topic: "Next terms, nth terms, common differences and sums",
    make(r) {
      const a = int(r, -5, 15);
      const d = nonZero(r, -6, 9);
      const terms = [0, 1, 2, 3].map((k) => num(a + k * d)).join(", ");
      switch (int(r, 0, 3)) {
        case 0:
          return {
            prompt: `Next term: ${terms}, …`,
            answer: num(a + 4 * d),
            wrong: [
              num(a + 5 * d),
              num(a + 4 * d + 1),
              num(a + 3 * d),
              num(a + 4 * d - 2),
            ],
          };
        case 1: {
          const n = int(r, 10, 25);
          return {
            prompt: `a₁ = ${num(a)}, d = ${num(d)}. Find a${toSub(n)}.`,
            answer: num(a + (n - 1) * d),
            wrong: [
              num(a + n * d),
              num(a + (n - 2) * d),
              num(n * d),
              num(a * n),
            ],
          };
        }
        case 2:
          return {
            prompt: `Common difference of ${terms}, …`,
            answer: num(d),
            wrong: [num(-d), num(d + 1), num(a), num(2 * d)],
          };
        default: {
          const b = int(r, 1, 9);
          const e = int(r, 1, 5);
          const n = int(r, 5, 10);
          const sum = (n * (2 * b + (n - 1) * e)) / 2;
          return {
            prompt: `Sum of the first ${n} terms: ${b}, ${b + e}, ${b + 2 * e}, …`,
            answer: num(sum),
            wrong: [
              num(sum + e),
              num(n * (b + (n - 1) * e)),
              num(sum - b),
              num(n * (b + n * e)),
            ],
          };
        }
      }
    },
  },
  {
    id: "math-2",
    unit: 2,
    unitTitle: "Geometric Sequences and Series",
    title: "Multiply Mania",
    topic: "Common ratios, next terms and sums",
    make(r) {
      const a = int(r, 1, 5);
      const ratio = pick(r, [2, 3, -2]);
      const terms = [0, 1, 2, 3].map((k) => num(a * ratio ** k)).join(", ");
      switch (int(r, 0, 3)) {
        case 0:
          return {
            prompt: `Next term: ${terms}, …`,
            answer: num(a * ratio ** 4),
            wrong: [
              num(a * ratio ** 3 + ratio),
              num(a * ratio ** 5),
              num(-a * ratio ** 4),
              num(a * ratio ** 4 + a),
            ],
          };
        case 1:
          return {
            prompt: `Common ratio of ${terms}, …`,
            answer: num(ratio),
            wrong: [num(-ratio), num(ratio + 1), num(a), num(ratio * 2)],
          };
        case 2: {
          const n = int(r, 5, 6);
          return {
            prompt: `a₁ = ${a}, r = ${num(ratio)}. Find a${toSub(n)}.`,
            answer: num(a * ratio ** (n - 1)),
            wrong: [
              num(a * ratio ** n),
              num(a * ratio ** (n - 2)),
              num(a * ratio * n),
              num(-a * ratio ** (n - 1)),
            ],
          };
        }
        default: {
          const n = int(r, 4, 6);
          const sum = a * (2 ** n - 1);
          return {
            prompt: `Sum of the first ${n} terms: ${a}, ${a * 2}, ${a * 4}, …`,
            answer: num(sum),
            wrong: [
              num(a * 2 ** n),
              num(sum - a),
              num(a * 2 ** (n - 1)),
              num(sum + a * 2),
            ],
          };
        }
      }
    },
  },
  {
    id: "math-3",
    unit: 3,
    unitTitle: "Polynomials and Polynomial Division",
    title: "Remainder Rush",
    topic: "Evaluating polynomials and the Remainder Theorem",
    make(r) {
      const coefs = [nonZero(r, -3, 3), int(r, -6, 6), int(r, -9, 9)];
      const value = (x: number) =>
        coefs[0]! * x * x + coefs[1]! * x + coefs[2]!;
      const c = nonZero(r, -3, 3);
      switch (int(r, 0, 2)) {
        case 0:
          return {
            prompt: `P(x) = ${poly(coefs)}. Find P(${num(c)}).`,
            answer: num(value(c)),
            wrong: [
              num(value(-c)),
              num(value(c) + 1),
              num(coefs[2]! + c),
              num(value(c) - coefs[2]!),
            ],
          };
        case 1:
          return {
            prompt: `Remainder when ${poly(coefs)} is divided by (x ${signed(-c)})`,
            answer: num(value(c)),
            wrong: [
              num(value(-c)),
              num(coefs[2]!),
              num(value(c) + c),
              num(value(c) - 2),
            ],
          };
        default: {
          const deg = int(r, 3, 5);
          const lead = nonZero(r, -7, 7);
          const p = [lead, ...Array.from({ length: deg }, () => int(r, -5, 5))];
          if (p[p.length - 1] === 0) p[p.length - 1] = 4;
          return {
            prompt: `Degree of ${poly(p)}`,
            answer: String(deg),
            wrong: [
              String(deg - 1),
              String(deg + 1),
              String(Math.abs(lead)),
              String(p.length + 1),
            ],
          };
        }
      }
    },
  },
  {
    id: "math-4",
    unit: 4,
    unitTitle: "Polynomial Equations and Functions",
    title: "Root Hunter",
    topic: "Roots, sums and products of roots",
    make(r) {
      const p = nonZero(r, -6, 6);
      let q = nonZero(r, -6, 6);
      if (q === p) q = p + 1 || 2;
      const eq = `${poly([1, -(p + q), p * q])} = 0`;
      const pair = (x: number, y: number) =>
        `${num(Math.min(x, y))} and ${num(Math.max(x, y))}`;
      switch (int(r, 0, 2)) {
        case 0:
          return {
            prompt: `Roots of ${eq}`,
            answer: pair(p, q),
            wrong: [pair(-p, -q), pair(p, -q), pair(-p, q), pair(p + 1, q + 1)],
          };
        case 1:
          return {
            prompt: `Sum of the roots of ${eq}`,
            answer: num(p + q),
            wrong: [num(-(p + q)), num(p * q), num(p - q), num(p + q + 1)],
          };
        default:
          return {
            prompt: `Product of the roots of ${eq}`,
            answer: num(p * q),
            wrong: [num(-(p * q)), num(p + q), num(p * q + 1), num(-(p + q))],
          };
      }
    },
  },
  {
    id: "math-5",
    unit: 5,
    unitTitle: "Circles: Arcs, Chords and Angles",
    title: "Circle Spinner",
    topic: "Central angles, inscribed angles and arcs",
    make(r) {
      const arc = 2 * int(r, 15, 95);
      switch (int(r, 0, 3)) {
        case 0:
          return {
            prompt: `An inscribed angle intercepts a ${arc}° arc. Its measure?`,
            answer: `${arc / 2}°`,
            wrong: [
              `${arc}°`,
              `${arc * 2}°`,
              `${180 - arc / 2}°`,
              `${360 - arc}°`,
            ],
          };
        case 1:
          return {
            prompt: `A central angle intercepts a ${arc}° arc. Its measure?`,
            answer: `${arc}°`,
            wrong: [
              `${arc / 2}°`,
              `${arc * 2}°`,
              `${360 - arc}°`,
              `${180 - arc / 2}°`,
            ],
          };
        case 2: {
          const angle = arc / 2;
          return {
            prompt: `An inscribed angle measures ${angle}°. Its intercepted arc?`,
            answer: `${arc}°`,
            wrong: [
              `${angle}°`,
              `${angle / 2}°`,
              `${360 - arc}°`,
              `${180 - angle}°`,
            ],
          };
        }
        default: {
          const a = 10 * int(r, 6, 15);
          const b = 10 * int(r, 6, 15);
          return {
            prompt: `Three arcs make a circle: ${a}°, ${b}° and x. Find x.`,
            answer: `${360 - a - b}°`,
            wrong: [
              `${180 - a - b < 0 ? a + b - 180 : 180 - a - b}°`,
              `${a + b}°`,
              `${360 - a - b + 10}°`,
              `${360 - a}°`,
            ],
          };
        }
      }
    },
  },
  {
    id: "math-6",
    unit: 6,
    unitTitle: "Coordinate Geometry",
    title: "Grid Runner",
    topic: "Distance, midpoint and slope",
    make(r) {
      const x1 = int(r, -5, 5);
      const y1 = int(r, -5, 5);
      switch (int(r, 0, 2)) {
        case 0: {
          const [dx, dy, d] = pick(r, [
            [3, 4, 5],
            [6, 8, 10],
            [5, 12, 13],
            [8, 6, 10],
            [4, 3, 5],
          ] as const);
          const x2 = x1 + dx * pick(r, [1, -1]);
          const y2 = y1 + dy * pick(r, [1, -1]);
          return {
            prompt: `Distance from (${num(x1)}, ${num(y1)}) to (${num(x2)}, ${num(y2)})`,
            answer: String(d),
            wrong: [
              String(dx + dy),
              String(d + 1),
              String(d * d),
              String(Math.abs(dx - dy) + d),
            ],
          };
        }
        case 1: {
          const x2 = x1 + 2 * nonZero(r, -4, 4);
          const y2 = y1 + 2 * nonZero(r, -4, 4);
          const m = (a: number, b: number) => `(${num(a)}, ${num(b)})`;
          const mx = (x1 + x2) / 2;
          const my = (y1 + y2) / 2;
          return {
            prompt: `Midpoint of (${num(x1)}, ${num(y1)}) and (${num(x2)}, ${num(y2)})`,
            answer: m(mx, my),
            wrong: [
              m(my, mx),
              m(x2 - x1, y2 - y1),
              m(mx + 1, my),
              m(x1 + x2, y1 + y2),
            ],
          };
        }
        default: {
          const run = nonZero(r, -4, 4);
          const slope = nonZero(r, -4, 4);
          const x2 = x1 + run;
          const y2 = y1 + slope * run;
          return {
            prompt: `Slope of the line through (${num(x1)}, ${num(y1)}) and (${num(x2)}, ${num(y2)})`,
            answer: num(slope),
            wrong: [
              num(-slope),
              num(slope + 1),
              num(slope * run),
              num(slope + 2),
            ],
          };
        }
      }
    },
  },
  {
    id: "math-7",
    unit: 7,
    unitTitle: "Permutations and Combinations",
    title: "Count It Up",
    topic: "Factorials, permutations and combinations",
    make(r) {
      switch (int(r, 0, 3)) {
        case 0: {
          const n = int(r, 3, 7);
          return {
            prompt: `${n}! = ?`,
            answer: String(fact(n)),
            wrong: [
              String(fact(n - 1)),
              String(n * n),
              String(fact(n) / 2),
              String(fact(n + 1)),
            ],
          };
        }
        case 1: {
          const n = int(r, 5, 9);
          const k = int(r, 2, 3);
          return {
            prompt: `P(${n}, ${k}): ways to arrange ${k} of ${n} people in a row`,
            answer: String(perm(n, k)),
            wrong: [
              String(comb(n, k)),
              String(n ** k),
              String(perm(n, k - 1)),
              String(n * k),
            ],
          };
        }
        case 2: {
          const n = int(r, 5, 10);
          const k = int(r, 2, 3);
          return {
            prompt: `C(${n}, ${k}): ways to choose ${k} of ${n} students`,
            answer: String(comb(n, k)),
            wrong: [
              String(perm(n, k)),
              String(n * k),
              String(comb(n, k) + n),
              String(comb(n, k - 1)),
            ],
          };
        }
        default: {
          const word = pick(r, [
            "MATH",
            "LOVE",
            "STAR",
            "MOMO",
            "BOOK",
            "SMART",
            "PLANE",
          ]);
          const counts = [...word].reduce<Record<string, number>>(
            (m, ch) => ({ ...m, [ch]: (m[ch] ?? 0) + 1 }),
            {},
          );
          const ways =
            fact(word.length) /
            Object.values(counts).reduce((p, c) => p * fact(c), 1);
          return {
            prompt: `Distinct arrangements of the letters of ${word}`,
            answer: String(ways),
            wrong: [
              String(
                ways === fact(word.length)
                  ? fact(word.length) / 2
                  : fact(word.length),
              ),
              String(word.length ** 2),
              String(fact(word.length - 1)),
              String(ways * 2),
            ],
          };
        }
      }
    },
  },
  {
    id: "math-8",
    unit: 8,
    unitTitle: "Probability and Measures of Position",
    title: "Lucky Draw",
    topic: "Probability and the median",
    make(r) {
      switch (int(r, 0, 2)) {
        case 0: {
          const red = int(r, 1, 8);
          const blue = int(r, 1, 8);
          const total = red + blue;
          return {
            prompt: `A bag has ${red} red and ${blue} blue marbles. P(red)?`,
            answer: frac(red, total),
            wrong: [
              frac(blue, total),
              frac(red, blue) === frac(red, total)
                ? `${red}/${blue + 1}`
                : frac(red, blue),
              frac(1, total),
              frac(red + 1, total + 1),
            ],
          };
        }
        case 1: {
          const k = int(r, 1, 5);
          return {
            prompt: `Roll one die. P(a number greater than ${k})?`,
            answer: frac(6 - k, 6),
            wrong: [
              frac(k, 6),
              frac(6 - k + 1, 6),
              frac(1, 6 - k + 1),
              frac(6 - k, 5),
            ],
          };
        }
        default: {
          const n = pick(r, [5, 7]);
          const values = Array.from({ length: n }, () => int(r, 1, 40));
          const sorted = [...values].sort((x, y) => x - y);
          const median = sorted[(n - 1) / 2]!;
          const mean = Math.round(values.reduce((t, v) => t + v, 0) / n);
          return {
            prompt: `Median of ${values.join(", ")}`,
            answer: String(median),
            wrong: [
              String(values[(n - 1) / 2]),
              String(mean),
              String(sorted[(n - 1) / 2 + 1]),
              String(sorted[(n - 1) / 2 - 1]),
            ],
          };
        }
      }
    },
  },
];

/** The answer with its last number moved by `by` (never to 0 in a denominator). */
function nudge(answer: string, by: number) {
  const matches = [...answer.matchAll(/−?\d+/g)];
  const last = matches.at(-1);
  if (!last) return `${answer}′`;
  const value = Number(last[0].replace("−", "-")) + by;
  const isDenominator = answer[last.index - 1] === "/";
  const fixed = isDenominator && value <= 0 ? 7 : value;
  return (
    answer.slice(0, last.index) +
    num(fixed) +
    answer.slice(last.index + last[0].length)
  );
}

function toSub(n: number) {
  return String(n).replace(/\d/g, (d) => "₀₁₂₃₄₅₆₇₈₉"[Number(d)]!);
}

/** The problem for a seed: four distinct choices in a seeded order. */
export function mathProblem(level: MathLevel, seed: number): MathProblem {
  const r = seeded(seed * 7919 + Number(level.id.split("-")[1]));
  const { prompt, answer, wrong } = level.make(r);
  const choices = [answer];
  for (const w of wrong) {
    if (choices.length === 4) break;
    if (!choices.includes(w)) choices.push(w);
  }
  // Fill any gap by nudging the answer's last number: 5/6 → 5/7, 40 → 41.
  for (let k = 1; choices.length < 4; k++) {
    const extra =
      k > 40
        ? `${answer}${"′".repeat(k - 40)}`
        : nudge(answer, k % 2 ? Math.ceil(k / 2) : -Math.ceil(k / 2));
    if (!choices.includes(extra)) choices.push(extra);
  }
  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [choices[i], choices[j]] = [choices[j]!, choices[i]!];
  }
  return { prompt, answer, choices };
}

export function mathStars(right: number) {
  return MATH_STARS.filter((needed) => right >= needed).length;
}

/** Scores a level: one answer per seed (empty when the balloons got away). */
export function scoreMath(
  level: MathLevel,
  answers: { seed: number; choice: string }[],
) {
  if (
    answers.length !== MATH_PROBLEMS ||
    new Set(answers.map((a) => a.seed)).size !== MATH_PROBLEMS
  )
    return null;
  const right = answers.filter(
    (a) => mathProblem(level, a.seed).answer === a.choice,
  ).length;
  return { right, total: MATH_PROBLEMS, stars: mathStars(right) };
}
