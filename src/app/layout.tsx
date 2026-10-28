import "~/styles/globals.css";

import { type Metadata, type Viewport } from "next";
import { Geist } from "next/font/google";

import { ServiceWorker } from "~/app/_components/service-worker";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "Momo Smart · Learning Management",
  description:
    "Courses, lessons, grading, assessments and attendance for schools — one command center for the whole school day.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      // Fallback for browsers without SVG favicon support.
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: { capable: true, title: "Momo", statusBarStyle: "default" },
};

/** The app bar color when installed (and in the Android app). */
export const viewport: Viewport = { themeColor: "#12275e" };

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body className="font-sans antialiased">
        <TRPCReactProvider>{children}</TRPCReactProvider>
        <ServiceWorker />
      </body>
    </html>
  );
}
