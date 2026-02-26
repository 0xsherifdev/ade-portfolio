import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import { readSingleton } from "@directus/sdk";
import directus from "@/lib/directus";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

async function getSiteSettings() {
  if (directus) {
    try {
      return await directus.request(readSingleton('site_settings'))
    } catch {}
  }
  return null
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return {
    title: settings?.title ?? "Ade | Web3 Developer",
    description: settings?.description ?? "I'm Ade — a full-stack blockchain developer specializing in smart contracts, DeFi protocols, and AI-powered Web3 applications. Turning ideas into production-ready code.",
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings()

  const logoText = settings?.logo_text ?? 'ade.dev'
  const footerText = settings?.footer_text ?? 'Designed & Built by Ade © 2025'
  const navItems = (settings?.nav_items as { label: string; href: string }[] | null) ?? undefined

  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${jetbrainsMono.variable} antialiased relative`}
      >
        <div className="grid-bg"></div>
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <Navbar logoText={logoText} navItems={navItems} />
        {children}
        <Footer text={footerText} />
      </body>
    </html>
  );
}
