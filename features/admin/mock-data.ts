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
