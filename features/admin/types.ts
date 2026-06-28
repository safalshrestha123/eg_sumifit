export type PublishStatus = "Published" | "Draft";
export type CmsResource = "achievements" | "certifications" | "programs" | "gallery" | "testimonials";

export interface CmsRecord {
  id: string;
  published: boolean;
  title?: string;
  description?: string | null;
  year?: number | null;
  category?: string | null;
  issuer?: string;
  credentialUrl?: string | null;
  slug?: string;
  imageUrl?: string | null;
  avatarUrl?: string | null;
  duration?: string | null;
  format?: string | null;
  benefits?: string[];
  altText?: string;
  name?: string;
  role?: string | null;
  quote?: string;
  result?: string | null;
  rating?: number;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminCollectionItem {
  id: string;
  title: string;
  description: string;
  meta: string;
  status: PublishStatus;
  image?: string;
  record?: CmsRecord;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  createdAt: string;
  read: boolean;
  archived: boolean;
}
