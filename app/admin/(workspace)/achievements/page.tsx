import type { Metadata } from "next";

import { ResourceManager } from "@/components/admin/resource-manager";

export const metadata: Metadata = { title: "Achievements" };

export default function AdminAchievementsPage() {
  return <ResourceManager resource="achievements" eyebrow="Credibility" title="Achievements" description="Maintain the milestones, competition results, and career moments shown across the website." singular="Achievement" />;
}
