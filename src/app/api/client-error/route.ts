/**
 * Receives script errors reported by browsers (see OLD_BROWSER_SCRIPT) and
 * writes them to the server log, so problems on devices we can't test, such
 * as iPads on iOS 12, can be read with `vercel logs`. Nothing is stored.
 */
export async function POST(request: Request) {
  const text = (await request.text()).slice(0, 4000);
  console.error("[client-error]", text);
  return new Response(null, { status: 204 });
}
