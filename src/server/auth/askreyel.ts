import { createPublicKey, verify, type KeyObject } from "node:crypto";

/**
 * One AskReyel account for every system. AskReyel (the School Hub) sends
 * people here with a short sign-in pass it signed; the pass names their
 * AskReyel email, and the Momo account with that email is signed in. Momo
 * checks the signature against AskReyel's public key, so nobody can make a
 * pass without AskReyel.
 */
import { ASKREYEL_URL } from "~/lib/askreyel";

export { ASKREYEL_SIGN_IN, ASKREYEL_URL } from "~/lib/askreyel";

export type AskReyelPass = {
  u: string;
  name: string | null;
  email: string | null;
  role: string;
};

let key: { at: number; value: KeyObject } | null = null;
async function publicKey(): Promise<KeyObject> {
  if (key && Date.now() - key.at < 6 * 60 * 60 * 1000) return key.value;
  const res = await fetch(`${ASKREYEL_URL}/api/sso?pub`, { cache: "no-store" });
  if (!res.ok) throw new Error(`AskReyel key: HTTP ${res.status}`);
  const { spki } = (await res.json()) as { spki: string };
  const value = createPublicKey({
    key: Buffer.from(spki, "base64"),
    format: "der",
    type: "spki",
  });
  key = { at: Date.now(), value };
  return value;
}

/** The pass's owner, or null if it is forged, expired or meant for another system. */
export async function checkAskReyelPass(
  pass: string,
): Promise<AskReyelPass | null> {
  const [data, sig] = pass.split(".");
  if (!data || !sig) return null;
  try {
    const ok = verify(
      null,
      Buffer.from(data),
      await publicKey(),
      Buffer.from(sig, "base64url"),
    );
    if (!ok) return null;
    const p = JSON.parse(Buffer.from(data, "base64url").toString()) as {
      u?: unknown;
      name?: unknown;
      email?: unknown;
      role?: unknown;
      aud?: unknown;
      exp?: unknown;
    };
    if (p.aud !== "momo" || typeof p.exp !== "number" || p.exp < Date.now())
      return null;
    if (typeof p.u !== "string") return null;
    return {
      u: p.u,
      name: typeof p.name === "string" ? p.name : null,
      email: typeof p.email === "string" ? p.email.trim().toLowerCase() : null,
      role: typeof p.role === "string" ? p.role : "",
    };
  } catch (e) {
    console.error("[auth] AskReyel pass check failed", e);
    return null;
  }
}
