/**
 * DepEd grading for the Learner's Progress Report Card (SF9), following
 * DepEd Order No. 8, s. 2015: each quarter's grade is the weighted Written
 * Work, Performance Task and Quarterly Assessment scores, transmuted so 60%
 * of the work becomes the passing grade of 75.
 */

export type LearningArea =
  "FIL" | "ENG" | "MATH" | "SCI" | "AP" | "ESP" | "TLE" | "MAPEH";

/** Junior High School learning areas in report-card order. */
export const LEARNING_AREAS: Array<{
  id: LearningArea;
  name: string;
  short: string;
}> = [
  { id: "FIL", name: "Filipino", short: "Filipino" },
  { id: "ENG", name: "English", short: "English" },
  { id: "MATH", name: "Mathematics", short: "Math" },
  { id: "SCI", name: "Science", short: "Science" },
  { id: "AP", name: "Araling Panlipunan (AP)", short: "AP" },
  { id: "ESP", name: "Edukasyon sa Pagpapakatao (EsP)", short: "EsP" },
  {
    id: "TLE",
    name: "Technology and Livelihood Education (TLE)",
    short: "TLE",
  },
  { id: "MAPEH", name: "MAPEH", short: "MAPEH" },
];

type Component = "WW" | "PT" | "QA";

/** Component weights per learning area (WW / PT / QA). */
const WEIGHTS: Record<LearningArea, Record<Component, number>> = {
  FIL: { WW: 30, PT: 50, QA: 20 },
  ENG: { WW: 30, PT: 50, QA: 20 },
  AP: { WW: 30, PT: 50, QA: 20 },
  ESP: { WW: 30, PT: 50, QA: 20 },
  MATH: { WW: 40, PT: 40, QA: 20 },
  SCI: { WW: 40, PT: 40, QA: 20 },
  TLE: { WW: 20, PT: 60, QA: 20 },
  MAPEH: { WW: 20, PT: 60, QA: 20 },
};

const AREA_PREFIXES: Array<[RegExp, LearningArea]> = [
  [/^(FIL)/i, "FIL"],
  [/^(ENG)/i, "ENG"],
  [/^(MATH)/i, "MATH"],
  [/^(SCI)/i, "SCI"],
  [/^(AP)\b/i, "AP"],
  [/^(ESP|EDUK|VALUES)/i, "ESP"],
  [/^(TLE|TVL|ICT)/i, "TLE"],
  [/^(MAPEH|MUSIC|ARTS|PE\b|HEALTH)/i, "MAPEH"],
];

/** Which learning area a course belongs to, from its department or code. */
export function learningAreaOf(course: {
  code: string;
  department?: { code: string } | null;
}): LearningArea | null {
  for (const key of [course.department?.code, course.code]) {
    if (!key) continue;
    for (const [pattern, area] of AREA_PREFIXES) {
      if (pattern.test(key.trim())) return area;
    }
  }
  return null;
}

/** "TLE 10-CP" → 10. */
export function gradeOfCourse(code: string): number | null {
  const match = /(\d{1,2})/.exec(code);
  return match ? Number(match[1]) : null;
}

/**
 * The subject a class counts toward on the report card: "TLE 10" for
 * "TLE 10 – ICT: Computer Programming", "Math 10" for "MATH 10".
 */
export function subjectLabel(course: {
  code: string;
  name: string;
  department?: { code: string } | null;
}): string {
  const area = learningAreaOf(course);
  const grade = gradeOfCourse(course.code);
  if (!area) return course.name;
  const short = LEARNING_AREAS.find((a) => a.id === area)!.short;
  return grade ? `${short} ${grade}` : short;
}

/** Which of WW / PT / QA a piece of work counts toward. */
export function componentOf(assignment: {
  type: string;
  category?: { name: string } | null;
}): Component {
  const category = assignment.category?.name ?? "";
  if (/written/i.test(category)) return "WW";
  if (/perform/i.test(category)) return "PT";
  if (/quarter|exam|periodical/i.test(category)) return "QA";
  switch (assignment.type) {
    case "EXAM":
      return "QA";
    case "PRACTICUM":
    case "PROJECT":
    case "LAB_REPORT":
    case "DIAGRAM":
      return "PT";
    default:
      return "WW";
  }
}

/** DepEd transmutation table as a formula (60 → 75, 100 → 100). */
export function transmute(initial: number): number {
  const ig = Math.max(0, Math.min(100, initial));
  if (ig >= 100) return 100;
  if (ig >= 60) return 75 + Math.floor((ig - 60) / 1.6);
  return 60 + Math.floor(ig / 4);
}

export function descriptor(grade: number): string {
  if (grade >= 90) return "Outstanding";
  if (grade >= 85) return "Very Satisfactory";
  if (grade >= 80) return "Satisfactory";
  if (grade >= 75) return "Fairly Satisfactory";
  return "Did Not Meet Expectations";
}

export const DESCRIPTORS = [
  { label: "Outstanding", range: "90–100" },
  { label: "Very Satisfactory", range: "85–89" },
  { label: "Satisfactory", range: "80–84" },
  { label: "Fairly Satisfactory", range: "75–79" },
  { label: "Did Not Meet Expectations", range: "Below 75" },
];

/**
 * Quarter (1–4) a date falls in. The school year is split into four equal
 * parts between its start and end dates; work outside it is clamped.
 */
export function quarterOf(date: Date, start: Date, end: Date): 1 | 2 | 3 | 4 {
  const span = end.getTime() - start.getTime();
  if (span <= 0) return 1;
  const part = Math.floor(((date.getTime() - start.getTime()) / span) * 4);
  return (Math.min(3, Math.max(0, part)) + 1) as 1 | 2 | 3 | 4;
}

export type ScoredItem = {
  component: Component;
  score: number;
  possible: number;
};

/**
 * One quarter's grade for a learning area from its scored work. A
 * component with no work yet is left out and the others share its weight.
 */
export function quarterGrade(
  area: LearningArea | null,
  items: ScoredItem[],
): number | null {
  const weights = WEIGHTS[area ?? "ENG"];
  let weighted = 0;
  let weightUsed = 0;
  for (const component of ["WW", "PT", "QA"] as const) {
    const parts = items.filter((i) => i.component === component);
    const possible = parts.reduce((sum, i) => sum + i.possible, 0);
    if (possible <= 0) continue;
    const score = parts.reduce((sum, i) => sum + i.score, 0);
    weighted += (score / possible) * 100 * weights[component];
    weightUsed += weights[component];
  }
  if (weightUsed === 0) return null;
  return transmute(weighted / weightUsed);
}
