/** The running version, so open pages can tell when a newer one is live. */
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(
    { version: process.env.VERCEL_DEPLOYMENT_ID ?? "dev" },
    { headers: { "Cache-Control": "no-store" } },
  );
}
