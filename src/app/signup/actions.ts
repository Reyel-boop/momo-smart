"use server";

import { randomBytes } from "node:crypto";

import { TRPCError } from "@trpc/server";
import { hash } from "bcryptjs";
import { AuthError } from "next-auth";
import { z } from "zod";

import { env } from "~/env";
import { signIn } from "~/server/auth";
import { homeForRole } from "~/server/auth/home";
import { db } from "~/server/db";
import { joinClassByCode } from "~/server/lib/join-class";

export type SignUpState = { error: string | null };

const common = {
  name: z.string().trim().min(2, "Enter your full name.").max(120),
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z
    .string()
    .min(8, "Use a password of at least 8 characters.")
    .max(200),
};

const schema = z.discriminatedUnion("role", [
  z.object({
    role: z.literal("TEACHER"),
    ...common,
    title: z.string().trim().max(20).optional(),
    employeeNumber: z.string().trim().max(40).optional(),
  }),
  z.object({
    role: z.literal("STUDENT"),
    ...common,
    studentNumber: z
      .string()
      .trim()
      .min(1, "Enter your student number (LRN).")
      .max(40),
    gradeLevel: z.coerce
      .number()
      .int()
      .min(7, "Choose your grade level.")
      .max(12),
    classCode: z.string().trim().max(20).optional(),
  }),
]);

const field = (formData: FormData, name: string) => {
  const value = formData.get(name);
  return typeof value === "string" && value.trim() !== "" ? value : undefined;
};

/**
 * Creates a teacher or student account with the person's own password and
 * signs them in. Students may join a class with its code right away.
 */
export async function signUp(
  _previous: SignUpState,
  formData: FormData,
): Promise<SignUpState> {
  // Every demo account is reset daily, and the reset refuses to run once a
  // real account exists — so the public demo takes no sign-ups.
  if (env.DEMO_MODE) {
    return {
      error:
        "This is the public demo, so new accounts can't be created here. Use Try as Teacher or Try as Student instead.",
    };
  }

  const parsed = schema.safeParse({
    role: formData.get("role"),
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    title: field(formData, "title"),
    employeeNumber: field(formData, "employeeNumber"),
    studentNumber: formData.get("studentNumber") ?? undefined,
    gradeLevel: formData.get("gradeLevel") ?? undefined,
    classCode: field(formData, "classCode"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your details." };
  }
  const input = parsed.data;
  if (formData.get("confirm") !== input.password) {
    return { error: "The two passwords don't match." };
  }

  const taken = await db.user.findUnique({
    where: { email: input.email },
    select: { id: true },
  });
  if (taken) {
    return {
      error: "An account with this email already exists. Sign in instead.",
    };
  }
  if (input.role === "STUDENT") {
    const numberTaken = await db.studentProfile.findUnique({
      where: { studentNumber: input.studentNumber },
      select: { id: true },
    });
    if (numberTaken) {
      return {
        error:
          "That student number is already registered. Ask the registrar if this is a mistake.",
      };
    }
  }

  const passwordHash = await hash(input.password, 10);
  try {
    await db.$transaction(async (tx) => {
      if (input.role === "TEACHER") {
        await tx.user.create({
          data: {
            name: input.name,
            email: input.email,
            role: "TEACHER",
            title: input.title ?? null,
            passwordHash,
            teacherProfile: {
              create: {
                // Employee numbers are unique; make one up if none was given.
                employeeNumber:
                  input.employeeNumber ??
                  `T-${randomBytes(4).toString("hex").toUpperCase()}`,
              },
            },
          },
        });
        return;
      }
      // DepEd: a Grade 12 student graduates at the end of this school year.
      const now = new Date();
      const schoolYearEnd =
        now.getMonth() >= 5 ? now.getFullYear() + 1 : now.getFullYear();
      const user = await tx.user.create({
        data: {
          name: input.name,
          email: input.email,
          role: "STUDENT",
          passwordHash,
          studentProfile: {
            create: {
              studentNumber: input.studentNumber,
              gradeLevel: input.gradeLevel,
              graduationYear: schoolYearEnd + (12 - input.gradeLevel),
            },
          },
        },
        select: { studentProfile: { select: { id: true } } },
      });
      if (input.classCode) {
        await joinClassByCode(tx, user.studentProfile!.id, input.classCode);
      }
    });
  } catch (error) {
    if (error instanceof TRPCError) return { error: error.message };
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return {
        error:
          input.role === "TEACHER"
            ? "That employee number is already registered."
            : "That email or student number is already registered.",
      };
    }
    throw error;
  }

  try {
    await signIn("credentials", {
      email: input.email,
      password: input.password,
      redirectTo: homeForRole(input.role),
    });
  } catch (error) {
    // A successful sign-in throws NEXT_REDIRECT, which must bubble up.
    if (error instanceof AuthError) {
      return {
        error: "Your account was created. Please sign in.",
      };
    }
    throw error;
  }
  return { error: null };
}
