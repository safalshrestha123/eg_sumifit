import type { Metadata } from "next";

import { ResourceManager } from "@/components/admin/resource-manager";
import { programs } from "@/features/admin/mock-data";

export const metadata: Metadata = { title: "Programs" };

export default function AdminProgramsPage() {
  return <ResourceManager eyebrow="Services" title="Programs" description="Create and maintain the coaching offers clients can discover on the public website." singular="Program" items={programs} />;
}
