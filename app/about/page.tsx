import { Award, BookOpenCheck, HeartHandshake } from "lucide-react";

import { ContactCta } from "@/components/shared/contact-cta";
import { PageHero } from "@/components/shared/page-hero";
import { Card } from "@/components/ui/card";
import { AboutSection } from "@/features/about/about-section";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "About Sumi",
  description: "Meet Sumi and learn about her coaching philosophy, mission, experience, and fitness certifications.",
  path: "/about",
});

const credentials = [
  { icon: Award, title: "Certified Personal Trainer", text: "Advanced strength, movement, and program design." },
  { icon: BookOpenCheck, title: "Nutrition Coach", text: "Sustainable habits grounded in practical nutrition science." },
  { icon: HeartHandshake, title: "Women's Fitness Specialist", text: "Inclusive coaching through every stage and starting point." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About Sumi" title="Coaching built on strength, empathy, and evidence." description="A personal approach to fitness that sees the whole person—not just a number, photo, or performance metric." />
      <AboutSection />
      <section className="section-padding bg-gray-50 dark:bg-gray-900/50">
        <div className="container-shell"><div className="max-w-2xl"><p className="eyebrow">Credentials</p><h2 className="mt-4 text-3xl font-black text-gray-950 dark:text-white sm:text-5xl">Knowledge you can trust.</h2></div><div className="mt-10 grid gap-5 md:grid-cols-3">{credentials.map(({ icon: Icon, title, text }) => <Card key={title} className="p-7"><Icon className="size-7 text-orange-500" /><h3 className="mt-5 text-lg font-black">{title}</h3><p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">{text}</p></Card>)}</div></div>
      </section>
      <ContactCta />
    </>
  );
}
