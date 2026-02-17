"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Ruler, Plus, Calendar, Activity, Sparkles, User } from "lucide-react";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";

interface Measurement {
  height?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  shoulder?: number;
  sleeveLength?: number;
  inseam?: number;
}

interface MeasurementHistory {
  _id: string;
  date: string;
  method: "ai" | "manual";
  measurements: Measurement;
  aiData?: {
    frontPhotoUrl?: string;
    sidePhotoUrl?: string;
    confidence?: number;
  };
}

export default function ClientMeasurementsPage() {
  const router = useRouter();
  const { user, token, activeRole } = useAuth();
  const [measurementHistory, setMeasurementHistory] = useState<MeasurementHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMeasurement, setNewMeasurement] = useState<Measurement>({
    height: undefined,
    chest: undefined,
    waist: undefined,
    hips: undefined,
    shoulder: undefined,
    sleeveLength: undefined,
    inseam: undefined,
  });

  useEffect(() => {
    // Check auth
    const token = sessionStorage.getItem("token");
    if (!token || activeRole !== "client") {
      router.push("/login");
      return;
    }

    fetchMeasurements();
  }, [router, activeRole]);

  const fetchMeasurements = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/api/measurements/history");
      setMeasurementHistory(response.data.measurementHistory || []);
    } catch (error) {
      console.error("Failed to fetch measurements:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMeasurement = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate at least one field is filled
    const hasData = Object.values(newMeasurement).some((val) => val && val > 0);
    if (!hasData) {
      alert("Please enter at least one measurement");
      return;
    }

    try {
      await apiClient.post("/api/measurements", {
        measurements: newMeasurement,
        method: "manual",
      });

      alert("Measurements saved successfully!");
      setShowAddForm(false);
      setNewMeasurement({
        height: undefined,
        chest: undefined,
        waist: undefined,
        hips: undefined,
        shoulder: undefined,
        sleeveLength: undefined,
        inseam: undefined,
      });
      fetchMeasurements(); // Refresh the list
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to save measurements");
    }
  };

  const latestMeasurement = measurementHistory[measurementHistory.length - 1];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Ruler className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading measurements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Ruler className="w-8 h-8 text-blue-600" />
                My Measurements
              </h1>
              <p className="text-gray-600 mt-1">Manage your body measurements for perfect fitting</p>
            </div>
            <button
              onClick={() => router.push("/dashboard/client")}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Latest Measurements Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Current Measurements</h2>
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add New
              </button>
            </div>

            {latestMeasurement ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <Calendar className="w-4 h-4" />
                  Last updated: {new Date(latestMeasurement.date).toLocaleDateString()}
                  <span className="ml-4 flex items-center gap-1">
                    {latestMeasurement.method === "ai" ? (
                      <>
                        <Sparkles className="w-4 h-4 text-purple-500" />
                        <span>AI Generated</span>
                      </>
                    ) : (
                      <>
                        <User className="w-4 h-4 text-blue-500" />
                        <span>Manual Entry</span>
                      </>
                    )}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(latestMeasurement.measurements).map(([key, value]) => (
                    value && (
                      <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-700 capitalize">
                          {key.replace(/([A-Z])/g, " $1")}
                        </span>
                        <span className="text-2xl font-bold text-blue-600">{value}"</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Ruler className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Measurements Yet</h3>
                <p className="text-gray-600 mb-6">Add your first measurement to get started</p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Measurements
                </button>
              </div>
            )}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push("/ai")}
                  className="w-full flex items-center gap-3 p-4 border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition-colors group"
                >
                  <Sparkles className="w-6 h-6 text-purple-600 group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">AI Try-On</p>
                    <p className="text-xs text-gray-600">Get measured using photos</p>
                  </div>
                </button>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="w-full flex items-center gap-3 p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition-colors group"
                >
                  <Plus className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">Manual Entry</p>
                    <p className="text-xs text-gray-600">Enter measurements yourself</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
              <Activity className="w-8 h-8 mb-3" />
              <h3 className="text-lg font-bold mb-2">Total Records</h3>
              <p className="text-4xl font-bold">{measurementHistory.length}</p>
              <p className="text-sm text-blue-100 mt-2">Measurement history entries</p>
            </div>
          </motion.div>
        </div>

        {/* Measurement History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-white rounded-2xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Measurement History</h2>
          {measurementHistory.length > 0 ? (
            <div className="space-y-4">
              {[...measurementHistory].reverse().map((entry, index) => (
                <motion.div
                  key={entry._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-500" />
                      <span className="font-semibold text-gray-900">
                        {new Date(entry.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <span
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                        entry.method === "ai"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {entry.method === "ai" ? (
                        <>
                          <Sparkles className="w-4 h-4" />
                          AI Generated
                        </>
                      ) : (
                        <>
                          <User className="w-4 h-4" />
                          Manual
                        </>
                      )}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(entry.measurements).map(([key, value]) => (
                      value && (
                        <div key={key} className="text-center p-3 bg-gray-50 rounded">
                          <p className="text-xs text-gray-600 capitalize mb-1">
                            {key.replace(/([A-Z])/g, " $1")}
                          </p>
                          <p className="text-lg font-bold text-gray-900">{value}"</p>
                        </div>
                      )
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No measurement history available</p>
          )}
        </motion.div>
      </div>

      {/* Add Measurement Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Measurements</h2>
                <form onSubmit={handleSaveMeasurement} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    {Object.entries(newMeasurement).map(([key, value]) => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                          {key.replace(/([A-Z])/g, " $1")} (inches)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={value || ""}
                          onChange={(e) =>
                            setNewMeasurement({
                              ...newMeasurement,
                              [key]: e.target.value ? parseFloat(e.target.value) : undefined,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., 36.5"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-4 pt-6">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Save Measurements
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
