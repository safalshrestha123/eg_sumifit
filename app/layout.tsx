import type { Metadata } from "next";
import { Geist } from "next/font/google";

import { SiteShell } from "@/components/layout/site-shell";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { createPageMetadata, siteConfig } from "@/lib/site";

import "./globals.css";

const geist = Geist({ subsets: ["latin"], display: "swap" });

const homeMetadata = createPageMetadata({
  title: "Personal Training & Online Coaching",
  description: siteConfig.description,
  path: "/",
});

export const metadata: Metadata = {
  ...homeMetadata,
  metadataBase: new URL(siteConfig.url),
  title: { default: "SumiFitness | Personal Training & Online Coaching", template: "%s | SumiFitness" },
  keywords: ["personal trainer", "fitness coach", "online coaching", "strength training", "weight loss"],
  authors: [{ name: "SumiFitness" }],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.className} min-h-screen bg-white text-gray-900 antialiased dark:bg-gray-950 dark:text-gray-100`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SiteShell>{children}</SiteShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
