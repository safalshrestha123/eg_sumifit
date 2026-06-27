import { MotionReveal } from "@/components/shared/motion-reveal";
import { PublicDataState } from "@/components/shared/public-data-state";
import { SectionTitle } from "@/components/shared/section-title";
import { TestimonialCarousel } from "@/features/testimonials/testimonial-carousel";
import { getPublicTestimonials } from "@/lib/api/public";
import type { Testimonial } from "@/types";

export async function TestimonialsSection() {
  const result = await getPublicTestimonials();
  if (!result.ok) return <section className="section-padding bg-white dark:bg-gray-950"><div className="container-shell"><PublicDataState error title="Client stories unavailable" description={result.message} /></div></section>;

  const testimonials: Testimonial[] = result.data.data.map((testimonial) => ({
    name: testimonial.name,
    avatarUrl: testimonial.avatarUrl || undefined,
    role: testimonial.role || "",
    quote: testimonial.quote,
    result: testimonial.result || "",
    initials: initials(testimonial.name),
    rating: testimonial.rating,
  }));
  return (
    <section className="section-padding bg-white dark:bg-gray-950">
      <div className="container-shell">
        <MotionReveal><SectionTitle eyebrow="Client stories" title="Confidence is the result that lasts." description="Progress is personal. These are a few of the people who chose consistency—and changed more than their workouts." align="center" /></MotionReveal>
        <MotionReveal className="mt-12">{testimonials.length > 0 ? <TestimonialCarousel testimonials={testimonials} /> : <PublicDataState title="No client stories published yet" description="Published testimonials will appear here." />}</MotionReveal>
      </div>
    </section>
  );
}

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "SF";
}
