// components/Designer/DesignCard.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Edit2, Trash2 } from "lucide-react";

interface Props {
  design: {
    _id: string;
    title: string;
    description: string;
    imageUrl: string;
    createdAt: string;
  };
  onDelete: (id: string) => void;
}

export default function DesignCard({ design, onDelete }: Props) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden"
    >
      <div className="relative aspect-[3/4]">
        <Image
          src={design.imageUrl}
          alt={design.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-4">
          <div className="flex gap-2">
            <button className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/40">
              <Edit2 size={18} className="text-white" />
            </button>
            <button
              onClick={() => onDelete(design._id)}
              className="bg-red-500/80 backdrop-blur-sm p-2 rounded-full hover:bg-red-600"
            >
              <Trash2 size={18} className="text-white" />
            </button>
          </div>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-800">{design.title}</h3>
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{design.description}</p>
        <p className="text-xs text-gray-500 mt-3">
          {new Date(design.createdAt).toLocaleDateString()}
        </p>
      </div>
    </motion.div>
  );
}