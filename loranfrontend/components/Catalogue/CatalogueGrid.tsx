// frontend/components/CatalogueGrid.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { fadeUp, stagger } from "@/app/lib/animations";
import { CatalogueItem } from "@/app/types";
import ItemModal from "./itemModal";

interface Props {
  items: CatalogueItem[];
}

export default function CatalogueGrid({ items }: Props) {
  const [modalItem, setModalItem] = useState<CatalogueItem | null>(null);

  // Randomize once per load
  const shuffled = useMemo(() => {
    return [...items].sort(() => Math.random() - 0.5);
  }, [items]);

  return (
    <>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        variants={stagger}
        initial="offscreen"
        animate="show"
      >
        {shuffled.map((item) => {
          const designerName = typeof item.designer === 'object' && item.designer?.name ? item.designer.name : typeof item.designer === 'string' ? item.designer : 'Unknown';
          const designerId = typeof item.designer === 'object' && item.designer?.id ? item.designer.id : null;

          return (
          <motion.article
            key={item._id}
            variants={fadeUp}
            className="group cursor-pointer"
            onClick={() => setModalItem(item)}
          >
            {/* Image */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl" style={{ background: "var(--surface-2)" }}>
              <Image
                src={item.imageUrl?.startsWith('/images/') 
                  ? item.imageUrl 
                  : `${process.env.NEXT_PUBLIC_BACKEND_URL}${item.imageUrl}`}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "linear-gradient(to top, rgba(14,42,34,0.75) 0%, transparent 100%)" }} />
            </div>

            {/* Info */}
            <div className="mt-4 text-center">
              <h3 className="font-medium truncate" style={{ color: "var(--text)" }}>{item.title}</h3>
              <p className="text-lg font-semibold" style={{ color: "var(--highlight)", fontFamily: "'JetBrains Mono', monospace" }}>₦{item.price.toLocaleString()}</p>

              {/* Designer Link */}
              {designerId ? (
                <Link
                  href={`/designers/${designerId}`}
                  className="mt-1 inline-block text-sm font-medium transition-colors"
                  style={{ color: "var(--muted)" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  by {designerName} →
                </Link>
              ) : (
                <span className="mt-1 inline-block text-sm font-medium" style={{ color: "var(--muted)" }}>by {designerName} →</span>
              )}
            </div>
          </motion.article>
        )})}
      </motion.div>

      <AnimatePresence>
        {modalItem && <ItemModal item={modalItem} onClose={() => setModalItem(null)} />}
      </AnimatePresence>
    </>
  );
}