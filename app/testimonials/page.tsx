import { Suspense } from "react";

import { ContactCta } from "@/components/shared/contact-cta";
import { PageHero } from "@/components/shared/page-hero";
import { PublicSectionLoading } from "@/components/shared/public-data-state";
import { TestimonialsSection } from "@/features/testimonials/testimonials-section";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Client Stories",
  description: "Read strength, confidence, and transformation stories from SumiFitness clients.",
  path: "/testimonials",
});

export default function TestimonialsPage() {
  return <><PageHero eyebrow="Client stories" title="Results that reach far beyond the mirror." description="Real people, real constraints, and progress built through a process designed to last." /><Suspense fallback={<PublicSectionLoading label="Loading client stories" />}><TestimonialsSection /></Suspense><ContactCta /></>;
}
