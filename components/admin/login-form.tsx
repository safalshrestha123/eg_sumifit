"use client";

import { ArrowRight, Eye, LockKeyhole, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError, apiRequest, setAuthSession, type AuthUser } from "@/lib/api/client";

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address.")),
  password: z.string().min(1, "Password is required.").max(72),
});

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const form = new FormData(event.currentTarget);
    const parsed = loginSchema.safeParse({ email: form.get("email"), password: form.get("password") });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Enter valid credentials.");
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest<{ user: AuthUser; accessToken: string }>("/api/auth/login", {
        method: "POST",
        authenticated: false,
        body: JSON.stringify(parsed.data),
      });

      if (response.user.role !== "ADMIN" && response.user.role !== "TRAINER") {
        setError("This account does not have CMS access.");
        return;
      }

      setAuthSession(response.accessToken, response.user);
      router.replace("/admin/dashboard");
      router.refresh();
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-8 space-y-5">
      <div className="space-y-2"><Label htmlFor="admin-email">Email address</Label><div className="relative"><Mail className="pointer-events-none absolute left-4 top-3.5 size-5 text-gray-400" /><Input id="admin-email" name="email" type="email" autoComplete="email" required className="pl-12" placeholder="trainer@example.com" /></div></div>
      <div className="space-y-2"><div className="flex items-center justify-between"><Label htmlFor="admin-password">Password</Label><span className="text-xs font-medium text-gray-400">Password recovery unavailable</span></div><div className="relative"><LockKeyhole className="pointer-events-none absolute left-4 top-3.5 size-5 text-gray-400" /><Input id="admin-password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required className="px-12" /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-2.5 grid size-8 place-items-center rounded-lg text-gray-400 hover:bg-gray-100" aria-label={showPassword ? "Hide password" : "Show password"}><Eye className="size-4" /></button></div></div>
      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:bg-red-500/10 dark:text-red-300" role="alert">{error}</p>}
      <Button type="submit" size="lg" className="w-full" disabled={loading}>{loading ? "Opening dashboard…" : "Continue to dashboard"}<ArrowRight className="size-4" /></Button>
      <p className="text-center text-xs leading-5 text-gray-400">Your session token is stored only for this browser tab and is cleared on logout.</p>
    </form>
  );
}
