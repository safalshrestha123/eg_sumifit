"use client";

import {
  Award,
  BadgeCheck,
  Bell,
  BookOpen,
  ChevronDown,
  ClipboardList,
  Dumbbell,
  Images,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Search,
  Settings,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { clearAuthSession, getStoredUser, type AuthUser } from "@/lib/api/client";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/profile", label: "Trainer profile", icon: UserRound },
  { href: "/admin/achievements", label: "Achievements", icon: Award },
  { href: "/admin/certifications", label: "Certifications", icon: BadgeCheck },
  { href: "/admin/programs", label: "Programs", icon: Dumbbell },
  { href: "/admin/enrollments", label: "Enrollments", icon: ClipboardList },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  { href: "/admin/testimonials", label: "Testimonials", icon: UsersRound },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/settings", label: "Settings", icon: Settings },
] as const;

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user] = useState<AuthUser | null>(getStoredUser);
  const currentPage = navigation.find((item) => item.href === pathname)?.label ?? "Admin";

  const logout = () => {
    clearAuthSession();
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-950 dark:bg-gray-950 dark:text-white">
      <a href="#admin-content" className="skip-link">Skip to admin content</a>

      {sidebarOpen && (
        <button type="button" className="fixed inset-0 z-40 bg-gray-950/60 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close navigation overlay" />
      )}

      <aside className={cn("fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-gray-200 bg-white transition-transform duration-200 dark:border-gray-800 dark:bg-gray-900 lg:translate-x-0", sidebarOpen ? "translate-x-0" : "-translate-x-full")} aria-label="Admin navigation">
        <div className="flex h-20 items-center justify-between border-b border-gray-100 px-6 dark:border-gray-800">
          <Link href="/admin/dashboard" className="flex items-center gap-3" onClick={() => setSidebarOpen(false)}>
            <span className="grid size-10 place-items-center rounded-2xl bg-orange-500 text-white"><Dumbbell className="size-5" /></span>
            <span><span className="block font-black tracking-tight">SUMI<span className="text-orange-500">FITNESS</span></span><span className="block text-[0.65rem] font-bold uppercase tracking-[0.2em] text-gray-400">Content Studio</span></span>
          </Link>
          <Button type="button" variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close navigation"><X className="size-5" /></Button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <p className="px-3 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-gray-400">Manage website</p>
          <div className="mt-3 space-y-1">
            {navigation.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link key={href} href={href} aria-current={active ? "page" : undefined} onClick={() => setSidebarOpen(false)} className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition", active ? "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300" : "text-gray-600 hover:bg-gray-100 hover:text-gray-950 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white")}>
                  <Icon className="size-4.5" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-gray-100 p-4 dark:border-gray-800">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-gray-50 p-3 dark:bg-gray-800/70">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gray-950 text-xs font-black text-white dark:bg-white dark:text-gray-950">SF</span>
            <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{user?.email ?? "SumiFitness"}</p><p className="truncate text-xs capitalize text-gray-500">{user?.role.toLowerCase() ?? "CMS user"}</p></div>
            <ChevronDown className="size-4 text-gray-400" />
          </div>
          <button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"><LogOut className="size-4" /> Log out</button>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b border-gray-200 bg-white/90 px-4 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-900/90 sm:px-6 lg:px-8">
          <Button type="button" variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open navigation" aria-expanded={sidebarOpen}><Menu className="size-5" /></Button>
          <div className="min-w-0"><p className="truncate text-sm font-bold sm:text-base">{currentPage}</p><p className="hidden text-xs text-gray-500 sm:block">Manage your SumiFitness website content</p></div>
          <div className="relative ml-auto hidden w-full max-w-xs md:block">
            <Search className="pointer-events-none absolute ml-3 mt-3.5 size-4 text-gray-400" />
            <Input type="search" aria-label="Search admin" placeholder="Search content…" className="h-11 bg-gray-50 pl-10 dark:bg-gray-950" />
          </div>
          <Button type="button" variant="ghost" size="icon" aria-label="Notifications" className="relative"><Bell className="size-5" /><span className="absolute right-2 top-2 size-2 rounded-full bg-orange-500" /></Button>
          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex"><Link href="/"><BookOpen className="size-4" /> View site</Link></Button>
        </header>

        <main id="admin-content" className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
