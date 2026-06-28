"use client";

import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ApiError, apiRequest, errorMessage, getAccessToken, getStoredUser } from "@/lib/api/client";

type EnrollmentState = "idle" | "loading" | "enrolled" | "error";

export function EnrollButton({ programId, programTitle }: { programId: string; programTitle: string }) {
  const router = useRouter();
  const [state, setState] = useState<EnrollmentState>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const enroll = async () => {
    const user = getStoredUser();
    if (!getAccessToken() || user?.role !== "CLIENT") {
      router.push("/client/login");
      return;
    }

    setState("loading");
    setMessage(null);
    try {
      await apiRequest(`/api/client/programs/${programId}/enroll`, { method: "POST" });
      setState("enrolled");
      setMessage(`Enrollment requested for ${programTitle}.`);
    } catch (requestError) {
      if (requestError instanceof ApiError && requestError.status === 401) {
        router.push("/client/login");
        return;
      }
      if (requestError instanceof ApiError && requestError.code === "ALREADY_ENROLLED") {
        setState("enrolled");
        setMessage("You are already enrolled in this program.");
        return;
      }
      setState("error");
      setMessage(errorMessage(requestError));
    }
  };

  if (state === "enrolled") {
    return (
      <div className="space-y-2" aria-live="polite">
        <p className="flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-300"><CheckCircle2 className="size-4" /> {message}</p>
        <Link href="/client/dashboard" className="inline-flex items-center gap-2 text-xs font-bold text-orange-600 hover:text-orange-700 dark:text-orange-400">View client dashboard <ArrowRight className="size-3.5" /></Link>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Button type="button" onClick={() => void enroll()} disabled={state === "loading"} className="w-full sm:w-auto">
        {state === "loading" ? <><Loader2 className="size-4 animate-spin" /> Enrolling…</> : <>Enroll in this program <ArrowRight className="size-4" /></>}
      </Button>
      {state === "error" && <p className="text-sm font-medium text-red-600 dark:text-red-300" role="alert">{message}</p>}
    </div>
  );
}
