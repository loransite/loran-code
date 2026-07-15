// components/Catalogue/ItemCard.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { CatalogueItem } from "@/app/types";

interface Props {
  item: CatalogueItem;
  onClick?: () => void; // Open modal
}

export default function ItemCard({ item, onClick }: Props) {
  const designerName = typeof item.designer === 'object' && item.designer?.name ? item.designer.name : typeof item.designer === 'string' ? item.designer : 'Unknown';
  const designerId = typeof item.designer === 'object' && item.designer?.id ? item.designer.id : null;

  return (
    <motion.article
      className="group cursor-pointer"
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl transition-shadow duration-300" style={{ background: "var(--surface-2)", border: "1px solid var(--border)", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
        <Image
          src={item.imageUrl?.startsWith('/images/') 
            ? item.imageUrl 
            : `${process.env.NEXT_PUBLIC_BACKEND_URL}${item.imageUrl}`}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "linear-gradient(to top, rgba(14,42,34,0.8) 0%, transparent 100%)" }} />
      </div>

      {/* Info */}
      <div className="mt-4 text-center">
        <h3 className="text-lg font-medium line-clamp-1" style={{ color: "var(--text)" }}>{item.title}</h3>
        <p className="text-lg font-semibold mt-1" style={{ color: "var(--highlight)", fontFamily: "'JetBrains Mono', monospace" }}>₦{item.price.toLocaleString()}</p>

        {/* Designer Link */}
        {designerId ? (
          <Link
            href={`/designers/${designerId}`}
            className="mt-2 inline-block text-sm font-medium transition-colors"
            style={{ color: "var(--muted)" }}
            onClick={(e) => e.stopPropagation()}
          >
            by {designerName} →
          </Link>
        ) : (
          <span className="mt-2 inline-block text-sm font-medium" style={{ color: "var(--muted)" }}>by {designerName} →</span>
        )}
      </div>
    </motion.article>
  );
}