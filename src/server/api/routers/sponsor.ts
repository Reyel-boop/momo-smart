import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  ownerProcedure,
  studentProcedure,
} from "~/server/api/trpc";

/**
 * Sponsor cards: one short educational message, labeled "Sponsored" and
 * naming the sponsor, shown to a student on the results screen after they
 * finish Unit Questions — never during questions or the timer. The owner
 * turns them on or off, writes each card, and gets monthly views and clicks
 * to show the sponsor.
 *
 * Safe before the database update: if the sponsor tables don't exist yet,
 * students simply see no card and the owner's page says the update is needed.
 */

/** The tables are missing until the migration is applied. */
const tableMissing = (error: unknown) =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  (error.code === "P2021" || error.code === "P2022");

const monthOf = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

/** "2026-12-01" (Philippine date) → the start or end of that day. */
const dayStart = (s: string) => new Date(`${s}T00:00:00+08:00`);
const dayEnd = (s: string) => new Date(`${s}T23:59:59.999+08:00`);

const httpUrl = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || /^https?:\/\/[^\s]+$/i.test(v), {
    message: "The link must start with https:// or http://",
  });
const ymd = z
  .string()
  .trim()
  .refine((v) => v === "" || /^\d{4}-\d{2}-\d{2}$/.test(v), {
    message: "Use a date like 2026-12-01.",
  });

const cardInput = z.object({
  schoolId: z.string().nullable(),
  sponsor: z.string().trim().min(2, "Enter the sponsor's name.").max(80),
  icon: z.string().trim().min(1).max(8),
  heading: z.string().trim().min(2, "Enter a short heading.").max(60),
  message: z
    .string()
    .trim()
    .min(10, "Write the educational message (at least a sentence).")
    .max(280, "Keep the message under 280 characters."),
  linkUrl: httpUrl,
  linkLabel: z.string().trim().max(30),
  color: z
    .string()
    .trim()
    .regex(/^#[0-9a-f]{6}$/i, "Pick a color."),
  startsOn: ymd,
  endsOn: ymd,
  active: z.boolean(),
});

const toData = (input: z.infer<typeof cardInput>) => ({
  schoolId: input.schoolId,
  sponsor: input.sponsor,
  icon: input.icon,
  heading: input.heading,
  message: input.message,
  linkUrl: input.linkUrl || null,
  linkLabel: input.linkLabel || null,
  color: input.color,
  startsOn: input.startsOn ? dayStart(input.startsOn) : null,
  endsOn: input.endsOn ? dayEnd(input.endsOn) : null,
  active: input.active,
});

export const sponsorRouter = createTRPCRouter({
  /**
   * Student: the card to show on the results screen, or null (cards are
   * off, none is running for this school today, or the update isn't in).
   */
  forResults: studentProcedure.query(async ({ ctx }) => {
    try {
      const setting = await ctx.db.sponsorSetting.findUnique({
        where: { id: "main" },
      });
      if (!setting?.enabled) return null;
      const now = new Date();
      const schoolId = ctx.session.user.schoolId ?? null;
      const cards = await ctx.db.sponsorCard.findMany({
        where: {
          active: true,
          AND: [
            { OR: [{ schoolId: null }, ...(schoolId ? [{ schoolId }] : [])] },
            { OR: [{ startsOn: null }, { startsOn: { lte: now } }] },
            { OR: [{ endsOn: null }, { endsOn: { gte: now } }] },
          ],
        },
        select: {
          id: true,
          sponsor: true,
          icon: true,
          heading: true,
          message: true,
          linkUrl: true,
          linkLabel: true,
          color: true,
        },
      });
      if (!cards.length) return null;
      return cards[Math.floor(Math.random() * cards.length)]!;
    } catch (error) {
      if (tableMissing(error)) return null;
      console.error("sponsor card", error);
      return null; // a sponsor card must never break the results screen
    }
  }),

  /** Student: the card was shown (once per screen) or its link was opened. */
  track: studentProcedure
    .input(z.object({ cardId: z.string(), kind: z.enum(["view", "click"]) }))
    .mutation(async ({ ctx, input }) => {
      try {
        const month = monthOf();
        await ctx.db.sponsorStat.upsert({
          where: { cardId_month: { cardId: input.cardId, month } },
          create: {
            cardId: input.cardId,
            month,
            views: input.kind === "view" ? 1 : 0,
            clicks: input.kind === "click" ? 1 : 0,
          },
          update:
            input.kind === "view"
              ? { views: { increment: 1 } }
              : { clicks: { increment: 1 } },
        });
      } catch {
        // counting is best effort: a missed count never bothers the student
      }
      return { ok: true };
    }),

  /** Owner: the switch, every card with this month's and all-time numbers. */
  list: ownerProcedure.query(async ({ ctx }) => {
    try {
      const month = monthOf();
      const [setting, cards, schools] = await Promise.all([
        ctx.db.sponsorSetting.findUnique({ where: { id: "main" } }),
        ctx.db.sponsorCard.findMany({
          orderBy: { createdAt: "desc" },
          include: { stats: true },
        }),
        ctx.db.school.findMany({
          orderBy: { name: "asc" },
          select: { id: true, name: true },
        }),
      ]);
      return {
        needsUpdate: false as const,
        enabled: setting?.enabled ?? false,
        month,
        schools,
        cards: cards.map(({ stats, ...card }) => {
          const now = stats.find((s) => s.month === month);
          return {
            ...card,
            monthViews: now?.views ?? 0,
            monthClicks: now?.clicks ?? 0,
            totalViews: stats.reduce((n, s) => n + s.views, 0),
            totalClicks: stats.reduce((n, s) => n + s.clicks, 0),
          };
        }),
      };
    } catch (error) {
      if (tableMissing(error)) {
        return {
          needsUpdate: true as const,
          enabled: false,
          month: monthOf(),
          schools: [],
          cards: [],
        };
      }
      throw error;
    }
  }),

  /** Owner: turn sponsor cards on or off for every school. */
  setEnabled: ownerProcedure
    .input(z.object({ enabled: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.sponsorSetting.upsert({
        where: { id: "main" },
        create: { id: "main", enabled: input.enabled },
        update: { enabled: input.enabled },
      });
      return { ok: true };
    }),

  /** Owner: add a card, or change one (with `id`). */
  save: ownerProcedure
    .input(cardInput.extend({ id: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      if (input.startsOn && input.endsOn && input.endsOn < input.startsOn) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The end date is before the start date.",
        });
      }
      const data = toData(input);
      if (input.id) {
        await ctx.db.sponsorCard.update({ where: { id: input.id }, data });
      } else {
        await ctx.db.sponsorCard.create({ data });
      }
      return { ok: true };
    }),

  /** Owner: delete a card and its numbers. */
  remove: ownerProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.sponsorCard.delete({ where: { id: input.id } });
      return { ok: true };
    }),

  /** Owner: one card's views and clicks per month, for the sponsor's report. */
  report: ownerProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const card = await ctx.db.sponsorCard.findUnique({
        where: { id: input.id },
        include: { stats: { orderBy: { month: "asc" } } },
      });
      if (!card) throw new TRPCError({ code: "NOT_FOUND" });
      return card;
    }),
});
