import type { Metadata } from "next";

import { AdminPageHeader } from "@/components/admin/page-header";
import { MessagesTable } from "@/components/admin/messages-table";

export const metadata: Metadata = { title: "Messages" };

export default function AdminMessagesPage() {
  return <><AdminPageHeader eyebrow="Client enquiries" title="Contact messages" description="Review and manage enquiries submitted through the public contact API." /><MessagesTable /></>;
}
