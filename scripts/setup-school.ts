/**
 * Sets up a real (non-demo) school on an EMPTY database:
 *
 *   DATABASE_URL="postgresql://…" npx tsx scripts/setup-school.ts \
 *     registrar@yourschool.edu.ph "Registrar Name"
 *
 * Run `npx prisma migrate deploy` against the database first. This creates
 * the curriculum (Grade 10 core subjects and TLE 7–10 with their lessons,
 * lectures and Unit Questions bank), the current school year, and one admin
 * account with a temporary password that must be changed at first sign-in.
 *
 * It refuses to run on a database that already has users.
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

async function main() {
  const [email, ...nameParts] = process.argv.slice(2);
  const name = nameParts.join(" ").trim() || "School Registrar";
  if (!email?.includes("@")) {
    console.error(
      'Usage: npx tsx scripts/setup-school.ts <admin email> "<admin name>"',
    );
    process.exit(1);
  }

  const db = new PrismaClient();
  try {
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
