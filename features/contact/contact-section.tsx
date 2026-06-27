import { Camera, Clock3, Mail, MapPin, Phone } from "lucide-react";

import { Card } from "@/components/ui/card";
import { ContactForm } from "@/features/contact/contact-form";
import { siteConfig } from "@/lib/site";

const details = [
  { icon: Mail, label: "Email", value: siteConfig.email, href: `mailto:${siteConfig.email}` },
  { icon: Phone, label: "Phone", value: siteConfig.phone, href: `tel:${siteConfig.phone.replace(/[^+\d]/g, "")}` },
  { icon: MapPin, label: "Studio", value: siteConfig.location },
  { icon: Clock3, label: "Hours", value: "Mon–Sat, 6am–8pm" },
];

export function ContactSection() {
  return (
    <section className="section-padding bg-white dark:bg-gray-950">
      <div className="container-shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="eyebrow">Start a conversation</p>
          <h2 className="mt-4 text-4xl font-black text-gray-950 dark:text-white">Tell me where you want to go.</h2>
          <p className="mt-5 leading-7 text-gray-600 dark:text-gray-300">Share your goal and I’ll help you identify the right next step. Initial consultations are complimentary and pressure-free.</p>
          <div className="mt-9 space-y-5">
            {details.map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex gap-4"><span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-orange-50 text-orange-600 dark:bg-orange-500/10"><Icon className="size-5" /></span><div><p className="text-xs font-bold uppercase tracking-wider text-gray-400">{label}</p>{href ? <a href={href} className="mt-1 block font-semibold text-gray-900 hover:text-orange-600 dark:text-white">{value}</a> : <p className="mt-1 font-semibold text-gray-900 dark:text-white">{value}</p>}</div></div>
            ))}
          </div>
          <a href={siteConfig.instagram} target="_blank" rel="noreferrer" className="mt-9 inline-flex items-center gap-2 text-sm font-bold text-orange-600 dark:text-orange-400"><Camera className="size-4" /> @sumifitness</a>
        </div>
        <Card className="p-6 sm:p-9"><ContactForm /></Card>
      </div>
      <div className="container-shell mt-12">
        <div className="grid min-h-80 place-items-center rounded-[2rem] border border-dashed border-gray-300 bg-gray-100 text-center dark:border-gray-700 dark:bg-gray-900">
          <div><MapPin className="mx-auto size-8 text-orange-500" /><p className="mt-3 font-bold text-gray-900 dark:text-white">Private studio · New York, NY</p><p className="mt-1 text-sm text-gray-500">Interactive map integration placeholder</p></div>
        </div>
      </div>
    </section>
  );
}
