import { MotionReveal } from "@/components/shared/motion-reveal";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gray-950 py-24 text-white sm:py-32">
      <div className="hero-orb hero-orb-right" aria-hidden="true" />
      <div className="container-shell relative">
        <MotionReveal>
          <p className="eyebrow text-orange-400">{eyebrow}</p>
          <h1 className="mt-5 max-w-4xl text-balance text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl">{title}</h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-gray-300">{description}</p>
        </MotionReveal>
      </div>
    </section>
  );
}
