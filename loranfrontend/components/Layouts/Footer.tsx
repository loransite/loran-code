// components/layout/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-t from-gray-50 to-white py-12 mt-20">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-6">
        <div>
          <h3 className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Loran
          </h3>
          <p className="text-sm text-gray-600 mt-2">
            Connecting fashion visionaries with their perfect clients.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800">Platform</h4>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            <li><Link href="/catalogue" className="hover:text-indigo-600">Catalogue</Link></li>
            <li><Link href="/designers" className="hover:text-indigo-600">Designers</Link></li>
            <li><Link href="/ai-tryon" className="hover:text-indigo-600">AI Try-On</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            <li><Link href="/about" className="hover:text-indigo-600">About</Link></li>
            <li><Link href="/blog" className="hover:text-indigo-600">Blog</Link></li>
            <li><Link href="/careers" className="hover:text-indigo-600">Careers</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800">Legal</h4>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            <li><Link href="/privacy" className="hover:text-indigo-600">Privacy</Link></li>
            <li><Link href="/terms" className="hover:text-indigo-600">Terms</Link></li>
          </ul>
        </div>
      </div>

      <div className="mt-12 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Loran. Crafted with love.
      </div>
    </footer>
  );
}