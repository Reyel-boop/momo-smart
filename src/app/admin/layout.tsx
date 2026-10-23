import { type Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { LogoMark } from "~/app/_components/brand";
import {
  CapIcon,
  GridIcon,
  ListIcon,
  SettingsIcon,
  UsersIcon,
} from "~/app/_components/icons";
import { Nav, type NavItem } from "~/app/_components/nav";
import { Avatar } from "~/app/_components/ui";
import { logout } from "~/app/login/actions";
import { auth } from "~/server/auth";
import { homeForRole } from "~/server/auth/home";

export const metadata: Metadata = {
  title: "Admin · Momo Smart",
  description: "Accounts, classes and enrollment for the school.",
};

const ITEMS: NavItem[] = [
  { label: "Overview", href: "/admin", exact: true },
  { label: "People", href: "/admin/people" },
  { label: "Sections", href: "/admin/sections" },
  { label: "Classes", href: "/admin/classes" },
  { label: "Settings", href: "/admin/settings" },
];

const ICONS: Record<string, React.ReactNode> = {
  Overview: <GridIcon className="size-[18px]" />,
  People: <UsersIcon className="size-[18px]" />,
  Sections: <ListIcon className="size-[18px]" />,
  Classes: <CapIcon className="size-[18px]" />,
  Settings: <SettingsIcon className="size-[18px]" />,
};

/** The registrar's portal: accounts, classes and enrollment. */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect(homeForRole(session.user.role));
  if (session.user.mustChangePassword) redirect("/account/password");
  const name = session.user.name ?? "Registrar";

  return (
    <div className="bg-canvas flex min-h-screen">
      <aside className="border-line bg-surface hidden w-[248px] shrink-0 flex-col border-r lg:flex">
        <div className="flex flex-1 flex-col px-4 py-5">
          <div className="flex items-start gap-3 px-1">
            <LogoMark className="size-9 shrink-0" />
            <div className="min-w-0">
              <p className="text-ink text-lg leading-tight font-extrabold tracking-tight">
                Momo Smart
              </p>
              <p className="text-muted text-[11px] font-bold tracking-wide uppercase">
                School Admin
              </p>
            </div>
          </div>
          <Nav items={ITEMS} icons={ICONS} />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-line bg-surface/90 sticky top-0 z-10 border-b backdrop-blur">
          <div className="flex items-center gap-3 px-5 py-3">
            <nav
              aria-label="Admin"
              className="flex gap-1 overflow-x-auto lg:hidden"
            >
              {ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-ink hover:bg-canvas rounded-lg px-3 py-1.5 text-sm font-semibold whitespace-nowrap"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <form action={logout} className="ml-auto flex items-center">
              <button
                type="submit"
                className="hover:bg-canvas flex items-center gap-3 rounded-xl py-1 pr-2 pl-1 transition"
                title={`${name} — sign out`}
              >
                <span className="sr-only">Sign out</span>
                <Avatar name={name} size="lg" />
                <span className="hidden text-left xl:block">
                  <span className="text-ink block text-sm font-bold">
                    {name}
                  </span>
                  <span className="text-muted block text-[11px] font-semibold">
                    Sign out
                  </span>
                </span>
              </button>
            </form>
          </div>
        </header>
        <main className="flex-1 p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
