"use client";

import { Switch } from "@/components/ui/switch";

export function PublishToggle({ published, onChange, label = "Published", disabled = false }: { published: boolean; onChange: (published: boolean) => void; label?: string; disabled?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <Switch checked={published} disabled={disabled} onCheckedChange={onChange} aria-label={`${published ? "Unpublish" : "Publish"} ${label}`} />
      <span className="text-xs font-semibold text-gray-500">{published ? "Published" : "Draft"}</span>
    </div>
  );
}
