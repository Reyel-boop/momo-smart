import type { Prisma } from "../../../generated/prisma";

/**
 * What a person types to sign in: their email, or — for students added from
 * School Form 1, who may have no email — their LRN (student number).
 */
export function accountWhere(identifier: string): Prisma.UserWhereInput {
  const value = identifier.trim();
  return value.includes("@")
    ? { email: value.toLowerCase() }
    : { studentProfile: { studentNumber: value } };
}
