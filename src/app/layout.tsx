import type { Metadata } from "next";
import { Chakra_Petch, Share_Tech_Mono } from "next/font/google";
import "./globals.css";
import "@/components/ui/scroll-cue.css";
import "@/features/home/spatial-hero.css";
import "@/components/site/statistics-bar.css";
import "@/components/site/technical-rail.css";
import "@/components/site/service-dossier.css";
import "@/components/site/page-family.css";
import "@/components/site/section-rail.css";
import "@/components/site/dot-texture.css";
import "@/components/site/grain-texture.css";
import "@/components/site/project-catalog.css";
import "@/features/services/services-page.css";
import "@/features/projects/project-detail.css";
import "@/features/contact/contact-page.css";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { SiteShell } from "@/components/site/site-shell";

const body = Chakra_Petch({
  weight: ["400", "700"],
  style: "normal",
  variable: "--font-chakra-petch",
  subsets: ["latin"],
});

const display = Share_Tech_Mono({
  weight: "400",
  variable: "--font-share-tech-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vurla — Built with intention",
  description:
    "Vurla is a design practice for spaces, objects, and environments that hold their ground.",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable}`}>
      <body className="antialiased">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteShell header={<Navbar />} footer={<Footer />}>{children}</SiteShell>
      </body>
    </html>
  );
}
