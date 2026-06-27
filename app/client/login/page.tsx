import type { Metadata } from "next";
import Link from "next/link";

import { ClientAuthLayout } from "@/components/client/client-auth-layout";
import { ClientLoginForm } from "@/components/client/client-login-form";

export const metadata: Metadata = { title: "Client sign in" };

export default function ClientLoginPage() {
  return (
    <ClientAuthLayout eyebrow="Client access" title="Welcome back." description="Sign in with your client account to access your dashboard and profile." footer={<>New to SumiFitness? <Link href="/client/register" className="font-bold text-orange-600 hover:text-orange-700">Create a client account</Link></>}>
      <ClientLoginForm />
      <p className="mt-5 text-center text-xs text-gray-400">Trainer or administrator? <Link href="/admin/login" className="font-semibold hover:text-gray-700 dark:hover:text-gray-200">Use the CMS login</Link></p>
    </ClientAuthLayout>
  );
}
