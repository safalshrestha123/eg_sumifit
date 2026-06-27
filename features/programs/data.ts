import { Dumbbell, HeartPulse, Laptop, Users } from "lucide-react";

import type { Program } from "@/types";

export const programs: Program[] = [
  {
    title: "Weight Loss",
    slug: "weight-loss",
    description:
      "A sustainable, evidence-led plan that builds healthy habits without restrictive extremes.",
    image: "/images/coaching.png",
    icon: HeartPulse,
    benefits: ["Personal nutrition guidance", "Progressive workouts", "Weekly accountability"],
  },
  {
    title: "Muscle Building",
    slug: "muscle-building",
    description:
      "Structured strength programming for measurable progress, better movement, and lasting power.",
    image: "/images/training.png",
    icon: Dumbbell,
    benefits: ["Strength assessment", "Custom training split", "Form coaching"],
  },
  {
    title: "Personal Coaching",
    slug: "personal-coaching",
    description:
      "Focused one-to-one sessions designed around your body, schedule, and performance goals.",
    image: "/images/sumi-hero.png",
    icon: Users,
    benefits: ["Private sessions", "Real-time feedback", "Goal reviews"],
  },
  {
    title: "Online Coaching",
    slug: "online-coaching",
    description:
      "Expert programming and support wherever you train, with a plan that evolves with you.",
    image: "/images/coaching.png",
    icon: Laptop,
    benefits: ["Flexible programming", "Video check-ins", "Direct coach support"],
  },
];
