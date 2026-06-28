"use client";

import { Switch } from "@/components/ui/switch";

export function PublishToggle({ published, onChange, label = "Published" }: { published: boolean; onChange: (published: boolean) => void; label?: string }) {
  return (
    <div className="flex items-center gap-2">
      <Switch checked={published} onCheckedChange={onChange} aria-label={`${published ? "Unpublish" : "Publish"} ${label}`} />
      <span className="text-xs font-semibold text-gray-500">{published ? "Published" : "Draft"}</span>
    </div>
  );
}
