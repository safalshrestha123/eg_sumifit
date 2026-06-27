import type { Metadata } from "next";

import { ResourceManager } from "@/components/admin/resource-manager";

export const metadata: Metadata = { title: "Programs" };

export default function AdminProgramsPage() {
  return <ResourceManager resource="programs" eyebrow="Services" title="Programs" description="Create and maintain the coaching offers clients can discover on the public website." singular="Program" />;
}
