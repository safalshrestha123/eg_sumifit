"use client";

import { ImagePlus, Loader2, Upload } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import { CmsImage } from "@/components/shared/cms-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { errorMessage, uploadImageFile } from "@/lib/api/client";

const maximumImageBytes = 5_242_880;
const acceptedImageTypes = ["image/avif", "image/gif", "image/jpeg", "image/png", "image/webp"];

export function ImageUploadField({
  name,
  label,
  defaultValue = "",
  fallback = "/images/training.png",
  required = false,
  previewClassName,
  onUploadingChange,
}: {
  name: "avatarUrl" | "imageUrl";
  label: string;
  defaultValue?: string;
  fallback?: string;
  required?: boolean;
  previewClassName?: string;
  onUploadingChange?: (uploading: boolean) => void;
}) {
  const id = useId();
  const fileInput = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(defaultValue);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [publicId, setPublicId] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  const selectFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    setPublicId(null);
    if (!acceptedImageTypes.includes(file.type)) {
      setError("Choose a JPEG, PNG, WebP, GIF, or AVIF image.");
      return;
    }
    if (file.size > maximumImageBytes) {
      setError("Images must be 5 MB or smaller.");
      return;
    }

    if (localPreview) URL.revokeObjectURL(localPreview);
    const preview = URL.createObjectURL(file);
    setLocalPreview(preview);
    setUploading(true);
    onUploadingChange?.(true);
    setProgress(0);
    try {
      const image = await uploadImageFile(file, setProgress);
      setUrl(image.secure_url);
      setPublicId(image.public_id);
      setLocalPreview(null);
    } catch (uploadError) {
      setError(errorMessage(uploadError));
      setLocalPreview(null);
    } finally {
      setUploading(false);
      onUploadingChange?.(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  const preview = localPreview || url;
  return (
    <div className="space-y-3">
      <Label htmlFor={`${id}-url`}>{label}</Label>
      <div className={cn("relative aspect-video overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-950", previewClassName)}>
        {preview ? <CmsImage src={preview} fallback={fallback} alt={`${label} preview`} fill sizes="480px" className="object-cover" /> : <div className="grid h-full place-items-center text-gray-400"><div className="text-center"><ImagePlus className="mx-auto size-7" /><p className="mt-2 text-xs font-semibold">No image selected</p></div></div>}
        {uploading && <div className="absolute inset-0 grid place-items-center bg-gray-950/65 text-white"><div className="text-center"><Loader2 className="mx-auto size-6 animate-spin" /><p className="mt-2 text-sm font-bold">{progress < 100 ? `Uploading ${progress}%` : "Processing image…"}</p></div></div>}
      </div>
      {uploading && <div className="h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800" role="progressbar" aria-label="Image upload progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><div className="h-full bg-orange-500 transition-[width]" style={{ width: `${progress}%` }} /></div>}
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input id={`${id}-url`} name={name} type="text" value={url} required={required} disabled={uploading} onChange={(event) => { setUrl(event.target.value); setLocalPreview(null); setPublicId(null); }} placeholder="https://res.cloudinary.com/…" />
        <input ref={fileInput} id={`${id}-file`} type="file" accept={acceptedImageTypes.join(",")} className="sr-only" disabled={uploading} onChange={(event) => void selectFile(event.target.files?.[0])} />
        <Button type="button" variant="outline" disabled={uploading} className="shrink-0" onClick={() => fileInput.current?.click()}>{uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}{url ? "Replace image" : "Upload image"}</Button>
      </div>
      <p className="text-xs text-gray-400">JPEG, PNG, WebP, GIF, or AVIF · maximum 5 MB</p>
      {publicId && <p className="text-xs font-medium text-emerald-600" role="status">Uploaded as {publicId}</p>}
      {error && <p className="text-sm font-medium text-red-600 dark:text-red-300" role="alert">{error}</p>}
    </div>
  );
}
