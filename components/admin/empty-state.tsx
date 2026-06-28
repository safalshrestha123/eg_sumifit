import { Inbox, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({ title, description, action, icon: Icon = Inbox }: { title: string; description: string; action?: ReactNode; icon?: LucideIcon }) {
  return (
    <div className="grid min-h-64 place-items-center rounded-3xl border border-dashed border-gray-300 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-900">
      <div><span className="mx-auto grid size-12 place-items-center rounded-2xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-300"><Icon className="size-5" /></span><h2 className="mt-4 font-bold">{title}</h2><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">{description}</p>{action && <div className="mt-5">{action}</div>}</div>
    </div>
  );
}
