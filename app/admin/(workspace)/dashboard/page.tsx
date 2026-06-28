import { ArrowUpRight, Dumbbell, Images, MessageSquare, Plus, UsersRound } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { adminStats, recentActivity } from "@/features/admin/mock-data";

export const metadata: Metadata = { title: "Dashboard" };

const icons = [Dumbbell, UsersRound, Images, MessageSquare];
const quickActions = [
  { href: "/admin/programs", label: "Add a program", text: "Create a new coaching offer" },
  { href: "/admin/gallery", label: "Upload media", text: "Organize website gallery assets" },
  { href: "/admin/testimonials", label: "Add a story", text: "Publish a client transformation" },
] as const;

export default function DashboardPage() {
  return (
    <>
      <AdminPageHeader eyebrow="Overview" title="Good morning, Sumi." description="Here is a clear view of your website content and the items that need attention." action={<Button asChild><Link href="/admin/programs"><Plus className="size-4" /> Create content</Link></Button>} />

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Website statistics">
        {adminStats.map((stat, index) => <StatCard key={stat.label} {...stat} icon={icons[index]} />)}
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <Card className="rounded-2xl shadow-none">
          <CardHeader className="flex-row items-center justify-between"><div><CardTitle>Recent activity</CardTitle><CardDescription>Latest mock content changes</CardDescription></div><Badge variant="muted">This week</Badge></CardHeader>
          <CardContent className="pt-0">
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {recentActivity.map((activity) => <div key={`${activity.action}-${activity.item}`} className="flex items-start gap-4 py-4"><span className="mt-1 size-2 shrink-0 rounded-full bg-orange-500" /><div className="min-w-0 flex-1"><p className="text-sm font-bold">{activity.action}</p><p className="mt-1 truncate text-sm text-gray-500">{activity.item}</p></div><time className="shrink-0 text-xs text-gray-400">{activity.time}</time></div>)}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-gray-950 text-white shadow-none dark:border-gray-800">
          <CardHeader><CardTitle>Quick actions</CardTitle><CardDescription className="text-gray-400">Jump straight into common tasks.</CardDescription></CardHeader>
          <CardContent className="space-y-3 pt-0">
            {quickActions.map((action) => <Link key={action.href} href={action.href} className="group flex items-center gap-3 rounded-2xl border border-white/10 p-4 transition hover:border-orange-500/50 hover:bg-white/5"><span className="grid size-9 place-items-center rounded-xl bg-orange-500/15 text-orange-400"><Plus className="size-4" /></span><span className="min-w-0 flex-1"><span className="block text-sm font-bold">{action.label}</span><span className="mt-0.5 block truncate text-xs text-gray-400">{action.text}</span></span><ArrowUpRight className="size-4 text-gray-500 transition group-hover:text-orange-400" /></Link>)}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
