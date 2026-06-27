import { cn } from "@/lib/utils";

interface SectionTitleProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export function SectionTitle({ eyebrow, title, description, align = "left" }: SectionTitleProps) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-4 text-balance text-3xl font-black tracking-tight text-gray-950 dark:text-white sm:text-5xl">{title}</h2>
      {description && <p className="mt-5 text-pretty text-base leading-7 text-gray-600 dark:text-gray-300 sm:text-lg">{description}</p>}
    </div>
  );
}
