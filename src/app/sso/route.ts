import { AuthError } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";

import { signIn } from "~/server/auth";
import { checkAskReyelPass } from "~/server/auth/askreyel";
import { homeForRole } from "~/server/auth/home";
import { db } from "~/server/db";

/**
 * Arrival from AskReyel: /sso?pass=… signs in the Momo account that has the
 * same email as the AskReyel account, then opens its home page.
 */
export async function GET(req: NextRequest) {
  const pass = req.nextUrl.searchParams.get("pass") ?? "";
  const back = (reason: string) =>
    NextResponse.redirect(new URL(`/login?askreyel=${reason}`, req.nextUrl));

  const who = pass ? await checkAskReyelPass(pass) : null;
  if (!who) return back("expired");
  if (!who.email) return back("noemail");

  const account = await db.user.findFirst({
    where: { email: { equals: who.email, mode: "insensitive" } },
    select: { role: true, isActive: true },
  });
  if (!account) return back("nomatch");
  if (!account.isActive) return back("off");

  try {
    await signIn("askreyel", {
      pass,
      redirectTo: homeForRole(account.role),
    });
  } catch (error) {
    if (error instanceof AuthError) return back("expired");
    throw error; // the successful sign-in's redirect
  }
  return back("expired");
}
