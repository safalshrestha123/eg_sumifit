import { SectionTitle } from "@/components/shared/section-title";
import { Counter } from "@/features/achievements/counter";
import { stats } from "@/features/achievements/data";
import { Timeline } from "@/features/achievements/timeline";

export function AchievementsSection({ showTimeline = true }: { showTimeline?: boolean }) {
  return (
    <section className="section-padding bg-white dark:bg-gray-950">
      <div className="container-shell">
        <SectionTitle eyebrow="Built through consistency" title="Experience measured in impact." description="Certifications matter. What matters more is translating that knowledge into results people can keep." align="center" />
        <div className="mt-12 grid grid-cols-2 gap-8 rounded-3xl bg-gray-50 px-5 py-10 dark:bg-gray-900 md:grid-cols-4 md:px-10">
          {stats.map((stat) => <Counter key={stat.label} {...stat} />)}
        </div>
        {showTimeline && <Timeline />}
      </div>
    </section>
  );
}
