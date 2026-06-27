"use client";

import { Dumbbell } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import { apiRequest, authExpiredEvent, clearAuthSession, getAccessToken, setAuthSession, type AuthUser } from "@/lib/api/client";

export function ClientAuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let active = true;
    const redirectToLogin = () => {
      clearAuthSession();
      router.replace("/client/login");
    };
    const token = getAccessToken();

    if (!token) {
      redirectToLogin();
      return;
    }

    window.addEventListener(authExpiredEvent, redirectToLogin);
    void apiRequest<{ user: AuthUser }>("/api/auth/me")
      .then(({ user }) => {
        if (!active) return;
        if (user.role === "ADMIN" || user.role === "TRAINER") {
          router.replace("/admin/dashboard");
          return;
        }
        if (user.role !== "CLIENT") {
          redirectToLogin();
          return;
        }
        setAuthSession(token, user);
        setAuthorized(true);
      })
      .catch(redirectToLogin);

    return () => {
      active = false;
      window.removeEventListener(authExpiredEvent, redirectToLogin);
    };
  }, [router]);

  if (!authorized) {
    return (
      <main className="grid min-h-screen place-items-center bg-gray-50 px-6 dark:bg-gray-950">
        <div className="text-center">
          <span className="mx-auto grid size-12 animate-pulse place-items-center rounded-2xl bg-orange-500 text-white"><Dumbbell className="size-5" /></span>
          <p className="mt-4 text-sm font-semibold text-gray-500">Checking client access…</p>
        </div>
      </main>
    );
  }

  return children;
}
