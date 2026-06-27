import { Camera } from "lucide-react";

import { MotionReveal } from "@/components/shared/motion-reveal";
import { SectionTitle } from "@/components/shared/section-title";
import { Button } from "@/components/ui/button";
import { galleryItems } from "@/features/gallery/data";
import { GalleryGrid } from "@/features/gallery/gallery-grid";
import { siteConfig } from "@/lib/site";

export function GallerySection({ preview = false }: { preview?: boolean }) {
  return (
    <section className="section-padding bg-gray-50 dark:bg-gray-900/50">
      <div className="container-shell">
        <MotionReveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionTitle eyebrow="Real work. Real energy." title="Strength in motion." description="A look inside the sessions, moments, and progress that define the SumiFitness community." />
          <Button asChild variant="outline"><a href={siteConfig.instagram} target="_blank" rel="noreferrer"><Camera className="size-4" /> Follow on Instagram</a></Button>
        </MotionReveal>
        <MotionReveal className="mt-12"><GalleryGrid items={preview ? galleryItems.slice(0, 4) : galleryItems} /></MotionReveal>
      </div>
    </section>
  );
}
