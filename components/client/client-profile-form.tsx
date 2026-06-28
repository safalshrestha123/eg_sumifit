"use client";

import { CheckCircle2, CircleAlert, Loader2, Save } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ClientProfileResponse } from "@/features/client/types";
import { apiRequest, errorMessage, getAccessToken, getStoredUser, setAuthSession } from "@/lib/api/client";

const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name.").max(120),
  email: z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address.")),
  phone: z.string().trim().max(40),
  fitnessGoal: z.string().trim().max(500),
  experienceLevel: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
});

export function ClientProfileForm() {
  const [data, setData] = useState<ClientProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void apiRequest<ClientProfileResponse>("/api/client/profile")
      .then((response) => { if (active) setData(response); })
      .catch((requestError) => { if (active) setError(errorMessage(requestError)); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    const parsed = profileSchema.safeParse(Object.fromEntries(new FormData(event.currentTarget)));
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check your profile details.");
      return;
    }

    setSaving(true);
    try {
      const values = parsed.data;
      const response = await apiRequest<ClientProfileResponse>("/api/client/profile", {
        method: "PATCH",
        body: JSON.stringify({ ...values, phone: values.phone || null, fitnessGoal: values.fitnessGoal || null }),
      });
      setData(response);
      const token = getAccessToken();
      const user = getStoredUser();
      if (token && user) setAuthSession(token, { ...user, email: response.email });
      setSuccess("Profile saved successfully.");
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <ProfileLoading />;
  if (!data) return <ProfileError message={error ?? "Your profile could not be loaded."} />;

  return (
    <div className="mx-auto max-w-4xl">
      <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">Account settings</p><h1 className="mt-2 text-3xl font-black tracking-tight">Client profile</h1><p className="mt-2 text-sm text-gray-500">Update the details used to understand your training background and goals.</p></div>
      <form key={data.profile?.updatedAt ?? "new-profile"} onSubmit={submit} className="mt-8 space-y-6 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8">
        <div className="grid gap-6 sm:grid-cols-2"><Field label="Full name" id="client-full-name"><Input id="client-full-name" name="fullName" autoComplete="name" required defaultValue={data.profile?.fullName ?? ""} /></Field><Field label="Email" id="client-email"><Input id="client-email" name="email" type="email" autoComplete="email" required defaultValue={data.email} /></Field></div>
        <div className="grid gap-6 sm:grid-cols-2"><Field label="Phone" id="client-phone"><Input id="client-phone" name="phone" type="tel" autoComplete="tel" defaultValue={data.profile?.phone ?? ""} /></Field><Field label="Experience level" id="client-experience"><select id="client-experience" name="experienceLevel" required defaultValue={data.profile?.experienceLevel ?? ""} className="flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 dark:border-gray-700 dark:bg-gray-950"><option value="" disabled>Select level</option><option value="BEGINNER">Beginner</option><option value="INTERMEDIATE">Intermediate</option><option value="ADVANCED">Advanced</option></select></Field></div>
        <Field label="Primary fitness goal" id="client-goal"><Textarea id="client-goal" name="fitnessGoal" rows={5} maxLength={500} placeholder="Describe the result you want to work toward…" defaultValue={data.profile?.fitnessGoal ?? ""} /></Field>
        {error && <p className="flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:bg-red-500/10 dark:text-red-300" role="alert"><CircleAlert className="mt-0.5 size-4 shrink-0" />{error}</p>}
        {success && <p className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300" role="status"><CheckCircle2 className="size-4" />{success}</p>}
        <div className="flex justify-end"><Button type="submit" size="lg" disabled={saving}>{saving ? <><Loader2 className="size-4 animate-spin" /> Saving…</> : <><Save className="size-4" /> Save profile</>}</Button></div>
      </form>
    </div>
  );
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return <div className="space-y-2"><Label htmlFor={id}>{label}</Label>{children}</div>;
}

function ProfileLoading() {
  return <div className="mx-auto max-w-4xl animate-pulse" aria-label="Loading client profile"><div className="h-24 max-w-md rounded-2xl bg-gray-200 dark:bg-gray-800" /><div className="mt-8 h-[30rem] rounded-3xl bg-gray-200 dark:bg-gray-800" /></div>;
}

function ProfileError({ message }: { message: string }) {
  return <div className="mx-auto max-w-xl rounded-3xl border border-red-200 bg-white p-8 text-center dark:border-red-500/20 dark:bg-gray-900"><CircleAlert className="mx-auto size-10 text-red-500" /><h1 className="mt-4 text-xl font-black">Profile unavailable</h1><p className="mt-2 text-sm text-gray-500">{message}</p><Button className="mt-6" onClick={() => window.location.reload()}>Try again</Button></div>;
}
