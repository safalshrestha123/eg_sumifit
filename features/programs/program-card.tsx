import { Check } from "lucide-react";

import { CmsImage } from "@/components/shared/cms-image";
import { Card } from "@/components/ui/card";
import { EnrollButton } from "@/features/programs/enroll-button";
import type { Program } from "@/types";

export function ProgramCard({ program }: { program: Program }) {
  const Icon = program.icon;
  return (
    <Card className="group overflow-hidden transition duration-300 hover:-translate-y-2 hover:shadow-xl">
      <div className="relative h-56 overflow-hidden">
        <CmsImage src={program.image} alt={`${program.title} coaching program`} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute left-5 top-5 grid size-11 place-items-center rounded-2xl bg-white text-orange-600 shadow-lg dark:bg-gray-950"><Icon className="size-5" /></span>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-black text-gray-950 dark:text-white">{program.title}</h3>
        <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">{program.description}</p>
        <ul className="mt-5 space-y-2">
          {program.benefits.map((benefit) => <li key={benefit} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"><Check className="size-4 text-green-500" />{benefit}</li>)}
        </ul>
        <div className="mt-6"><EnrollButton programId={program.id} programTitle={program.title} /></div>
      </div>
    </Card>
  );
}
