import { Quote, Star } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { Testimonial } from "@/types";

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <Card className="relative h-full p-7 sm:p-9">
      <Quote className="size-9 text-orange-500/30" />
      <div className="mt-5 flex gap-1" aria-label={`${testimonial.rating} out of 5 stars`}>
        {Array.from({ length: testimonial.rating }, (_, index) => <Star key={index} className="size-4 fill-orange-500 text-orange-500" aria-hidden="true" />)}
      </div>
      <blockquote className="mt-6 text-balance text-xl font-semibold leading-8 text-gray-900 dark:text-white">“{testimonial.quote}”</blockquote>
      {testimonial.result && <p className="mt-6 inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700 dark:bg-green-500/10 dark:text-green-400">{testimonial.result}</p>}
      <div className="mt-8 flex items-center gap-3 border-t border-gray-100 pt-6 dark:border-gray-800">
        <span className="grid size-11 place-items-center rounded-full bg-gray-900 text-sm font-black text-white dark:bg-white dark:text-gray-950">{testimonial.initials}</span>
        <div><p className="font-bold text-gray-950 dark:text-white">{testimonial.name}</p>{testimonial.role && <p className="text-xs text-gray-500">{testimonial.role}</p>}</div>
      </div>
    </Card>
  );
}
