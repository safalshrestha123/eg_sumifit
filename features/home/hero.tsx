import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";

import { CmsImage } from "@/components/shared/cms-image";
import { MotionReveal } from "@/components/shared/motion-reveal";
import { PublicDataState } from "@/components/shared/public-data-state";
import { Button } from "@/components/ui/button";
import { getPublicCertifications, getPublicProfile } from "@/lib/api/public";

export async function Hero() {
  const [profileResult, certificationsResult] = await Promise.all([getPublicProfile(), getPublicCertifications()]);

  if (!profileResult.ok || !certificationsResult.ok) {
    return <section className="section-padding bg-gray-950"><div className="container-shell"><PublicDataState error title="Trainer profile unavailable" description="The trainer profile could not be loaded. Please try again shortly." /></div></section>;
  }

  const profile = profileResult.data.profile;
  if (!profile) {
    return <section className="section-padding bg-gray-950"><div className="container-shell"><PublicDataState title="Trainer profile coming soon" description="Published trainer details will appear here once they are available." /></div></section>;
  }

  const profileImage = profile.avatarUrl || "/images/sumi-hero.png";
  return (
    <section className="relative overflow-hidden bg-gray-950 text-white">
      <div className="hero-orb hero-orb-left" aria-hidden="true" />
      <div className="container-shell grid min-h-[calc(100svh-4.5rem)] items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-0">
        <MotionReveal className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-orange-400">
            <span className="size-2 rounded-full bg-green-500" /> {profile.professionalTitle}
          </div>
          <h1 className="mt-7 text-balance text-5xl font-black leading-[0.96] tracking-[-0.04em] sm:text-7xl xl:text-8xl">
            Transform your body. <span className="text-orange-500">Build your confidence.</span>
          </h1>
          <p className="mt-7 max-w-xl text-pretty text-lg leading-8 text-gray-300">{profile.shortBio || profile.biography || profile.professionalTitle}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg"><Link href="/contact">Book consultation <ArrowRight className="size-4" /></Link></Button>
            <Button asChild size="lg" variant="outline" className="border-white/25 text-white hover:bg-white hover:text-gray-950"><Link href="/programs"><Play className="size-4 fill-current" /> View programs</Link></Button>
          </div>
          <div className="mt-12 flex gap-8 border-t border-white/10 pt-7">
            <div><p className="text-2xl font-black">{profile.clientsCoached}+</p><p className="mt-1 text-xs text-gray-400">Clients coached</p></div>
            <div><p className="text-2xl font-black">{profile.yearsExperience}+</p><p className="mt-1 text-xs text-gray-400">Years experience</p></div>
            <div><p className="text-2xl font-black">{certificationsResult.data.pagination.total}</p><p className="mt-1 text-xs text-gray-400">Certifications</p></div>
          </div>
        </MotionReveal>

        <MotionReveal delay={0.15} className="relative mx-auto h-[32rem] w-full max-w-xl overflow-hidden rounded-[2.5rem] border border-white/10 lg:h-[42rem]">
          <CmsImage src={profileImage} fallback="/images/sumi-hero.png" alt={`${profile.displayName}, ${profile.professionalTitle}`} fill preload sizes="(min-width: 1024px) 45vw, 90vw" className="object-cover object-center" />
          <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/10 bg-black/55 p-5 backdrop-blur-md">
            <p className="text-sm font-semibold">Strong looks different on everyone.</p>
            <p className="mt-1 text-xs text-gray-300">Your plan should too.</p>
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}
