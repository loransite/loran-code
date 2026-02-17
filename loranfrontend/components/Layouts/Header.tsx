// components/layout/Header.tsx
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm shadow-sm">
      <nav className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Loran
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/catalogue" className="text-gray-700 hover:text-indigo-600 transition">
            Catalogue
          </Link>
          <Link href="/designers" className="text-gray-700 hover:text-indigo-600 transition">
            Designers
          </Link>
          <Link href="/how-it-works" className="text-gray-700 hover:text-indigo-600 transition">
            How It Works
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Button href="/login" variant="ghost" className="hidden md:inline-flex">
            Log In
          </Button>
          <Button href="/signup" variant="primary">
            Sign Up
          </Button>
        </div>
      </nav>
    </header>
  );
}