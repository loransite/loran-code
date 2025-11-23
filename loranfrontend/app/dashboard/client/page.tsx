"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

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

interface CatalogueItem {
  _id: string;
  title: string;
  description: string;
  price: number;
}

export default function ClientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [catalogue, setCatalogue] = useState<CatalogueItem[]>([]);
  const [selectedCatalogueId, setSelectedCatalogueId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(userData) as User;
    setUser(parsedUser);

    const fetchData = async () => {
      try {
        const [catalogueRes, ordersRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/catalogue`),
          axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/client${selectedCatalogueId ? `?catalogueId=${selectedCatalogueId}` : ""}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setCatalogue(Array.isArray(catalogueRes.data) ? catalogueRes.data : []);
        setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Failed to fetch data");
        } else {
          setError("Unexpected error occurred");
        }
        // Ensure state is set to empty arrays even on error
        setCatalogue([]);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, selectedCatalogueId]); // Re-fetch orders when selectedCatalogueId changes

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  const handleCatalogueSelect = (catalogueId: string) => {
    setSelectedCatalogueId(catalogueId === selectedCatalogueId ? null : catalogueId); // Toggle selection
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Loran Tailoring</h1>
          <div className="flex items-center space-x-4">
            <p>Welcome, {user.fullName} ({user.role})</p>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                router.push("/login");
              }}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
            >
              Log Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Site Content (Catalogue) */}
      <main className="container mx-auto px-4 py-8">
        <section className="mb-8">
          <h2 className="text-3xl font-semibold mb-4">Our Catalogue</h2>
          <p className="text-lg mb-4">
            Explore our collection of custom designs and place your order for tailored clothing.
          </p>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {catalogue.map((item) => (
              <div key={item._id} className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p>{item.description}</p>
                <p>Price: ${item.price}</p>
                <button
                  onClick={() => handleCatalogueSelect(item._id)}
                  className={`mt-2 px-4 py-2 rounded ${selectedCatalogueId === item._id ? "bg-green-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                >
                  {selectedCatalogueId === item._id ? "Selected" : "View Orders for This Item"}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Client-Specific Orders */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Your Orders {selectedCatalogueId ? `for ${catalogue.find(item => item._id === selectedCatalogueId)?.title}` : ""}
          </h2>
          {orders.length === 0 ? (
            <p>No orders found. {selectedCatalogueId ? "Select another item or place an order!" : "Place an order to get started!"}</p>
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