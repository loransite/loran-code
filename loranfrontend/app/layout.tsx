import "@/app/globals.css";
import Navbar from "@/components/Navbar";
import EmailVerificationBanner from "@/components/EmailVerificationBanner";
import Footer from "@/components/Layouts/Footer";

import { AuthProvider } from '@/lib/AuthContext';

export const metadata = {
  title: "Loran – Custom Fashion, Made for You",
  description: "Connect with independent designers, get AI-powered measurements, and order bespoke clothing tailored exactly to your fit.",
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
      <body
        className="antialiased"
        style={{
          backgroundColor: "var(--bg)",
          color: "var(--text)",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <AuthProvider>
          <Navbar />
          <EmailVerificationBanner />
          <main className="px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
