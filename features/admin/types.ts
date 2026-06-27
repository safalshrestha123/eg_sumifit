export type PublishStatus = "Published" | "Draft";

export interface AdminCollectionItem {
  id: string;
  title: string;
  description: string;
  meta: string;
  status: PublishStatus;
  image?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  preview: string;
  receivedAt: string;
  read: boolean;
}
