/**
 * CB-NAT Review subjects, in the order they're shown, and how the question
 * spreadsheet names them.
 */
export const NAT_SUBJECT_INFO = {
  ENGLISH: { label: "English", icon: "📖", tone: "from-blue-600 to-sky-600" },
  FILIPINO: {
    label: "Filipino",
    icon: "📜",
    tone: "from-rose-600 to-amber-500",
  },
  MATH: {
    label: "Mathematics",
    icon: "➗",
    tone: "from-indigo-600 to-violet-600",
  },
  SCIENCE: {
    label: "Science",
    icon: "🔬",
    tone: "from-emerald-600 to-teal-600",
  },
  AP: {
    label: "Araling Panlipunan",
    icon: "🌏",
    tone: "from-amber-600 to-orange-600",
  },
  MIXED: {
    label: "Full Mock Exam",
    icon: "📝",
    tone: "from-slate-700 to-navy",
  },
} as const;

export type NatSubjectKey = keyof typeof NAT_SUBJECT_INFO;

export const NAT_SUBJECT_ORDER = Object.keys(
  NAT_SUBJECT_INFO,
) as NatSubjectKey[];

/** "Math", "Mathematics", "AP", "Araling Panlipunan", "Mock"… → the key. */
export function natSubjectOf(text: string): NatSubjectKey | null {
  const t = text.trim().toLowerCase();
  if (!t) return null;
  if (t.startsWith("eng")) return "ENGLISH";
  if (t.startsWith("fil")) return "FILIPINO";
  if (t.startsWith("math")) return "MATH";
  if (t.startsWith("sci")) return "SCIENCE";
  if (t === "ap" || t.startsWith("aral")) return "AP";
  if (/mix|mock|full|all/.test(t)) return "MIXED";
  return null;
}
