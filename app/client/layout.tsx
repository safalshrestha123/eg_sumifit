import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: { default: "Client Portal", template: "%s | SumiFitness" },
  description: "SumiFitness protected client portal.",
  robots: { index: false, follow: false },
};

export default function ClientRootLayout({ children }: { children: ReactNode }) {
  return children;
}
