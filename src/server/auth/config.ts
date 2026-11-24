import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

import { db } from "~/server/db";
import { checkAskReyelPass } from "./askreyel";
import { accountWhere } from "./identifier";
import type { UserRole } from "../../../generated/prisma";

/**
 * Module augmentation for `next-auth`. The session carries the caller's role
 * plus the ids of their academic profiles so that authorisation checks in the
 * tRPC layer never have to re-resolve them.
 *
 * @see https://authjs.dev/getting-started/typescript
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: UserRole;
      /** Set when the user is a student. */
      studentId: string | null;
      /** Set when the user is a teacher. */
      teacherId: string | null;
      /** Signed in with a temporary password that must be changed first. */
      mustChangePassword: boolean;
      /** The person's school (for the owner, the school they're working in). */
      schoolId: string | null;
      /** The Momo owner, who creates schools and can switch between them. */
      isOwner: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    role?: UserRole;
    studentId?: string | null;
    teacherId?: string | null;
  }
}

/**
 * What we carry on the session token beyond the NextAuth defaults.
 *
 * The `JWT` interface is not augmented here: next-auth and @auth/prisma-adapter
 * resolve to different copies of `@auth/core`, so an augmentation would attach
 * to the wrong one. The token is a `Record<string, unknown>`, so the claims are
 * written as plain fields and read back through `readClaims`.
 */
type SessionClaims = {
  id: string;
  role: UserRole;
  studentId: string | null;
  teacherId: string | null;
  mustChangePassword: boolean;
  schoolId: string | null;
  isOwner: boolean;
};

const ROLES: UserRole[] = ["STUDENT", "TEACHER", "ADMIN"];

const asString = (value: unknown): string | null =>
  typeof value === "string" && value.length > 0 ? value : null;

function readClaims(token: Record<string, unknown>): SessionClaims {
  const role = token.role;
  return {
    id: asString(token.id) ?? "",
    role: ROLES.includes(role as UserRole) ? (role as UserRole) : "STUDENT",
    studentId: asString(token.studentId),
    teacherId: asString(token.teacherId),
    mustChangePassword: token.mustChangePassword === true,
    schoolId: asString(token.schoolId),
    isOwner: token.isOwner === true,
  };
}

/** `email` holds an email address or, for some students, their LRN. */
const credentialsSchema = z.object({
  email: z.string().trim().min(1).max(200),
  password: z.string().min(1),
});

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * Sign-in is email + password against the `User.passwordHash` column. Credential
 * sign-in cannot use database sessions, so the session is a JWT and the role /
 * profile ids are carried on the token.
 *
 * @see https://authjs.dev/getting-started/authentication/credentials
 */
const ACCOUNT_TTL_MS = 30_000;
const accountCache = new Map<string, { at: number; row: AccountRow | null }>();
type AccountRow = Awaited<ReturnType<typeof readAccount>>;
function readAccount(id: string) {
  return db.user.findUnique({
    where: { id },
    select: {
      isActive: true,
      role: true,
      mustChangePassword: true,
      schoolId: true,
      isOwner: true,
      studentProfile: { select: { id: true } },
      teacherProfile: { select: { id: true } },
    },
  });
}
async function accountOf(id: string) {
  const hit = accountCache.get(id);
  if (hit && Date.now() - hit.at < ACCOUNT_TTL_MS) return hit.row;
  const row = await readAccount(id);
  // Accounts that must still change their password are always re-read, so
  // the change applies on the very next page (no loop back to the form).
  if (row && !row.mustChangePassword) {
    if (accountCache.size > 5000) accountCache.clear();
    accountCache.set(id, { at: Date.now(), row });
  } else accountCache.delete(id);
  return row;
}
/** Forget a cached account (after a password change, deactivation, etc.). */
export function forgetAccount(id: string) {
  accountCache.delete(id);
}

export const authConfig = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
    // A school day plus a margin; re-authentication is cheap.
    maxAge: 12 * 60 * 60,
  },
  // Momo also runs inside the School Hub (another site, in a frame). Browsers
  // drop the default SameSite=Lax cookies there, so sign-in never sticks.
  // In production the auth cookies are SameSite=None and Partitioned (kept
  // per top-level site), which works both in the Hub and in its own tab.
  ...(process.env.NODE_ENV === "production" && {
    cookies: {
      sessionToken: {
        name: "__Secure-authjs.session-token",
        options: {
          httpOnly: true,
          sameSite: "none",
          path: "/",
          secure: true,
          partitioned: true,
        },
      },
      callbackUrl: {
        name: "__Secure-authjs.callback-url",
        options: {
          sameSite: "none",
          path: "/",
          secure: true,
          partitioned: true,
        },
      },
      csrfToken: {
        name: "__Host-authjs.csrf-token",
        options: {
          httpOnly: true,
          sameSite: "none",
          path: "/",
          secure: true,
          partitioned: true,
        },
      },
    },
  }),
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Credentials({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (raw) => {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;

        const user = await db.user.findFirst({
          where: accountWhere(parsed.data.email),
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            isActive: true,
            passwordHash: true,
            studentProfile: { select: { id: true } },
            teacherProfile: { select: { id: true } },
          },
        });

        // Same failure for unknown accounts and bad passwords, so the form
        // cannot be used to enumerate who has an account.
        if (!user?.passwordHash || !user.isActive) return null;

        const valid = await compare(parsed.data.password, user.passwordHash);
        if (!valid) return null;

        await db.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          studentId: user.studentProfile?.id ?? null,
          teacherId: user.teacherProfile?.id ?? null,
        };
      },
    }),
    // Opened from AskReyel: its sign-in pass stands in for the password.
    Credentials({
      id: "askreyel",
      name: "AskReyel",
      credentials: { pass: { type: "text" } },
      authorize: async (raw) => {
        const pass = typeof raw?.pass === "string" ? raw.pass : "";
        const who = pass ? await checkAskReyelPass(pass) : null;
        if (!who?.email) return null;

        const user = await db.user.findFirst({
          where: { email: { equals: who.email, mode: "insensitive" } },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            isActive: true,
            mustChangePassword: true,
            studentProfile: { select: { id: true } },
            teacherProfile: { select: { id: true } },
          },
        });
        if (!user?.isActive) return null;

        await db.user.update({
          where: { id: user.id },
          data: {
            lastLoginAt: new Date(),
            // A temporary password from a reset isn't needed any more: AskReyel
            // is how they sign in. Clear it so it can't be used by anyone else.
            ...(user.mustChangePassword && {
              mustChangePassword: false,
              passwordHash: null,
            }),
          },
        });
        forgetAccount(user.id);

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          studentId: user.studentProfile?.id ?? null,
          teacherId: user.teacherProfile?.id ?? null,
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      // On sign-in the authorize() result is available and already authoritative.
      if (user) {
        const claims: SessionClaims = {
          id: asString(user.id) ?? "",
          role: user.role ?? "STUDENT",
          studentId: user.studentId ?? null,
          teacherId: user.teacherId ?? null,
          // Read on the next request, from the account row below.
          mustChangePassword: false,
          schoolId: null,
          isOwner: false,
        };
        return { ...token, ...claims };
      }

      const current = readClaims(token);
      if (!current.id) return null;

      // A JWT outlives the row it describes, so the account is re-read:
      // deleted or deactivated users lose access, and role or profile changes
      // apply without a fresh sign-in. The answer is reused for 30 seconds per
      // server instance, so a class of students clicking around doesn't send
      // one lookup per request. If the database is briefly unreachable, the
      // student stays signed in with the claims they already have instead of
      // being signed out or shown an error.
      let account: AccountRow | null;
      try {
        account = await accountOf(current.id);
      } catch (e) {
        console.error("[auth] account check skipped (database busy)", e);
        return token;
      }

      // Returning null invalidates the session; the caller sees a signed-out
      // visitor rather than a 500 from a dangling user id.
      if (!account?.isActive) return null;

      return {
        ...token,
        role: account.role,
        studentId: account.studentProfile?.id ?? null,
        teacherId: account.teacherProfile?.id ?? null,
        mustChangePassword: account.mustChangePassword,
        schoolId: account.schoolId,
        isOwner: account.isOwner,
      };
    },
    session: ({ session, token }) => {
      const claims = readClaims(token);
      return {
        ...session,
        user: { ...session.user, ...claims },
      };
    },
  },
} satisfies NextAuthConfig;
