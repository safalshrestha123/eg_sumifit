import { ArrowUpRight, Camera, Play } from "lucide-react";
import Link from "next/link";

import { navItems, siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-950 text-white">
      <div className="container-shell grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="text-2xl font-black">SUMI<span className="text-orange-500">FITNESS</span></p>
          <p className="mt-4 max-w-sm text-sm leading-7 text-gray-400">Strength-first coaching for sustainable results, greater confidence, and a life that feels as strong as it looks.</p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">Explore</p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {navItems.slice(1).map((item) => <Link key={item.href} href={item.href} className="text-sm text-gray-300 transition hover:text-orange-400">{item.label}</Link>)}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">Connect</p>
          <div className="mt-5 flex gap-3">
            <a href={siteConfig.instagram} target="_blank" rel="noreferrer" className="social-button" aria-label="Instagram"><Camera className="size-5" /></a>
            <a href={siteConfig.youtube} target="_blank" rel="noreferrer" className="social-button" aria-label="YouTube"><Play className="size-5" /></a>
            <a href={`mailto:${siteConfig.email}`} className="social-button" aria-label="Email SumiFitness"><ArrowUpRight className="size-5" /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800">
        <div className="container-shell flex flex-col gap-2 py-6 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} SumiFitness. All rights reserved.</p>
          <p>Train strong. Live confident.</p>
        </div>
      </div>
    </footer>
  );
}
