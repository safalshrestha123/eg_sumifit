"use client";

import { ArrowRight, Eye, LockKeyhole, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    window.setTimeout(() => router.push("/admin/dashboard"), 450);
  };

  return (
    <form onSubmit={submit} className="mt-8 space-y-5">
      <div className="space-y-2"><Label htmlFor="admin-email">Email address</Label><div className="relative"><Mail className="pointer-events-none absolute left-4 top-3.5 size-5 text-gray-400" /><Input id="admin-email" type="email" defaultValue="hello@sumifitness.com" autoComplete="email" required className="pl-12" /></div></div>
      <div className="space-y-2"><div className="flex items-center justify-between"><Label htmlFor="admin-password">Password</Label><button type="button" className="text-xs font-semibold text-orange-600" onClick={() => alert("Password recovery is disabled in this UI demo.")}>Forgot password?</button></div><div className="relative"><LockKeyhole className="pointer-events-none absolute left-4 top-3.5 size-5 text-gray-400" /><Input id="admin-password" type={showPassword ? "text" : "password"} defaultValue="sumifitness-demo" autoComplete="current-password" required className="px-12" /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-2.5 grid size-8 place-items-center rounded-lg text-gray-400 hover:bg-gray-100" aria-label={showPassword ? "Hide password" : "Show password"}><Eye className="size-4" /></button></div></div>
      <Button type="submit" size="lg" className="w-full" disabled={loading}>{loading ? "Opening dashboard…" : "Continue to dashboard"}<ArrowRight className="size-4" /></Button>
      <p className="text-center text-xs leading-5 text-gray-400">Demo interface only. No credentials are checked or stored.</p>
    </form>
  );
}
