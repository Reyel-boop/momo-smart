"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AUTO_TRIES = 3;
const WAIT_SECONDS = 5;

/**
 * Shown when a page fails to load, usually because the database was briefly
 * busy (for example when a whole class signs in at once). Instead of a broken
 * page, Momo says so and tries again by itself a few times.
 */
export default function PageError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const [tries] = useState(() => {
    try {
      const key = `momo-retry:${location.pathname}`;
      const [n, at] = (sessionStorage.getItem(key) ?? "0:0")
        .split(":")
        .map(Number);
      // Start counting again after a quiet minute.
      const next = Date.now() - (at ?? 0) > 60_000 ? 1 : (n ?? 0) + 1;
      sessionStorage.setItem(key, `${next}:${Date.now()}`);
      return next;
    } catch {
      return AUTO_TRIES + 1;
    }
  });
  const auto = tries <= AUTO_TRIES;
  const [left, setLeft] = useState(WAIT_SECONDS);

  useEffect(() => {
    console.error(error);
  }, [error]);

  const retry = () => {
    router.refresh();
    reset();
  };

  useEffect(() => {
    if (!auto) return;
    if (left <= 0) {
      retry();
      return;
    }
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto, left]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6 py-16">
      <div className="max-w-md text-center">
        <p className="text-5xl" aria-hidden="true">
          🐢
        </p>
        <h1 className="text-ink mt-4 text-2xl font-extrabold">
          Momo is a little busy
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed">
          Many students are using Momo right now, so this page didn&apos;t load.
          Your work is safe.
          {auto
            ? ` Trying again in ${left} second${left === 1 ? "" : "s"}…`
            : " Please tap Try again in a moment."}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={retry}
            className="bg-navy hover:bg-navy-deep rounded-xl px-6 py-3 text-sm font-bold text-white transition"
          >
            Try again
          </button>
          <button
            type="button"
            onClick={() => location.assign("/")}
            className="border-line text-ink hover:bg-canvas rounded-xl border px-6 py-3 text-sm font-bold transition"
          >
            Go home
          </button>
        </div>
      </div>
    </div>
  );
}
