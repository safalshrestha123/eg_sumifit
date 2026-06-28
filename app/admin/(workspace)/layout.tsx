import type { ReactNode } from "react";

import { AdminAuthGuard } from "@/components/admin/auth-guard";
import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminWorkspaceLayout({ children }: { children: ReactNode }) {
  return <AdminAuthGuard><AdminShell>{children}</AdminShell></AdminAuthGuard>;
}
