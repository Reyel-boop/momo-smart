/**
 * Reads a DepEd School Form 1 (SF1 – School Register) as exported from LIS.
 *
 * The sheet starts with school details ("School Year", "Grade Level",
 * "Section" with their values beside them), then a table whose header row
 * has "LRN", the learner's name (one cell "LAST, FIRST, EXT, MIDDLE" or
 * split across several columns) and "Sex". Learners are listed males first,
 * with "TOTAL MALE / FEMALE" rows in between; those have no LRN and are
 * skipped.
 */

export type Sf1Student = { lrn: string; name: string; sex: "M" | "F" | null };
export type Sf1 = {
  gradeLevel: number | null;
  section: string | null;
  schoolYear: string | null;
  students: Sf1Student[];
  /** Rows that looked like learners but couldn't be read. */
  skipped: number;
};

type Cell = string | number | boolean | null | undefined;

const text = (cell: Cell) =>
  cell === null || cell === undefined ? "" : String(cell).trim();

/** "DELA CRUZ" → "Dela Cruz", "o'neil-santos" → "O'Neil-Santos". */
export function titleCase(value: string) {
  return value
    .toLocaleLowerCase("en-PH")
    .replace(
      /(^|[\s\-'’.])(\p{L})/gu,
      (_, sep: string, ch: string) => sep + ch.toLocaleUpperCase("en-PH"),
    );
}

/** "JR" → "Jr.", "iii" → "III": name extensions as they are usually written. */
function suffixOf(ext: string) {
  const bare = ext.replace(/\./g, "").trim();
  if (!bare) return "";
  if (/^[ivx]+$/i.test(bare)) return bare.toUpperCase();
  return `${titleCase(bare)}.`;
}

/**
 * Turns SF1's "LAST, FIRST, EXTENSION, MIDDLE" into "First M. Last Ext".
 * Without commas the name is kept as written.
 */
export function sf1Name(raw: string) {
  const parts = raw.split(",").map((p) => p.trim());
  if (parts.length < 2) return titleCase(raw.replace(/\s+/g, " ").trim());
  const [last = "", first = "", ext = "", middle = ""] = parts;
  const initial = middle ? ` ${middle[0]!.toUpperCase()}.` : "";
  return `${titleCase(first)}${initial} ${titleCase(last)} ${suffixOf(ext)}`
    .replace(/\s+/g, " ")
    .trim();
}

/** The value written after a label like "Grade Level" in the form's header. */
function labelValue(rows: Cell[][], label: RegExp): string | null {
  for (const row of rows.slice(0, 20)) {
    for (let i = 0; i < row.length; i++) {
      const cell = text(row[i]);
      if (!label.test(cell)) continue;
      // "Grade Level: 10" in one cell, or the value in a later cell.
      const inline = cell.split(/[:]/)[1]?.trim();
      if (inline) return inline;
      for (let j = i + 1; j < row.length; j++) {
        const value = text(row[j]);
        if (value) return value;
      }
    }
  }
  return null;
}

export function parseSchoolForm1(rows: Cell[][]): Sf1 | null {
  const headerIndex = rows.findIndex((row) =>
    row.some((cell) => /^lrn$/i.test(text(cell))),
  );
  if (headerIndex === -1) return null;
  const header = rows[headerIndex]!.map(text);
  const lrnCol = header.findIndex((h) => /^lrn$/i.test(h));
  let sexCol = header.findIndex((h, i) => i > lrnCol && /^sex/i.test(h));
  if (sexCol === -1) sexCol = lrnCol + 2;

  const students: Sf1Student[] = [];
  const seen = new Set<string>();
  let skipped = 0;
  for (const row of rows.slice(headerIndex + 1)) {
    const lrn = text(row[lrnCol]).replace(/\s+/g, "");
    // Keep empty cells in a split name so "Middle Name" stays in its place.
    const nameCells = row.slice(lrnCol + 1, sexCol).map(text);
    const rawName = nameCells.some(Boolean) ? nameCells.join(", ") : "";
    if (!/^\d{12}$/.test(lrn)) {
      // A row with a name but no valid LRN is a learner we can't add.
      if (rawName && /\d{6,}/.test(lrn)) skipped++;
      continue;
    }
    if (seen.has(lrn) || !rawName) {
      if (!rawName) skipped++;
      continue;
    }
    seen.add(lrn);
    const sex = text(row[sexCol]).toUpperCase();
    students.push({
      lrn,
      name: sf1Name(rawName),
      sex: sex.startsWith("M") ? "M" : sex.startsWith("F") ? "F" : null,
    });
  }

  const grade = labelValue(rows.slice(0, headerIndex), /^grade\s*level/i);
  const gradeNumber = grade ? Number(/\d+/.exec(grade)?.[0]) : NaN;
  return {
    gradeLevel: Number.isFinite(gradeNumber) ? gradeNumber : null,
    section: labelValue(rows.slice(0, headerIndex), /^section/i),
    schoolYear: labelValue(rows.slice(0, headerIndex), /^school\s*year/i),
    students,
    skipped,
  };
}
