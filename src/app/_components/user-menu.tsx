"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { logout } from "~/app/login/actions";
import { Avatar } from "~/app/_components/ui";

/**
 * The name and picture in the top bar: opens a menu for the profile, the
 * profile picture, the email address, settings and signing out.
 */
export function UserMenu({
  name,
  subtitle,
  email,
  image,
  base,
  showText = true,
  profileHref,
}: {
  name: string;
  /** "ID: #123" for students, the department for teachers. */
  subtitle: string;
  email: string | null;
  image: string | null;
  /** "/student" or "/teacher" */
  base: string;
  showText?: boolean;
  /** The "My profile" page (defaults to the profile part of Settings). */
  profileHref?: string;
}) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", away);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  const settings = `${base}/settings`;
  const item =
    "text-ink hover:bg-canvas flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold transition";

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="hover:bg-canvas flex items-center gap-3 rounded-xl py-1 pr-2 pl-1 text-left transition"
      >
        <Avatar name={name} src={image} size="lg" />
        {showText && (
          <span className="hidden min-w-0 xl:block">
            <span className="text-ink block text-sm font-bold">{name}</span>
            <span className="text-muted block text-[11px] font-semibold">
              {subtitle}
            </span>
          </span>
        )}
        <span className="sr-only">Open the account menu</span>
      </button>

      {open && (
        <div
          role="menu"
          className="border-line bg-surface shadow-card absolute right-0 z-30 mt-2 w-72 rounded-2xl border p-2"
        >
          <div className="flex items-center gap-3 px-3 py-2">
            <Avatar name={name} src={image} size="lg" />
            <div className="min-w-0">
              <p className="text-ink truncate text-sm font-bold">{name}</p>
              <p className="text-muted truncate text-xs">{subtitle}</p>
              <p className="text-muted truncate text-xs">
                {email ?? "No email address yet"}
              </p>
            </div>
          </div>
          <div className="border-line my-1 border-t" />
          <Link
            role="menuitem"
            href={profileHref ?? `${settings}#profile`}
            className={item}
            onClick={() => setOpen(false)}
          >
            My profile
          </Link>
          <Link
            role="menuitem"
            href={`${settings}#photo`}
            className={item}
            onClick={() => setOpen(false)}
          >
            Profile picture
            {!image && (
              <span className="text-brand text-[11px] font-bold">Add</span>
            )}
          </Link>
          <Link
            role="menuitem"
            href={`${settings}#email`}
            className={item}
            onClick={() => setOpen(false)}
          >
            Email address
            {!email && (
              <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-bold text-rose-700">
                Add
              </span>
            )}
          </Link>
          <Link
            role="menuitem"
            href={settings}
            className={item}
            onClick={() => setOpen(false)}
          >
            Settings &amp; password
          </Link>
          <div className="border-line my-1 border-t" />
          <form action={logout}>
            <button
              type="submit"
              role="menuitem"
              className={`${item} text-rose-600`}
            >
              Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
