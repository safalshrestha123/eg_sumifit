import { Award, BookOpenCheck, HeartHandshake } from "lucide-react";

import { PublicDataState } from "@/components/shared/public-data-state";
import { Card } from "@/components/ui/card";
import { getPublicCertifications } from "@/lib/api/public";

const icons = [Award, BookOpenCheck, HeartHandshake];

export async function CertificationsSection() {
  const result = await getPublicCertifications();

  return (
    <section className="section-padding bg-gray-50 dark:bg-gray-900/50">
      <div className="container-shell">
        <div className="max-w-2xl"><p className="eyebrow">Credentials</p><h2 className="mt-4 text-3xl font-black text-gray-950 dark:text-white sm:text-5xl">Knowledge you can trust.</h2></div>
        {!result.ok ? (
          <div className="mt-10"><PublicDataState error title="Certifications unavailable" description={result.message} /></div>
        ) : result.data.data.length === 0 ? (
          <div className="mt-10"><PublicDataState title="No certifications published yet" description="Published qualifications will appear here." /></div>
        ) : (
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {result.data.data.map((certification, index) => {
              const Icon = icons[index % icons.length] ?? Award;
              const content = <><Icon className="size-7 text-orange-500" /><h3 className="mt-5 text-lg font-black">{certification.title}</h3><p className="mt-1 text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">{certification.issuer}</p>{certification.description && <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">{certification.description}</p>}</>;
              return certification.credentialUrl ? <Card key={certification.id} className="p-7"><a href={certification.credentialUrl} target="_blank" rel="noreferrer" className="block">{content}</a></Card> : <Card key={certification.id} className="p-7">{content}</Card>;
            })}
          </div>
        )}
      </div>
    </section>
  );
}
