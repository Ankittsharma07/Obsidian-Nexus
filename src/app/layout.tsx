import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/shared/data-state";
import { SiteFooter } from "@/components/layout/site-footer";

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Obsidian Nexus",
  description: "Client intelligence SaaS with AI-powered health insights.",
  metadataBase: new URL("https://obsidian-nexus.vercel.app"),
  openGraph: {
    title: "Obsidian Nexus",
    description: "Premium full-stack client intelligence platform.",
    images: ["/og.png"]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-base text-slate-100 antialiased", grotesk.variable)} suppressHydrationWarning>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
