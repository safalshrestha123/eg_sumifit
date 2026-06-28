"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import { AdminLoading } from "@/components/admin/admin-loading";
import { apiRequest, authExpiredEvent, clearAuthSession, getAccessToken, setAuthSession, type AuthUser } from "@/lib/api/client";

export function AdminAuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let active = true;
    const redirectToLogin = () => {
      clearAuthSession();
      router.replace("/admin/login");
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
        if (user.role !== "ADMIN" && user.role !== "TRAINER") {
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
    return <main className="min-h-screen bg-gray-50 p-6 dark:bg-gray-950"><div className="mx-auto max-w-5xl pt-20"><AdminLoading /></div></main>;
  }

  return children;
}
