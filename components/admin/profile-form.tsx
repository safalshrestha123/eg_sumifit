"use client";

import { Camera, Check, Save } from "lucide-react";
import Image from "next/image";
import { useState, type FormEvent } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ProfileForm() {
  const [saved, setSaved] = useState(false);

  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  return (
    <form onSubmit={save} className="mt-8 grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
      <div className="space-y-6">
        <Card className="rounded-2xl shadow-none"><CardHeader><CardTitle>Profile image</CardTitle><CardDescription>Used on the homepage and about page.</CardDescription></CardHeader><CardContent className="pt-0"><div className="relative mx-auto aspect-[4/5] max-w-xs overflow-hidden rounded-3xl bg-gray-100"><Image src="/images/sumi-hero.png" alt="Current trainer profile" fill sizes="320px" className="object-cover" /></div><Button type="button" variant="outline" className="mt-4 w-full"><Camera className="size-4" /> Replace image</Button><p className="mt-3 text-center text-xs text-gray-400">UI preview only · JPG or PNG up to 5 MB</p></CardContent></Card>
        <Card className="rounded-2xl shadow-none"><CardHeader><CardTitle>Profile visibility</CardTitle></CardHeader><CardContent className="pt-0"><div className="flex items-center justify-between rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-500/10"><div><p className="text-sm font-bold text-emerald-800 dark:text-emerald-200">Published</p><p className="mt-1 text-xs text-emerald-700/70 dark:text-emerald-300/70">Visible on the public website</p></div><Badge variant="success"><Check className="mr-1 size-3" /> Live</Badge></div></CardContent></Card>
      </div>

      <Card className="rounded-2xl shadow-none">
        <CardHeader className="border-b border-gray-100 dark:border-gray-800"><CardTitle>Trainer details</CardTitle><CardDescription>Edit the public-facing introduction and professional information.</CardDescription></CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid gap-5 sm:grid-cols-2"><FormField label="Display name" id="profile-name"><Input id="profile-name" defaultValue="Sumi" /></FormField><FormField label="Professional title" id="profile-title"><Input id="profile-title" defaultValue="Personal Trainer & Performance Coach" /></FormField></div>
          <FormField label="Short introduction" id="profile-intro" hint="Appears in cards and compact profile sections."><Textarea id="profile-intro" className="min-h-24" defaultValue="Certified personal trainer helping women build strength, confidence, and sustainable habits through coaching that fits real life." /></FormField>
          <FormField label="Full biography" id="profile-bio" hint="Appears on the About page."><Textarea id="profile-bio" className="min-h-48" defaultValue="I believe fitness should add to your life—not take it over. My coaching combines evidence-led strength training, practical nutrition habits, and honest support to help every client build results they can maintain." /></FormField>
          <div className="grid gap-5 sm:grid-cols-2"><FormField label="Years of experience" id="profile-experience"><Input id="profile-experience" type="number" defaultValue="8" min="0" /></FormField><FormField label="Clients coached" id="profile-clients"><Input id="profile-clients" type="number" defaultValue="750" min="0" /></FormField></div>
          <div className="grid gap-5 sm:grid-cols-2"><FormField label="Location" id="profile-location"><Input id="profile-location" defaultValue="New York, NY" /></FormField><FormField label="Specialization" id="profile-specialization"><Input id="profile-specialization" defaultValue="Women’s strength & performance" /></FormField></div>
          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-end">{saved && <p className="mr-auto text-sm font-semibold text-emerald-600" role="status"><Check className="mr-1 inline size-4" /> Changes saved locally</p>}<Button type="button" variant="outline">Discard</Button><Button type="submit"><Save className="size-4" /> Save profile</Button></div>
        </CardContent>
      </Card>
    </form>
  );
}

function FormField({ label, id, hint, children }: { label: string; id: string; hint?: string; children: React.ReactNode }) {
  return <div className="space-y-2"><Label htmlFor={id}>{label}</Label>{children}{hint && <p className="text-xs text-gray-400">{hint}</p>}</div>;
}
