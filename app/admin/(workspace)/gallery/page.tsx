import type { Metadata } from "next";

import { ResourceManager } from "@/components/admin/resource-manager";
import { gallery } from "@/features/admin/mock-data";

export const metadata: Metadata = { title: "Gallery" };

export default function AdminGalleryPage() {
  return <ResourceManager eyebrow="Media library" title="Gallery" description="Organize training, coaching, and brand imagery before it appears on the website." singular="Gallery image" items={gallery} view="gallery" />;
}
