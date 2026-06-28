"use client";

import Image, { type ImageLoader, type ImageProps } from "next/image";

const passthroughLoader: ImageLoader = ({ src }) => src;

export function CmsImage({ src, alt, fallback = "/images/training.png", ...props }: Omit<ImageProps, "src"> & { src: string; fallback?: string }) {
  const validSource = src.startsWith("/") || /^https?:\/\//i.test(src) ? src : fallback;
  const remote = /^https?:\/\//i.test(validSource);
  return <Image {...props} src={validSource} alt={alt} loader={remote ? passthroughLoader : undefined} unoptimized={remote} />;
}
