import { TRPCError } from "@trpc/server";
import { hash } from "bcryptjs";
import { z } from "zod";

import { temporaryPassword } from "~/server/api/routers/admin";
import { createTRPCRouter, ownerProcedure } from "~/server/api/trpc";

const isUniqueViolation = (error: unknown) =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  error.code === "P2002";

const schoolInput = z.object({
  name: z.string().trim().min(3, "Enter the school's name.").max(120),
  depedId: z.string().trim().max(20).optional(),
  address: z.string().trim().max(200).optional(),
});

const orNull = (value: string | undefined) =>
  value === undefined || value === "" ? null : value;

/**
 * The Momo owner's tools: every school with its numbers, adding schools and
 * their admins, and switching which school the owner is working in. The
 * owner's account belongs to the school they switch to, so every admin
 * page then shows that school.
 */
export const schoolRouter = createTRPCRouter({
  /** Every school, with counts and its admins; marks the one being viewed. */
  list: ownerProcedure.query(async ({ ctx }) => {
    const schools = await ctx.db.school.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        depedId: true,
        address: true,
        joinCode: true,
        createdAt: true,
        _count: {
          select: {
            homerooms: true,
            sections: { where: { term: { isCurrent: true } } },
          },
        },
        users: {
          where: { role: "ADMIN", isOwner: false },
          orderBy: { name: "asc" },
          select: {
            id: true,
            name: true,
            email: true,
            mustChangePassword: true,
            isActive: true,
          },
        },
      },
    });
    const people = await ctx.db.user.groupBy({
      by: ["schoolId", "role"],
      where: { isActive: true, schoolId: { not: null } },
      _count: { _all: true },
    });
    const count = (schoolId: string, role: "TEACHER" | "STUDENT") =>
      people.find((p) => p.schoolId === schoolId && p.role === role)?._count
        ._all ?? 0;
    return schools.map(({ users, _count, ...school }) => ({
      ...school,
      sections: _count.homerooms,
      classes: _count.sections,
      teachers: count(school.id, "TEACHER"),
      students: count(school.id, "STUDENT"),
      admins: users,
      current: school.id === ctx.session.user.schoolId,
    }));
  }),

  create: ownerProcedure.input(schoolInput).mutation(async ({ ctx, input }) => {
    try {
      return await ctx.db.school.create({
        data: {
          name: input.name,
          depedId: orNull(input.depedId),
          address: orNull(input.address),
        },
        select: { id: true, joinCode: true },
      });
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new TRPCError({
          code: "CONFLICT",
          message: `There is already a school named ${input.name}.`,
        });
      }
      throw error;
    }
  }),

  update: ownerProcedure
    .input(schoolInput.extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.school.update({
          where: { id: input.id },
          data: {
            name: input.name,
            depedId: orNull(input.depedId),
            address: orNull(input.address),
          },
        });
      } catch (error) {
        if (isUniqueViolation(error)) {
          throw new TRPCError({
            code: "CONFLICT",
            message: `There is already a school named ${input.name}.`,
          });
        }
        throw error;
      }
      return { ok: true };
    }),

  /** Makes a school admin account with a temporary password (shown once). */
  addAdmin: ownerProcedure
    .input(
      z.object({
        schoolId: z.string(),
        name: z.string().trim().min(2, "Enter the admin's name.").max(120),
        email: z.string().trim().toLowerCase().email("Enter a valid email."),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const school = await ctx.db.school.findUnique({
        where: { id: input.schoolId },
        select: { id: true },
      });
      if (!school) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "School not found.",
        });
      }
      const password = temporaryPassword();
      try {
        await ctx.db.user.create({
          data: {
            name: input.name,
            email: input.email,
            role: "ADMIN",
            schoolId: school.id,
            passwordHash: await hash(password, 10),
            mustChangePassword: true,
          },
        });
      } catch (error) {
        if (isUniqueViolation(error)) {
          throw new TRPCError({
            code: "CONFLICT",
            message: `An account with the email ${input.email} already exists.`,
          });
        }
        throw error;
      }
      return { email: input.email, password };
    }),

  /** Opens a school: the owner's admin pages now show that school. */
  switchTo: ownerProcedure
    .input(z.object({ schoolId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const school = await ctx.db.school.findUnique({
        where: { id: input.schoolId },
        select: { id: true, name: true },
      });
      if (!school) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "School not found.",
        });
      }
      await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { schoolId: school.id },
      });
      return school;
    }),
});
