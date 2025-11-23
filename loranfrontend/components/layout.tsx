// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Server-side imports (safe)
import Header from "@/components/Layouts/Header";
import Footer from "@/components/Layouts/Footer";

// Client-side imports (dynamic – avoids SSR errors)
import dynamic from "next/dynamic";

const FloatingCTA = dynamic(
  () => import("@/components/ui/FloatingCTA"),
  { ssr: false } // Only load on client
);

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Loran – Designer × Client",
  description: "AI-powered fashion marketplace connecting designers and clients.",
  keywords: "fashion, designer, AI try-on, bespoke clothing, couture",
  openGraph: {
    title: "Loran",
    description: "Where designers meet their perfect clients.",
    images: ["/images/hero-bg.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      
        <link rel="icon" href="/favicon.ico" />
      
      <body className={`${inter.className} min-h-screen flex flex-col bg-gray-50`}>
        {/* Server-rendered Header */}
        <Header />

        {/* Page content */}
        <main className="flex-1">{children}</main>

        {/* Server-rendered Footer */}
        <Footer />

        {/* Client-only Floating CTA */}
        <FloatingCTA />
      </body>
    </html>
  );
}