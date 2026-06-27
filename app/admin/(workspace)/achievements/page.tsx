import type { Metadata } from "next";

import { ResourceManager } from "@/components/admin/resource-manager";
import { achievements } from "@/features/admin/mock-data";

export const metadata: Metadata = { title: "Achievements" };

export default function AdminAchievementsPage() {
  return <ResourceManager eyebrow="Credibility" title="Achievements" description="Maintain the milestones, competition results, and career moments shown across the website." singular="Achievement" items={achievements} />;
}
