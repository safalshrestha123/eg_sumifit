"use client";

import { Dumbbell, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { navItems } from "@/lib/site";

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200/70 bg-white/90 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/90">
      <nav className="container-shell flex h-18 items-center justify-between" aria-label="Primary navigation">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-base font-black tracking-tight sm:text-lg" aria-label="SumiFitness home">
          <span className="grid size-10 place-items-center rounded-full bg-orange-500 text-white"><Dumbbell className="size-5" /></span>
          <span>SUMI<span className="text-orange-500">FITNESS</span></span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined} className={cn("rounded-full px-3 py-2 text-sm font-medium text-gray-600 transition hover:text-orange-600 dark:text-gray-300", pathname === item.href && "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400")}>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <ThemeToggle />
          <Button asChild size="sm" className="hidden sm:inline-flex"><Link href="/contact">Book consultation</Link></Button>
          <Button type="button" variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsOpen((value) => !value)} aria-expanded={isOpen} aria-controls="mobile-menu" aria-label={isOpen ? "Close menu" : "Open menu"}>
            {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </nav>

      {isOpen && (
        <div id="mobile-menu" className="border-t border-gray-200 bg-white px-4 py-5 dark:border-gray-800 dark:bg-gray-950 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined} onClick={() => setIsOpen(false)} className={cn("rounded-xl px-4 py-3 font-medium text-gray-700 dark:text-gray-200", pathname === item.href && "bg-orange-50 text-orange-600 dark:bg-orange-500/10")}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
