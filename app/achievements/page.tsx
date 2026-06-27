import { ContactCta } from "@/components/shared/contact-cta";
import { PageHero } from "@/components/shared/page-hero";
import { AchievementsSection } from "@/features/achievements/achievements-section";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Achievements",
  description: "Explore Sumi's certifications, competition milestones, coaching experience, and client impact.",
  path: "/achievements",
});

export default function AchievementsPage() {
  return <><PageHero eyebrow="Achievements" title="Progress earned one consistent step at a time." description="A coaching career shaped by continued education, competition, and the success of hundreds of clients." /><AchievementsSection /><ContactCta /></>;
}
