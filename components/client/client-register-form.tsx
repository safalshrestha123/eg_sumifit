"use client";

import { ArrowRight, CheckCircle2, Eye, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest, errorMessage, setAuthSession, type AuthUser } from "@/lib/api/client";

const registrationSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name.").max(120),
  email: z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address.")),
  phone: z.string().trim().max(40),
  fitnessGoal: z.string().trim().min(5, "Tell us a little about your fitness goal.").max(500),
  experienceLevel: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  password: z.string().min(12, "Password must contain at least 12 characters.").max(72),
  confirmPassword: z.string(),
}).refine((value) => value.password === value.confirmPassword, { path: ["confirmPassword"], message: "Passwords do not match." });

export function ClientRegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    const form = new FormData(event.currentTarget);
    const parsed = registrationSchema.safeParse(Object.fromEntries(form));
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check your registration details.");
      return;
    }

    const values = {
      fullName: parsed.data.fullName,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      fitnessGoal: parsed.data.fitnessGoal,
      experienceLevel: parsed.data.experienceLevel,
      password: parsed.data.password,
      role: "CLIENT" as const,
    };
    setLoading(true);
    try {
      const response = await apiRequest<{ user: AuthUser; accessToken: string }>("/api/auth/register", {
        method: "POST",
        authenticated: false,
        body: JSON.stringify(values),
      });
      if (response.user.role !== "CLIENT") throw new Error("The API returned an invalid account role.");
      setAuthSession(response.accessToken, response.user);
      setSuccess("Account created. Opening your dashboard…");
      router.replace("/client/dashboard");
      router.refresh();
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-8 space-y-5">
      <div className="grid gap-5 sm:grid-cols-2"><Field label="Full name" id="register-name"><Input id="register-name" name="fullName" autoComplete="name" required /></Field><Field label="Email" id="register-email"><Input id="register-email" name="email" type="email" autoComplete="email" required /></Field></div>
      <div className="grid gap-5 sm:grid-cols-2"><Field label="Phone" id="register-phone"><Input id="register-phone" name="phone" type="tel" autoComplete="tel" /></Field><Field label="Experience level" id="register-experience"><select id="register-experience" name="experienceLevel" required defaultValue="" className="flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 dark:border-gray-700 dark:bg-gray-950"><option value="" disabled>Select level</option><option value="BEGINNER">Beginner</option><option value="INTERMEDIATE">Intermediate</option><option value="ADVANCED">Advanced</option></select></Field></div>
      <Field label="Primary fitness goal" id="register-goal"><Textarea id="register-goal" name="fitnessGoal" required placeholder="Build strength, improve fitness, prepare for an event…" /></Field>
      <div className="grid gap-5 sm:grid-cols-2"><Field label="Password" id="register-password"><div className="relative"><Input id="register-password" name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" required className="pr-11" /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-2 top-2 grid size-8 place-items-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800" aria-label={showPassword ? "Hide passwords" : "Show passwords"}><Eye className="size-4" /></button></div></Field><Field label="Confirm password" id="register-confirm"><Input id="register-confirm" name="confirmPassword" type={showPassword ? "text" : "password"} autoComplete="new-password" required /></Field></div>
      <p className="text-xs leading-5 text-gray-400">Use at least 12 characters. Your password is hashed before storage.</p>
      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:bg-red-500/10 dark:text-red-300" role="alert">{error}</p>}
      {success && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300" role="status"><CheckCircle2 className="mr-2 inline size-4" />{success}</p>}
      <Button type="submit" size="lg" className="w-full" disabled={loading}>{loading ? <><Loader2 className="size-4 animate-spin" /> Creating account…</> : <>Create client account <ArrowRight className="size-4" /></>}</Button>
    </form>
  );
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return <div className="space-y-2"><Label htmlFor={id}>{label}</Label>{children}</div>;
}
