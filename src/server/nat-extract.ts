import "server-only";

import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import mammoth from "mammoth";
import * as XLSX from "xlsx";
import * as z from "zod/v4";

import { env } from "~/env";

/**
 * Reads a teacher's CB-NAT reviewer — a PDF, a Word file, photos of the
 * pages, a spreadsheet or pasted text, in whatever layout — and returns its
 * multiple-choice questions as practice tests, with Claude doing the
 * reading. Answers and rationales come from the file when it has them;
 * otherwise Claude works them out and the question is flagged for a
 * teacher's check.
 */

const QuestionSchema = z.object({
  prompt: z
    .string()
    .describe(
      "The full question. If it belongs to a passage, table, graph or other stimulus, the stimulus first (graphs and pictures written out as text with their exact values), then a blank line, then the question.",
    ),
  options: z
    .array(z.string())
    .describe(
      "The choices in their original order, without the A./B. letters.",
    ),
  answer: z.number().int().describe("0-based index of the right choice."),
  answerFromFile: z
    .boolean()
    .describe("True only when the file itself gives this answer."),
  explanation: z
    .string()
    .describe("The rationale students read after answering."),
  explanationFromFile: z
    .boolean()
    .describe("True when the rationale comes from the file."),
});

const ExtractionSchema = z.object({
  tests: z.array(
    z.object({
      subject: z.enum([
        "ENGLISH",
        "FILIPINO",
        "MATH",
        "SCIENCE",
        "AP",
        "MIXED",
      ]),
      title: z.string(),
      questions: z.array(QuestionSchema),
    }),
  ),
  notes: z
    .string()
    .describe(
      "Short notes for the teacher, in English: anything skipped (non-multiple-choice items, unreadable parts) or uncertain. Empty when there is nothing to report.",
    ),
});

export type NatExtraction = z.infer<typeof ExtractionSchema>;

const SYSTEM = `You turn a Philippine teacher's NAT reviewer into practice tests for Momo Smart's CB-NAT Review (Grade 10). Students will answer each question on a computer, one at a time, and then read its rationale. Read every page of the file.

Subjects: ENGLISH, FILIPINO, MATH (Mathematics), SCIENCE, AP (Araling Panlipunan), or MIXED for a full mock exam that mixes subjects. A file can hold several tests — for example one per week, quarter part or reading set; split them the way the file is organized. Give each test a short, clear title from the file's headings (for example "Plate Tectonics – Quarter 1, Part 1" or "Kontemporaryong Isyu – Quarter 1, Week 1"); never just the school's name.

For each multiple-choice question:
- Copy the question and choices exactly as written, keeping the original language (English or Filipino) and fixing only obvious typing errors. Drop the item numbers and the A–D letters.
- When questions share a passage, story, table, graph, flowchart, timeline or picture, put that stimulus at the start of EACH of those questions, then a blank line, then the question. Students cannot see images, so write every visual out as text with its exact labels and numbers (for a bar graph, each bar and its value; for a table, each row).
- Keep combined choices such as "I, III" or "Tama ang pahayag 1 at 3" as they are, with the statements they refer to inside the question.
- answer: take it from the file's answer key or rationale section when there is one (answerFromFile true). Only when the file gives no answer, work it out carefully yourself (answerFromFile false).
- explanation: use the file's rationale when it has one (explanationFromFile true). Otherwise write a short, clear rationale yourself — one to three sentences saying why the answer is right and, when useful, why a tempting choice is wrong — in the same language as the question (explanationFromFile false).

Skip items that are not multiple choice (essays, matching, fill-in-the-blank without choices) and mention them in notes. Do not invent questions.`;

/** One uploaded file, read into what Claude can take. */
export type NatSource = { name: string; type: string; data: Buffer };

async function toContent(
  sources: NatSource[],
  pasted: string,
): Promise<Anthropic.Beta.BetaContentBlockParam[]> {
  const blocks: Anthropic.Beta.BetaContentBlockParam[] = [];
  for (const file of sources) {
    const name = file.name.toLowerCase();
    if (file.type === "application/pdf" || name.endsWith(".pdf")) {
      blocks.push({
        type: "document",
        source: {
          type: "base64",
          media_type: "application/pdf",
          data: file.data.toString("base64"),
        },
        title: file.name,
      });
    } else if (/\.(png|jpe?g|webp|gif)$/.test(name)) {
      const media_type = name.endsWith(".png")
        ? "image/png"
        : name.endsWith(".webp")
          ? "image/webp"
          : name.endsWith(".gif")
            ? "image/gif"
            : "image/jpeg";
      blocks.push({
        type: "image",
        source: {
          type: "base64",
          media_type,
          data: file.data.toString("base64"),
        },
      });
    } else if (name.endsWith(".docx")) {
      const { value } = await mammoth.extractRawText({ buffer: file.data });
      blocks.push({ type: "text", text: `File "${file.name}":\n\n${value}` });
    } else if (/\.(xlsx|xls|csv)$/.test(name)) {
      const book = XLSX.read(file.data);
      const sheets = book.SheetNames.map(
        (sheet) =>
          `Sheet "${sheet}":\n${XLSX.utils.sheet_to_csv(book.Sheets[sheet]!)}`,
      );
      blocks.push({
        type: "text",
        text: `File "${file.name}":\n\n${sheets.join("\n\n")}`,
      });
    } else if (/\.(txt|md)$/.test(name)) {
      blocks.push({
        type: "text",
        text: `File "${file.name}":\n\n${file.data.toString("utf8")}`,
      });
    } else {
      throw new NatExtractError(
        `“${file.name}” is not a file type Momo can read. Use PDF, Word (.docx), photos (JPG/PNG), Excel or text.`,
      );
    }
  }
  if (pasted.trim()) {
    blocks.push({ type: "text", text: `Pasted text:\n\n${pasted.trim()}` });
  }
  blocks.push({
    type: "text",
    text: "Turn the questions above into CB-NAT practice tests.",
  });
  return blocks;
}

export class NatExtractError extends Error {}

/** Reads the files (and/or pasted text) into practice tests. */
export async function extractNatTests(
  sources: NatSource[],
  pasted: string,
): Promise<NatExtraction> {
  if (!env.ANTHROPIC_API_KEY) {
    throw new NatExtractError(
      "Reading files with AI is not set up yet (no Anthropic API key). Ask the Momo owner to add it.",
    );
  }
  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
  const content = await toContent(sources, pasted);

  let message;
  try {
    // Streamed, since a long reviewer can take minutes to write out.
    message = await client.beta.messages
      .stream({
        model: "claude-opus-5-5",
        max_tokens: 64000,
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
        system: SYSTEM,
        messages: [{ role: "user", content }],
        output_config: {
          // Answer keys matter more than speed.
          effort: "high",
          format: betaZodOutputFormat(ExtractionSchema),
        },
      })
      .finalMessage();
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      throw new NatExtractError(
        "The Anthropic API key was refused. Ask the Momo owner to check it.",
      );
    }
    if (error instanceof Anthropic.RateLimitError) {
      throw new NatExtractError(
        "The AI reader is busy. Wait a minute and try again.",
      );
    }
    if (error instanceof Anthropic.BadRequestError) {
      throw new NatExtractError(
        `The AI reader could not take this file: ${error.message}`,
      );
    }
    throw error;
  }

  if (message.stop_reason === "refusal") {
    throw new NatExtractError(
      "The AI reader declined this file. Check that it is a reviewer and try again.",
    );
  }
  if (message.stop_reason === "max_tokens") {
    throw new NatExtractError(
      "This file has too many questions to read at once. Split it into smaller files (for example one per week or subject).",
    );
  }
  const result = message.parsed_output;
  if (!result) {
    throw new NatExtractError(
      "The AI reader could not make sense of this file. Try a clearer copy.",
    );
  }

  // Keep only questions that work in Momo: two to six choices and an answer.
  return {
    notes: result.notes,
    tests: result.tests
      .map((t) => ({
        ...t,
        title: t.title.trim().slice(0, 160),
        questions: t.questions
          .map((q) => ({
            ...q,
            options: q.options
              .map((o) => o.trim())
              .filter(Boolean)
              .slice(0, 6),
          }))
          .filter(
            (q) =>
              q.prompt.trim() &&
              q.options.length >= 2 &&
              q.answer >= 0 &&
              q.answer < q.options.length,
          ),
      }))
      .filter((t) => t.title && t.questions.length > 0),
  };
}
