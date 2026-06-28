"use client";

import { ArrowRight, CircleAlert, Dumbbell, Mail, Target, UserRound } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { EnrolledPrograms } from "@/components/client/enrolled-programs";
import type { ClientProfileResponse, ExperienceLevel } from "@/features/client/types";
import { apiRequest, errorMessage } from "@/lib/api/client";

export function ClientDashboard() {
  const [data, setData] = useState<ClientProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void apiRequest<ClientProfileResponse>("/api/client/profile")
      .then((response) => { if (active) setData(response); })
      .catch((requestError) => { if (active) setError(errorMessage(requestError)); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  if (loading) return <DashboardLoading />;
  if (error || !data) return <DashboardError message={error ?? "Your dashboard could not be loaded."} />;

  const profile = data.profile;
  const completedFields = profile ? [profile.fullName, profile.phone, profile.fitnessGoal, profile.experienceLevel].filter(Boolean).length : 0;
  const completeness = Math.round((completedFields / 4) * 100);

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl bg-gray-950 p-6 text-white sm:p-8 lg:p-10">
        <div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-400">Client dashboard</p><h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Welcome{profile?.fullName ? `, ${profile.fullName.split(" ")[0]}` : " to SumiFitness"}.</h1><p className="mt-4 max-w-xl text-sm leading-6 text-gray-300 sm:text-base">Keep your details and fitness goals current so your coaching journey starts with the right context.</p><Button asChild className="mt-6"><Link href="/client/profile">Update my profile <ArrowRight className="size-4" /></Link></Button></div>
      </section>

      {!profile && <div className="flex items-start gap-3 rounded-2xl border border-orange-200 bg-orange-50 p-5 text-orange-900 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-200"><CircleAlert className="mt-0.5 size-5 shrink-0" /><div><p className="font-bold">Complete your client profile</p><p className="mt-1 text-sm opacity-80">Add your name, goal, phone, and experience level before continuing.</p></div></div>}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={UserRound} label="Profile complete" value={`${completeness}%`} detail={completeness === 100 ? "All details added" : "Add missing details"} />
        <StatCard icon={Target} label="Primary goal" value={profile?.fitnessGoal ?? "Not set"} detail="Your current focus" compact />
        <StatCard icon={Dumbbell} label="Experience" value={formatExperience(profile?.experienceLevel)} detail="Training level" />
        <StatCard icon={Mail} label="Account email" value={data.email} detail="Login email" compact />
      </section>
      <EnrolledPrograms />
    </div>
  );
}

function StatCard({ icon: Icon, label, value, detail, compact = false }: { icon: typeof UserRound; label: string; value: string; detail: string; compact?: boolean }) {
  return <article className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"><span className="grid size-10 place-items-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-300"><Icon className="size-5" /></span><p className="mt-5 text-xs font-bold uppercase tracking-[0.15em] text-gray-400">{label}</p><p className={compact ? "mt-2 line-clamp-2 min-h-12 text-base font-black" : "mt-2 truncate text-2xl font-black"}>{value}</p><p className="mt-2 text-xs text-gray-400">{detail}</p></article>;
}

function DashboardLoading() {
  return <div className="animate-pulse space-y-8" aria-label="Loading client dashboard"><div className="h-64 rounded-3xl bg-gray-200 dark:bg-gray-800" /><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-52 rounded-2xl bg-gray-200 dark:bg-gray-800" />)}</div></div>;
}

function DashboardError({ message }: { message: string }) {
  return <div className="rounded-3xl border border-red-200 bg-white p-8 text-center dark:border-red-500/20 dark:bg-gray-900"><CircleAlert className="mx-auto size-10 text-red-500" /><h1 className="mt-4 text-xl font-black">Dashboard unavailable</h1><p className="mx-auto mt-2 max-w-md text-sm text-gray-500">{message}</p><Button className="mt-6" onClick={() => window.location.reload()}>Try again</Button></div>;
}

function formatExperience(value: ExperienceLevel | null | undefined) {
  return value ? value.charAt(0) + value.slice(1).toLowerCase() : "Not set";
}
