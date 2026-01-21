"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { Star, Package, MessageSquare } from "lucide-react";
import ProfileHeader from "@/components/Dashboard/ProfileHeader";
import { useAuth } from "@/lib/AuthContext";

// Define types
interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

interface Order {
  _id: string;
  catalogueId: { _id: string; title: string; description: string; price: number };
  status: string;
  total: number;
  createdAt: string;
}

export default function ClientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { availableRoles, token, user: authUser } = useAuth();
  const [showDesignerForm, setShowDesignerForm] = useState(false);
  const [designerForm, setDesignerForm] = useState({
    brandName: "",
    phone: "",
    city: "",
    state: "",
    country: "",
    shopAddress: "",
    yearsExperience: "",
    expertiseLevel: "intermediate",
    bio: "",
  });

  const handleBecomeDesigner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/add-role`,
        { 
          role: "designer", 
          designerDetails: designerForm 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert(res.data.message);
      // Refresh user data (especially designerStatus)
      window.location.reload();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to submit application");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    const activeRole = localStorage.getItem("activeRole");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    // Check if user is logged in as client
    if (activeRole !== "client") {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(userData) as User;
    setUser(parsedUser);

    const fetchData = async () => {
      try {
        const ordersRes = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/client`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Failed to fetch data");
        } else {
          setError("Unexpected error occurred");
        }
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Loran Tailoring</h1>
          <div className="flex items-center space-x-4">
            <p>Welcome, {user.fullName} ({user.role})</p>
          </div>
        </div>
      </header>

      {/* Profile Header */}
      <div className="container mx-auto px-4 py-6">
        <ProfileHeader role="client" />
      </div>

      {/* Main Site Content (Catalogue) */}
      <main className="container mx-auto px-4 py-8">
        {/* Upgrade to Designer Banner */}
        {!availableRoles?.includes("designer") && (
          <div className="mb-6 bg-gradient-to-r from-blue-100 to-indigo-100 p-6 rounded-lg shadow-sm border border-blue-200">
            {authUser?.designerStatus === 'pending' ? (
              <div className="text-center">
                <h3 className="text-xl font-bold text-yellow-800 mb-2">Application Pending</h3>
                <p className="text-yellow-700">Your application to become a designer is currently under review by our team. We will notify you once approved!</p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-blue-800 mb-2">Want to sell your designs?</h3>
                <p className="text-blue-600 mb-4">You are currently a client. Follow the due process below to register as a designer and start uploading your work.</p>
                {!showDesignerForm ? (
                  <button 
                    onClick={() => setShowDesignerForm(true)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Start Designer Application
                  </button>
                ) : (
                  <form onSubmit={handleBecomeDesigner} className="bg-white p-6 rounded-lg shadow-inner space-y-4">
                    <h4 className="font-bold text-gray-700 border-b pb-2">Business Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Brand Name"
                        required
                        className="border p-2 rounded w-full"
                        onChange={(e) => setDesignerForm({...designerForm, brandName: e.target.value})}
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        required
                        className="border p-2 rounded w-full"
                        onChange={(e) => setDesignerForm({...designerForm, phone: e.target.value})}
                      />
                    </div>
                    
                    <h4 className="font-bold text-gray-700 border-b pb-2">Location Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input
                        type="text"
                        placeholder="City"
                        required
                        className="border p-2 rounded w-full"
                        onChange={(e) => setDesignerForm({...designerForm, city: e.target.value})}
                      />
                      <input
                        type="text"
                        placeholder="State"
                        required
                        className="border p-2 rounded w-full"
                        onChange={(e) => setDesignerForm({...designerForm, state: e.target.value})}
                      />
                      <input
                        type="text"
                        placeholder="Country"
                        required
                        className="border p-2 rounded w-full"
                        onChange={(e) => setDesignerForm({...designerForm, country: e.target.value})}
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Shop/Studio Address"
                      required
                      className="border p-2 rounded w-full"
                      onChange={(e) => setDesignerForm({...designerForm, shopAddress: e.target.value})}
                    />

                    <h4 className="font-bold text-gray-700 border-b pb-2">Professional Profile</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="number"
                        placeholder="Years of Experience"
                        required
                        className="border p-2 rounded w-full"
                        onChange={(e) => setDesignerForm({...designerForm, yearsExperience: e.target.value})}
                      />
                      <select
                        className="border p-2 rounded w-full"
                        value={designerForm.expertiseLevel}
                        onChange={(e) => setDesignerForm({...designerForm, expertiseLevel: e.target.value})}
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="expert">Expert</option>
                      </select>
                    </div>
                    <textarea
                      placeholder="Bio - Tell your potential clients about your style and expertise"
                      required
                      className="border p-2 rounded w-full h-24"
                      onChange={(e) => setDesignerForm({...designerForm, bio: e.target.value})}
                    ></textarea>

                    <div className="flex gap-2">
                      <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700">
                        Submit Application for Approval
                      </button>
                      <button type="button" onClick={() => setShowDesignerForm(false)} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300">
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>
        )}

        {/* Quick Action: Reviews Link */}
        <div className="mb-6 bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Star className="w-6 h-6 text-yellow-500" />
              <div>
                <h3 className="font-semibold text-lg">Have a completed order?</h3>
                <p className="text-sm text-gray-600">Share your experience and review your designer</p>
              </div>
            </div>
            <Link
              href="/reviews"
              className="bg-white text-purple-600 font-semibold px-6 py-2 rounded-lg hover:bg-gray-50 transition shadow"
            >
              Write Review
            </Link>
          </div>
        </div>

        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-semibold">Browse Our Catalogue</h2>
              <p className="text-lg text-gray-600 mt-2">
                Explore our collection of custom designs and place your order for tailored clothing.
              </p>
            </div>
            <Link
              href="/catalogue"
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl font-semibold"
            >
              <Package className="w-5 h-5" />
              View Full Catalogue
            </Link>
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
        </section>

        {/* Client-Specific Orders */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>
          {orders.length === 0 ? (
            <p>No orders found. Place an order to get started!</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {orders.map((order) => (
                <div key={order._id} className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-lg font-semibold">Order #{order._id}</h3>
                  <p><strong>Item:</strong> {order.catalogueId.title}</p>
                  <p><strong>Status:</strong> {order.status}</p>
                  <p><strong>Total:</strong> ${order.total}</p>
                  <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                  <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    View Order Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}