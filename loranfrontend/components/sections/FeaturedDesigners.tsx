"use client"
// components/sections/FeaturedDesigners.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fadeUp, cardLift } from "@/app/lib/animations";
import Image from "next/image";
import Link from "next/link";
import { apiClient } from "@/lib/api";

interface FeaturedDesigner {
  id: string;
  name: string;
  avatarUrl?: string | null;
}

const AVATAR_FALLBACKS = [
  "/images/designer-1.jpg",
  "/images/designer-2.jpg",
  "/images/designer-3.jpg",
  "/images/hands-sewing.jpg",
];

const pickFallback = (seed: string) => {
  const key = String(seed || "fallback");
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  return AVATAR_FALLBACKS[hash % AVATAR_FALLBACKS.length];
};

const getAvatarSrc = (avatarUrl?: string | null, seed: string = "fallback") => {
  const fallback = pickFallback(seed);

  if (!avatarUrl) return fallback;

  const raw = String(avatarUrl).trim();
  const normalized = raw.replace(/\\/g, "/").replace(/^\.\//, "");

  if (!raw || raw === "null" || raw === "undefined") return fallback;

  if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
    return normalized;
  }

  if (normalized.startsWith("/images/")) {
    return normalized;
  }

  if (normalized.startsWith("/uploads/") || normalized.startsWith("uploads/")) {
    const backendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000").replace(/\/$/, "");
    const uploadPath = normalized.startsWith("/") ? normalized : `/${normalized}`;
    return `${backendUrl}${uploadPath}`;
  }

  if (normalized.startsWith("/")) {
    return normalized;
  }

  return fallback;
};

export default function FeaturedDesigners() {
  const [designers, setDesigners] = useState<FeaturedDesigner[]>([]);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadFeaturedDesigners = async () => {
      try {
        const res = await apiClient.get<FeaturedDesigner[]>("/api/designers", {
          timeout: 8000,
        });

        if (!isMounted) return;

        if (Array.isArray(res.data)) {
          setDesigners(res.data.slice(0, 6));
          setLoadError(false);
        } else {
          setDesigners([]);
          setLoadError(true);
        }
      } catch (error) {
        console.error("Failed to load featured designers:", error);
        if (isMounted) {
          // Use the deployed API directly if an older Vercel build was made
          // without NEXT_PUBLIC_BACKEND_URL.
          try {
            const fallback = await fetch("https://loran-code.onrender.com/api/designers");
            const data: unknown = await fallback.json();
            if (isMounted && fallback.ok && Array.isArray(data)) {
              setDesigners(data.slice(0, 6) as FeaturedDesigner[]);
              setLoadError(false);
              return;
            }
          } catch (fallbackError) {
            console.error("Fallback featured-designers request failed:", fallbackError);
          }

          if (isMounted) {
            setDesigners([]);
            setLoadError(true);
          }
        }
      }
    };

    loadFeaturedDesigners();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-16 md:py-20 px-4 sm:px-6" style={{ background: "var(--surface)" }}>
      <div className="container mx-auto px-6">
        <motion.h2
          className="text-2xl sm:text-4xl md:text-5xl text-center mb-4"
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, color: "var(--text)" }}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          Featured Designers
        </motion.h2>
        <motion.p
          className="text-center mb-12"
          style={{ color: "var(--muted)" }}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          Independent talent. Direct orders. Zero middlemen.
        </motion.p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
          {designers.map((d) => (
            <Link key={d.id} href={`/designers/${d.id}`} className="block">
              <motion.div
                className="group relative overflow-hidden rounded-2xl cursor-pointer"
                style={{ border: "1px solid var(--border)", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}
                variants={cardLift}
                whileHover={{ y: -3, boxShadow: "0 24px 60px rgba(0,0,0,0.3)", borderColor: "rgba(232,220,192,0.25)" }}
              >
                <div className="w-full h-64 relative">
                  <Image
                    src={getAvatarSrc(d.avatarUrl, d.id || d.name)}
                    alt={d.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110 rounded-2xl"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    onError={(event) => {
                      event.currentTarget.src = pickFallback(d.id || d.name);
                    }}
                  />
                </div>
                <motion.div
                  className="absolute inset-0 flex flex-col justify-end p-4 md:p-6 opacity-100 transition-opacity duration-300"
                  style={{ background: "linear-gradient(to top, rgba(14,42,34,0.92) 0%, transparent 100%)" }}
                >
                  <h3
                    className="text-xl mb-1"
                    style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, color: "var(--text)" }}
                  >
                    {d.name}
                  </h3>
                  <p className="text-sm" style={{ color: "var(--muted)" }}>Verified Designer</p>
                </motion.div>
              </motion.div>
            </Link>
          ))}

          {designers.length === 0 && (
            <div className="col-span-full text-center py-8" style={{ color: "var(--muted)" }}>
              {loadError ? "Featured designers are temporarily unavailable. Please try again shortly." : "No approved designers to show yet."}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}