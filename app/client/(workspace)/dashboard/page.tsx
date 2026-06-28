import type { Metadata } from "next";

import { ClientDashboard } from "@/components/client/client-dashboard";

export const metadata: Metadata = { title: "Dashboard" };

export default function ClientDashboardPage() {
  return <ClientDashboard />;
}
