import { TRPCError } from "@trpc/server";

import { api } from "~/trpc/server";

/** Quotes a CSV field when it holds a comma, quote or line break. */
const cell = (value: string | number | null | undefined) => {
  const text = value == null ? "" : String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

const slug = (text: string) =>
  text.replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "");

/**
 * Gradebook download: ?section=<id> exports one class; without it, every
 * class the teacher owns, one block per class. Opens in Excel or Sheets.
 */
export async function GET(request: Request) {
  const sectionParam = new URL(request.url).searchParams.get("section");
  try {
    const sections = await api.course.mySections();
    const chosen = sectionParam
      ? sections.filter((s) => s.id === sectionParam)
      : sections;
    if (chosen.length === 0) {
      return new Response("No such class.", { status: 404 });
    }

    const blocks: string[] = [];
    for (const section of chosen) {
      const book = await api.grading.gradebook({ sectionId: section.id });
      const header = [
        "Student",
        "Student number",
        ...book.assignments.map((a) => `${a.title} (/${a.pointsPossible})`),
        "Current %",
        "Letter",
      ];
      const lines = book.rows.map((row) => [
        row.student.name,
        row.student.studentNumber,
        ...book.assignments.map((a) => {
          const result = row.cells[a.id];
          if (!result) return "";
          if (result.status === "MISSING") return "Missing";
          if (result.status === "EXCUSED") return "Excused";
          return result.score ?? "";
        }),
        row.currentPercent ?? "",
        row.currentLetter ?? "",
      ]);
      blocks.push(
        [[`${section.course.name} — ${section.code}`], header, ...lines]
          .map((line) => line.map(cell).join(","))
          .join("\r\n"),
      );
    }

    const name =
      chosen.length === 1
        ? `gradebook-${slug(`${chosen[0]!.course.code}-${chosen[0]!.code}`)}`
        : "gradebook-all-classes";
    // A byte-order mark makes Excel read the names' accents correctly.
    return new Response(`﻿${blocks.join("\r\n\r\n")}\r\n`, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${name}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    if (error instanceof TRPCError && error.code === "UNAUTHORIZED") {
      return new Response("Sign in first.", { status: 401 });
    }
    if (error instanceof TRPCError && error.code === "FORBIDDEN") {
      return new Response("Teachers only.", { status: 403 });
    }
    throw error;
  }
}
