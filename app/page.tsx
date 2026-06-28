import { Suspense } from "react";

import { ContactCta } from "@/components/shared/contact-cta";
import { PublicSectionLoading } from "@/components/shared/public-data-state";
import { AboutSection } from "@/features/about/about-section";
import { AchievementsSection } from "@/features/achievements/achievements-section";
import { GallerySection } from "@/features/gallery/gallery-section";
import { Hero } from "@/features/home/hero";
import { InstagramCta } from "@/features/home/instagram-cta";
import { ProgramsSection } from "@/features/programs/programs-section";
import { TestimonialsSection } from "@/features/testimonials/testimonials-section";

export default function HomePage() {
  return (
    <>
      <Suspense fallback={<PublicSectionLoading label="Loading trainer profile" />}><Hero /></Suspense>
      <Suspense fallback={<PublicSectionLoading label="Loading about Sumi" />}><AboutSection preview /></Suspense>
      <Suspense fallback={<PublicSectionLoading muted label="Loading programs" />}><ProgramsSection preview /></Suspense>
      <Suspense fallback={<PublicSectionLoading label="Loading achievements" />}><AchievementsSection /></Suspense>
      <Suspense fallback={<PublicSectionLoading muted label="Loading gallery" />}><GallerySection preview /></Suspense>
      <Suspense fallback={<PublicSectionLoading label="Loading client stories" />}><TestimonialsSection /></Suspense>
      <InstagramCta />
      <ContactCta />
    </>
  );
}
