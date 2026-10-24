import { CheckCircleIcon } from "~/app/_components/icons";

type Block =
  | { kind: "heading"; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "code"; text: string };

/**
 * Renders the small Markdown subset lesson authors use — headings, bullet
 * lists, paragraphs, **bold**, `inline code` and ``` code blocks — without
 * pulling in a Markdown library. Text is rendered as React children, so
 * nothing (not even HTML in a code sample) is injected as raw HTML.
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

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      blocks.push({ kind: "paragraph", text: paragraph.join(" ") });
      paragraph = [];
    }
  };
  const flushList = () => {
    if (items.length > 0) {
      blocks.push({ kind: "list", items });
      items = [];
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
      code = [];
      continue;
    }
    const line = raw.trim();
    const heading = /^#{1,6}\s+(.*)$/.exec(line);
    const bullet = /^[-*]\s+(.*)$/.exec(line);

    if (line.length === 0) {
      flushParagraph();
      flushList();
    } else if (heading) {
      flushParagraph();
      flushList();
      blocks.push({ kind: "heading", text: heading[1]! });
    } else if (bullet) {
      flushParagraph();
      items.push(bullet[1]!);
    } else {
      flushList();
      paragraph.push(line);
    }
  }
  if (code) blocks.push({ kind: "code", text: code.join("\n") });
  flushParagraph();
  flushList();
  return blocks;
}

function inline(text: string): React.ReactNode[] {
  return text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).map((part, index) =>
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
