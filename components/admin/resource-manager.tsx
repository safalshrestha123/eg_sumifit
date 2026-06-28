"use client";

import { FilePenLine, Plus, Search, Trash2 } from "lucide-react";
import Image from "next/image";
import { useMemo, useState, type FormEvent } from "react";

import { EmptyState } from "@/components/admin/empty-state";
import { AdminPageHeader } from "@/components/admin/page-header";
import { PublishToggle } from "@/components/admin/publish-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { AdminCollectionItem } from "@/features/admin/types";

interface ResourceManagerProps {
  eyebrow: string;
  title: string;
  description: string;
  singular: string;
  items: AdminCollectionItem[];
  view?: "list" | "gallery";
}

export function ResourceManager({ eyebrow, title, description, singular, items: initialItems, view = "list" }: ResourceManagerProps) {
  const [items, setItems] = useState(initialItems);
  const [query, setQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AdminCollectionItem | null>(null);
  const [published, setPublished] = useState(true);

  const filteredItems = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return items;
    return items.filter((item) => `${item.title} ${item.description} ${item.meta}`.toLowerCase().includes(search));
  }, [items, query]);

  const openCreate = () => {
    setEditing(null);
    setPublished(true);
    setDialogOpen(true);
  };

  const openEdit = (item: AdminCollectionItem) => {
    setEditing(item);
    setPublished(item.status === "Published");
    setDialogOpen(true);
  };

  const saveItem = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nextItem: AdminCollectionItem = {
      id: editing?.id ?? `${singular.toLowerCase().replaceAll(" ", "-")}-${Date.now()}`,
      title: String(form.get("title")),
      description: String(form.get("description")),
      meta: String(form.get("meta")),
      status: published ? "Published" : "Draft",
      image: editing?.image ?? (view === "gallery" ? "/images/training.png" : undefined),
    };

    setItems((current) => editing ? current.map((item) => item.id === editing.id ? nextItem : item) : [nextItem, ...current]);
    setDialogOpen(false);
  };

  const togglePublished = (id: string, isPublished: boolean) => {
    setItems((current) => current.map((item) => item.id === id ? { ...item, status: isPublished ? "Published" : "Draft" } : item));
  };

  const removeItem = (id: string) => setItems((current) => current.filter((item) => item.id !== id));

  return (
    <>
      <AdminPageHeader eyebrow={eyebrow} title={title} description={description} action={<Button type="button" onClick={openCreate}><Plus className="size-4" /> Add {singular.toLowerCase()}</Button>} />

      <Card className="mt-8 overflow-hidden rounded-2xl">
        <div className="flex flex-col gap-4 border-b border-gray-100 p-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="relative w-full sm:max-w-sm"><Search className="pointer-events-none absolute left-3.5 top-3.5 size-4 text-gray-400" /><Input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${title.toLowerCase()}…`} aria-label={`Search ${title}`} className="pl-10" /></div>
          <p className="text-xs font-semibold text-gray-500">{filteredItems.length} of {items.length} items</p>
        </div>

        {filteredItems.length === 0 ? (
          <div className="p-5"><EmptyState title={items.length === 0 ? `No ${title.toLowerCase()} yet` : "No matching content"} description={items.length === 0 ? `Create the first ${singular.toLowerCase()} to begin building this section.` : "Try a different search term or clear the current filter."} action={items.length === 0 ? <Button type="button" onClick={openCreate}><Plus className="size-4" /> Add {singular.toLowerCase()}</Button> : <Button type="button" variant="outline" onClick={() => setQuery("")}>Clear search</Button>} /></div>
        ) : view === "gallery" ? (
          <div className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3 sm:p-5">
            {filteredItems.map((item) => (
              <article key={item.id} className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
                <div className="relative aspect-[4/3] bg-gray-100 dark:bg-gray-950"><Image src={item.image ?? "/images/training.png"} alt={item.title} fill sizes="(min-width: 1280px) 25vw, (min-width: 640px) 40vw, 90vw" className="object-cover" /></div>
                <div className="p-4"><div className="flex items-start justify-between gap-3"><div><h2 className="font-bold">{item.title}</h2><p className="mt-1 text-xs text-gray-500">{item.meta}</p></div><Badge variant={item.status === "Published" ? "success" : "warning"}>{item.status}</Badge></div><p className="mt-3 line-clamp-2 text-sm text-gray-500">{item.description}</p><div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-100 pt-4 dark:border-gray-800"><PublishToggle published={item.status === "Published"} label={item.title} onChange={(value) => togglePublished(item.id, value)} /><ItemActions item={item} singular={singular} onEdit={openEdit} onRemove={removeItem} /></div></div>
              </article>
            ))}
          </div>
        ) : (
          <div>
            <div className="hidden grid-cols-[minmax(0,1fr)_11rem_9rem_6rem] gap-4 border-b border-gray-100 bg-gray-50 px-5 py-3 text-[0.65rem] font-bold uppercase tracking-wider text-gray-400 dark:border-gray-800 dark:bg-gray-950/50 md:grid"><span>Content</span><span>Visibility</span><span>Status</span><span className="text-right">Actions</span></div>
            {filteredItems.map((item) => (
              <article key={item.id} className="grid gap-4 border-b border-gray-100 p-5 last:border-0 dark:border-gray-800 md:grid-cols-[minmax(0,1fr)_11rem_9rem_6rem] md:items-center">
                <div className="min-w-0"><h2 className="truncate font-bold">{item.title}</h2><p className="mt-1 line-clamp-1 text-sm text-gray-500">{item.description}</p><p className="mt-2 text-xs font-semibold text-gray-400">{item.meta}</p></div>
                <PublishToggle published={item.status === "Published"} label={item.title} onChange={(value) => togglePublished(item.id, value)} />
                <div><Badge variant={item.status === "Published" ? "success" : "warning"}>{item.status}</Badge></div>
                <ItemActions item={item} singular={singular} onEdit={openEdit} onRemove={removeItem} />
              </article>
            ))}
          </div>
        )}
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl overflow-y-auto bg-white p-0 text-gray-950 dark:bg-gray-900 dark:text-white">
          <div className="border-b border-gray-100 px-6 py-5 pr-16 dark:border-gray-800"><DialogTitle className="text-xl font-black">{editing ? `Edit ${singular.toLowerCase()}` : `Add ${singular.toLowerCase()}`}</DialogTitle><DialogDescription className="mt-1 text-sm text-gray-500">Changes stay in this browser session and are not sent to a backend.</DialogDescription></div>
          <form onSubmit={saveItem} className="space-y-5 p-6">
            <div className="space-y-2"><Label htmlFor="resource-title">Title</Label><Input id="resource-title" name="title" defaultValue={editing?.title} required placeholder={`${singular} title`} /></div>
            <div className="space-y-2"><Label htmlFor="resource-description">Description</Label><Textarea id="resource-description" name="description" defaultValue={editing?.description} required placeholder="Add a clear website description…" /></div>
            <div className="space-y-2"><Label htmlFor="resource-meta">Details</Label><Input id="resource-meta" name="meta" defaultValue={editing?.meta} required placeholder="Date, category, result, or format" /></div>
            <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-4 dark:bg-gray-950"><div><p className="text-sm font-bold">Publish on website</p><p className="mt-1 text-xs text-gray-500">Draft items remain hidden from public pages.</p></div><Switch checked={published} onCheckedChange={setPublished} aria-label="Publish on website" /></div>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button type="submit">{editing ? "Save changes" : `Create ${singular.toLowerCase()}`}</Button></div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ItemActions({ item, singular, onEdit, onRemove }: { item: AdminCollectionItem; singular: string; onEdit: (item: AdminCollectionItem) => void; onRemove: (id: string) => void }) {
  return (
    <div className="flex justify-end gap-1">
      <Button type="button" variant="ghost" size="icon" onClick={() => onEdit(item)} aria-label={`Edit ${item.title}`}><FilePenLine className="size-4" /></Button>
      <Button type="button" variant="ghost" size="icon" className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-500/10" onClick={() => onRemove(item.id)} aria-label={`Delete ${singular.toLowerCase()} ${item.title}`}><Trash2 className="size-4" /></Button>
    </div>
  );
}
