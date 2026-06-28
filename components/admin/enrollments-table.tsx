"use client";

import { AlertCircle, ClipboardList, Loader2, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { EmptyState } from "@/components/admin/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { CmsEnrollment, EnrollmentStatus } from "@/features/admin/types";
import { apiRequest, errorMessage } from "@/lib/api/client";

const statuses = ["PENDING", "APPROVED", "REJECTED", "CANCELLED"] as const;
const statusVariant: Record<EnrollmentStatus, "warning" | "success" | "danger" | "muted"> = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "danger",
  CANCELLED: "muted",
};

export function EnrollmentsTable() {
  const [enrollments, setEnrollments] = useState<CmsEnrollment[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"ALL" | EnrollmentStatus>("ALL");
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadEnrollments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest<{ data: CmsEnrollment[] }>("/api/cms/enrollments?pageSize=100");
      setEnrollments(response.data);
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    void apiRequest<{ data: CmsEnrollment[] }>("/api/cms/enrollments?pageSize=100")
      .then((response) => { if (active) setEnrollments(response.data); })
      .catch((requestError: unknown) => { if (active) setError(errorMessage(requestError)); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const visibleEnrollments = useMemo(() => {
    const search = query.trim().toLowerCase();
    return enrollments.filter((enrollment) => {
      const matchesStatus = filter === "ALL" || enrollment.status === filter;
      const client = enrollment.user.clientProfile?.fullName ?? enrollment.user.email;
      const matchesSearch = !search || `${client} ${enrollment.user.email} ${enrollment.program.title}`.toLowerCase().includes(search);
      return matchesStatus && matchesSearch;
    });
  }, [enrollments, filter, query]);

  const updateStatus = async (enrollment: CmsEnrollment, status: EnrollmentStatus) => {
    if (status === enrollment.status) return;
    setActiveId(enrollment.id);
    setError(null);
    setSuccess(null);
    try {
      const response = await apiRequest<{ enrollment: CmsEnrollment }>(`/api/cms/enrollments/${enrollment.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setEnrollments((current) => current.map((item) => item.id === enrollment.id ? response.enrollment : item));
      setSuccess(`${enrollment.program.title} enrollment marked ${formatStatus(status).toLowerCase()}.`);
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setActiveId(null);
    }
  };

  return (
    <>
      {(error || success) && <div className={`mt-6 flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${error ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300" : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300"}`} role={error ? "alert" : "status"}><span className="flex items-center gap-2">{error && <AlertCircle className="size-4" />}{error ?? success}</span>{error && <Button type="button" size="sm" variant="outline" onClick={() => void loadEnrollments()}>Retry</Button>}</div>}
      <Card className="mt-8 overflow-hidden rounded-2xl shadow-none">
        <div className="flex flex-col gap-4 border-b border-gray-100 p-4 dark:border-gray-800 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm"><Search className="pointer-events-none absolute left-3.5 top-3.5 size-4 text-gray-400" /><Input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search client or program…" aria-label="Search enrollments" className="pl-10" /></div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-500">Status<select value={filter} onChange={(event) => setFilter(event.target.value as "ALL" | EnrollmentStatus)} className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:border-orange-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"><option value="ALL">All statuses</option>{statuses.map((status) => <option key={status} value={status}>{formatStatus(status)}</option>)}</select></label>
        </div>

        {loading ? (
          <div className="flex min-h-56 items-center justify-center gap-3 text-sm font-semibold text-gray-500" role="status"><Loader2 className="size-5 animate-spin" /> Loading enrollments…</div>
        ) : visibleEnrollments.length === 0 ? (
          <div className="p-5"><EmptyState icon={ClipboardList} title="No enrollments found" description={enrollments.length === 0 ? "Client program requests will appear here." : "No enrollments match the current search and status filter."} action={enrollments.length > 0 ? <Button type="button" variant="outline" onClick={() => { setQuery(""); setFilter("ALL"); }}>Clear filters</Button> : undefined} /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[52rem] text-left text-sm">
              <thead className="bg-gray-50 text-xs font-bold uppercase tracking-[0.12em] text-gray-400 dark:bg-gray-950"><tr><th className="px-5 py-4">Client</th><th className="px-5 py-4">Program</th><th className="px-5 py-4">Requested</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Update status</th></tr></thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {visibleEnrollments.map((enrollment) => (
                  <tr key={enrollment.id} className="align-middle">
                    <td className="px-5 py-4"><p className="font-bold">{enrollment.user.clientProfile?.fullName ?? "Client"}</p><p className="mt-1 text-xs text-gray-500">{enrollment.user.email}</p>{enrollment.user.clientProfile?.phone && <p className="mt-1 text-xs text-gray-400">{enrollment.user.clientProfile.phone}</p>}</td>
                    <td className="px-5 py-4"><p className="font-bold">{enrollment.program.title}</p><p className="mt-1 text-xs text-gray-500">{[enrollment.program.duration, enrollment.program.format].filter(Boolean).join(" · ") || "Program details not set"}</p></td>
                    <td className="px-5 py-4 text-xs font-medium text-gray-500"><time dateTime={enrollment.createdAt}>{formatDate(enrollment.createdAt)}</time></td>
                    <td className="px-5 py-4"><Badge variant={statusVariant[enrollment.status]}>{formatStatus(enrollment.status)}</Badge></td>
                    <td className="px-5 py-4"><div className="flex items-center gap-2"><select value={enrollment.status} disabled={activeId === enrollment.id} onChange={(event) => void updateStatus(enrollment, event.target.value as EnrollmentStatus)} aria-label={`Update ${enrollment.program.title} enrollment status`} className="h-10 min-w-36 rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-orange-500 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-950">{statuses.map((status) => <option key={status} value={status}>{formatStatus(status)}</option>)}</select>{activeId === enrollment.id && <Loader2 className="size-4 animate-spin text-orange-500" />}</div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}

function formatStatus(status: EnrollmentStatus) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(date);
}
