import type * as React from "react";

import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "warning" | "muted" | "danger";

const variants: Record<BadgeVariant, string> = {
  default: "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300",
  success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  warning: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  muted: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
  danger: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300",
};

export function Badge({ className, variant = "default", ...props }: React.ComponentProps<"span"> & { variant?: BadgeVariant }) {
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold", variants[variant], className)} {...props} />;
}
