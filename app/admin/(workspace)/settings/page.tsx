import type { Metadata } from "next";

import { AdminPageHeader } from "@/components/admin/page-header";
import { SettingsForm } from "@/components/admin/settings-form";

export const metadata: Metadata = { title: "Settings" };

export default function AdminSettingsPage() {
  return <><AdminPageHeader eyebrow="Workspace" title="Website settings" description="Manage the mock site identity, social links, publishing defaults, and workspace preferences." /><SettingsForm /></>;
}
