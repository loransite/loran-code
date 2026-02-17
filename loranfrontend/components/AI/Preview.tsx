"use client";

import Image from "next/image";
import { Measurement } from "../../lib/ai";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Preview({ src, measurements, onUpdate }: { src: string | null; measurements: Measurement[]; onUpdate?: (idx: number, bbox: { x:number; y:number; w:number; h:number }) => void }) {
  if (!src) {
    return (
      <div className="bg-gray-50 rounded-lg h-64 flex items-center justify-center">
        <p className="text-gray-400">No image selected</p>
      </div>
    );
  }

  return (
    <div className="relative rounded-lg overflow-hidden bg-white shadow">
      <div className="w-full h-96 relative">
        <Image src={src} alt="Uploaded" fill className="object-contain" />
      </div>

      {/* Overlay boxes */}
      {measurements.map((m, i) => (
        m.bbox ? (
          <DraggableBox key={i} idx={i} m={m} onUpdate={onUpdate} />
        ) : null
      ))}
    </div>
  );
}

function DraggableBox({ idx, m, onUpdate }: { idx: number; m: Measurement; onUpdate?: (i:number, bbox:{x:number;y:number;w:number;h:number})=>void }) {
  const [pos, setPos] = useState({ x: m.bbox!.x, y: m.bbox!.y });
  const [dragging, setDragging] = useState(false);
  useEffect(() => { setPos({ x: m.bbox!.x, y: m.bbox!.y }); }, [m.bbox]);

  const start = (e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
    const startX = e.clientX;
    const startY = e.clientY;
    const orig = { x: pos.x, y: pos.y };

    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      setPos({ x: Math.max(0, orig.x + dx), y: Math.max(0, orig.y + dy) });
    };

    const onUp = () => {
      setDragging(false);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      onUpdate?.(idx, { x: pos.x, y: pos.y, w: m.bbox!.w, h: m.bbox!.h });
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="absolute border-2 border-indigo-500 text-indigo-600 cursor-move"
      style={{ left: `${pos.x}px`, top: `${pos.y}px`, width: `${m.bbox!.w}px`, height: `${m.bbox!.h}px` }}
      onMouseDown={start}
    >
      <div className="text-xs bg-indigo-600 text-white px-1">{m.label}</div>
    </motion.div>
  );
}
