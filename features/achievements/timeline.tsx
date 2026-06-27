import { Award, BadgeCheck, Flag } from "lucide-react";

import { MotionReveal } from "@/components/shared/motion-reveal";
import { achievements } from "@/features/achievements/data";

const iconByType = { medal: Award, certificate: BadgeCheck, milestone: Flag };

export function Timeline() {
  return (
    <div className="relative mx-auto mt-14 max-w-4xl before:absolute before:bottom-0 before:left-5 before:top-0 before:w-px before:bg-gray-200 dark:before:bg-gray-800 md:before:left-1/2">
      {achievements.map((item, index) => {
        const Icon = iconByType[item.type];
        return (
          <MotionReveal key={item.title} className={`relative mb-10 pl-16 md:w-1/2 md:pl-0 ${index % 2 === 0 ? "md:pr-14 md:text-right" : "md:ml-auto md:pl-14"}`}>
            <span className={`absolute left-0 top-0 grid size-10 place-items-center rounded-full bg-orange-500 text-white ring-8 ring-white dark:ring-gray-950 ${index % 2 === 0 ? "md:-right-5 md:left-auto" : "md:-left-5"}`}><Icon className="size-4" /></span>
            <p className="text-sm font-black text-orange-600 dark:text-orange-400">{item.year}</p>
            <h3 className="mt-2 text-xl font-black text-gray-950 dark:text-white">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">{item.description}</p>
          </MotionReveal>
        );
      })}
    </div>
  );
}
