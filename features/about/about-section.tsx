import { ArrowRight, BadgeCheck, Heart, Target } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { MotionReveal } from "@/components/shared/motion-reveal";
import { SectionTitle } from "@/components/shared/section-title";
import { Button } from "@/components/ui/button";

const values = [
  { icon: Target, title: "Built for you", text: "Every plan starts with your goals, history, and real life." },
  { icon: Heart, title: "Sustainable first", text: "No extremes. Just consistent work that supports your wellbeing." },
  { icon: BadgeCheck, title: "Expert guidance", text: "Evidence-led coaching with honest feedback and clear progression." },
];

export function AboutSection({ preview = false }: { preview?: boolean }) {
  return (
    <section className="section-padding bg-white dark:bg-gray-950">
      <div className="container-shell grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <MotionReveal className="relative min-h-[28rem] overflow-hidden rounded-[2rem] sm:min-h-[36rem]">
          <Image src="/images/coaching.png" alt="Sumi coaching a client during a strength session" fill sizes="(min-width: 1024px) 45vw, 90vw" className="object-cover" />
          <div className="absolute bottom-5 left-5 rounded-2xl bg-white p-5 shadow-xl dark:bg-gray-900">
            <p className="text-3xl font-black text-orange-500">8+</p>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">Years changing lives</p>
          </div>
        </MotionReveal>
        <MotionReveal delay={0.1}>
          <SectionTitle eyebrow="Meet your coach" title="Fitness should add to your life—not take it over." description="I’m Sumi, a certified personal trainer focused on helping women build strength and confidence through coaching that is personal, practical, and grounded in evidence." />
          <div className="mt-8 space-y-5">
            {values.slice(0, preview ? 2 : 3).map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"><Icon className="size-5" /></span>
                <div><h3 className="font-bold text-gray-950 dark:text-white">{title}</h3><p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">{text}</p></div>
              </div>
            ))}
          </div>
          {preview && <Button asChild variant="outline" className="mt-9"><Link href="/about">My story <ArrowRight className="size-4" /></Link></Button>}
        </MotionReveal>
      </div>
    </section>
  );
}
