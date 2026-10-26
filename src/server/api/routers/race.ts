import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  studentProcedure,
  teacherProcedure,
} from "~/server/api/trpc";
import { assertEnrolled, assertTeachesSection } from "~/server/lib/permissions";
import {
  RACE_MINUTES,
  raceFor,
  reshuffleTeams,
  TEAM_COUNT,
} from "~/server/lib/race";

/**
 * Group Race: five teams per class racing on the stars their members earn
 * in that class. Teachers shuffle or move students between teams and rename
 * teams; students watch their class's race.
 */
export const raceRouter = createTRPCRouter({
  /** Teacher: the classes they can show a race for. */
  classes: teacherProcedure.query(async ({ ctx }) => {
    const sections = await ctx.db.section.findMany({
      where: { teacherId: ctx.teacherId ?? "", term: { isCurrent: true } },
      orderBy: [{ course: { name: "asc" } }, { code: "asc" }],
      select: {
        id: true,
        code: true,
        course: { select: { name: true } },
        _count: { select: { enrollments: { where: { status: "ACTIVE" } } } },
      },
    });
    return sections.map((s) => ({
      id: s.id,
      label: `${s.course.name} — ${s.code}`,
      students: s._count.enrollments,
    }));
  }),

  /** Teacher: one class's race. */
  forSection: teacherProcedure
    .input(z.object({ sectionId: z.string() }))
    .query(async ({ ctx, input }) => {
      await assertTeachesSection(ctx.db, ctx.session.user, input.sectionId);
      return raceFor(ctx.db, input.sectionId);
    }),

  /** Student: the races of the classes they're in, with their own team. */
  mine: studentProcedure.query(async ({ ctx }) => {
    const enrollments = await ctx.db.enrollment.findMany({
      where: {
        studentId: ctx.studentId,
        status: "ACTIVE",
        section: { term: { isCurrent: true } },
      },
      orderBy: { section: { course: { name: "asc" } } },
      select: { sectionId: true },
    });
    const races = [];
    for (const e of enrollments) {
      const race = await raceFor(ctx.db, e.sectionId);
      races.push({
        ...race,
        myTeam:
          race.teams.find((t) =>
            t.members.some((m) => m.studentId === ctx.studentId),
          )?.number ?? null,
      });
    }
    return races;
  }),

  /** Student: one class's race (must be enrolled). */
  forMySection: studentProcedure
    .input(z.object({ sectionId: z.string() }))
    .query(async ({ ctx, input }) => {
      await assertEnrolled(ctx.db, ctx.session.user, input.sectionId);
      const race = await raceFor(ctx.db, input.sectionId);
      return {
        ...race,
        myTeam:
          race.teams.find((t) =>
            t.members.some((m) => m.studentId === ctx.studentId),
          )?.number ?? null,
      };
    }),

  /** Teacher: starts a timed race (ending any race still running). */
  start: teacherProcedure
    .input(
      z.object({
        sectionId: z.string(),
        minutes: z
          .number()
          .int()
          .refine((m) => (RACE_MINUTES as readonly number[]).includes(m)),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await assertTeachesSection(ctx.db, ctx.session.user, input.sectionId);
      const now = new Date();
      await ctx.db.raceSession.updateMany({
        where: { sectionId: input.sectionId, endsAt: { gt: now } },
        data: { endsAt: now },
      });
      await ctx.db.raceSession.create({
        data: {
          sectionId: input.sectionId,
          startsAt: now,
          endsAt: new Date(now.getTime() + input.minutes * 60_000),
        },
      });
      return { ok: true };
    }),

  /** Teacher: ends the running race now. */
  stop: teacherProcedure
    .input(z.object({ sectionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await assertTeachesSection(ctx.db, ctx.session.user, input.sectionId);
      const now = new Date();
      await ctx.db.raceSession.updateMany({
        where: { sectionId: input.sectionId, endsAt: { gt: now } },
        data: { endsAt: now },
      });
      return { ok: true };
    }),

  /** Teacher: shuffles the class into five new teams. */
  shuffle: teacherProcedure
    .input(z.object({ sectionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await assertTeachesSection(ctx.db, ctx.session.user, input.sectionId);
      await reshuffleTeams(ctx.db, input.sectionId);
      return { ok: true };
    }),

  /** Teacher: moves one student to another team. */
  move: teacherProcedure
    .input(
      z.object({
        sectionId: z.string(),
        studentId: z.string(),
        number: z
          .number()
          .int()
          .min(0)
          .max(TEAM_COUNT - 1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await assertTeachesSection(ctx.db, ctx.session.user, input.sectionId);
      const team = await ctx.db.raceTeam.findUnique({
        where: {
          sectionId_number: {
            sectionId: input.sectionId,
            number: input.number,
          },
        },
        select: { id: true },
      });
      const member = await ctx.db.raceMember.findUnique({
        where: {
          sectionId_studentId: {
            sectionId: input.sectionId,
            studentId: input.studentId,
          },
        },
        select: { id: true },
      });
      if (!team || !member) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Team not found." });
      }
      await ctx.db.raceMember.update({
        where: { id: member.id },
        data: { teamId: team.id },
      });
      return { ok: true };
    }),

  /** Teacher: renames a team. */
  rename: teacherProcedure
    .input(
      z.object({
        sectionId: z.string(),
        number: z
          .number()
          .int()
          .min(0)
          .max(TEAM_COUNT - 1),
        name: z.string().trim().min(1).max(40),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await assertTeachesSection(ctx.db, ctx.session.user, input.sectionId);
      await ctx.db.raceTeam.update({
        where: {
          sectionId_number: {
            sectionId: input.sectionId,
            number: input.number,
          },
        },
        data: { name: input.name },
      });
      return { ok: true };
    }),
});
