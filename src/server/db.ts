import { env } from "~/env";
import { PrismaClient } from "../../generated/prisma";

/**
 * The database URL with a longer connect timeout: Neon pauses an idle
 * database and takes a few seconds to wake it, and a whole class signing in
 * at once can briefly make the pooler slow. Prisma's default of 5 seconds
 * turned those moments into "Can't reach database server" errors.
 */
function databaseUrl() {
  const raw = process.env.DATABASE_URL;
  if (!raw) return undefined;
  try {
    const url = new URL(raw);
    if (!url.searchParams.has("connect_timeout"))
      url.searchParams.set("connect_timeout", "20");
    if (!url.searchParams.has("pool_timeout"))
      url.searchParams.set("pool_timeout", "20");
    return url.toString();
  } catch {
    return raw;
  }
}

/** Errors that mean "the database could not be reached right now". */
const RETRYABLE = new Set(["P1001", "P1002", "P1017", "P2024"]);
const errorCode = (e: unknown) => {
  if (typeof e !== "object" || e === null) return undefined;
  const x = e as { code?: unknown; errorCode?: unknown };
  return typeof x.code === "string"
    ? x.code
    : typeof x.errorCode === "string"
      ? x.errorCode
      : undefined;
};
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const createPrismaClient = () =>
  new PrismaClient({
    datasourceUrl: databaseUrl(),
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  }).$extends({
    // A query that failed only because the database was briefly unreachable
    // is tried again (twice, after a short wait) instead of failing the page.
    query: {
      async $allOperations({ args, query }) {
        for (let attempt = 0; ; attempt++) {
          try {
            return (await query(args)) as unknown;
          } catch (e) {
            const code = errorCode(e);
            if (attempt >= 2 || !code || !RETRYABLE.has(code)) throw e;
            await sleep(500 * (attempt + 1));
          }
        }
      },
    },
  });

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Typed as the plain client: the retry extension changes no query shapes, and
// the code passes `db` to helpers that expect a PrismaClient.
export const db =
  globalForPrisma.prisma ?? (createPrismaClient() as unknown as PrismaClient);

// One client per server instance (also in production, where a warm
// serverless instance handles many requests).
globalForPrisma.prisma = db;
