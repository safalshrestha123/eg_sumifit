import { Suspense } from "react";

import { ContactCta } from "@/components/shared/contact-cta";
import { PageHero } from "@/components/shared/page-hero";
import { PublicSectionLoading } from "@/components/shared/public-data-state";
import { GallerySection } from "@/features/gallery/gallery-section";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Training Gallery",
  description: "See the energy, coaching, and progress inside the SumiFitness training community.",
  path: "/gallery",
});

export default function GalleryPage() {
  return <><PageHero eyebrow="Gallery" title="A stronger life, captured in motion." description="Training is more than a workout. It is the confidence, focus, and community built along the way." /><Suspense fallback={<PublicSectionLoading muted label="Loading gallery" />}><GallerySection /></Suspense><ContactCta /></>;
}
