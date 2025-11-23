"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";

interface DesignerBrief {
  id: string;
  name: string;
  joinedAt: string;
}

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

  if (loading) return <div className="py-20">Loading designers…</div>;

  return (
    <div className="py-12 px-4 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Designers</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {designers.map((d) => (
          <div key={d.id} className="bg-white rounded-lg shadow p-4 text-center">
            <div className="mx-auto mb-4 h-28 w-28 rounded-full overflow-hidden bg-gray-100">
              <Image src="/images/default-avatar.jpg" alt={d.name} width={112} height={112} />
            </div>
            <h3 className="font-semibold">{d.name}</h3>
            <p className="text-sm text-gray-500">Joined {new Date(d.joinedAt).getFullYear()}</p>
            <Link href={`/designers/${d.id}`} className="mt-3 inline-block text-indigo-600 hover:underline">
              View Profile
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}