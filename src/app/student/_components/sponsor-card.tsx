"use client";

import { useEffect, useRef, useState } from "react";

import { api } from "~/trpc/react";

/**
 * One quiet, educational sponsor message on the results screen (after a try
 * is finished, never during questions). Always labeled "Sponsored" with the
 * sponsor's name, and the student can close it. Shows nothing when sponsor
 * cards are off or none is running.
 */
export function SponsorCard() {
  const { data: card } = api.sponsor.forResults.useQuery(undefined, {
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: false,
  });
  const track = api.sponsor.track.useMutation();
  const [closed, setClosed] = useState(false);
  const counted = useRef<string | null>(null);

  useEffect(() => {
    if (card && counted.current !== card.id) {
      counted.current = card.id;
      track.mutate({ cardId: card.id, kind: "view" });
    }
    // count each card once per results screen
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card?.id]);

  if (!card || closed) return null;
  return (
    <SponsorCardView
      card={card}
      onClose={() => setClosed(true)}
      onLinkClick={() => track.mutate({ cardId: card.id, kind: "click" })}
    />
  );
}

type CardView = {
  icon: string;
  heading: string;
  message: string;
  sponsor: string;
  color: string;
  linkUrl: string | null;
  linkLabel: string | null;
};

/** The card itself (also used for the owner's preview). */
export function SponsorCardView({
  card,
  onClose,
  onLinkClick,
}: {
  card: CardView;
  onClose?: () => void;
  onLinkClick?: () => void;
}) {
  return (
    <aside
      aria-label="Sponsored message"
      className="border-line bg-surface shadow-card relative flex items-start gap-3.5 rounded-2xl border py-4 pr-11 pl-4"
    >
      <span
        aria-hidden="true"
        className="bg-brand-soft grid size-11 shrink-0 place-items-center rounded-xl text-[22px]"
      >
        {card.icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-ink text-sm font-bold">{card.heading}</p>
        <p className="mt-0.5 text-sm text-slate-700">{card.message}</p>
        <p className="text-muted mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
          <span className="border-line rounded-md border px-1.5 py-px text-[10.5px] font-bold tracking-wide uppercase">
            Sponsored
          </span>
          <span
            aria-hidden="true"
            className="grid size-5 place-items-center rounded-[5px] text-[10px] font-extrabold text-white"
            style={{ background: card.color }}
          >
            {card.sponsor.charAt(0).toUpperCase()}
          </span>
          <span>
            Supported by{" "}
            <b className="text-ink font-semibold">{card.sponsor}</b>
          </span>
          {card.linkUrl && (
            <>
              <span aria-hidden="true">·</span>
              <a
                href={card.linkUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                onClick={onLinkClick}
                className="text-brand font-semibold hover:underline"
              >
                {card.linkLabel ?? "Learn more"} →
              </a>
            </>
          )}
        </p>
      </div>
      <button
        type="button"
        aria-label="Close this message"
        onClick={onClose}
        className="text-muted hover:bg-canvas absolute top-2 right-2 grid size-8 place-items-center rounded-lg text-lg leading-none"
      >
        ×
      </button>
    </aside>
  );
}
