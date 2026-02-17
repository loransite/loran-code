// frontend/components/DesignerUploadsGrid.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CatalogueItem } from "@/app/types/index"
import { fadeUp, stagger } from "@/app/lib/animations";
import ItemModal from "@/components/Catalogue/itemModal";
import { useState } from "react";

interface Props {
  items: CatalogueItem[];
}

export default function DesignerUploadsGrid({ items }: Props) {
  const [modalItem, setModalItem] = useState<CatalogueItem | null>(null);

  return (
    <>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
        variants={stagger}
        initial="offscreen"
        whileInView="show"
        viewport={{ once: true }}
      >
        {items.map((item) => (
          <motion.article
            key={item._id}
            variants={fadeUp}
            className="group cursor-pointer overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-shadow"
            onClick={() => setModalItem(item)}
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-900 truncate">{item.title}</h3>
              <p className="text-xl font-bold text-pink-600">${item.price}</p>
            </div>
          </motion.article>
        ))}
      </motion.div>

      {modalItem && <ItemModal item={modalItem} onClose={() => setModalItem(null)} />}
    </>
  );
}