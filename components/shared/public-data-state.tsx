import { AlertCircle, Inbox } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function PublicDataState({ title, description, error = false }: { title: string; description: string; error?: boolean }) {
  const Icon = error ? AlertCircle : Inbox;
  return (
    <div className="grid min-h-56 place-items-center rounded-3xl border border-dashed border-gray-300 bg-white/70 p-8 text-center dark:border-gray-700 dark:bg-gray-950/40" role={error ? "alert" : "status"}>
      <div className="max-w-md">
        <span className={cn("mx-auto grid size-12 place-items-center rounded-2xl", error ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-300" : "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-300")}><Icon className="size-5" /></span>
        <h3 className="mt-4 text-lg font-black text-gray-950 dark:text-white">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    </div>
  );
}

export function PublicSectionLoading({ muted = false, label = "Loading content" }: { muted?: boolean; label?: string }) {
  return (
    <section className={cn("section-padding", muted ? "bg-gray-50 dark:bg-gray-900/50" : "bg-white dark:bg-gray-950")} aria-label={label} aria-busy="true">
      <div className="container-shell">
        <div className="mx-auto max-w-2xl space-y-4 text-center"><Skeleton className="mx-auto h-4 w-32" /><Skeleton className="mx-auto h-10 w-3/4" /><Skeleton className="mx-auto h-5 w-full" /></div>
        <div className="mt-12 grid gap-6 md:grid-cols-3"><Skeleton className="h-72 rounded-3xl" /><Skeleton className="h-72 rounded-3xl" /><Skeleton className="h-72 rounded-3xl" /></div>
      </div>
      <span className="sr-only">{label}…</span>
    </section>
  );
}
