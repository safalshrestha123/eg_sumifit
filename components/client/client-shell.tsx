"use client";

import { Dumbbell, Home, LayoutDashboard, LogOut, Menu, UserRound, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { authSessionChangedEvent, clearAuthSession, getStoredUser, type AuthUser } from "@/lib/api/client";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/client/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/client/profile", label: "My profile", icon: UserRound },
] as const;

export function ClientShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(getStoredUser);

  useEffect(() => {
    const refreshUser = () => setUser(getStoredUser());
    window.addEventListener(authSessionChangedEvent, refreshUser);
    return () => window.removeEventListener(authSessionChangedEvent, refreshUser);
  }, []);

  const logout = () => {
    clearAuthSession();
    router.replace("/client/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-950 dark:bg-gray-950 dark:text-white">
      <a href="#client-content" className="skip-link">Skip to client content</a>
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-900/90">
        <div className="mx-auto flex h-18 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/client/dashboard" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-2xl bg-orange-500 text-white"><Dumbbell className="size-5" /></span>
            <span><span className="block text-sm font-black tracking-tight">SUMI<span className="text-orange-500">FITNESS</span></span><span className="block text-[0.6rem] font-bold uppercase tracking-[0.2em] text-gray-400">Client portal</span></span>
          </Link>

          <nav className="ml-8 hidden items-center gap-1 md:flex" aria-label="Client navigation">
            {navigation.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={cn("flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition", active ? "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300" : "text-gray-500 hover:bg-gray-100 hover:text-gray-950 dark:hover:bg-gray-800 dark:hover:text-white")}><Icon className="size-4" />{label}</Link>;
            })}
          </nav>

          <div className="ml-auto hidden items-center gap-3 sm:flex">
            <div className="hidden text-right lg:block"><p className="max-w-56 truncate text-sm font-bold">{user?.email ?? "Client account"}</p><p className="text-xs text-gray-400">Fitness client</p></div>
            <Button asChild variant="ghost" size="icon"><Link href="/" aria-label="View public website"><Home className="size-5" /></Link></Button>
            <Button type="button" variant="outline" size="sm" onClick={logout}><LogOut className="size-4" /> Log out</Button>
          </div>
          <Button type="button" variant="ghost" size="icon" className="ml-auto md:hidden" onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen}>{menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}</Button>
        </div>
        {menuOpen && (
          <nav className="border-t border-gray-100 px-4 py-4 dark:border-gray-800 md:hidden" aria-label="Mobile client navigation">
            <div className="mx-auto max-w-7xl space-y-1">
              {navigation.map(({ href, label, icon: Icon }) => <Link key={href} href={href} onClick={() => setMenuOpen(false)} className={cn("flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold", pathname === href ? "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300" : "text-gray-500")}><Icon className="size-4" />{label}</Link>)}
              <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-gray-500"><Home className="size-4" /> Public website</Link>
              <button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-600"><LogOut className="size-4" /> Log out</button>
            </div>
          </nav>
        )}
      </header>
      <main id="client-content" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">{children}</main>
    </div>
  );
}
