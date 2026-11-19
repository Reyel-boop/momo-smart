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
    // Neon's "-pooler" address is PgBouncer: tell Prisma, as Neon recommends.
    if (url.hostname.includes("-pooler") && !url.searchParams.has("pgbouncer"))
      url.searchParams.set("pgbouncer", "true");
    return url.toString();
  } catch {
    return raw;
  }
}

/** Errors that mean "the database could not be reached right now". */
const RETRYABLE = new Set(["P1001", "P1002", "P1017", "P2024"]);
const UNREACHABLE =
  /can't reach database server|timed out fetching a new connection|connection (?:was )?(?:closed|reset|terminated)|server has closed the connection|ECONNRESET|ETIMEDOUT/i;
// Prisma doesn't always attach a code: "Can't reach database server" arrives
// as an initialization error with errorCode undefined. Check the message too.
const isUnreachable = (e: unknown) => {
  if (typeof e !== "object" || e === null) return false;
  const x = e as { code?: unknown; errorCode?: unknown; message?: unknown };
  const code =
    typeof x.code === "string"
      ? x.code
      : typeof x.errorCode === "string"
        ? x.errorCode
        : "";
  return (
    RETRYABLE.has(code) ||
    (typeof x.message === "string" && UNREACHABLE.test(x.message))
  );
};
const WAITS_MS = [500, 1500, 3000];

/*
 * A short memory of answers that almost never change, so a class of students
 * opening pages doesn't ask the (small, free) database the same thing again
 * and again. Each server keeps its own copy; any change to that table made
 * through this server clears it at once, and every copy expires on its own.
 */
const READS = new Set([
  "findFirst",
  "findFirstOrThrow",
  "findUnique",
  "findUniqueOrThrow",
  "findMany",
  "count",
]);
const KEEP_MS: Record<string, number> = {
  Term: 60_000, // the current school term
  School: 60_000,
  Notification: 15_000, // the unread badge, asked on every page
};
const memory = new Map<string, { at: number; value: Promise<unknown> }>();
function forgetModel(model: string) {
  for (const key of memory.keys())
    if (key.startsWith(model + ":")) memory.delete(key);
}
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const createPrismaClient = () =>
  new PrismaClient({
    datasourceUrl: databaseUrl(),
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  }).$extends({
    // A query that failed only because the database was briefly unreachable
    // is tried again (up to 3 times, waiting a little longer each time)
    // instead of failing the page.
    query: {
      async $allOperations({ model, operation, args, query }) {
        const keep = model ? KEEP_MS[model] : undefined;
        if (keep && model) {
          if (!READS.has(operation)) forgetModel(model);
          // Notifications: only the unread count is kept, not the lists.
          else if (model !== "Notification" || operation === "count") {
            const key = `${model}:${operation}:${JSON.stringify(args)}`;
            const hit = memory.get(key);
            if (hit && Date.now() - hit.at < keep) return hit.value;
            const value = runWithRetry(() => query(args));
            if (memory.size > 2000) memory.clear();
            memory.set(key, { at: Date.now(), value });
            value.catch(() => memory.delete(key));
            return value;
          }
        }
        return runWithRetry(() => query(args));
      },
    },
  });

async function runWithRetry(run: () => Promise<unknown>): Promise<unknown> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await run();
    } catch (e) {
      if (attempt >= WAITS_MS.length || !isUnreachable(e)) throw e;
      await sleep(WAITS_MS[attempt]!);
    }
  }
}

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
