import { Camera } from "lucide-react";

import { MotionReveal } from "@/components/shared/motion-reveal";
import { PublicDataState } from "@/components/shared/public-data-state";
import { SectionTitle } from "@/components/shared/section-title";
import { Button } from "@/components/ui/button";
import { GalleryGrid } from "@/features/gallery/gallery-grid";
import { getPublicGallery } from "@/lib/api/public";
import { siteConfig } from "@/lib/site";
import type { GalleryItem } from "@/types";

const layoutClasses = ["md:row-span-2", "", "md:col-span-2", "md:row-span-2", "", ""];

export async function GallerySection({ preview = false }: { preview?: boolean }) {
  const result = await getPublicGallery();
  if (!result.ok) return <section className="section-padding bg-gray-50 dark:bg-gray-900/50"><div className="container-shell"><PublicDataState error title="Gallery unavailable" description={result.message} /></div></section>;

  const galleryItems: GalleryItem[] = result.data.data.map((item, index) => ({
    id: item.id,
    src: item.imageUrl,
    alt: item.altText,
    category: item.category || item.title,
    className: layoutClasses[index % layoutClasses.length] ?? "",
  }));
  const visibleItems = preview ? galleryItems.slice(0, 4) : galleryItems;
  return (
    <section className="section-padding bg-gray-50 dark:bg-gray-900/50">
      <div className="container-shell">
        <MotionReveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionTitle eyebrow="Real work. Real energy." title="Strength in motion." description="A look inside the sessions, moments, and progress that define the SumiFitness community." />
          <Button asChild variant="outline"><a href={siteConfig.instagram} target="_blank" rel="noreferrer"><Camera className="size-4" /> Follow on Instagram</a></Button>
        </MotionReveal>
        <MotionReveal className="mt-12">{visibleItems.length > 0 ? <GalleryGrid items={visibleItems} /> : <PublicDataState title="No gallery images published yet" description="Published training photos will appear here." />}</MotionReveal>
      </div>
    </section>
  );
}
