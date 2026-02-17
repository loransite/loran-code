"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Users, Mail, Phone, MapPin, Award, Calendar } from "lucide-react";

type User = {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  phone?: string;
  city?: string;
  state?: string;
  country?: string;
  brandName?: string;
  yearsExperience?: number;
  expertiseLevel?: string;
  height?: number;
  bmi?: number;
  createdAt: string;
};

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "client" | "designer" | "admin">("all");

  useEffect(() => {
    // Check if user is admin
    const token = sessionStorage.getItem("token");
    const userStr = sessionStorage.getItem("user");

    if (!token || !userStr) {
      alert("Please login as admin");
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (user.role !== "admin") {
        alert("Access denied. Admin only.");
        router.push("/");
        return;
      }

      // Fetch all users
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setUsers(data.users || data || []);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch users:", err);
          setLoading(false);
        });
    } catch (e) {
      alert("Session error");
      router.push("/login");
    }
  }, [router]);

  const filteredUsers = users.filter((u) => filter === "all" || u.role === filter);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Users className="w-10 h-10 text-blue-600" />
            Registered Users
          </h1>
          <p className="text-gray-600">Total: {users.length} users</p>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {["all", "client", "designer", "admin"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === f
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span className="ml-2 text-sm">
                ({f === "all" ? users.length : users.filter((u) => u.role === f).length})
              </span>
            </button>
          ))}
        </div>

        {/* Users Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{user.fullName}</h3>
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-semibold mt-1 ${
                      user.role === "admin"
                        ? "bg-red-100 text-red-700"
                        : user.role === "designer"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>

                {user.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{user.phone}</span>
                  </div>
                )}

                {(user.city || user.country) && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {[user.city, user.state, user.country].filter(Boolean).join(", ")}
                    </span>
                  </div>
                )}

                {user.role === "designer" && (
                  <>
                    {user.brandName && (
                      <div className="font-semibold text-purple-600">
                        Brand: {user.brandName}
                      </div>
                    )}
                    {user.yearsExperience && (
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        <span>
                          {user.yearsExperience} years • {user.expertiseLevel || "N/A"}
                        </span>
                      </div>
                    )}
                  </>
                )}

                {user.role === "client" && (
                  <>
                    {user.height && (
                      <div className="text-gray-600">Height: {user.height} cm</div>
                    )}
                    {user.bmi && <div className="text-gray-600">BMI: {user.bmi}</div>}
                  </>
                )}

                <div className="flex items-center gap-2 text-xs text-gray-400 pt-2 border-t">
                  <Calendar className="w-3 h-3" />
                  <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No {filter !== "all" ? filter + "s" : "users"} found
          </div>
        )}
      </div>
    </div>
  );
}
