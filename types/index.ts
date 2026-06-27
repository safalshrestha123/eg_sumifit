import type { LucideIcon } from "lucide-react";

export interface Program {
  title: string;
  slug: string;
  description: string;
  image: string;
  icon: LucideIcon;
  benefits: string[];
}

export interface Achievement {
  year: string;
  title: string;
  description: string;
  type: "medal" | "certificate" | "milestone";
}

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
  result: string;
  initials: string;
  rating: number;
}

export interface GalleryItem {
  src: string;
  alt: string;
  category: string;
  className: string;
}
