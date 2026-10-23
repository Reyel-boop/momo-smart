/**
 * Reads a DepEd School Form 1 (SF1 – School Register) as exported from LIS.
 *
 * The sheet starts with school details ("School Year", "Grade Level",
 * "Section" with their values beside them), then a table whose header row
 * has "LRN", the learner's name (one cell "LAST,FIRST, MIDDLE" or
 * "LAST, FIRST, EXT, MIDDLE", or split across several columns) and "Sex". Learners are listed males first,
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

const EXTENSION = /^(jr|sr|ii|iii|iv)\.?$/i;
/** "-" or "N/A" written where there is no middle name. */
const blank = (value: string) =>
  /^[-–.\s]*$|^n\/?a$/i.test(value) ? "" : value;

/**
 * Turns SF1's "LAST,FIRST, MIDDLE" or "LAST, FIRST, EXTENSION, MIDDLE" into
 * "First M. Last Ext". An extension written with a name ("JR VILLACORTA",
 * "CHRISTOPHER JR") is moved to the end. Without commas the name is kept as
 * written.
 */
export function sf1Name(raw: string) {
  const parts = raw.split(",").map((p) => blank(p.replace(/\s+/g, " ").trim()));
  if (parts.length < 2) return titleCase(raw.replace(/\s+/g, " ").trim());
  // Three parts: LAST, FIRST, MIDDLE. Four or more: LAST, FIRST, EXT, MIDDLE.
  const [last = "", rawFirst = "", rawExt = "", rawMiddle = ""] =
    parts.length === 3 ? [parts[0], parts[1], "", parts[2]] : parts;
  let ext = rawExt;
  const pull = (value: string) => {
    const words = value.split(" ").filter(Boolean);
    if (!ext) ext = words.find((w) => EXTENSION.test(w)) ?? "";
    return words.filter((w) => !EXTENSION.test(w)).join(" ");
  };
  const first = pull(rawFirst);
  const middle = pull(rawMiddle);
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
    // The whole name in one cell ("LAST,FIRST, MIDDLE", beside empty merged
    // cells), or split across columns: then keep empty cells so "Middle
    // Name" stays in its place.
    const nameCells = row.slice(lrnCol + 1, sexCol).map(text);
    const filled = nameCells.filter(Boolean);
    const rawName =
      filled.length === 1
        ? filled[0]!
        : filled.length > 1
          ? nameCells.join(", ")
          : "";
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
