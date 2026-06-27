"use client";

import { AlertCircle, Check, Loader2, Save } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest, errorMessage } from "@/lib/api/client";

interface TrainerProfile {
  id: string;
  displayName: string;
  professionalTitle: string;
  shortBio: string | null;
  biography: string | null;
  avatarUrl: string | null;
  phone: string | null;
  location: string | null;
  specialization: string | null;
  yearsExperience: number;
  clientsCoached: number;
  published: boolean;
}

const profileSchema = z.object({
  displayName: z.string().trim().min(2, "Display name must contain at least 2 characters.").max(100),
  professionalTitle: z.string().trim().min(2, "Professional title must contain at least 2 characters.").max(150),
  shortBio: z.string().trim().max(500).nullable(),
  biography: z.string().trim().max(5_000).nullable(),
  avatarUrl: z.string().trim().max(2_000).nullable(),
  phone: z.string().trim().max(40).nullable(),
  location: z.string().trim().max(150).nullable(),
  specialization: z.string().trim().max(200).nullable(),
  yearsExperience: z.number().int().min(0).max(80),
  clientsCoached: z.number().int().min(0).max(10_000_000),
  published: z.boolean(),
});

const blankProfile = {
  displayName: "",
  professionalTitle: "",
  shortBio: "",
  biography: "",
  avatarUrl: "",
  phone: "",
  location: "",
  specialization: "",
  yearsExperience: 0,
  clientsCoached: 0,
  published: false,
};

export function ProfileForm() {
  const [profile, setProfile] = useState<TrainerProfile | null>(null);
  const [published, setPublished] = useState(false);
  const [formVersion, setFormVersion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [initialLoadFailed, setInitialLoadFailed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setInitialLoadFailed(false);
    setError(null);
    setSuccess(null);
    try {
      const response = await apiRequest<{ profile: TrainerProfile | null }>("/api/cms/profile");
      setProfile(response.profile);
      setPublished(response.profile?.published ?? false);
      setFormVersion((version) => version + 1);
    } catch (requestError) {
      setError(errorMessage(requestError));
      setInitialLoadFailed(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    void apiRequest<{ profile: TrainerProfile | null }>("/api/cms/profile")
      .then((response) => {
        if (!active) return;
        setProfile(response.profile);
        setPublished(response.profile?.published ?? false);
        setFormVersion((version) => version + 1);
      })
      .catch((requestError: unknown) => {
        if (!active) return;
        setError(errorMessage(requestError));
        setInitialLoadFailed(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    const form = new FormData(event.currentTarget);
    const text = (name: string) => String(form.get(name) ?? "").trim() || null;
    const parsed = profileSchema.safeParse({
      displayName: form.get("displayName"),
      professionalTitle: form.get("professionalTitle"),
      shortBio: text("shortBio"),
      biography: text("biography"),
      avatarUrl: text("avatarUrl"),
      phone: text("phone"),
      location: text("location"),
      specialization: text("specialization"),
      yearsExperience: Number(form.get("yearsExperience")),
      clientsCoached: Number(form.get("clientsCoached")),
      published,
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check the profile fields.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await apiRequest<{ profile: TrainerProfile }>("/api/cms/profile", {
        method: "PATCH",
        body: JSON.stringify(parsed.data),
      });
      setProfile(response.profile);
      setPublished(response.profile.published);
      setFormVersion((version) => version + 1);
      setSuccess("Profile saved to the CMS.");
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Card className="mt-8 grid min-h-64 place-items-center rounded-2xl"><p className="flex items-center gap-3 text-sm font-semibold text-gray-500" role="status"><Loader2 className="size-5 animate-spin" /> Loading profile…</p></Card>;
  if (initialLoadFailed) return <Card className="mt-8 grid min-h-64 place-items-center rounded-2xl p-8 text-center"><div><AlertCircle className="mx-auto size-8 text-red-500" /><p className="mt-3 text-sm font-semibold text-red-700" role="alert">{error}</p><Button type="button" variant="outline" className="mt-4" onClick={() => void loadProfile()}>Retry</Button></div></Card>;

  const values = profile ?? blankProfile;
  const previewImage = values.avatarUrl?.startsWith("/") ? values.avatarUrl : "/images/sumi-hero.png";

  return (
    <form key={`${profile?.id ?? "new-profile"}-${formVersion}`} onSubmit={save} className="mt-8 grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
      <div className="space-y-6">
        <Card className="rounded-2xl shadow-none"><CardHeader><CardTitle>Profile image</CardTitle><CardDescription>Used on the homepage and about page.</CardDescription></CardHeader><CardContent className="pt-0"><div className="relative mx-auto aspect-[4/5] max-w-xs overflow-hidden rounded-3xl bg-gray-100"><Image src={previewImage} alt="Current trainer profile" fill sizes="320px" className="object-cover" /></div><p className="mt-3 text-center text-xs text-gray-400">Set an existing image URL in the profile form. Uploads are not enabled.</p></CardContent></Card>
        <Card className="rounded-2xl shadow-none"><CardHeader><CardTitle>Profile visibility</CardTitle></CardHeader><CardContent className="pt-0"><div className="flex items-center justify-between rounded-2xl bg-gray-50 p-4 dark:bg-gray-950"><div><p className="text-sm font-bold">Publish profile</p><p className="mt-1 text-xs text-gray-500">Controls the public profile API.</p></div><div className="flex items-center gap-3"><Badge variant={published ? "success" : "warning"}>{published ? "Live" : "Draft"}</Badge><Switch checked={published} onCheckedChange={setPublished} aria-label="Publish profile" /></div></div></CardContent></Card>
      </div>

      <Card className="rounded-2xl shadow-none">
        <CardHeader className="border-b border-gray-100 dark:border-gray-800"><CardTitle>Trainer details</CardTitle><CardDescription>Edit the public-facing introduction and professional information.</CardDescription></CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid gap-5 sm:grid-cols-2"><FormField label="Display name" id="profile-name"><Input id="profile-name" name="displayName" defaultValue={values.displayName} required /></FormField><FormField label="Professional title" id="profile-title"><Input id="profile-title" name="professionalTitle" defaultValue={values.professionalTitle} required /></FormField></div>
          <FormField label="Short introduction" id="profile-intro" hint="Appears in cards and compact profile sections."><Textarea id="profile-intro" name="shortBio" className="min-h-24" defaultValue={values.shortBio ?? ""} /></FormField>
          <FormField label="Full biography" id="profile-bio" hint="Appears on the About page."><Textarea id="profile-bio" name="biography" className="min-h-48" defaultValue={values.biography ?? ""} /></FormField>
          <FormField label="Profile image URL" id="profile-avatar"><Input id="profile-avatar" name="avatarUrl" defaultValue={values.avatarUrl ?? ""} placeholder="/images/sumi-hero.png" /></FormField>
          <div className="grid gap-5 sm:grid-cols-2"><FormField label="Years of experience" id="profile-experience"><Input id="profile-experience" name="yearsExperience" type="number" defaultValue={values.yearsExperience} min="0" max="80" required /></FormField><FormField label="Clients coached" id="profile-clients"><Input id="profile-clients" name="clientsCoached" type="number" defaultValue={values.clientsCoached} min="0" required /></FormField></div>
          <div className="grid gap-5 sm:grid-cols-2"><FormField label="Location" id="profile-location"><Input id="profile-location" name="location" defaultValue={values.location ?? ""} /></FormField><FormField label="Specialization" id="profile-specialization"><Input id="profile-specialization" name="specialization" defaultValue={values.specialization ?? ""} /></FormField></div>
          <FormField label="Phone" id="profile-phone"><Input id="profile-phone" name="phone" type="tel" defaultValue={values.phone ?? ""} /></FormField>
          {(error || success) && <p className={`rounded-xl px-4 py-3 text-sm font-medium ${error ? "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300" : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"}`} role={error ? "alert" : "status"}>{error ?? <><Check className="mr-1 inline size-4" /> {success}</>}</p>}
          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-end"><Button type="button" variant="outline" disabled={submitting} onClick={() => void loadProfile()}>Discard</Button><Button type="submit" disabled={submitting}>{submitting ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />} Save profile</Button></div>
        </CardContent>
      </Card>
    </form>
  );
}

function FormField({ label, id, hint, children }: { label: string; id: string; hint?: string; children: React.ReactNode }) {
  return <div className="space-y-2"><Label htmlFor={id}>{label}</Label>{children}{hint && <p className="text-xs text-gray-400">{hint}</p>}</div>;
}
