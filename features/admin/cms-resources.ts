import { z } from "zod";

import type { AdminCollectionItem, CmsRecord, CmsResource } from "@/features/admin/types";

export interface CmsField {
  name: keyof CmsRecord;
  label: string;
  type: "text" | "textarea" | "number" | "url" | "list";
  required?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
}

interface ResourceConfig {
  endpoint: string;
  responseKey: "achievement" | "certification" | "program" | "image" | "testimonial";
  fields: CmsField[];
  schema: z.ZodType;
  toDisplay: (record: CmsRecord) => AdminCollectionItem;
}

const nullableText = (max: number) => z.string().trim().max(max).nullable();
const sortOrder = z.number().int().min(0).max(100_000);

export const resourceConfigs: Record<CmsResource, ResourceConfig> = {
  achievements: {
    endpoint: "/api/cms/achievements",
    responseKey: "achievement",
    fields: [
      { name: "title", label: "Title", type: "text", required: true, placeholder: "Achievement title" },
      { name: "description", label: "Description", type: "textarea", required: true, placeholder: "Describe the milestone…" },
      { name: "year", label: "Year", type: "number", min: 1900, max: 2200 },
      { name: "category", label: "Category", type: "text", placeholder: "Milestone, competition…" },
      { name: "sortOrder", label: "Sort order", type: "number", min: 0 },
    ],
    schema: z.object({ title: z.string().trim().min(2).max(200), description: z.string().trim().min(2).max(2_000), year: z.number().int().min(1900).max(2200).nullable(), category: nullableText(100), sortOrder, published: z.boolean() }),
    toDisplay: (record) => display(record, record.title, record.description, [record.year, record.category].filter(Boolean).join(" · ")),
  },
  certifications: {
    endpoint: "/api/cms/certifications",
    responseKey: "certification",
    fields: [
      { name: "title", label: "Title", type: "text", required: true, placeholder: "Certification title" },
      { name: "issuer", label: "Issuer", type: "text", required: true, placeholder: "Issuing organization" },
      { name: "description", label: "Description", type: "textarea", placeholder: "What this qualification covers…" },
      { name: "credentialUrl", label: "Credential URL", type: "url", placeholder: "https://…" },
      { name: "sortOrder", label: "Sort order", type: "number", min: 0 },
    ],
    schema: z.object({ title: z.string().trim().min(2).max(200), issuer: z.string().trim().min(2).max(200), description: nullableText(2_000), credentialUrl: z.union([z.url().max(2_000), z.null()]), sortOrder, published: z.boolean() }),
    toDisplay: (record) => display(record, record.title, record.description ?? `Issued by ${record.issuer ?? "Unknown"}`, record.issuer ?? "Certification"),
  },
  programs: {
    endpoint: "/api/cms/programs",
    responseKey: "program",
    fields: [
      { name: "title", label: "Title", type: "text", required: true, placeholder: "Program title" },
      { name: "slug", label: "URL slug", type: "text", required: true, placeholder: "online-coaching" },
      { name: "description", label: "Description", type: "textarea", required: true, placeholder: "Describe the coaching offer…" },
      { name: "imageUrl", label: "Image URL", type: "text", placeholder: "/images/coaching.png" },
      { name: "duration", label: "Duration", type: "text", placeholder: "12 weeks" },
      { name: "format", label: "Format", type: "text", placeholder: "Online, in person…" },
      { name: "benefits", label: "Benefits", type: "list", placeholder: "One benefit per line" },
      { name: "sortOrder", label: "Sort order", type: "number", min: 0 },
    ],
    schema: z.object({ slug: z.string().trim().toLowerCase().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase URL slug."), title: z.string().trim().min(2).max(200), description: z.string().trim().min(2).max(5_000), imageUrl: nullableText(2_000), duration: nullableText(100), format: nullableText(100), benefits: z.array(z.string().min(1).max(200)).max(30), sortOrder, published: z.boolean() }),
    toDisplay: (record) => display(record, record.title, record.description, [record.duration, record.format].filter(Boolean).join(" · "), record.imageUrl ?? undefined),
  },
  gallery: {
    endpoint: "/api/cms/gallery",
    responseKey: "image",
    fields: [
      { name: "title", label: "Title", type: "text", required: true, placeholder: "Image title" },
      { name: "altText", label: "Alternative text", type: "text", required: true, placeholder: "Describe the image for accessibility" },
      { name: "imageUrl", label: "Image URL", type: "text", required: true, placeholder: "/images/training.png" },
      { name: "category", label: "Category", type: "text", placeholder: "Training, coaching…" },
      { name: "description", label: "Description", type: "textarea", placeholder: "Optional internal description…" },
      { name: "sortOrder", label: "Sort order", type: "number", min: 0 },
    ],
    schema: z.object({ title: z.string().trim().min(2).max(200), altText: z.string().trim().min(2).max(300), imageUrl: z.string().trim().min(1).max(2_000), category: nullableText(100), description: nullableText(2_000), sortOrder, published: z.boolean() }),
    toDisplay: (record) => display(record, record.title, record.description ?? record.altText, record.category ?? "Gallery", record.imageUrl ?? undefined),
  },
  testimonials: {
    endpoint: "/api/cms/testimonials",
    responseKey: "testimonial",
    fields: [
      { name: "name", label: "Client name", type: "text", required: true, placeholder: "Client name" },
      { name: "role", label: "Client context", type: "text", placeholder: "Online coaching client" },
      { name: "quote", label: "Testimonial", type: "textarea", required: true, placeholder: "Client story…" },
      { name: "result", label: "Result", type: "text", placeholder: "First unassisted pull-up" },
      { name: "rating", label: "Rating", type: "number", min: 1, max: 5 },
      { name: "sortOrder", label: "Sort order", type: "number", min: 0 },
    ],
    schema: z.object({ name: z.string().trim().min(2).max(150), role: nullableText(150), quote: z.string().trim().min(10).max(5_000), result: nullableText(300), rating: z.number().int().min(1).max(5), sortOrder, published: z.boolean() }),
    toDisplay: (record) => display(record, record.name, record.quote, [record.result, record.role].filter(Boolean).join(" · ")),
  },
};

export function parseResourceForm(resource: CmsResource, form: FormData, published: boolean) {
  const config = resourceConfigs[resource];
  const value: Record<string, unknown> = { published };

  for (const field of config.fields) {
    const raw = String(form.get(field.name) ?? "").trim();
    if (field.type === "number") value[field.name] = raw ? Number(raw) : field.name === "rating" ? 5 : field.name === "sortOrder" ? 0 : null;
    else if (field.type === "list") value[field.name] = raw ? raw.split(/[\n,]/).map((item) => item.trim()).filter(Boolean) : [];
    else value[field.name] = raw || null;
  }

  const result = config.schema.safeParse(value);
  if (!result.success) return { success: false as const, error: result.error.issues[0]?.message ?? "Check the form values." };
  return { success: true as const, data: result.data as Record<string, unknown> };
}

export function fieldValue(record: CmsRecord | null, field: CmsField) {
  if (!record) return field.name === "rating" ? "5" : field.name === "sortOrder" ? "0" : "";
  const value = record[field.name];
  if (Array.isArray(value)) return value.join("\n");
  return value == null ? "" : String(value);
}

function display(record: CmsRecord, title: string | undefined, description: string | null | undefined, meta: string, image?: string): AdminCollectionItem {
  return {
    id: record.id,
    title: title ?? "Untitled",
    description: description ?? "No description provided.",
    meta: meta || "No details",
    status: record.published ? "Published" : "Draft",
    image,
    record,
  };
}
