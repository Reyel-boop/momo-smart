/**
 * Sets up a real (non-demo) school:
 *
 *   DATABASE_URL="postgresql://…" npx tsx scripts/setup-school.ts \
 *     registrar@yourschool.edu.ph "Registrar Name" [--replace-demo]
 *
 * Run `npx prisma migrate deploy` against the database first. This creates
 * the curriculum (Grade 10 core subjects and TLE 7–10 with their lessons,
 * lectures and Unit Questions bank), the current school year, and one admin
 * account with a temporary password that must be changed at first sign-in.
 *
 * Normally it refuses to run on a database that already has users. With
 * --replace-demo it first clears a DEMO database — only if every account in
 * it is a demo (@momosmart.edu) account — keeping the waitlist sign-ups.
 */
import { randomInt } from "node:crypto";

import { hash } from "bcryptjs";

import { PrismaClient } from "../generated/prisma";
import { createCurriculum } from "../src/server/curriculum";

const ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";
const group = () =>
  Array.from({ length: 4 }, () => ALPHABET[randomInt(ALPHABET.length)]).join(
    "",
  );

/** Tables kept when clearing the demo: migration history and waitlist leads. */
const KEEP = new Set(["_prisma_migrations", "WaitlistEntry"]);

async function clearDemo(db: PrismaClient) {
  const real = await db.user.count({
    where: {
      NOT: [
        { email: { endsWith: "@momosmart.edu" } },
        { email: { endsWith: "@student.momosmart.edu" } },
      ],
    },
  });
  if (real > 0) {
    throw new Error(
      `Refusing to clear: ${real} account(s) are not demo accounts. This is not a demo database.`,
    );
  }
  const tables = await db.$queryRawUnsafe<Array<{ tablename: string }>>(
    `SELECT tablename FROM pg_tables WHERE schemaname = 'public'`,
  );
  const wipe = tables.map((t) => t.tablename).filter((t) => !KEEP.has(t));
  await db.$executeRawUnsafe(
    `TRUNCATE ${wipe.map((t) => `"${t}"`).join(", ")} RESTART IDENTITY CASCADE`,
  );
  console.log(`Cleared ${wipe.length} demo tables (kept the waitlist).`);
}

async function main() {
  const args = process.argv.slice(2);
  const replaceDemo = args.includes("--replace-demo");
  const [email, ...nameParts] = args.filter((a) => !a.startsWith("--"));
  const name = nameParts.join(" ").trim() || "School Registrar";
  if (!email?.includes("@")) {
    console.error(
      'Usage: npx tsx scripts/setup-school.ts <admin email> "<admin name>" [--replace-demo]',
    );
    process.exit(1);
  }

  const db = new PrismaClient();
  try {
    if (replaceDemo) await clearDemo(db);
    const users = await db.user.count();
    if (users > 0) {
      console.error(
        `This database already has ${users} user(s). setup-school only runs on an empty database.`,
      );
      process.exit(1);
    }

    console.log("Creating the curriculum…");
    const curriculum = await createCurriculum(db);

    // DepEd school year: mid-June to the end of March.
    const now = new Date();
    const startYear =
      now.getMonth() >= 5 ? now.getFullYear() : now.getFullYear() - 1;
    const term = await db.term.create({
      data: {
        name: `S.Y. ${startYear}–${startYear + 1}`,
        schoolYear: `${startYear}-${startYear + 1}`,
        startDate: new Date(Date.UTC(startYear, 5, 15)),
        endDate: new Date(Date.UTC(startYear + 1, 2, 31)),
        isCurrent: true,
      },
    });

    const password = `${group()}-${group()}-${group()}`;
    await db.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        role: "ADMIN",
        passwordHash: await hash(password, 10),
        mustChangePassword: true,
      },
    });

    console.log("\nSchool set up:");
    console.log(`  courses   ${curriculum.courses}`);
    console.log(`  units     ${curriculum.units}`);
    console.log(`  lessons   ${curriculum.lessons}`);
    console.log(`  term      ${term.name}`);
    console.log("\nAdmin sign-in (change the password at first sign-in):");
    console.log(`  email     ${email.toLowerCase()}`);
    console.log(`  password  ${password}`);
  } finally {
    await db.$disconnect();
  }
}

void main();
