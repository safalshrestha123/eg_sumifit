import type { Metadata } from "next";

import { AdminPageHeader } from "@/components/admin/page-header";
import { MessagesTable } from "@/components/admin/messages-table";
import { messages } from "@/features/admin/mock-data";

export const metadata: Metadata = { title: "Messages" };

export default function AdminMessagesPage() {
  return <><AdminPageHeader eyebrow="Client enquiries" title="Contact messages" description="Review the mock enquiries submitted through the public contact experience. No messages are fetched or persisted." /><MessagesTable initialMessages={messages} /></>;
}
