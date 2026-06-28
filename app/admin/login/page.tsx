import { Dumbbell, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = { title: "Sign in" };

export default function AdminLoginPage() {
  return (
    <main className="grid min-h-screen bg-white dark:bg-gray-950 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden bg-gray-950 p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-20">
        <div className="hero-orb hero-orb-left" aria-hidden="true" />
        <Link href="/" className="relative flex items-center gap-3"><span className="grid size-11 place-items-center rounded-2xl bg-orange-500"><Dumbbell className="size-5" /></span><span className="text-lg font-black">SUMI<span className="text-orange-500">FITNESS</span></span></Link>
        <div className="relative max-w-xl"><p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">Content Studio</p><h1 className="mt-5 text-5xl font-black leading-tight tracking-tight xl:text-6xl">Your website, organized in one focused workspace.</h1><p className="mt-6 max-w-lg text-lg leading-8 text-gray-300">Manage programs, stories, credentials, gallery assets, and client enquiries through a consistent publishing workflow.</p></div>
        <div className="relative flex items-center gap-3 text-sm text-gray-400"><ShieldCheck className="size-5 text-emerald-400" /> Authenticated CMS access · API-backed content</div>
      </section>
      <section className="flex items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-12 flex items-center gap-3 lg:hidden"><span className="grid size-10 place-items-center rounded-2xl bg-orange-500 text-white"><Dumbbell className="size-5" /></span><span className="font-black">SUMI<span className="text-orange-500">FITNESS</span></span></Link>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">Admin access</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Welcome back, Sumi.</h2><p className="mt-3 text-sm leading-6 text-gray-500">Sign in with an administrator or trainer account to manage website content.</p>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
