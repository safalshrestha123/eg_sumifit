import type { Metadata } from "next";

import { ClientProfileForm } from "@/components/client/client-profile-form";

export const metadata: Metadata = { title: "My profile" };

export default function ClientProfilePage() {
  return <ClientProfileForm />;
}
