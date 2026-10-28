import { env } from "~/env";

/**
 * Digital Asset Links: tells Android that the Momo app on Google Play and
 * this website belong together, so the app opens Momo full-screen with no
 * browser bar. The app's package name and its signing key's SHA-256
 * fingerprint(s) come from the environment (from Play Console's App
 * integrity page).
 */
export function GET() {
  const fingerprints = (env.ANDROID_SHA256_FINGERPRINTS ?? "")
    .split(",")
    .map((f) => f.trim().toUpperCase())
    .filter(Boolean);
  const statements =
    env.ANDROID_PACKAGE_NAME && fingerprints.length
      ? [
          {
            relation: ["delegate_permission/common.handle_all_urls"],
            target: {
              namespace: "android_app",
              package_name: env.ANDROID_PACKAGE_NAME,
              sha256_cert_fingerprints: fingerprints,
            },
          },
        ]
      : [];
  return Response.json(statements, {
    headers: { "Cache-Control": "public, max-age=3600" },
  });
}
