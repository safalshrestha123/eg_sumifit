import type { Metadata } from "next";

import { ResourceManager } from "@/components/admin/resource-manager";

export const metadata: Metadata = { title: "Certifications" };

export default function AdminCertificationsPage() {
  return <ResourceManager resource="certifications" eyebrow="Qualifications" title="Certifications" description="Keep professional credentials, issuers, and renewal details organized and publication-ready." singular="Certification" />;
}
