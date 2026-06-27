import type { Achievement } from "@/types";

export const achievements: Achievement[] = [
  {
    year: "2017",
    title: "Certified Personal Trainer",
    description: "Earned national certification and began coaching clients full time.",
    type: "certificate",
  },
  {
    year: "2019",
    title: "First Competition Medal",
    description: "Placed in a regional strength and conditioning competition.",
    type: "medal",
  },
  {
    year: "2022",
    title: "500 Clients Coached",
    description: "Reached a milestone built on individual plans and sustainable transformations.",
    type: "milestone",
  },
  {
    year: "2025",
    title: "Advanced Nutrition Certification",
    description: "Expanded coaching expertise with evidence-based performance nutrition.",
    type: "certificate",
  },
];

export const stats = [
  { value: 8, suffix: "+", label: "Years coaching" },
  { value: 750, suffix: "+", label: "Clients trained" },
  { value: 12, suffix: "", label: "Certifications" },
  { value: 96, suffix: "%", label: "Goal completion" },
] as const;
