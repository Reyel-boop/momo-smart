"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Card, Pill } from "~/app/_components/ui";
import { type RouterOutputs, api } from "~/trpc/react";

type Data = RouterOutputs["sponsor"]["list"];
type SponsorCardRow = Data["cards"][number];

const field =
  "border-line bg-canvas text-ink placeholder:text-muted focus:border-brand focus:bg-surface focus:ring-brand/10 rounded-lg border px-3 py-2 text-sm transition outline-none focus:ring-4";
const label = "text-ink text-xs font-bold";
const primary =
  "bg-navy hover:bg-navy-deep rounded-lg px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-60";
const secondary =
  "border-line bg-surface text-ink hover:bg-canvas rounded-lg border px-3 py-1.5 text-sm font-semibold transition disabled:opacity-60";

const ICONS = ["💡", "🎓", "📚", "🧪", "🧮", "🌏", "✏️", "🏦", "💻", "📖"];
const COLORS = ["#f97316", "#2563eb", "#16a34a", "#9333ea", "#e11d48", "#0891b2", "#ca8a04"];

/** "2026-12-01" for a date input, in Philippine time. */
const toYmd = (d: Date | string | null) =>
  d
    ? new Date(d).toLocaleDateString("en-CA", { timeZone: "Asia/Manila" })
    : "";
const shortDate = (d: Date | string | null) =>
  d
    ? new Date(d).toLocaleDateString("en-PH", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "Asia/Manila",
      })
    : null;

type Draft = {
  id?: string;
  schoolId: string | null;
  sponsor: string;
  icon: string;
  heading: string;
  message: string;
  linkUrl: string;
  linkLabel: string;
  color: string;
  startsOn: string;
  endsOn: string;
  active: boolean;
};
const EMPTY: Draft = {
  schoolId: null,
  sponsor: "",
  icon: "💡",
  heading: "Study tip",
  message: "",
  linkUrl: "",
  linkLabel: "Learn more",
  color: "#f97316",
  startsOn: "",
  endsOn: "",
  active: true,
};

function statusOf(card: SponsorCardRow) {
  const now = Date.now();
  if (!card.active) return { tone: "slate" as const, text: "Paused" };
  if (card.startsOn && new Date(card.startsOn).getTime() > now)
    return { tone: "blue" as const, text: "Scheduled" };
  if (card.endsOn && new Date(card.endsOn).getTime() < now)
    return { tone: "amber" as const, text: "Ended" };
  return { tone: "green" as const, text: "Running" };
}

export function SponsorsManager({ data }: { data: Data }) {
  const [draft, setDraft] = useState<Draft | null>(null);

  if (data.needsUpdate) {
    return (
      <Card className="p-6">
        <p className="text-ink font-extrabold">One database update is needed</p>
        <p className="text-muted mt-1 text-sm">
          Sponsor cards need three new tables. Until they exist, students
          simply see no sponsor card and nothing else changes. Run this once
          from the momo-smart folder with the live database address set:
        </p>
        <pre className="bg-canvas text-ink mt-3 overflow-x-auto rounded-lg p-3 text-sm">
          npm run db:migrate
        </pre>
      </Card>
    );
  }

  const schoolName = (id: string | null) =>
    id ? (data.schools.find((s) => s.id === id)?.name ?? "One school") : "All schools";

  return (
    <div className="space-y-6">
      <Switch enabled={data.enabled} running={data.cards.filter((c) => statusOf(c).text === "Running").length} />

      {draft ? (
        <Editor
          draft={draft}
          schools={data.schools}
          onDone={() => setDraft(null)}
        />
      ) : (
        <button type="button" className={primary} onClick={() => setDraft(EMPTY)}>
          + Add a sponsor card
        </button>
      )}

      <Card className="overflow-hidden">
        <div className="border-line flex flex-wrap items-center justify-between gap-2 border-b px-5 py-4">
          <p className="text-ink font-extrabold">Sponsor cards ({data.cards.length})</p>
          <p className="text-muted text-xs">
            Views = times a student saw the card · Clicks = times they opened
            the link · “This month” is {data.month}
          </p>
        </div>
        {data.cards.length === 0 ? (
          <p className="text-muted px-5 py-8 text-center text-sm">
            No sponsor cards yet. Add one above.
          </p>
        ) : (
          <ul className="divide-line divide-y">
            {data.cards.map((card) => (
              <Row
                key={card.id}
                card={card}
                school={schoolName(card.schoolId)}
                onEdit={() =>
                  setDraft({
                    id: card.id,
                    schoolId: card.schoolId,
                    sponsor: card.sponsor,
                    icon: card.icon,
                    heading: card.heading,
                    message: card.message,
                    linkUrl: card.linkUrl ?? "",
                    linkLabel: card.linkLabel ?? "",
                    color: card.color,
                    startsOn: toYmd(card.startsOn),
                    endsOn: toYmd(card.endsOn),
                    active: card.active,
                  })
                }
              />
            ))}
          </ul>
        )}
      </Card>

      <Card className="p-5">
        <p className="text-ink text-sm font-extrabold">The rules every card follows</p>
        <ul className="text-muted mt-2 list-disc space-y-1 pl-5 text-sm">
          <li>Shown only on the results screen after Unit Questions are finished: never during questions or the timer.</li>
          <li>Always labeled “Sponsored” with “Supported by” and the sponsor’s name; students can close it.</li>
          <li>Educational messages only (study tips, scholarships, libraries, school supplies). You approve each one.</li>
          <li>One card per results screen. When several are running, a different one may show each time.</li>
        </ul>
      </Card>
    </div>
  );
}

function Switch({ enabled, running }: { enabled: boolean; running: number }) {
  const router = useRouter();
  const set = api.sponsor.setEnabled.useMutation({ onSuccess: () => router.refresh() });
  return (
    <Card className={`flex flex-wrap items-center gap-4 p-5 ${enabled ? "border-emerald-200 bg-emerald-50" : ""}`}>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label="Sponsor cards on or off"
        disabled={set.isPending}
        onClick={() => {
          if (!enabled && !confirm("Turn sponsor cards ON? Students in every school will start seeing them after finishing Unit Questions.")) return;
          set.mutate({ enabled: !enabled });
        }}
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${enabled ? "bg-emerald-600" : "bg-slate-300"}`}
      >
        <span className={`absolute top-1 size-5 rounded-full bg-white shadow transition-all ${enabled ? "left-6" : "left-1"}`} />
      </button>
      <div className="min-w-0 flex-1">
        <p className="text-ink font-extrabold">
          Sponsor cards are {enabled ? "ON" : "OFF"}
        </p>
        <p className="text-muted text-sm">
          {enabled
            ? `Students see one card after finishing Unit Questions. ${running} card${running === 1 ? " is" : "s are"} running now.`
            : "No student sees any sponsor card. You can add and prepare cards while this is off."}
        </p>
      </div>
    </Card>
  );
}

/** What students will see, while editing. */
function Preview({ draft }: { draft: Draft }) {
  return (
    <div className="border-line bg-surface relative flex items-start gap-3.5 rounded-2xl border py-4 pr-11 pl-4">
      <span aria-hidden="true" className="bg-brand-soft grid size-11 shrink-0 place-items-center rounded-xl text-[22px]">
        {draft.icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-ink text-sm font-bold">{draft.heading || "Heading"}</p>
        <p className="mt-0.5 text-sm text-slate-700">
          {draft.message || "Your educational message appears here."}
        </p>
        <p className="text-muted mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
          <span className="border-line rounded-md border px-1.5 py-px text-[10.5px] font-bold tracking-wide uppercase">Sponsored</span>
          <span aria-hidden="true" className="grid size-5 place-items-center rounded-[5px] text-[10px] font-extrabold text-white" style={{ background: draft.color }}>
            {(draft.sponsor || "S").charAt(0).toUpperCase()}
          </span>
          <span>
            Supported by <b className="text-ink font-semibold">{draft.sponsor || "Sponsor name"}</b>
          </span>
          {draft.linkUrl && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-brand font-semibold">{draft.linkLabel || "Learn more"} →</span>
            </>
          )}
        </p>
      </div>
      <span aria-hidden="true" className="text-muted absolute top-2 right-3 text-lg">×</span>
    </div>
  );
}

function Editor({
  draft: initial,
  schools,
  onDone,
}: {
  draft: Draft;
  schools: Data["schools"];
  onDone: () => void;
}) {
  const router = useRouter();
  const [d, setD] = useState<Draft>(initial);
  const [error, setError] = useState<string | null>(null);
  const save = api.sponsor.save.useMutation({
    onSuccess: () => {
      router.refresh();
      onDone();
    },
    onError: (e) => {
      const issues = e.data?.zodError?.fieldErrors;
      const first = issues ? Object.values(issues).flat()[0] : null;
      setError(first ?? e.message);
    },
  });
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((x) => ({ ...x, [k]: v }));

  return (
    <Card className="p-5">
      <p className="text-ink font-extrabold">{d.id ? "Edit sponsor card" : "New sponsor card"}</p>
      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_380px]">
        <form
          id="sponsor-form"
          className="grid gap-3 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);
            save.mutate(d);
          }}
        >
          <div>
            <label htmlFor="sp-sponsor" className={label}>Sponsor name</label>
            <input id="sp-sponsor" value={d.sponsor} onChange={(e) => set("sponsor", e.target.value)} placeholder="e.g. Bright School Supplies" required maxLength={80} className={`${field} mt-1 w-full`} />
          </div>
          <div>
            <label htmlFor="sp-school" className={label}>Show in</label>
            <select id="sp-school" value={d.schoolId ?? ""} onChange={(e) => set("schoolId", e.target.value || null)} className={`${field} mt-1 w-full`}>
              <option value="">All schools</option>
              {schools.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <span className={label}>Icon</span>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {ICONS.map((i) => (
                <button key={i} type="button" aria-label={`Icon ${i}`} onClick={() => set("icon", i)} className={`grid size-9 place-items-center rounded-lg border text-lg ${d.icon === i ? "border-brand bg-brand-soft" : "border-line bg-surface"}`}>
                  {i}
                </button>
              ))}
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="sp-heading" className={label}>Heading</label>
            <input id="sp-heading" value={d.heading} onChange={(e) => set("heading", e.target.value)} placeholder="e.g. Study tip, Scholarship alert, Did you know?" required maxLength={60} className={`${field} mt-1 w-full`} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="sp-message" className={label}>
              Educational message <span className="text-muted font-normal">({d.message.length}/280)</span>
            </label>
            <textarea id="sp-message" value={d.message} onChange={(e) => set("message", e.target.value)} rows={3} maxLength={280} required placeholder="Something useful for students, e.g. a study tip or a scholarship notice." className={`${field} mt-1 w-full`} />
          </div>
          <div>
            <label htmlFor="sp-link" className={label}>Link <span className="text-muted font-normal">(optional)</span></label>
            <input id="sp-link" value={d.linkUrl} onChange={(e) => set("linkUrl", e.target.value)} placeholder="https://…" maxLength={500} className={`${field} mt-1 w-full`} />
          </div>
          <div>
            <label htmlFor="sp-linklabel" className={label}>Link text</label>
            <input id="sp-linklabel" value={d.linkLabel} onChange={(e) => set("linkLabel", e.target.value)} placeholder="Learn more" maxLength={30} className={`${field} mt-1 w-full`} />
          </div>
          <div>
            <label htmlFor="sp-start" className={label}>Starts <span className="text-muted font-normal">(optional)</span></label>
            <input id="sp-start" type="date" value={d.startsOn} onChange={(e) => set("startsOn", e.target.value)} className={`${field} mt-1 w-full`} />
          </div>
          <div>
            <label htmlFor="sp-end" className={label}>Ends <span className="text-muted font-normal">(optional)</span></label>
            <input id="sp-end" type="date" value={d.endsOn} onChange={(e) => set("endsOn", e.target.value)} className={`${field} mt-1 w-full`} />
          </div>
          <div>
            <span className={label}>Sponsor color</span>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {COLORS.map((c) => (
                <button key={c} type="button" aria-label={`Color ${c}`} onClick={() => set("color", c)} className={`size-8 rounded-lg ring-offset-2 ${d.color === c ? "ring-ink ring-2" : ""}`} style={{ background: c }} />
              ))}
            </div>
          </div>
          <label className="text-ink flex items-center gap-2 self-end text-sm font-semibold">
            <input type="checkbox" checked={d.active} onChange={(e) => set("active", e.target.checked)} className="size-4" />
            Running (uncheck to pause)
          </label>
        </form>
        <div>
          <p className={label}>Preview: what students see</p>
          <div className="bg-canvas mt-2 rounded-2xl p-3">
            <Preview draft={d} />
          </div>
        </div>
      </div>
      {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="submit" form="sponsor-form" className={primary} disabled={save.isPending}>
          {save.isPending ? "Saving…" : d.id ? "Save changes" : "Add card"}
        </button>
        <button type="button" className={secondary} onClick={onDone}>Cancel</button>
      </div>
    </Card>
  );
}

function Row({ card, school, onEdit }: { card: SponsorCardRow; school: string; onEdit: () => void }) {
  const router = useRouter();
  const utils = api.useUtils();
  const st = statusOf(card);
  const save = api.sponsor.save.useMutation({ onSuccess: () => router.refresh() });
  const remove = api.sponsor.remove.useMutation({ onSuccess: () => router.refresh() });
  const [busy, setBusy] = useState(false);

  const togglePause = () =>
    save.mutate({
      id: card.id,
      schoolId: card.schoolId,
      sponsor: card.sponsor,
      icon: card.icon,
      heading: card.heading,
      message: card.message,
      linkUrl: card.linkUrl ?? "",
      linkLabel: card.linkLabel ?? "",
      color: card.color,
      startsOn: toYmd(card.startsOn),
      endsOn: toYmd(card.endsOn),
      active: !card.active,
    });

  // the sponsor's monthly report: views, clicks and click rate per month
  const report = async () => {
    setBusy(true);
    try {
      const r = await utils.sponsor.report.fetch({ id: card.id });
      const q = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
      const lines = [
        [q("Momo Smart sponsor report")],
        [q("Sponsor"), q(r.sponsor)],
        [q("Card"), q(`${r.heading}: ${r.message}`)],
        [q("Shown in"), q(school)],
        [q("Dates"), q(`${shortDate(r.startsOn) ?? "No start date"} to ${shortDate(r.endsOn) ?? "no end date"}`)],
        [],
        [q("Month"), q("Views"), q("Clicks"), q("Click rate")],
        ...r.stats.map((s) => [q(s.month), s.views, s.clicks, q(s.views ? `${((100 * s.clicks) / s.views).toFixed(1)}%` : "-")]),
        [q("Total"), r.stats.reduce((n, s) => n + s.views, 0), r.stats.reduce((n, s) => n + s.clicks, 0)],
      ].map((row) => row.join(","));
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob(["﻿" + lines.join("\r\n")], { type: "text/csv" }));
      a.download = `Momo Smart sponsor report - ${r.sponsor}.csv`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    } finally {
      setBusy(false);
    }
  };

  return (
    <li className="flex flex-wrap items-start gap-4 px-5 py-4">
      <span aria-hidden="true" className="bg-brand-soft grid size-11 shrink-0 place-items-center rounded-xl text-[22px]">{card.icon}</span>
      <div className="min-w-[220px] flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-ink font-bold">{card.sponsor}</p>
          <Pill tone={st.tone}>{st.text}</Pill>
        </div>
        <p className="text-ink mt-0.5 text-sm font-semibold">{card.heading}</p>
        <p className="text-muted text-sm">{card.message}</p>
        <p className="text-muted mt-1 text-xs">
          {school} · {shortDate(card.startsOn) ?? "No start date"} – {shortDate(card.endsOn) ?? "no end date"}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-x-5 gap-y-0.5 text-right text-sm">
        <span className="text-muted text-xs">This month</span>
        <span className="text-muted text-xs">All time</span>
        <span><b className="text-ink">{card.monthViews.toLocaleString()}</b> views</span>
        <span><b className="text-ink">{card.totalViews.toLocaleString()}</b> views</span>
        <span><b className="text-ink">{card.monthClicks.toLocaleString()}</b> clicks</span>
        <span><b className="text-ink">{card.totalClicks.toLocaleString()}</b> clicks</span>
      </div>
      <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:flex-col">
        <button type="button" className={secondary} onClick={onEdit}>Edit</button>
        <button type="button" className={secondary} onClick={togglePause} disabled={save.isPending}>{card.active ? "Pause" : "Resume"}</button>
        <button type="button" className={secondary} onClick={report} disabled={busy}>{busy ? "…" : "Report (CSV)"}</button>
        <button
          type="button"
          className={`${secondary} text-rose-600`}
          disabled={remove.isPending}
          onClick={() => { if (confirm(`Delete the card from ${card.sponsor}? Its numbers are deleted too.`)) remove.mutate({ id: card.id }); }}
        >
          Delete
        </button>
      </div>
    </li>
  );
}
