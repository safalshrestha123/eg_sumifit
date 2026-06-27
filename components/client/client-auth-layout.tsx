import { Dumbbell, ShieldCheck } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export function ClientAuthLayout({ eyebrow, title, description, children, footer }: { eyebrow: string; title: string; description: string; children: ReactNode; footer: ReactNode }) {
  return (
    <main className="grid min-h-screen bg-white dark:bg-gray-950 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="relative hidden overflow-hidden bg-gray-950 p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-20">
        <div className="hero-orb hero-orb-left" aria-hidden="true" />
        <Link href="/" className="relative flex items-center gap-3"><span className="grid size-11 place-items-center rounded-2xl bg-orange-500"><Dumbbell className="size-5" /></span><span className="text-lg font-black">SUMI<span className="text-orange-500">FITNESS</span></span></Link>
        <div className="relative max-w-xl"><p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">Client portal</p><h1 className="mt-5 text-5xl font-black leading-tight tracking-tight xl:text-6xl">Your goals, profile, and coaching journey in one place.</h1><p className="mt-6 max-w-lg text-lg leading-8 text-gray-300">Keep your fitness details current and access a focused space built around your progress.</p></div>
        <div className="relative flex items-center gap-3 text-sm text-gray-400"><ShieldCheck className="size-5 text-emerald-400" /> Protected client access · JWT authenticated</div>
      </section>
      <section className="flex items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full max-w-lg">
          <Link href="/" className="mb-12 flex items-center gap-3 lg:hidden"><span className="grid size-10 place-items-center rounded-2xl bg-orange-500 text-white"><Dumbbell className="size-5" /></span><span className="font-black">SUMI<span className="text-orange-500">FITNESS</span></span></Link>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">{eyebrow}</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">{title}</h2><p className="mt-3 text-sm leading-6 text-gray-500">{description}</p>
          {children}
          <div className="mt-8 text-center text-sm text-gray-500">{footer}</div>
        </div>
      </section>
    </main>
  );
}
