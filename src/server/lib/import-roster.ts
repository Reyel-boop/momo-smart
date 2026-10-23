import { randomInt } from "node:crypto";

import { hash } from "bcryptjs";
import { z } from "zod";

import type { PrismaClient } from "../../../generated/prisma";

/** One student read from School Form 1 (or a class list). */
export const rosterRow = z.object({
  studentNumber: z.string().trim().min(1).max(40),
  name: z.string().trim().min(1).max(120),
  gradeLevel: z.number().int().min(1).max(12),
  email: z.string().trim().toLowerCase().email().optional(),
});
/** The section (homeroom) a School Form 1 upload places students in. */
export const homeroom = z.object({
  name: z.string().trim().min(1, "Enter the section name.").max(60),
  gradeLevel: z.number().int().min(1).max(12),
});

export type RosterRow = z.infer<typeof rosterRow>;

export type RosterResult =
  | {
      lrn: string;
      name: string;
      status: "created";
      /** Temporary password; shown once. */
      password: string;
    }
  | { lrn: string; name: string; status: "existing" }
  | { lrn: string; name: string; status: "failed"; error: string };

const ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";
const temporaryPassword = () => {
  const group = () =>
    Array.from({ length: 4 }, () => ALPHABET[randomInt(ALPHABET.length)]).join(
      "",
    );
  return `${group()}-${group()}-${group()}`;
};

const graduationYear = (gradeLevel: number, now = new Date()) =>
  (now.getMonth() >= 5 ? now.getFullYear() + 1 : now.getFullYear()) +
  (12 - gradeLevel);

/**
 * Creates accounts for students not seen before (they sign in with their
 * LRN, or email if one was given, and a temporary password) and enrolls
 * everyone in the given classes. A student whose LRN already has an account
 * is only enrolled, so uploading the same form twice is safe. Given the
 * form's section (homeroom), everyone is placed in it; it is created if new.
 */
export async function importRoster(
  db: PrismaClient,
  rows: RosterRow[],
  sectionIds: string[],
  homeroom?: { name: string; gradeLevel: number } | null,
): Promise<RosterResult[]> {
  const room = homeroom
    ? await db.homeroom.upsert({
        where: { gradeLevel_name: homeroom },
        create: homeroom,
        update: {},
        select: { id: true, name: true },
      })
    : null;
  const placement = room ? { sectionId: room.id, homeroom: room.name } : {};
  const results: RosterResult[] = [];
  for (const row of rows) {
    try {
      const existing = await db.studentProfile.findUnique({
        where: { studentNumber: row.studentNumber },
        select: { id: true },
      });
      let studentId = existing?.id ?? null;
      let password: string | null = null;

      if (!studentId) {
        if (row.email) {
          const taken = await db.user.findUnique({
            where: { email: row.email },
            select: { id: true },
          });
          if (taken) {
            throw new Error(
              `The email ${row.email} belongs to another account.`,
            );
          }
        }
        password = temporaryPassword();
        const user = await db.user.create({
          data: {
            name: row.name,
            email: row.email ?? null,
            role: "STUDENT",
            passwordHash: await hash(password, 10),
            mustChangePassword: true,
            studentProfile: {
              create: {
                studentNumber: row.studentNumber,
                gradeLevel: row.gradeLevel,
                graduationYear: graduationYear(row.gradeLevel),
                ...placement,
              },
            },
          },
          select: { studentProfile: { select: { id: true } } },
        });
        studentId = user.studentProfile!.id;
      } else if (room) {
        await db.studentProfile.update({
          where: { id: studentId },
          data: placement,
        });
      }

      for (const sectionId of sectionIds) {
        await db.enrollment.upsert({
          where: { sectionId_studentId: { sectionId, studentId } },
          create: { sectionId, studentId },
          update: { status: "ACTIVE", droppedAt: null },
        });
      }

      results.push(
        password
          ? {
              lrn: row.studentNumber,
              name: row.name,
              status: "created",
              password,
            }
          : { lrn: row.studentNumber, name: row.name, status: "existing" },
      );
    } catch (error) {
      results.push({
        lrn: row.studentNumber,
        name: row.name,
        status: "failed",
        error: error instanceof Error ? error.message : "Not added.",
      });
    }
  }
  return results;
}
