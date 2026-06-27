import { Skeleton } from "@/components/ui/skeleton";

export function AdminLoading() {
  return (
    <div aria-label="Loading admin content" role="status">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="mt-4 h-9 w-72 max-w-full" />
      <Skeleton className="mt-3 h-5 w-[32rem] max-w-full" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-36" />)}</div>
      <Skeleton className="mt-6 h-80" />
    </div>
  );
}
