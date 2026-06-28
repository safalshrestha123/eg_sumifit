import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const tones = {
  orange: "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-300",
  violet: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300",
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300",
  green: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300",
};

export function StatCard({ label, value, change, tone, icon: Icon }: { label: string; value: string; change: string; tone: keyof typeof tones; icon: LucideIcon }) {
  return (
    <Card className="rounded-2xl p-5 shadow-none">
      <div className="flex items-start justify-between"><div><p className="text-sm font-semibold text-gray-500">{label}</p><p className="mt-3 text-3xl font-black tracking-tight">{value}</p></div><span className={cn("grid size-11 place-items-center rounded-2xl", tones[tone])}><Icon className="size-5" /></span></div>
      <p className="mt-4 text-xs font-semibold text-gray-400">{change}</p>
    </Card>
  );
}
