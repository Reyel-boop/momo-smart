"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { LogoMark } from "~/app/_components/brand";
import {
  HELP,
  STARTERS,
  findAnswers,
  type HelpEntry,
  type HelpRole,
} from "~/lib/momo-help";

type Message =
  | { from: "me"; text: string }
  | {
      from: "momo";
      text: string;
      link?: HelpEntry["link"];
      /** Other questions the reader can tap. */
      chips?: HelpEntry[];
    };

const byId = (id: string) => HELP.find((e) => e.id === id)!;

/**
 * Momo the help dog: a chat bubble in the corner of every teacher and
 * student page. Questions are answered from Momo's FAQ on the device.
 */
export function MomoChat({
  role,
  firstName,
}: {
  role: HelpRole;
  firstName?: string | null;
}) {
  const helpHref = role === "TEACHER" ? "/teacher/help" : "/student/help";
  const starters = STARTERS[role].map(byId);
  const greeting: Message = {
    from: "momo",
    text: `Arf! 🐶 Hi${firstName ? ` ${firstName}` : ""}! I'm Momo. Ask me anything about using Momo Smart, or tap a question below.`,
    chips: starters,
  };

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([greeting]);
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const reply = (entry: HelpEntry, more: HelpEntry[] = []): Message => ({
    from: "momo",
    text: entry.answer,
    link: entry.link,
    chips: more.length > 0 ? more : undefined,
  });

  const ask = (text: string) => {
    const question = text.trim();
    if (!question) return;
    const [best, ...rest] = findAnswers(question, role);
    const answer: Message = best
      ? reply(best, rest)
      : {
          from: "momo",
          text:
            role === "TEACHER"
              ? "Sorry, I don't know that one yet. 🐾 Try asking another way, or open the Help Center."
              : "Sorry, I don't know that one yet. 🐾 Try asking another way, or message your teacher.",
          link:
            role === "TEACHER"
              ? { label: "Open Help Center", href: helpHref }
              : { label: "Message my teacher", href: "/student/messages" },
          chips: starters,
        };
    setMessages((list) => [...list, { from: "me", text: question }, answer]);
    setDraft("");
  };

  const pick = (entry: HelpEntry) =>
    setMessages((list) => [
      ...list,
      { from: "me", text: entry.question },
      reply(entry),
    ]);

  return (
    <>
      {open && (
        <section
          role="dialog"
          aria-label="Momo Help chat"
          className="border-line bg-surface fixed right-4 bottom-24 z-[90] flex flex-col overflow-hidden rounded-2xl border shadow-2xl"
          style={{
            width: "calc(100vw - 32px)",
            maxWidth: 380,
            height: "min(560px, calc(100vh - 120px))",
          }}
        >
          <header className="bg-navy flex items-center gap-3 px-4 py-3 text-white">
            <LogoMark className="size-10 shrink-0 ring-2 ring-white/20" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-extrabold">Momo Help</p>
              <p className="text-[11px] text-white/70">
                Ask me how to do anything in Momo
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="rounded-lg px-2 py-1 text-lg leading-none text-white/80 hover:bg-white/10 hover:text-white"
            >
              ×
            </button>
          </header>

          <div
            ref={listRef}
            className="bg-canvas flex-1 space-y-3 overflow-y-auto px-3 py-4"
            aria-live="polite"
          >
            {messages.map((message, i) =>
              message.from === "me" ? (
                <div key={i} className="flex justify-end">
                  <p className="bg-brand max-w-[80%] rounded-2xl rounded-br-md px-3.5 py-2 text-sm text-white">
                    {message.text}
                  </p>
                </div>
              ) : (
                <div key={i} className="flex items-end gap-2">
                  <LogoMark className="size-7 shrink-0" />
                  <div className="max-w-[85%] min-w-0">
                    <div className="border-line bg-surface text-ink rounded-2xl rounded-bl-md border px-3.5 py-2.5 text-sm leading-relaxed">
                      {message.text}
                      {message.link && (
                        <Link
                          href={message.link.href}
                          onClick={() => setOpen(false)}
                          className="text-brand mt-2 block text-xs font-bold hover:underline"
                        >
                          {message.link.label} →
                        </Link>
                      )}
                    </div>
                    {message.chips && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {message.chips.map((chip) => (
                          <button
                            key={chip.id}
                            type="button"
                            onClick={() => pick(chip)}
                            className="border-brand/30 bg-surface text-brand hover:bg-brand-soft rounded-full border px-3 py-1.5 text-left text-xs font-semibold transition"
                          >
                            {chip.question}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ),
            )}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              ask(draft);
            }}
            className="border-line flex items-center gap-2 border-t p-3"
          >
            <input
              ref={inputRef}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Type your question…"
              maxLength={300}
              aria-label="Your question"
              className="border-line bg-canvas text-ink focus:border-brand min-w-0 flex-1 rounded-xl border px-3 py-2.5 text-base outline-none"
            />
            <button
              type="submit"
              disabled={!draft.trim()}
              className="bg-navy hover:bg-navy-deep shrink-0 rounded-xl px-4 py-2.5 text-sm font-bold text-white transition disabled:opacity-50"
            >
              Ask
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o);
          if (!open) setTimeout(() => inputRef.current?.focus(), 50);
        }}
        aria-label={open ? "Close Momo Help" : "Open Momo Help chat"}
        aria-expanded={open}
        className="fixed right-4 bottom-4 z-[90] flex items-center gap-2 rounded-full bg-transparent print:hidden"
      >
        {!open && (
          <span className="border-line bg-surface text-ink hidden rounded-full border px-3 py-1.5 text-xs font-bold shadow-md sm:inline">
            Ask Momo 🐾
          </span>
        )}
        <span className="relative">
          <LogoMark className="size-14 rounded-full shadow-lg ring-4 ring-white" />
          {!open && (
            <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-amber-400 text-[11px] font-extrabold text-white">
              ?
            </span>
          )}
        </span>
      </button>
    </>
  );
}
