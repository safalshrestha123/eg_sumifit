export interface PublicTrainerProfile {
  id: string;
  displayName: string;
  professionalTitle: string;
  shortBio: string | null;
  biography: string | null;
  avatarUrl: string | null;
  phone: string | null;
  location: string | null;
  specialization: string | null;
  yearsExperience: number;
  clientsCoached: number;
  updatedAt: string;
}

export interface PublicAchievement {
  id: string;
  title: string;
  description: string;
  year: number | null;
  category: string | null;
  sortOrder: number;
  createdAt: string;
}

export interface PublicCertification {
  id: string;
  title: string;
  issuer: string;
  description: string | null;
  issuedAt: string | null;
  expiresAt: string | null;
  credentialUrl: string | null;
  sortOrder: number;
}

export interface PublicProgram {
  id: string;
  slug: string;
  title: string;
  description: string;
  imageUrl: string | null;
  duration: string | null;
  format: string | null;
  benefits: string[];
  sortOrder: number;
}

export interface PublicGalleryImage {
  id: string;
  title: string;
  altText: string;
  imageUrl: string;
  category: string | null;
  description: string | null;
  sortOrder: number;
}

export interface PublicTestimonial {
  id: string;
  name: string;
  avatarUrl: string | null;
  role: string | null;
  quote: string;
  result: string | null;
  rating: number;
  sortOrder: number;
}

export interface PaginatedPublicResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export type PublicApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string };
