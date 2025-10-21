import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { SiteProvider } from "@/context/SiteContext";
import { Navbar } from "@/components/ui/navbar/Navbar";
import { Footer } from "@/components/site/Footer";
import { DebugPanel } from "@/components/site/DebugPanel";
import { PageTransition } from "@/components/site/PageTransition";
import { ProgressBar } from "@/components/site/ProgressBar";
import { LoadingOverlay } from "@/components/site/LoadingOverlay";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Vurla - Architecture that Elevates Space",
	description: "Award-winning architecture firm specializing in residential, commercial, and public realm design. Creating thoughtful, resilient environments for living, working, and gathering.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Short title: App providers and site chrome */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SiteProvider>
            <Navbar />
            <main className="min-h-screen" aria-busy={false}>
              <PageTransition>
                {children}
              </PageTransition>
            </main>
            <Footer />
            <DebugPanel />
            <ProgressBar />
            <LoadingOverlay />
          </SiteProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
