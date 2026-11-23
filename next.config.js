/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  // These libraries ship modern syntax (private class fields, ?.) that old
  // iPads and iPhones on iOS 12 (Safari 12) cannot read, and one unreadable
  // file stops every button in the app. Compile them down like our own code.
  transpilePackages: [
    "@tanstack/react-query",
    "@tanstack/query-core",
    "@trpc/client",
    "@trpc/react-query",
    "@trpc/server",
    "superjson",
    "next-auth",
    "@auth/core",
    "@vercel/blob",
    "@vercel/oidc",
    "three",
  ],
  // Momo's own address is www.momo-smart.com: visitors on the old
  // momo-smart.vercel.app address are sent there (same page). API calls and
  // /.well-known stay on the old address so nothing in progress breaks.
  async redirects() {
    return [
      {
        source: "/:path((?!api/|\\.well-known/).*)",
        has: [{ type: "host", value: "momo-smart.vercel.app" }],
        destination: "https://www.momo-smart.com/:path",
        permanent: false,
      },
    ];
  },
};

export default config;
