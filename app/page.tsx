import { ContactCta } from "@/components/shared/contact-cta";
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
      <Hero />
      <AboutSection preview />
      <ProgramsSection preview />
      <AchievementsSection />
      <GallerySection preview />
      <TestimonialsSection />
      <InstagramCta />
      <ContactCta />
    </>
  );
}
