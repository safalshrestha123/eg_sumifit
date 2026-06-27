import type { Metadata } from "next";

export const siteConfig = {
  name: "SumiFitness",
  description:
    "Personal training and online coaching designed to build strength, confidence, and sustainable results.",
  url: "https://sumifitness.com",
  email: "hello@sumifitness.com",
  phone: "+1 (555) 014-2277",
  location: "New York, NY",
  instagram: "https://instagram.com",
  youtube: "https://youtube.com",
} as const;

const socialImage = {
  url: "/images/training.png",
  width: 1536,
  height: 1024,
  alt: "SumiFitness strength coaching",
};

export function createPageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: `/${string}`;
}): Metadata {
  const canonicalUrl = path || "/";
  const socialTitle = `${title} | ${siteConfig.name}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: canonicalUrl,
      siteName: siteConfig.name,
      title: socialTitle,
      description,
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [socialImage.url],
    },
  };
}

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/programs", label: "Programs" },
  { href: "/achievements", label: "Achievements" },
  { href: "/gallery", label: "Gallery" },
  { href: "/testimonials", label: "Stories" },
  { href: "/contact", label: "Contact" },
] as const;
