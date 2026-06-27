import type { ReactNode } from "react";

import { ClientAuthGuard } from "@/components/client/client-auth-guard";
import { ClientShell } from "@/components/client/client-shell";

export default function ClientWorkspaceLayout({ children }: { children: ReactNode }) {
  return <ClientAuthGuard><ClientShell>{children}</ClientShell></ClientAuthGuard>;
}
