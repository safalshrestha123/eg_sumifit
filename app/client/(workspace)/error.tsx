"use client";

import { CircleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ClientWorkspaceError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <div className="mx-auto max-w-xl rounded-3xl border border-red-200 bg-white p-8 text-center dark:border-red-500/20 dark:bg-gray-900"><CircleAlert className="mx-auto size-10 text-red-500" /><h1 className="mt-4 text-xl font-black">Something went wrong</h1><p className="mt-2 text-sm text-gray-500">The client area could not render this page.</p><Button className="mt-6" onClick={reset}>Try again</Button></div>;
}
