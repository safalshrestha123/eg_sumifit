import type { Metadata } from "next";

import { EnrollmentsTable } from "@/components/admin/enrollments-table";
import { AdminPageHeader } from "@/components/admin/page-header";

export const metadata: Metadata = { title: "Program enrollments" };

export default function AdminEnrollmentsPage() {
  return <><AdminPageHeader eyebrow="Client programs" title="Program enrollments" description="Review client program requests and update their enrollment status." /><EnrollmentsTable /></>;
}
