import type { Metadata } from "next";
import Link from "next/link";

import { ClientAuthLayout } from "@/components/client/client-auth-layout";
import { ClientRegisterForm } from "@/components/client/client-register-form";

export const metadata: Metadata = { title: "Create client account" };

export default function ClientRegisterPage() {
  return (
    <ClientAuthLayout eyebrow="Start your journey" title="Create your client account." description="Tell us where you are now and what you want to achieve." footer={<>Already have an account? <Link href="/client/login" className="font-bold text-orange-600 hover:text-orange-700">Sign in</Link></>}>
      <ClientRegisterForm />
    </ClientAuthLayout>
  );
}
