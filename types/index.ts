import type { LucideIcon } from "lucide-react";

export interface Program {
  id: string;
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
  avatarUrl?: string;
  role: string;
  quote: string;
  result: string;
  initials: string;
  rating: number;
}

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  category: string;
  className: string;
}
