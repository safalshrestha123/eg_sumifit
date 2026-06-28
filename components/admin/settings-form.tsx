"use client";

import { Check, Save } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export function SettingsForm() {
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState({ messages: true, drafts: true, summary: false });

  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  return (
    <form onSubmit={save} className="mt-8 space-y-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="rounded-2xl shadow-none"><CardHeader><CardTitle>Website details</CardTitle><CardDescription>Core contact and location information used across the site.</CardDescription></CardHeader><CardContent className="space-y-5 pt-0"><SettingField id="site-name" label="Website name"><Input id="site-name" defaultValue="SumiFitness" /></SettingField><SettingField id="site-email" label="Public email"><Input id="site-email" type="email" defaultValue="hello@sumifitness.com" /></SettingField><div className="grid gap-5 sm:grid-cols-2"><SettingField id="site-phone" label="Phone"><Input id="site-phone" defaultValue="+1 (555) 014-2277" /></SettingField><SettingField id="site-location" label="Location"><Input id="site-location" defaultValue="New York, NY" /></SettingField></div><SettingField id="site-description" label="Default SEO description"><Textarea id="site-description" defaultValue="Personal training and online coaching designed to build strength, confidence, and sustainable results." /></SettingField></CardContent></Card>

        <div className="space-y-6">
          <Card className="rounded-2xl shadow-none"><CardHeader><CardTitle>Social profiles</CardTitle><CardDescription>Public links used in the footer and calls to action.</CardDescription></CardHeader><CardContent className="space-y-5 pt-0"><SettingField id="instagram-url" label="Instagram URL"><Input id="instagram-url" type="url" defaultValue="https://instagram.com/sumifitness" /></SettingField><SettingField id="youtube-url" label="YouTube URL"><Input id="youtube-url" type="url" defaultValue="https://youtube.com/@sumifitness" /></SettingField></CardContent></Card>
          <Card className="rounded-2xl shadow-none"><CardHeader><CardTitle>Publishing defaults</CardTitle><CardDescription>Choose the initial state for newly created content.</CardDescription></CardHeader><CardContent className="space-y-4 pt-0"><ToggleRow title="Publish new content automatically" description="New items start live instead of as drafts." defaultChecked={false} /><ToggleRow title="Show draft labels" description="Display internal draft indicators in lists." defaultChecked /></CardContent></Card>
        </div>
      </div>

      <Card className="rounded-2xl shadow-none"><CardHeader><CardTitle>Workspace notifications</CardTitle><CardDescription>These switches are UI-only and do not send notifications.</CardDescription></CardHeader><CardContent className="grid gap-4 pt-0 md:grid-cols-3"><ControlledToggle title="New contact messages" description="Notify when a visitor submits the contact form." checked={notifications.messages} onChange={(value) => setNotifications((state) => ({ ...state, messages: value }))} /><ControlledToggle title="Unpublished drafts" description="Weekly reminder about unfinished content." checked={notifications.drafts} onChange={(value) => setNotifications((state) => ({ ...state, drafts: value }))} /><ControlledToggle title="Monthly summary" description="A monthly website content overview." checked={notifications.summary} onChange={(value) => setNotifications((state) => ({ ...state, summary: value }))} /></CardContent></Card>

      <div className="sticky bottom-4 flex flex-col-reverse gap-3 rounded-2xl border border-gray-200 bg-white/95 p-4 shadow-xl backdrop-blur dark:border-gray-800 dark:bg-gray-900/95 sm:flex-row sm:items-center sm:justify-end">{saved && <p className="mr-auto text-sm font-semibold text-emerald-600" role="status"><Check className="mr-1 inline size-4" /> Settings saved locally</p>}<Button type="button" variant="outline">Reset changes</Button><Button type="submit"><Save className="size-4" /> Save settings</Button></div>
    </form>
  );
}

function SettingField({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return <div className="space-y-2"><Label htmlFor={id}>{label}</Label>{children}</div>;
}

function ToggleRow({ title, description, defaultChecked }: { title: string; description: string; defaultChecked?: boolean }) {
  return <div className="flex items-center justify-between gap-5 rounded-2xl bg-gray-50 p-4 dark:bg-gray-950"><div><p className="text-sm font-bold">{title}</p><p className="mt-1 text-xs leading-5 text-gray-500">{description}</p></div><Switch defaultChecked={defaultChecked} aria-label={title} /></div>;
}

function ControlledToggle({ title, description, checked, onChange }: { title: string; description: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return <div className="flex items-start justify-between gap-5 rounded-2xl border border-gray-200 p-4 dark:border-gray-800"><div><p className="text-sm font-bold">{title}</p><p className="mt-1 text-xs leading-5 text-gray-500">{description}</p></div><Switch checked={checked} onCheckedChange={onChange} aria-label={title} /></div>;
}
