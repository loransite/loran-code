import "@/app/globals.css";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title:  "Loran – Bespoke Fashion",
  description: "Fashion marketplace for AI try-on and designer showcase.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <Navbar />
        <main className="pt-20">{children}</main>
      </body>
    </html>
  );
}
