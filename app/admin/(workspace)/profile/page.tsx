import type { Metadata } from "next";

import { AdminPageHeader } from "@/components/admin/page-header";
import { ProfileForm } from "@/components/admin/profile-form";

export const metadata: Metadata = { title: "Trainer profile" };

export default function AdminProfilePage() {
  return <><AdminPageHeader eyebrow="Personal brand" title="Trainer profile" description="Control the biography, image, and key experience details shown throughout SumiFitness." /><ProfileForm /></>;
}
