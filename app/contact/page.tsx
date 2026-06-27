import { Suspense } from "react";

import { PageHero } from "@/components/shared/page-hero";
import { PublicSectionLoading } from "@/components/shared/public-data-state";
import { ContactSection } from "@/features/contact/contact-section";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Contact",
  description: "Book a complimentary SumiFitness consultation or ask a question about personal and online coaching.",
  path: "/contact",
});

export default function ContactPage() {
  return <><PageHero eyebrow="Contact" title="Your strongest chapter can start today." description="Tell me what you are working toward. We’ll talk through your needs and find the right next step—without pressure." /><Suspense fallback={<PublicSectionLoading label="Loading contact details" />}><ContactSection /></Suspense></>;
}
