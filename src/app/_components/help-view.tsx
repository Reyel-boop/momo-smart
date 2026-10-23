import Link from "next/link";

import { ChatIcon, ChevronDownIcon, HelpIcon } from "~/app/_components/icons";
import { PageHeader } from "~/app/_components/page-header";
import { Card, CardHeader } from "~/app/_components/ui";

export type HelpTopic = { question: string; answer: React.ReactNode };

/** The Help page for either portal: common questions and who to contact. */
export function HelpView({
  topics,
  contact,
}: {
  topics: HelpTopic[];
  contact: { text: string; href: string; label: string };
}) {
  return (
    <div className="mx-auto max-w-[900px] space-y-6">
      <PageHeader
        title="Help Center"
        subtitle="Answers to common questions about Momo Smart."
      />

      <Card>
        <CardHeader
          icon={<HelpIcon className="size-[18px]" />}
          title="Frequently asked questions"
        />
        <div className="divide-line divide-y">
          {topics.map((topic) => (
            <details key={topic.question} className="group">
              <summary className="text-ink hover:bg-canvas flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-sm font-bold [&::-webkit-details-marker]:hidden">
                {topic.question}
                <ChevronDownIcon className="text-muted size-4 shrink-0 transition group-open:rotate-180" />
              </summary>
              <div className="text-muted px-5 pb-4 text-sm leading-relaxed">
                {topic.answer}
              </div>
            </details>
          ))}
        </div>
      </Card>

      <Card className="flex flex-wrap items-center justify-between gap-4 p-5">
        <div className="flex items-center gap-3">
          <span className="bg-brand-soft text-brand flex size-10 items-center justify-center rounded-xl">
            <ChatIcon className="size-5" />
          </span>
          <p className="text-ink text-sm font-semibold">{contact.text}</p>
        </div>
        <Link
          href={contact.href}
          className="bg-navy hover:bg-navy-deep rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition"
        >
          {contact.label}
        </Link>
      </Card>
    </div>
  );
}
