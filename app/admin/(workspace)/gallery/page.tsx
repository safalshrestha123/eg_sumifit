import type { Metadata } from "next";

import { ResourceManager } from "@/components/admin/resource-manager";

export const metadata: Metadata = { title: "Gallery" };

export default function AdminGalleryPage() {
  return <ResourceManager resource="gallery" eyebrow="Media library" title="Gallery" description="Organize training, coaching, and brand imagery before it appears on the website." singular="Gallery image" view="gallery" />;
}
