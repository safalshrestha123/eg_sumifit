import type { Metadata } from "next";

import { ResourceManager } from "@/components/admin/resource-manager";

export const metadata: Metadata = { title: "Testimonials" };

export default function AdminTestimonialsPage() {
  return <ResourceManager resource="testimonials" eyebrow="Social proof" title="Testimonials" description="Review client stories, outcomes, and publication status from one consistent workspace." singular="Testimonial" />;
}
