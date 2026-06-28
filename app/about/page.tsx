import { Suspense } from "react";

import { ContactCta } from "@/components/shared/contact-cta";
import { PageHero } from "@/components/shared/page-hero";
import { PublicSectionLoading } from "@/components/shared/public-data-state";
import { AboutSection } from "@/features/about/about-section";
import { CertificationsSection } from "@/features/certifications/certifications-section";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "About Sumi",
  description: "Meet Sumi and learn about her coaching philosophy, mission, experience, and fitness certifications.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About Sumi" title="Coaching built on strength, empathy, and evidence." description="A personal approach to fitness that sees the whole person—not just a number, photo, or performance metric." />
      <Suspense fallback={<PublicSectionLoading label="Loading trainer profile" />}><AboutSection /></Suspense>
      <Suspense fallback={<PublicSectionLoading muted label="Loading certifications" />}><CertificationsSection /></Suspense>
      <ContactCta />
    </>
  );
}
