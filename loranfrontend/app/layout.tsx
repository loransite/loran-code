import "@/app/globals.css";
import Navbar from "@/components/Navbar";
import EmailVerificationBanner from "@/components/EmailVerificationBanner";
import Footer from "@/components/Layouts/Footer";
import type { Metadata } from "next";

import { AuthProvider } from '@/lib/AuthContext';

export const metadata: Metadata = {
  title: "Loran – Bespoke Fashion",
  description: "Fashion marketplace for AI try-on and designer showcase.",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <AuthProvider>
          <Navbar />
          <EmailVerificationBanner />
          <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
