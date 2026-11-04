import { CheckCircleIcon } from "~/app/_components/icons";

type Block =
  | { kind: "heading"; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "numbered"; items: string[] }
  | { kind: "table"; head: string[] | null; rows: string[][] }
  | { kind: "code"; text: string };

/**
 * Renders the small Markdown subset lesson authors use — headings, bullet and
 * numbered lists, tables, paragraphs, **bold**, *italics*, `inline code` and
 * ``` code blocks — without pulling in a Markdown library. Text is rendered as
 * React children, so nothing (not even HTML in a code sample) is injected as
 * raw HTML.
 */
export function LessonMarkdown({ source }: { source: string }) {
  return (
    <div className="space-y-4">
      {parse(source).map((block, index) => {
        if (block.kind === "code") {
          return (
            <pre
              key={index}
              className="border-line bg-canvas text-ink overflow-x-auto rounded-lg border px-4 py-3 font-mono text-xs leading-relaxed"
            >
              <code>{block.text}</code>
            </pre>
          );
        }
        if (block.kind === "heading") {
          return (
            <h3 key={index} className="text-ink text-lg font-bold">
              {inline(block.text)}
            </h3>
          );
        }
        if (block.kind === "list") {
          return (
            <ul key={index} className="space-y-2.5">
              {block.items.map((item, itemIndex) => (
                <li
                  key={itemIndex}
                  className="text-muted flex gap-2.5 text-sm leading-relaxed"
                >
                  <CheckCircleIcon className="text-brand mt-0.5 size-4 shrink-0" />
                  <span>{inline(item)}</span>
                </li>
              ))}
            </ul>
          );
        }
        if (block.kind === "numbered") {
          return (
            <ol
              key={index}
              className="text-muted list-decimal space-y-2.5 pl-6 text-sm leading-relaxed"
            >
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{inline(item)}</li>
              ))}
            </ol>
          );
        }
        if (block.kind === "table") {
          return (
            <div
              key={index}
              className="border-line overflow-x-auto rounded-lg border"
            >
              <table className="w-full border-collapse text-left text-sm">
                {block.head && (
                  <thead className="bg-canvas">
                    <tr>
                      {block.head.map((cell, cellIndex) => (
                        <th
                          key={cellIndex}
                          className="text-ink px-3 py-2 font-semibold"
                        >
                          {inline(cell)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                )}
                <tbody>
                  {block.rows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-line border-t">
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="text-muted px-3 py-2">
                          {inline(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        return (
          <p key={index} className="text-muted text-sm leading-relaxed">
            {inline(block.text)}
          </p>
        );
      })}
    </div>
  );
}

function parse(source: string): Block[] {
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let items: string[] = [];
  let listKind: "list" | "numbered" = "list";
  let table: string[][] = [];

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      blocks.push({ kind: "paragraph", text: paragraph.join(" ") });
      paragraph = [];
    }
  };
  const flushList = () => {
    if (items.length > 0) {
      blocks.push({ kind: listKind, items });
      items = [];
    }
  };
  const addItem = (kind: "list" | "numbered", text: string) => {
    flushParagraph();
    if (kind !== listKind) flushList();
    listKind = kind;
    items.push(text);
  };
  const flushTable = () => {
    if (table.length > 0) {
      const hasHead = table[1]?.every((cell) => /^:?-+:?$/.test(cell));
      blocks.push({
        kind: "table",
        head: hasHead ? table[0]! : null,
        rows: table.slice(hasHead ? 2 : 0),
      });
      table = [];
    }
  };

  let code: string[] | null = null;
  for (const raw of source.split("\n")) {
    // Inside a ``` block lines are kept exactly, indentation included.
    if (code) {
      if (/^(```|~~~)/.test(raw.trim())) {
        blocks.push({ kind: "code", text: code.join("\n") });
        code = null;
      } else {
        code.push(raw);
      }
      continue;
    }
    if (/^(```|~~~)/.test(raw.trim())) {
      flushParagraph();
      flushList();
      flushTable();
      code = [];
      continue;
    }
    const line = raw.trim();
    const heading = /^#{1,6}\s+(.*)$/.exec(line);
    const bullet = /^[-*]\s+(.*)$/.exec(line);
    const number = /^\d+\.\s+(.*)$/.exec(line);

    if (/^\|.*\|$/.test(line)) {
      flushParagraph();
      flushList();
      table.push(
        line
          .slice(1, -1)
          .split("|")
          .map((cell) => cell.trim()),
      );
      continue;
    }
    flushTable();

    if (line.length === 0) {
      flushParagraph();
      flushList();
    } else if (heading) {
      flushParagraph();
      flushList();
      blocks.push({ kind: "heading", text: heading[1]! });
    } else if (bullet) {
      addItem("list", bullet[1]!);
    } else if (number) {
      addItem("numbered", number[1]!);
    } else {
      flushList();
      paragraph.push(line);
    }
  }
  if (code) blocks.push({ kind: "code", text: code.join("\n") });
  flushParagraph();
  flushList();
  flushTable();
  return blocks;
}

/** `code`, **bold** and *italics*; a * beside a letter or digit stays as is. */
const INLINE =
  /(`[^`]+`|\*\*[^*]+\*\*|(?<![\w*])\*[^*\s](?:[^*]*[^*\s])?\*(?![\w*]))/g;

function inline(text: string): React.ReactNode[] {
  return text.split(INLINE).map((part, index) =>
    part.length > 2 && part.startsWith("`") && part.endsWith("`") ? (
      <code
        key={index}
        className="bg-canvas text-ink rounded px-1 py-0.5 font-mono text-[0.85em]"
      >
        {part.slice(1, -1)}
      </code>
    ) : part.length > 4 && part.startsWith("**") && part.endsWith("**") ? (
      <strong key={index} className="text-ink font-semibold">
        {part.slice(2, -2)}
      </strong>
    ) : part.length > 2 && part.startsWith("*") && part.endsWith("*") ? (
      <em key={index}>{part.slice(1, -1)}</em>
    ) : (
      part
    ),
  );
}

const SUBSCRIPTS = "₀₁₂₃₄₅₆₇₈₉";

/**
 * Typesets a plain-text chemical equation: "C6H12O6 + 2 NAD+" becomes
 * "C₆H₁₂O₆ + 2 NAD⁺". Coefficients (numbers after a space) are left alone.
 */
export function chemical(formula: string): string {
  return formula
    .replace(
      /([A-Za-z)])(\d+)/g,
      (_, symbol: string, digits: string) =>
        symbol + [...digits].map((d) => SUBSCRIPTS[Number(d)]).join(""),
    )
    .replace(/([A-Za-z])\+(?=\s|$)/g, "$1⁺")
    .replace(/\bPi\b/g, "Pᵢ");
}

export function FormulaBlock({
  title,
  formula,
}: {
  title: string;
  formula: string;
}) {
  return (
    <div className="border-brand bg-brand-soft/60 mt-6 rounded-xl border-l-4 px-5 py-4">
      <p className="text-navy text-[11px] font-bold tracking-wide uppercase">
        Formula Block • {title}
      </p>
      <p className="border-line bg-surface text-ink mt-3 overflow-x-auto rounded-lg border px-4 py-3 text-center font-mono text-sm leading-relaxed">
        {chemical(formula)}
      </p>
    </div>
  );
}
