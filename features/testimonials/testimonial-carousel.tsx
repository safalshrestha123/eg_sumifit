"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { TestimonialCard } from "@/features/testimonials/testimonial-card";
import type { Testimonial } from "@/types";

export function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const activeTestimonial = testimonials[index] ?? testimonials[0];
  if (!activeTestimonial) return null;
  const previous = () => setIndex((value) => (value - 1 + testimonials.length) % testimonials.length);
  const next = () => setIndex((value) => (value + 1) % testimonials.length);

  return (
    <div>
      <div className="relative mx-auto min-h-[25rem] max-w-3xl overflow-hidden" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div key={index} initial={{ opacity: 0, x: 24, scale: 0.98 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: -24, scale: 0.98 }} transition={{ duration: 0.35 }}>
            <TestimonialCard testimonial={activeTestimonial} />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-7 flex items-center justify-center gap-3">
        <Button variant="outline" size="icon" onClick={previous} aria-label="Previous testimonial"><ArrowLeft className="size-4" /></Button>
        <p className="min-w-16 text-center text-sm font-semibold text-gray-500">{index + 1} / {testimonials.length}</p>
        <Button variant="outline" size="icon" onClick={next} aria-label="Next testimonial"><ArrowRight className="size-4" /></Button>
      </div>
    </div>
  );
}
