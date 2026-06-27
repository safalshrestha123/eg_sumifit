"use client";

import { CircleAlert, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function AdminError({ unstable_retry }: { error: Error & { digest?: string }; unstable_retry: () => void }) {
  return (
    <div className="grid min-h-[60vh] place-items-center rounded-3xl border border-red-200 bg-white p-8 text-center dark:border-red-900 dark:bg-gray-900">
      <div><span className="mx-auto grid size-14 place-items-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-300"><CircleAlert className="size-6" /></span><h1 className="mt-5 text-2xl font-black">This section could not be displayed.</h1><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">The mock content encountered an unexpected rendering error. Retry the current section.</p><Button type="button" className="mt-6" onClick={unstable_retry}><RotateCcw className="size-4" /> Try again</Button></div>
    </div>
  );
}
