/**
 * Which courses have a course Exam (safe for the browser). The questions
 * themselves stay on the server: src/server/demo/tle/exams.ts.
 */
export const EXAM_QUESTION_COUNT = 50;

/** TLE – ICT Telecommunications (…-TEL) and Computer Programming (…-CP). */
export function examKindOf(courseCode: string): "TEL" | "CP" | null {
  if (courseCode.endsWith("-TEL")) return "TEL";
  if (courseCode.endsWith("-CP")) return "CP";
  return null;
}

export const examHref = (courseId: string) =>
  `/student/courses/exam/${courseId}`;
