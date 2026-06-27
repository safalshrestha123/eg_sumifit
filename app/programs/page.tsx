import { ContactCta } from "@/components/shared/contact-cta";
import { PageHero } from "@/components/shared/page-hero";
import { ProgramsSection } from "@/features/programs/programs-section";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Training Programs",
  description: "Explore personal training, online coaching, weight loss, and muscle-building programs from SumiFitness.",
  path: "/programs",
});

export default function ProgramsPage() {
  return <><PageHero eyebrow="Programs" title="A clear path from where you are to where you want to be." description="Choose a coaching format that fits your goal, lifestyle, and preferred way to train." /><ProgramsSection /><ContactCta /></>;
}
