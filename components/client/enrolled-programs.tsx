"use client";

import { CalendarDays, CircleAlert, Dumbbell } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { CmsImage } from "@/components/shared/cms-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ClientEnrollment, EnrollmentStatus } from "@/features/client/types";
import { apiRequest, errorMessage } from "@/lib/api/client";

const statusVariant: Record<EnrollmentStatus, "warning" | "success" | "danger" | "muted"> = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "danger",
  CANCELLED: "muted",
};

export function EnrolledPrograms() {
  const [enrollments, setEnrollments] = useState<ClientEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEnrollments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest<{ data: ClientEnrollment[] }>("/api/client/enrollments?pageSize=100");
      setEnrollments(response.data);
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    void apiRequest<{ data: ClientEnrollment[] }>("/api/client/enrollments?pageSize=100")
      .then((response) => { if (active) setEnrollments(response.data); })
      .catch((requestError: unknown) => { if (active) setError(errorMessage(requestError)); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <section aria-labelledby="enrolled-programs-title">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600 dark:text-orange-400">Training</p><h2 id="enrolled-programs-title" className="mt-2 text-2xl font-black tracking-tight">Enrolled programs</h2><p className="mt-2 text-sm text-gray-500">Track the programs you have requested and their approval status.</p></div><Button asChild variant="outline" size="sm"><Link href="/programs">Browse programs</Link></Button></div>

      {loading ? (
        <div className="mt-6 grid animate-pulse gap-4 md:grid-cols-2" aria-label="Loading enrolled programs">{Array.from({ length: 2 }).map((_, index) => <div key={index} className="h-48 rounded-2xl bg-gray-200 dark:bg-gray-800" />)}</div>
      ) : error ? (
        <div className="mt-6 flex flex-col items-start gap-4 rounded-2xl border border-red-200 bg-white p-5 dark:border-red-500/20 dark:bg-gray-900"><div className="flex items-start gap-3"><CircleAlert className="mt-0.5 size-5 shrink-0 text-red-500" /><div><p className="font-bold">Enrollments unavailable</p><p className="mt-1 text-sm text-gray-500">{error}</p></div></div><Button type="button" variant="outline" size="sm" onClick={() => void loadEnrollments()}>Try again</Button></div>
      ) : enrollments.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-900"><span className="mx-auto grid size-12 place-items-center rounded-2xl bg-orange-50 text-orange-600 dark:bg-orange-500/10"><Dumbbell className="size-5" /></span><h3 className="mt-4 font-black">No enrolled programs yet</h3><p className="mt-2 text-sm text-gray-500">Choose a published program to send your enrollment request.</p><Button asChild className="mt-5" size="sm"><Link href="/programs">Explore programs</Link></Button></div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {enrollments.map((enrollment) => (
            <article key={enrollment.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 sm:grid sm:grid-cols-[9rem_1fr]">
              <div className="relative min-h-36 bg-gray-100 dark:bg-gray-800"><CmsImage src={enrollment.program.imageUrl || "/images/training.png"} alt={`${enrollment.program.title} program`} fill sizes="(min-width: 640px) 144px, 100vw" className="object-cover" /></div>
              <div className="p-5"><div className="flex items-start justify-between gap-3"><h3 className="font-black">{enrollment.program.title}</h3><Badge variant={statusVariant[enrollment.status]}>{formatStatus(enrollment.status)}</Badge></div><p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">{enrollment.program.description}</p><div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-gray-400">{enrollment.program.duration && <span>{enrollment.program.duration}</span>}{enrollment.program.format && <span>{enrollment.program.format}</span>}<span className="flex items-center gap-1"><CalendarDays className="size-3.5" /> Requested {formatDate(enrollment.createdAt)}</span></div></div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function formatStatus(status: EnrollmentStatus) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(date);
}
