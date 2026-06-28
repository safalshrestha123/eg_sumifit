import type { Metadata } from "next";

import { ResourceManager } from "@/components/admin/resource-manager";
import { certifications } from "@/features/admin/mock-data";

export const metadata: Metadata = { title: "Certifications" };

export default function AdminCertificationsPage() {
  return <ResourceManager eyebrow="Qualifications" title="Certifications" description="Keep professional credentials, issuers, and renewal details organized and publication-ready." singular="Certification" items={certifications} />;
}
