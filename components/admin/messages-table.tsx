"use client";

import { Mail, MailOpen, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { EmptyState } from "@/components/admin/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { ContactMessage } from "@/features/admin/types";

export function MessagesTable({ initialMessages }: { initialMessages: ContactMessage[] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const visibleMessages = useMemo(() => {
    const search = query.trim().toLowerCase();
    return messages.filter((message) => {
      const matchesFilter = filter === "all" || !message.read;
      const matchesSearch = !search || `${message.name} ${message.email} ${message.subject} ${message.preview}`.toLowerCase().includes(search);
      return matchesFilter && matchesSearch;
    });
  }, [filter, messages, query]);

  const toggleRead = (id: string) => setMessages((current) => current.map((message) => message.id === id ? { ...message, read: !message.read } : message));
  const remove = (id: string) => setMessages((current) => current.filter((message) => message.id !== id));

  return (
    <Card className="mt-8 overflow-hidden rounded-2xl shadow-none">
      <div className="flex flex-col gap-4 border-b border-gray-100 p-4 dark:border-gray-800 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm"><Search className="pointer-events-none absolute left-3.5 top-3.5 size-4 text-gray-400" /><Input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search messages…" aria-label="Search messages" className="pl-10" /></div>
        <div className="flex items-center gap-2"><Button type="button" size="sm" variant={filter === "all" ? "secondary" : "ghost"} onClick={() => setFilter("all")}>All <Badge variant="muted" className="ml-1">{messages.length}</Badge></Button><Button type="button" size="sm" variant={filter === "unread" ? "secondary" : "ghost"} onClick={() => setFilter("unread")}>Unread <Badge variant="default" className="ml-1">{messages.filter((message) => !message.read).length}</Badge></Button></div>
      </div>

      {visibleMessages.length === 0 ? (
        <div className="p-5"><EmptyState title="No messages found" description={messages.length === 0 ? "New contact form messages will appear here once a backend is connected." : "No messages match the current search and filter."} action={messages.length > 0 ? <Button type="button" variant="outline" onClick={() => { setQuery(""); setFilter("all"); }}>Clear filters</Button> : undefined} /></div>
      ) : (
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {visibleMessages.map((message) => (
            <article key={message.id} className={message.read ? "p-5" : "bg-orange-50/50 p-5 dark:bg-orange-500/5"}>
              <div className="grid gap-4 lg:grid-cols-[12rem_minmax(0,1fr)_8rem_6rem] lg:items-center">
                <div className="min-w-0"><div className="flex items-center gap-2"><span className={message.read ? "size-2 rounded-full bg-gray-300" : "size-2 rounded-full bg-orange-500"} /><h2 className="truncate text-sm font-bold">{message.name}</h2></div><a href={`mailto:${message.email}`} className="mt-1 block truncate pl-4 text-xs text-gray-500 hover:text-orange-600">{message.email}</a></div>
                <div className="min-w-0"><p className="truncate text-sm font-semibold">{message.subject}</p><p className="mt-1 line-clamp-1 text-sm text-gray-500">{message.preview}</p></div>
                <time className="text-xs font-medium text-gray-400">{message.receivedAt}</time>
                <div className="flex justify-end gap-1"><Button type="button" variant="ghost" size="icon" onClick={() => toggleRead(message.id)} aria-label={`Mark ${message.subject} as ${message.read ? "unread" : "read"}`}>{message.read ? <Mail className="size-4" /> : <MailOpen className="size-4" />}</Button><Button type="button" variant="ghost" size="icon" className="text-red-600 hover:bg-red-50" onClick={() => remove(message.id)} aria-label={`Delete message from ${message.name}`}><Trash2 className="size-4" /></Button></div>
              </div>
            </article>
          ))}
        </div>
      )}
    </Card>
  );
}
