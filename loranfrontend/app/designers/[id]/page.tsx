"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

interface UploadItem {
  _id: string;
  title: string;
  price: number;
  imageUrl: string;
  createdAt: string;
}

export default function DesignerProfilePage() {
  const params = useParams() as { id?: string };
  const id = params?.id;
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/designers/${id}`)
      .then((res) => setProfile(res.data))
      .catch((e) => {
        console.error("Failed to load profile", e);
        router.push("/designers");
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) return <div className="py-20">Loading profile…</div>;
  if (!profile) return <div className="py-20">Profile not found</div>;

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="bg-gradient-to-r from-pink-50 to-indigo-50 rounded-xl p-6 mb-8 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="h-32 w-32 rounded-full overflow-hidden bg-gray-100 ring-4 ring-white shadow">
            <Image src={profile.avatarUrl || '/images/default-avatar.jpg'} alt={profile.name} width={128} height={128} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{profile.name}</h1>
            <p className="text-sm text-gray-600">{profile.yearsExperience} years experience • {profile.jobsDone} jobs</p>
            {profile.rating ? (
              <div className="mt-2 text-yellow-500">{Array.from({ length: Math.round(profile.rating) }).map((_, i) => (
                <span key={i}>★</span>
              ))}</div>
            ) : (
              <p className="text-sm text-gray-500 mt-2">No ratings yet</p>
            )}
            {profile.bio && <p className="mt-3 text-gray-700 max-w-2xl">{profile.bio}</p>}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Designs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {profile.uploads.map((u: UploadItem) => (
            <div key={u._id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="relative h-56 w-full">
                <Image src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${u.imageUrl}`} alt={u.title} fill className="object-cover" />
              </div>
              <div className="p-4">
                <h3 className="font-medium">{u.title}</h3>
                <p className="text-pink-600 font-bold">${u.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
