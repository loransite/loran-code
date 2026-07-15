"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";

interface DesignerBrief {
  id: string;
  name: string;
  joinedAt: string;
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

  if (normalized.startsWith("http://") || normalized.startsWith("https://") || normalized.startsWith("/images/")) {
    return normalized;
  }

  if (normalized.startsWith("/uploads/") || normalized.startsWith("uploads/")) {
    const backendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000").replace(/\/$/, "");
    const uploadPath = normalized.startsWith("/") ? normalized : `/${normalized}`;
    return `${backendUrl}${uploadPath}`;
  }

  if (normalized.startsWith("/")) return normalized;
  return fallback;
};

export default function DesignersPage() {
  const [designers, setDesigners] = useState<DesignerBrief[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/designers`)
      .then((res) => setDesigners(res.data || []))
      .catch((e) => {
        console.error("Failed to load designers", e);
        setDesigners([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="py-20 text-center" style={{ color: "var(--muted)" }}>Loading designers…</div>
  );

  return (
    <div className="py-8 md:py-12 px-4 max-w-7xl mx-auto" style={{ minHeight: "100vh" }}>
      <h1
        className="mb-6 md:mb-8"
        style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, color: "var(--text)", fontSize: "clamp(28px, 7vw, 48px)" }}
      >
        Designers
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {designers.map((d) => (
          <div
            key={d.id}
            className="p-4 md:p-5 text-center rounded-2xl transition-all"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}
          >
            <div className="mx-auto mb-3 h-20 w-20 md:h-28 md:w-28 rounded-full overflow-hidden" style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
              <Image src={getAvatarSrc(d.avatarUrl, d.id || d.name)} alt={d.name} width={112} height={112} className="w-full h-full object-cover" />
            </div>
            <h3 className="font-medium text-sm md:text-base" style={{ color: "var(--text)" }}>{d.name}</h3>
            <p className="text-xs mt-1" style={{ color: "var(--muted)", fontFamily: "'JetBrains Mono', monospace" }}>
              Joined {new Date(d.joinedAt).getFullYear()}
            </p>
            <Link
              href={`/designers/${d.id}`}
              className="mt-3 inline-block text-xs font-semibold px-4 py-2 transition-all"
              style={{ background: "var(--highlight)", color: "#0E2A22", borderRadius: "3px" }}
            >
              View Profile
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}