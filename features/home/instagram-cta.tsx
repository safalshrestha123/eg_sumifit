import { ArrowUpRight, Camera } from "lucide-react";

import { MotionReveal } from "@/components/shared/motion-reveal";
import { siteConfig } from "@/lib/site";

export function InstagramCta() {
  return (
    <section className="bg-gray-950 py-8 text-white">
      <MotionReveal className="container-shell flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4"><span className="grid size-12 place-items-center rounded-2xl bg-orange-500"><Camera className="size-6" /></span><div><p className="font-black">Daily training, tips, and honest progress.</p><p className="text-sm text-gray-400">Follow the SumiFitness community on Instagram.</p></div></div>
        <a href={siteConfig.instagram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-orange-400 hover:text-orange-300">@sumifitness <ArrowUpRight className="size-4" /></a>
      </MotionReveal>
    </section>
  );
}
