"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Camera, User, Star } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/lib/AuthContext";

interface ProfileHeaderProps {
  role: "client" | "designer";
}

export default function ProfileHeader({ role }: ProfileHeaderProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { user, updateUser } = useAuth();

  useEffect(() => {
    if (user?.profilePicture) {
      setPreviewUrl(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${user.profilePicture}`);
    }
  }, [user]);

  const handlePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to server
    setUploading(true);
    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      // Update AuthContext with new profile data
      updateUser(res.data);
      
      alert("✅ Profile picture updated successfully");
    } catch (error: unknown) {
      console.error("Upload failed:", error);
      const err = error as { response?: { data?: { message?: string } } };
      alert(err.response?.data?.message || "Failed to upload picture");
      // Revert preview on error
      if (user?.profilePicture) {
        setPreviewUrl(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${user.profilePicture}`);
      } else {
        setPreviewUrl(null);
      }
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
          <div className="flex-1">
            <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-lg p-6 mb-6"
    >
      <div className="flex items-center gap-6">
        {/* Profile Picture */}
        <div className="relative group">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-lg">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt={user.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-12 h-12 text-white" />
            )}
          </div>
          
          {/* Upload Button Overlay */}
          <label
            htmlFor="profile-upload"
            className={`absolute inset-0 rounded-full bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center ${
              uploading ? "opacity-100" : ""
            }`}
          >
            {uploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            ) : (
              <Camera className="w-8 h-8 text-white" />
            )}
          </label>
          <input
            id="profile-upload"
            type="file"
            accept="image/*"
            onChange={handlePictureUpload}
            className="hidden"
            disabled={uploading}
          />
        </div>

        {/* User Info */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            {user.fullName}
          </h2>
          <p className="text-gray-600 mb-2">{user.email}</p>
          
          {role === "designer" && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="font-semibold text-gray-800">
                  {user.rating ? user.rating.toFixed(1) : "No ratings yet"}
                </span>
                {user.totalReviews && user.totalReviews > 0 && (
                  <span className="text-xs text-gray-600 ml-1">
                    ({user.totalReviews} review{user.totalReviews !== 1 ? 's' : ''})
                  </span>
                )}
              </div>
            </div>
          )}
          
          {role === "client" && user.height && (
            <div className="flex gap-4 text-sm text-gray-600">
              <span>Height: {user.height} cm</span>
              {user.bmi && <span>BMI: {user.bmi}</span>}
            </div>
          )}
        </div>

        {/* Role Badge */}
        <div className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold capitalize shadow-md">
          {role}
        </div>
      </div>
    </motion.div>
  );
}
