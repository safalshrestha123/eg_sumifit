import "server-only";

import type {
  PaginatedPublicResponse,
  PublicAchievement,
  PublicApiResult,
  PublicCertification,
  PublicGalleryImage,
  PublicProgram,
  PublicTestimonial,
  PublicTrainerProfile,
} from "@/features/public/types";

const publicApiBaseUrl = (process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:4000").replace(/\/$/, "");

export function getPublicProfile() {
  return publicApiResult<{ profile: PublicTrainerProfile | null }>("/api/public/profile");
}

export function getPublicAchievements() {
  return publicCollectionResult<PublicAchievement>("achievements");
}

export function getPublicCertifications() {
  return publicCollectionResult<PublicCertification>("certifications");
}

export function getPublicPrograms() {
  return publicCollectionResult<PublicProgram>("programs");
}

export function getPublicGallery() {
  return publicCollectionResult<PublicGalleryImage>("gallery");
}

export function getPublicTestimonials() {
  return publicCollectionResult<PublicTestimonial>("testimonials");
}

async function publicCollectionResult<T>(resource: string) {
  return publicApiResult<PaginatedPublicResponse<T>>(`/api/public/${resource}?pageSize=100`);
}

async function publicApiResult<T>(path: string): Promise<PublicApiResult<T>> {
  try {
    const response = await fetch(`${publicApiBaseUrl}${path}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      return { ok: false, message: "This content is temporarily unavailable." };
    }

    return { ok: true, data: await response.json() as T };
  } catch {
    return { ok: false, message: "This content is temporarily unavailable." };
  }
}
