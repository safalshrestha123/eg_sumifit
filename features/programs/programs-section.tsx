import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { MotionReveal } from "@/components/shared/motion-reveal";
import { SectionTitle } from "@/components/shared/section-title";
import { Button } from "@/components/ui/button";
import { programs } from "@/features/programs/data";
import { ProgramCard } from "@/features/programs/program-card";

export function ProgramsSection({ preview = false }: { preview?: boolean }) {
  const visiblePrograms = preview ? programs.slice(0, 3) : programs;
  return (
    <section className="section-padding bg-gray-50 dark:bg-gray-900/50">
      <div className="container-shell">
        <MotionReveal><SectionTitle eyebrow="Choose your path" title="Coaching designed around your goal." description="Clear programming, attentive support, and a process you can sustain—wherever you begin." align="center" /></MotionReveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visiblePrograms.map((program, index) => <MotionReveal key={program.slug} delay={index * 0.08}><ProgramCard program={program} /></MotionReveal>)}
        </div>
        {preview && <div className="mt-10 text-center"><Button asChild variant="outline"><Link href="/programs">Explore all programs <ArrowRight className="size-4" /></Link></Button></div>}
      </div>
    </section>
  );
}
