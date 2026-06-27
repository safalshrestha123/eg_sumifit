import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { MotionReveal } from "@/components/shared/motion-reveal";
import { Button } from "@/components/ui/button";

export function ContactCta() {
  return (
    <section className="section-padding">
      <div className="container-shell">
        <MotionReveal className="overflow-hidden rounded-[2rem] bg-orange-500 px-6 py-14 text-center text-white sm:px-12 sm:py-20">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-100">Your next chapter</p>
          <h2 className="mx-auto mt-4 max-w-3xl text-balance text-3xl font-black sm:text-5xl">Ready to feel stronger in your body and your life?</h2>
          <p className="mx-auto mt-5 max-w-xl text-orange-50">Book a complimentary consultation and get a clear plan for your goals.</p>
          <Button asChild variant="secondary" size="lg" className="mt-8"><Link href="/contact">Book consultation <ArrowRight className="size-4" /></Link></Button>
        </MotionReveal>
      </div>
    </section>
  );
}
