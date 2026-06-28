"use client";

import { AlertCircle, FilePenLine, Loader2, Plus, Search, Trash2 } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";

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
import { fieldValue, parseResourceForm, resourceConfigs, type CmsField } from "@/features/admin/cms-resources";
import type { AdminCollectionItem, CmsRecord, CmsResource } from "@/features/admin/types";
import { apiRequest, errorMessage } from "@/lib/api/client";

interface ResourceManagerProps {
  resource: CmsResource;
  eyebrow: string;
  title: string;
  description: string;
  singular: string;
  view?: "list" | "gallery";
}

export function ResourceManager({ resource, eyebrow, title, description, singular, view = "list" }: ResourceManagerProps) {
  const config = resourceConfigs[resource];
  const [records, setRecords] = useState<CmsRecord[]>([]);
  const [query, setQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<CmsRecord | null>(null);
  const [published, setPublished] = useState(true);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadRecords = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest<{ data: CmsRecord[] }>(`${config.endpoint}?pageSize=100`);
      setRecords(response.data);
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, [config.endpoint]);

  useEffect(() => {
    let active = true;
    void apiRequest<{ data: CmsRecord[] }>(`${config.endpoint}?pageSize=100`)
      .then((response) => {
        if (active) setRecords(response.data);
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
  }, [config.endpoint]);

  const items = useMemo(() => records.map(config.toDisplay), [config, records]);
  const filteredItems = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return items;
    return items.filter((item) => `${item.title} ${item.description} ${item.meta}`.toLowerCase().includes(search));
  }, [items, query]);

  const openCreate = () => {
    setEditing(null);
    setPublished(true);
    setFormError(null);
    setDialogOpen(true);
  };

  const openEdit = (item: AdminCollectionItem) => {
    if (!item.record) return;
    setEditing(item.record);
    setPublished(item.record.published);
    setFormError(null);
    setDialogOpen(true);
  };

  const saveItem = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    const parsed = parseResourceForm(resource, new FormData(event.currentTarget), published);
    if (!parsed.success) {
      setFormError(parsed.error);
      return;
    }

    setSubmitting(true);
    try {
      const endpoint = editing ? `${config.endpoint}/${editing.id}` : config.endpoint;
      const response = await apiRequest<Record<string, CmsRecord>>(endpoint, {
        method: editing ? "PATCH" : "POST",
        body: JSON.stringify(parsed.data),
      });
      const saved = response[config.responseKey];
      if (!saved) throw new Error("The API returned an invalid response.");
      setRecords((current) => editing ? current.map((record) => record.id === saved.id ? saved : record) : [saved, ...current]);
      setSuccess(`${singular} ${editing ? "updated" : "created"}.`);
      setDialogOpen(false);
    } catch (requestError) {
      setFormError(errorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  };

  const togglePublished = async (id: string, isPublished: boolean) => {
    setActiveId(id);
    setError(null);
    try {
      const response = await apiRequest<Record<string, CmsRecord>>(`${config.endpoint}/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ published: isPublished }),
      });
      const updated = response[config.responseKey];
      setRecords((current) => current.map((record) => record.id === id ? updated : record));
      setSuccess(`${singular} ${isPublished ? "published" : "unpublished"}.`);
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setActiveId(null);
    }
  };

  const removeItem = async (id: string) => {
    setActiveId(id);
    setError(null);
    try {
      await apiRequest(`${config.endpoint}/${id}`, { method: "DELETE" });
      setRecords((current) => current.filter((record) => record.id !== id));
      setSuccess(`${singular} deleted.`);
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setActiveId(null);
    }
  };

  return (
    <>
      <AdminPageHeader eyebrow={eyebrow} title={title} description={description} action={<Button type="button" onClick={openCreate}><Plus className="size-4" /> Add {singular.toLowerCase()}</Button>} />

      {(error || success) && (
        <div className={`mt-6 flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${error ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300" : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300"}`} role={error ? "alert" : "status"}>
          <span className="flex items-center gap-2">{error && <AlertCircle className="size-4" />}{error ?? success}</span>
          {error && <Button type="button" size="sm" variant="outline" onClick={() => void loadRecords()}>Retry</Button>}
        </div>
      )}

      <Card className="mt-8 overflow-hidden rounded-2xl">
        <div className="flex flex-col gap-4 border-b border-gray-100 p-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="relative w-full sm:max-w-sm"><Search className="pointer-events-none absolute left-3.5 top-3.5 size-4 text-gray-400" /><Input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${title.toLowerCase()}…`} aria-label={`Search ${title}`} className="pl-10" /></div>
          <p className="text-xs font-semibold text-gray-500">{filteredItems.length} of {items.length} items</p>
        </div>

        {loading ? (
          <div className="flex min-h-56 items-center justify-center gap-3 text-sm font-semibold text-gray-500" role="status"><Loader2 className="size-5 animate-spin" /> Loading {title.toLowerCase()}…</div>
        ) : filteredItems.length === 0 ? (
          <div className="p-5"><EmptyState title={items.length === 0 ? `No ${title.toLowerCase()} yet` : "No matching content"} description={items.length === 0 ? `Create the first ${singular.toLowerCase()} to begin building this section.` : "Try a different search term or clear the current filter."} action={items.length === 0 ? <Button type="button" onClick={openCreate}><Plus className="size-4" /> Add {singular.toLowerCase()}</Button> : <Button type="button" variant="outline" onClick={() => setQuery("")}>Clear search</Button>} /></div>
        ) : view === "gallery" ? (
          <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-3">
            {filteredItems.map((item) => (
              <article key={item.id} className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
                <div className="relative aspect-[4/3] bg-gray-100 dark:bg-gray-950"><Image src={item.image?.startsWith("/") ? item.image : "/images/training.png"} alt={item.title} fill sizes="(min-width: 1280px) 25vw, (min-width: 640px) 40vw, 90vw" className="object-cover" /></div>
                <div className="p-4"><div className="flex items-start justify-between gap-3"><div><h2 className="font-bold">{item.title}</h2><p className="mt-1 text-xs text-gray-500">{item.meta}</p></div><Badge variant={item.status === "Published" ? "success" : "warning"}>{item.status}</Badge></div><p className="mt-3 line-clamp-2 text-sm text-gray-500">{item.description}</p><div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-100 pt-4 dark:border-gray-800"><PublishToggle published={item.status === "Published"} label={item.title} disabled={activeId === item.id} onChange={(value) => void togglePublished(item.id, value)} /><ItemActions item={item} singular={singular} disabled={activeId === item.id} onEdit={openEdit} onRemove={(id) => void removeItem(id)} /></div></div>
              </article>
            ))}
          </div>
        ) : (
          <div>
            <div className="hidden grid-cols-[minmax(0,1fr)_11rem_9rem_6rem] gap-4 border-b border-gray-100 bg-gray-50 px-5 py-3 text-[0.65rem] font-bold uppercase tracking-wider text-gray-400 dark:border-gray-800 dark:bg-gray-950/50 md:grid"><span>Content</span><span>Visibility</span><span>Status</span><span className="text-right">Actions</span></div>
            {filteredItems.map((item) => (
              <article key={item.id} className="grid gap-4 border-b border-gray-100 p-5 last:border-0 dark:border-gray-800 md:grid-cols-[minmax(0,1fr)_11rem_9rem_6rem] md:items-center">
                <div className="min-w-0"><h2 className="truncate font-bold">{item.title}</h2><p className="mt-1 line-clamp-1 text-sm text-gray-500">{item.description}</p><p className="mt-2 text-xs font-semibold text-gray-400">{item.meta}</p></div>
                <PublishToggle published={item.status === "Published"} label={item.title} disabled={activeId === item.id} onChange={(value) => void togglePublished(item.id, value)} />
                <div><Badge variant={item.status === "Published" ? "success" : "warning"}>{item.status}</Badge></div>
                <ItemActions item={item} singular={singular} disabled={activeId === item.id} onEdit={openEdit} onRemove={(id) => void removeItem(id)} />
              </article>
            ))}
          </div>
        )}
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto bg-white p-0 text-gray-950 dark:bg-gray-900 dark:text-white">
          <div className="border-b border-gray-100 px-6 py-5 pr-16 dark:border-gray-800"><DialogTitle className="text-xl font-black">{editing ? `Edit ${singular.toLowerCase()}` : `Add ${singular.toLowerCase()}`}</DialogTitle><DialogDescription className="mt-1 text-sm text-gray-500">Save this content to the CMS API and control its public visibility.</DialogDescription></div>
          <form key={editing?.id ?? "create"} onSubmit={saveItem} className="space-y-5 p-6">
            {config.fields.map((field) => <ResourceField key={field.name} field={field} record={editing} resource={resource} />)}
            <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-4 dark:bg-gray-950"><div><p className="text-sm font-bold">Publish on website</p><p className="mt-1 text-xs text-gray-500">Draft items remain hidden from public API responses.</p></div><Switch checked={published} onCheckedChange={setPublished} aria-label="Publish on website" /></div>
            {formError && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:bg-red-950/30 dark:text-red-300" role="alert">{formError}</p>}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><Button type="button" variant="outline" disabled={submitting} onClick={() => setDialogOpen(false)}>Cancel</Button><Button type="submit" disabled={submitting}>{submitting && <Loader2 className="size-4 animate-spin" />}{editing ? "Save changes" : `Create ${singular.toLowerCase()}`}</Button></div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ResourceField({ field, record, resource }: { field: CmsField; record: CmsRecord | null; resource: CmsResource }) {
  const id = `${resource}-${field.name}`;
  const shared = { id, name: field.name, defaultValue: fieldValue(record, field), required: field.required, placeholder: field.placeholder };
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{field.label}</Label>
      {field.type === "textarea" || field.type === "list" ? <Textarea {...shared} className={field.type === "list" ? "min-h-28" : undefined} /> : <Input {...shared} type={field.type === "number" ? "number" : field.type} min={field.min} max={field.max} />}
      {field.type === "list" && <p className="text-xs text-gray-400">Enter one item per line.</p>}
    </div>
  );
}

function ItemActions({ item, singular, disabled, onEdit, onRemove }: { item: AdminCollectionItem; singular: string; disabled: boolean; onEdit: (item: AdminCollectionItem) => void; onRemove: (id: string) => void }) {
  return (
    <div className="flex justify-end gap-1">
      <Button type="button" variant="ghost" size="icon" disabled={disabled} onClick={() => onEdit(item)} aria-label={`Edit ${item.title}`}><FilePenLine className="size-4" /></Button>
      <Button type="button" variant="ghost" size="icon" disabled={disabled} className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-500/10" onClick={() => onRemove(item.id)} aria-label={`Delete ${singular.toLowerCase()} ${item.title}`}>{disabled ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}</Button>
    </div>
  );
}
