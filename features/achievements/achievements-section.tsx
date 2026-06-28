import { PublicDataState } from "@/components/shared/public-data-state";
import { SectionTitle } from "@/components/shared/section-title";
import { Counter } from "@/features/achievements/counter";
import { Timeline } from "@/features/achievements/timeline";
import { getPublicAchievements, getPublicCertifications, getPublicProfile } from "@/lib/api/public";
import type { Achievement } from "@/types";

export async function AchievementsSection({ showTimeline = true }: { showTimeline?: boolean }) {
  const [achievementsResult, certificationsResult, profileResult] = await Promise.all([
    getPublicAchievements(),
    getPublicCertifications(),
    getPublicProfile(),
  ]);

  if (!achievementsResult.ok || !certificationsResult.ok || !profileResult.ok) {
    return <section className="section-padding bg-white dark:bg-gray-950"><div className="container-shell"><PublicDataState error title="Achievements unavailable" description="Career milestones could not be loaded. Please try again shortly." /></div></section>;
  }

  const profile = profileResult.data.profile;
  const achievements: Achievement[] = achievementsResult.data.data.map((item) => ({
    year: item.year ? String(item.year) : new Date(item.createdAt).getFullYear().toString(),
    title: item.title,
    description: item.description,
    type: achievementType(item.category),
  }));
  const stats = [
    { value: profile?.yearsExperience ?? 0, suffix: "+", label: "Years coaching" },
    { value: profile?.clientsCoached ?? 0, suffix: "+", label: "Clients trained" },
    { value: certificationsResult.data.pagination.total, suffix: "", label: "Certifications" },
    { value: achievementsResult.data.pagination.total, suffix: "", label: "Milestones" },
  ];

  return (
    <section className="section-padding bg-white dark:bg-gray-950">
      <div className="container-shell">
        <SectionTitle eyebrow="Built through consistency" title="Experience measured in impact." description="Certifications matter. What matters more is translating that knowledge into results people can keep." align="center" />
        <div className="mt-12 grid grid-cols-2 gap-8 rounded-3xl bg-gray-50 px-5 py-10 dark:bg-gray-900 md:grid-cols-4 md:px-10">
          {stats.map((stat) => <Counter key={stat.label} {...stat} />)}
        </div>
        {showTimeline && (achievements.length > 0 ? <Timeline achievements={achievements} /> : <div className="mt-14"><PublicDataState title="No achievements published yet" description="Published career milestones will appear here." /></div>)}
      </div>
    </section>
  );
}

function achievementType(category: string | null): Achievement["type"] {
  const value = category?.toLowerCase() ?? "";
  if (value.includes("competition") || value.includes("medal")) return "medal";
  if (value.includes("certification") || value.includes("education")) return "certificate";
  return "milestone";
}
