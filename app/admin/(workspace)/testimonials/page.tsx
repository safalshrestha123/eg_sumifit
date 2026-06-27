import type { Metadata } from "next";

import { ResourceManager } from "@/components/admin/resource-manager";
import { testimonials } from "@/features/admin/mock-data";

export const metadata: Metadata = { title: "Testimonials" };

export default function AdminTestimonialsPage() {
  return <ResourceManager eyebrow="Social proof" title="Testimonials" description="Review client stories, outcomes, and publication status from one consistent workspace." singular="Testimonial" items={testimonials} />;
}
