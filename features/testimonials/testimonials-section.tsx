import { MotionReveal } from "@/components/shared/motion-reveal";
import { SectionTitle } from "@/components/shared/section-title";
import { TestimonialCarousel } from "@/features/testimonials/testimonial-carousel";

export function TestimonialsSection() {
  return (
    <section className="section-padding bg-white dark:bg-gray-950">
      <div className="container-shell">
        <MotionReveal><SectionTitle eyebrow="Client stories" title="Confidence is the result that lasts." description="Progress is personal. These are a few of the people who chose consistency—and changed more than their workouts." align="center" /></MotionReveal>
        <MotionReveal className="mt-12"><TestimonialCarousel /></MotionReveal>
      </div>
    </section>
  );
}
