"use client";

import { AlertCircle, Loader2, Mail, MailOpen, Search, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { EmptyState } from "@/components/admin/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { ContactMessage } from "@/features/admin/types";
import { apiRequest, errorMessage } from "@/lib/api/client";

export function MessagesTable() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadMessages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest<{ data: ContactMessage[] }>("/api/cms/messages?pageSize=100");
      setMessages(response.data);
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    void apiRequest<{ data: ContactMessage[] }>("/api/cms/messages?pageSize=100")
      .then((response) => {
        if (active) setMessages(response.data);
      })
      .catch((requestError: unknown) => {
        if (active) setError(errorMessage(requestError));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const visibleMessages = useMemo(() => {
    const search = query.trim().toLowerCase();
    return messages.filter((message) => {
      const matchesFilter = filter === "all" || !message.read;
      const matchesSearch = !search || `${message.name} ${message.email} ${message.subject ?? ""} ${message.message}`.toLowerCase().includes(search);
      return matchesFilter && matchesSearch;
    });
  }, [filter, messages, query]);

  const toggleRead = async (message: ContactMessage) => {
    setActiveId(message.id);
    setError(null);
    try {
      const response = await apiRequest<{ message: ContactMessage }>(`/api/cms/messages/${message.id}`, {
        method: "PATCH",
        body: JSON.stringify({ read: !message.read }),
      });
      setMessages((current) => current.map((item) => item.id === message.id ? response.message : item));
      setSuccess(`Message marked ${message.read ? "unread" : "read"}.`);
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setActiveId(null);
    }
  };

  const remove = async (id: string) => {
    setActiveId(id);
    setError(null);
    try {
      await apiRequest(`/api/cms/messages/${id}`, { method: "DELETE" });
      setMessages((current) => current.filter((message) => message.id !== id));
      setSuccess("Message deleted.");
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setActiveId(null);
    }
  };

  return (
    <>
      {(error || success) && <div className={`mt-6 flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${error ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300" : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300"}`} role={error ? "alert" : "status"}><span className="flex items-center gap-2">{error && <AlertCircle className="size-4" />}{error ?? success}</span>{error && <Button type="button" size="sm" variant="outline" onClick={() => void loadMessages()}>Retry</Button>}</div>}
      <Card className="mt-8 overflow-hidden rounded-2xl shadow-none">
        <div className="flex flex-col gap-4 border-b border-gray-100 p-4 dark:border-gray-800 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm"><Search className="pointer-events-none absolute left-3.5 top-3.5 size-4 text-gray-400" /><Input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search messages…" aria-label="Search messages" className="pl-10" /></div>
          <div className="flex items-center gap-2"><Button type="button" size="sm" variant={filter === "all" ? "secondary" : "ghost"} onClick={() => setFilter("all")}>All <Badge variant="muted" className="ml-1">{messages.length}</Badge></Button><Button type="button" size="sm" variant={filter === "unread" ? "secondary" : "ghost"} onClick={() => setFilter("unread")}>Unread <Badge variant="default" className="ml-1">{messages.filter((message) => !message.read).length}</Badge></Button></div>
        </div>

        {loading ? (
          <div className="flex min-h-56 items-center justify-center gap-3 text-sm font-semibold text-gray-500" role="status"><Loader2 className="size-5 animate-spin" /> Loading messages…</div>
        ) : visibleMessages.length === 0 ? (
          <div className="p-5"><EmptyState title="No messages found" description={messages.length === 0 ? "New public contact submissions will appear here." : "No messages match the current search and filter."} action={messages.length > 0 ? <Button type="button" variant="outline" onClick={() => { setQuery(""); setFilter("all"); }}>Clear filters</Button> : undefined} /></div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {visibleMessages.map((message) => (
              <article key={message.id} className={message.read ? "p-5" : "bg-orange-50/50 p-5 dark:bg-orange-500/5"}>
                <div className="grid gap-4 lg:grid-cols-[12rem_minmax(0,1fr)_8rem_6rem] lg:items-center">
                  <div className="min-w-0"><div className="flex items-center gap-2"><span className={message.read ? "size-2 rounded-full bg-gray-300" : "size-2 rounded-full bg-orange-500"} /><h2 className="truncate text-sm font-bold">{message.name}</h2></div><a href={`mailto:${message.email}`} className="mt-1 block truncate pl-4 text-xs text-gray-500 hover:text-orange-600">{message.email}</a></div>
                  <div className="min-w-0"><p className="truncate text-sm font-semibold">{message.subject || "Contact enquiry"}</p><p className="mt-1 line-clamp-2 text-sm text-gray-500">{message.message}</p></div>
                  <time dateTime={message.createdAt} className="text-xs font-medium text-gray-400">{formatDate(message.createdAt)}</time>
                  <div className="flex justify-end gap-1"><Button type="button" variant="ghost" size="icon" disabled={activeId === message.id} onClick={() => void toggleRead(message)} aria-label={`Mark ${message.subject || "message"} as ${message.read ? "unread" : "read"}`}>{activeId === message.id ? <Loader2 className="size-4 animate-spin" /> : message.read ? <Mail className="size-4" /> : <MailOpen className="size-4" />}</Button><Button type="button" variant="ghost" size="icon" disabled={activeId === message.id} className="text-red-600 hover:bg-red-50" onClick={() => void remove(message.id)} aria-label={`Delete message from ${message.name}`}><Trash2 className="size-4" /></Button></div>
                </div>
              </article>
            ))}
          </div>
        )}
      </Card>
    </>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(date);
}
