import { type MetadataRoute } from "next";

/**
 * The web app manifest: makes Momo installable, and is what the Android app
 * (a Trusted Web Activity on Google Play) reads for its name, icon and
 * colors. It opens at sign-in, which sends signed-in people straight home.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Momo Smart",
    short_name: "Momo",
    description:
      "Lessons, quizzes, games, grades and attendance for students and teachers.",
    start_url: "/login",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#12275e",
    theme_color: "#12275e",
    categories: ["education", "productivity"],
    lang: "en",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
