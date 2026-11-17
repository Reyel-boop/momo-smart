import Link from "next/link";

import {
  BellIcon,
  HelpIcon,
  PlusCircleIcon,
  SearchIcon,
} from "~/app/_components/icons";
import { UserMenu } from "~/app/_components/user-menu";

export function Topbar({
  termName,
  studentName,
  studentNumber,
  unreadNotifications,
  email,
  image,
}: {
  termName: string;
  studentName: string;
  studentNumber: string;
  unreadNotifications: number;
  email: string | null;
  image: string | null;
}) {
  return (
    <header className="border-line bg-surface/90 sticky top-0 z-10 border-b backdrop-blur">
      <div className="flex items-center gap-4 py-3 pr-5 pl-16 lg:pl-5">
        <span className="text-ink min-w-0 truncate px-2 py-1.5 text-sm font-bold">
          {termName}
        </span>

        <form
          action="/student/search"
          role="search"
          className="relative hidden max-w-md min-w-0 flex-1 md:block"
        >
          <label htmlFor="topbar-search" className="sr-only">
            Search
          </label>
          <SearchIcon className="text-muted absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <input
            id="topbar-search"
            type="search"
            name="q"
            placeholder="Search courses, lessons, assignments…"
            className="border-line bg-canvas text-ink placeholder:text-muted focus:border-brand focus:bg-surface focus:ring-brand/10 w-full rounded-xl border py-2.5 pr-4 pl-9 text-sm transition outline-none focus:ring-4"
          />
        </form>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Link
            href="/student/assignments"
            className="bg-brand hover:bg-brand/90 hidden items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition sm:inline-flex"
          >
            <PlusCircleIcon className="size-4" />
            New Submission
          </Link>
          <Link
            href="/student/notifications"
            className="text-muted hover:bg-canvas hover:text-ink relative rounded-lg p-2 transition"
            aria-label={`Notifications${unreadNotifications > 0 ? ` (${unreadNotifications} unread)` : ""}`}
          >
            <BellIcon className="size-5" />
            {unreadNotifications > 0 && (
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-orange-500" />
            )}
          </Link>
          <Link
            href="/student/help"
            className="text-muted hover:bg-canvas hover:text-ink rounded-lg p-2 transition"
            aria-label="Help"
          >
            <HelpIcon className="size-5" />
          </Link>

          <UserMenu
            name={studentName}
            subtitle={`ID: #${studentNumber}`}
            email={email}
            image={image}
            base="/student"
          />
        </div>
      </div>
    </header>
  );
}
