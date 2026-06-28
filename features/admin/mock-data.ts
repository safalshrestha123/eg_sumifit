import type { AdminCollectionItem, ContactMessage } from "@/features/admin/types";

export const adminStats = [
  { label: "Published programs", value: "4", change: "+1 this month", tone: "orange" },
  { label: "Client stories", value: "18", change: "3 awaiting review", tone: "violet" },
  { label: "Gallery assets", value: "42", change: "+8 this month", tone: "blue" },
  { label: "Unread messages", value: "7", change: "2 received today", tone: "green" },
] as const;

export const recentActivity = [
  { action: "Program updated", item: "Online Coaching", time: "18 minutes ago" },
  { action: "Testimonial published", item: "Maya R. transformation", time: "2 hours ago" },
  { action: "Gallery image added", item: "Strength session 024", time: "Yesterday" },
  { action: "Profile saved", item: "Trainer biography", time: "2 days ago" },
] as const;

export const achievements: AdminCollectionItem[] = [
  { id: "ach-1", title: "500 Clients Coached", description: "Reached a major coaching milestone through individual programming and long-term client support.", meta: "2022 · Milestone", status: "Published" },
  { id: "ach-2", title: "Regional Strength Medal", description: "Placed in a regional strength and conditioning competition.", meta: "2019 · Competition", status: "Published" },
  { id: "ach-3", title: "Eight Years in Coaching", description: "Celebrating consistent education, practice, and measurable client impact.", meta: "2025 · Career", status: "Draft" },
];

export const certifications: AdminCollectionItem[] = [
  { id: "cert-1", title: "Certified Personal Trainer", description: "Advanced strength, movement assessment, and program design.", meta: "NASM · Issued 2017", status: "Published" },
  { id: "cert-2", title: "Nutrition Coach", description: "Practical, evidence-led nutrition strategies for sustainable performance.", meta: "Precision Nutrition · Issued 2021", status: "Published" },
  { id: "cert-3", title: "Women’s Fitness Specialist", description: "Inclusive coaching across training stages and starting points.", meta: "GGS · Renewal due Sep 2026", status: "Draft" },
];

export const programs: AdminCollectionItem[] = [
  { id: "program-1", title: "Weight Loss", description: "Sustainable coaching that builds useful habits without restrictive extremes.", meta: "12 weeks · Hybrid", status: "Published", image: "/images/coaching.png" },
  { id: "program-2", title: "Muscle Building", description: "Structured strength programming for measurable progress and lasting power.", meta: "16 weeks · Gym", status: "Published", image: "/images/training.png" },
  { id: "program-3", title: "Personal Coaching", description: "Focused one-to-one sessions designed around the client’s goals and schedule.", meta: "Ongoing · In person", status: "Published", image: "/images/sumi-hero.png" },
  { id: "program-4", title: "Online Coaching", description: "Expert programming and feedback wherever the client trains.", meta: "Monthly · Remote", status: "Draft", image: "/images/coaching.png" },
];

export const gallery: AdminCollectionItem[] = [
  { id: "gallery-1", title: "Trainer portrait", description: "Sumi in the strength studio.", meta: "Portrait · 2.1 MB", status: "Published", image: "/images/sumi-hero.png" },
  { id: "gallery-2", title: "Kettlebell session", description: "Functional strength training in progress.", meta: "Training · 1.8 MB", status: "Published", image: "/images/training.png" },
  { id: "gallery-3", title: "One-to-one coaching", description: "Movement feedback during a private session.", meta: "Coaching · 1.6 MB", status: "Published", image: "/images/coaching.png" },
  { id: "gallery-4", title: "Form review", description: "Technical instruction during a client workout.", meta: "Coaching · 1.7 MB", status: "Draft", image: "/images/coaching.png" },
  { id: "gallery-5", title: "Strength block", description: "A focused training block in the studio.", meta: "Training · 2.0 MB", status: "Published", image: "/images/training.png" },
  { id: "gallery-6", title: "Coach profile", description: "Updated profile photography for the website.", meta: "Portrait · 2.2 MB", status: "Draft", image: "/images/sumi-hero.png" },
];

export const testimonials: AdminCollectionItem[] = [
  { id: "story-1", title: "Maya R.", description: "Sumi helped me stop chasing quick fixes. I feel stronger, more capable, and finally consistent.", meta: "18 kg lost · Online coaching", status: "Published" },
  { id: "story-2", title: "Elena T.", description: "Every session has purpose. My technique, confidence, and energy have changed completely.", meta: "2× strength · Personal training", status: "Published" },
  { id: "story-3", title: "Nina K.", description: "The plan fits my life instead of taking it over. The mindset shift has been the biggest result.", meta: "First pull-up · Muscle building", status: "Draft" },
];

export const messages: ContactMessage[] = [
  { id: "msg-1", name: "Alicia Morgan", email: "alicia@example.com", subject: "Personal coaching availability", preview: "I’m looking for two sessions per week and would love to know what availability you have…", receivedAt: "Today, 9:42 AM", read: false },
  { id: "msg-2", name: "Priya Shah", email: "priya@example.com", subject: "Online coaching question", preview: "Does the online plan include form reviews if I train from my apartment gym?", receivedAt: "Today, 8:16 AM", read: false },
  { id: "msg-3", name: "Jenna Lee", email: "jenna@example.com", subject: "Returning after injury", preview: "My physio cleared me to return to training and recommended that I work with a coach…", receivedAt: "Yesterday", read: true },
  { id: "msg-4", name: "Monica Ruiz", email: "monica@example.com", subject: "Consultation follow-up", preview: "Thank you for yesterday’s conversation. The hybrid program sounds like the right fit.", receivedAt: "Jun 24", read: true },
];
