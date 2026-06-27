"use client";

import { Expand } from "lucide-react";

import { CmsImage } from "@/components/shared/cms-image";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { GalleryItem } from "@/types";

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  return (
    <div className="grid auto-rows-[18rem] gap-4 sm:grid-cols-2 md:grid-cols-3">
      {items.map((item) => (
        <Dialog key={item.id}>
          <DialogTrigger asChild>
            <button className={cn("group relative overflow-hidden rounded-3xl bg-gray-100 text-left dark:bg-gray-900", item.className)} aria-label={`Open ${item.alt}`}>
              <CmsImage src={item.src} alt={item.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
              <span className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-80" />
              <span className="absolute inset-x-5 bottom-5 flex items-end justify-between text-white">
                <span><span className="block text-xs font-semibold uppercase tracking-widest text-orange-300">{item.category}</span><span className="mt-1 block text-sm font-medium">{item.alt}</span></span>
                <span className="grid size-10 place-items-center rounded-full bg-white/15 backdrop-blur"><Expand className="size-4" /></span>
              </span>
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle className="sr-only">{item.alt}</DialogTitle>
            <div className="relative h-[80vh] w-full"><CmsImage src={item.src} alt={item.alt} fill sizes="90vw" className="object-contain" /></div>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
}
