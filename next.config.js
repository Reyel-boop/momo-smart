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
};

export default config;
