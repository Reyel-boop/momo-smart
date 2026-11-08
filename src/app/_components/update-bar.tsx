"use client";

import { useEffect, useState } from "react";

const CHECK_EVERY_MS = 5 * 60 * 1000;

/**
 * Pages left open (an iPad home-screen app, the phone app, a tab from
 * yesterday) keep showing the version they were opened with. This checks
 * now and then and, once a newer version is live, offers a one-tap refresh.
 * It never reloads by itself, so nothing being typed is lost.
 */
export function UpdateBar({ version }: { version: string }) {
  const [stale, setStale] = useState(false);

  useEffect(() => {
    if (version === "dev") return;
    let stopped = false;
    const check = () => {
      if (stopped || document.visibilityState === "hidden") return;
      fetch("/api/version", { cache: "no-store" })
        .then((res) => (res.ok ? res.json() : null))
        .then((data: { version?: string } | null) => {
          if (!stopped && data?.version && data.version !== version) {
            setStale(true);
          }
        })
        .catch(() => {
          // Offline: try again later.
        });
    };
    const timer = window.setInterval(check, CHECK_EVERY_MS);
    document.addEventListener("visibilitychange", check);
    window.addEventListener("focus", check);
    check();
    return () => {
      stopped = true;
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", check);
      window.removeEventListener("focus", check);
    };
  }, [version]);

  if (!stale) return null;
  return (
    <button
      type="button"
      onClick={() => window.location.reload()}
      className="bg-navy fixed bottom-4 left-1/2 z-[100] rounded-full px-5 py-3 text-sm font-bold whitespace-nowrap text-white shadow-lg"
      style={{ transform: "translateX(-50%)" }}
    >
      ✨ Momo was updated — tap to refresh
    </button>
  );
}
