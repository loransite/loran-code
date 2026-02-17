// components/DesignerProfile.tsx
import Image from "next/image";
import DesignerUploadsGrid from "./DesignerUploadsGrid";
import type { DesignerProfile, CatalogueItem } from "@/app/types";
import { format } from "date-fns";

interface Props {
  designer: DesignerProfile;   // ← Full profile
  items: CatalogueItem[];
}

export default function DesignerProfile({ designer, items }: Props) {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero */}
      <div className="bg-gradient-to-br from-pink-50 to-indigo-50 rounded-3xl p-8 md:p-12 mb-12">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden ring-4 ring-white shadow-xl">
              <Image
                src={designer.avatarUrl || "/images/default-avatar.jpg"}
                alt={designer.name}
                width={160}
                height={160}
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900">{designer.name}</h1>
            <p className="text-lg text-gray-600 mt-2">
              Joined {format(new Date(designer.joinedAt), "MMMM yyyy")}
            </p>
            <div className="flex gap-6 justify-center md:justify-start mt-4 text-sm">
              <div>
                <span className="font-bold text-2xl text-pink-600">{designer.totalDesigns}</span>
                <p className="text-gray-600">Designs</p>
              </div>
            </div>
          </div>
        </div>

        {designer.bio && (
          <p className="mt-8 text-lg text-gray-700 max-w-3xl mx-auto md:mx-0 leading-relaxed">
            {designer.bio}
          </p>
        )}
      </div>

      {/* Uploads */}
      <section>
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center md:text-left">
          All Designs
        </h2>
        {items.length > 0 ? (
          <DesignerUploadsGrid items={items} />
        ) : (
          <p className="text-center text-gray-500 py-12">No designs yet.</p>
        )}
      </section>
    </div>
  );
}