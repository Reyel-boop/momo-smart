"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { PlayFillIcon } from "~/app/_components/icons";
import { api } from "~/trpc/react";

/** "Live Quiz is on!" — shown on every student page while a game is open. */
export function LiveBanner() {
  const pathname = usePathname();
  const { data: game } = api.live.mine.useQuery(undefined, {
    refetchInterval: 8000,
  });
  if (!game || pathname.startsWith("/student/live")) return null;
  return (
    <Link
      href="/student/live"
      className="flex items-center justify-center gap-3 bg-amber-400 px-4 py-2.5 text-sm font-extrabold text-[#0b1437] transition hover:bg-amber-300"
    >
      <PlayFillIcon className="size-4" />
      Live Quiz is on for {game.title}!{" "}
      <span className="underline">{game.joined ? "Go back" : "Join now"}</span>
    </Link>
  );
}
