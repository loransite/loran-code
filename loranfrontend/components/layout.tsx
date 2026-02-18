import "@/app/globals.css";
import dynamic from "next/dynamic";

export const metadata = {
  title: "Loran – Bespoke Fashion",
  description: "Fashion marketplace for AI try-on and designer showcase.",
};

const Navbar = dynamic(() => import("@/components/Navbar"), { ssr: false });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="bg-gray-50 text-gray-900">
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{
              const scrub=(el)=>{ if(!el) return; Array.from(el.attributes).forEach(a=>{ if(/^data-gr|^data-new-gr|^data-gramm/.test(a.name)) el.removeAttribute(a.name); }); };
              scrub(document.documentElement);
              scrub(document.body);
            }catch(e){} })();`,
          }}
        />
        <Navbar />
        <main className="pt-20">{children}</main>
      </body>
    </html>
  );
}