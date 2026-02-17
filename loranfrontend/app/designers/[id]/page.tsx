"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { Star } from "lucide-react";
import ReviewList from "@/components/Review/ReviewList";

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
              <div className="mt-2 flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.round(profile.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {profile.rating.toFixed(1)} ({profile.totalReviews || 0} review{profile.totalReviews !== 1 ? 's' : ''})
                </span>
              </div>
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
          {profile.uploads?.map((u: any) => (
            <div key={u._id} className="bg-white rounded-lg shadow overflow-hidden group">
              <div className="relative h-64 w-full">
                <Image src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${u.image || u.imageUrl}`} alt={u.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800">{u.title}</h3>
                <p className="text-pink-600 font-extrabold mt-1">₦{u.price?.toLocaleString()}</p>
                <Link 
                   href={`/catalogue?item=${u._id}`}
                   className="mt-3 block text-center py-2 bg-gray-900 text-white rounded text-xs font-bold hover:bg-black transition-colors"
                >
                  Order Custom
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">Client Reviews</h2>
        <ReviewList designerId={id as string} />
      </div>
    </div>
  );
}
