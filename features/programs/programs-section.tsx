import { ArrowRight, Dumbbell, HeartPulse, Laptop, Users } from "lucide-react";
import Link from "next/link";

import { MotionReveal } from "@/components/shared/motion-reveal";
import { PublicDataState } from "@/components/shared/public-data-state";
import { SectionTitle } from "@/components/shared/section-title";
import { Button } from "@/components/ui/button";
import { ProgramCard } from "@/features/programs/program-card";
import { getPublicPrograms } from "@/lib/api/public";
import type { Program } from "@/types";

const icons = [HeartPulse, Dumbbell, Users, Laptop];

export async function ProgramsSection({ preview = false }: { preview?: boolean }) {
  const result = await getPublicPrograms();
  if (!result.ok) return <section className="section-padding bg-gray-50 dark:bg-gray-900/50"><div className="container-shell"><PublicDataState error title="Programs unavailable" description={result.message} /></div></section>;

  const programs: Program[] = result.data.data.map((program, index) => ({
    title: program.title,
    slug: program.slug,
    description: program.description,
    image: program.imageUrl || "/images/training.png",
    icon: icons[index % icons.length] ?? Dumbbell,
    benefits: program.benefits.length > 0 ? program.benefits : [program.duration, program.format].filter((item): item is string => Boolean(item)),
  }));
  const visiblePrograms = preview ? programs.slice(0, 3) : programs;
  return (
    <section className="section-padding bg-gray-50 dark:bg-gray-900/50">
      <div className="container-shell">
        <MotionReveal><SectionTitle eyebrow="Choose your path" title="Coaching designed around your goal." description="Clear programming, attentive support, and a process you can sustain—wherever you begin." align="center" /></MotionReveal>
        {visiblePrograms.length === 0 ? <div className="mt-12"><PublicDataState title="No programs published yet" description="Published coaching programs will appear here." /></div> : <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{visiblePrograms.map((program, index) => <MotionReveal key={program.slug} delay={index * 0.08}><ProgramCard program={program} /></MotionReveal>)}</div>}
        {preview && programs.length > 0 && <div className="mt-10 text-center"><Button asChild variant="outline"><Link href="/programs">Explore all programs <ArrowRight className="size-4" /></Link></Button></div>}
      </div>
    </section>
  );
}
