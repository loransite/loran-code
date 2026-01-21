// pages/designer/dashboard.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { orderAPI } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { Share2, Clock, CheckCircle, Package, DollarSign, Activity, Ruler, User, Mail, FileText, X } from 'lucide-react';
import { UploadForm } from '@/components/Designer/uploadform';
import ProfileHeader from '@/components/Dashboard/ProfileHeader';
import { motion, AnimatePresence } from 'framer-motion';

const DesignerDashboard: React.FC = () => {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [uploading, setUploading] = useState(false);
  const [designs, setDesigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication and role
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      const activeRole = localStorage.getItem('activeRole');

      if (!storedToken) {
        router.push('/login');
        return;
      }

      if (activeRole !== 'designer') {
        router.push('/dashboard/client'); // Redirect if not in designer mode
        return;
      }

      setToken(storedToken);
    }
  }, [router]);

  const fetchMine = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/designs/mine`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDesigns(res.data || []);
    } catch (err) {
      console.error('Failed to load your designs', err);
      setDesigns([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const res = await orderAPI.getDesignerOrders();
      setOrders(res.data || []);
    } catch (err) {
      console.error('Failed to load designer orders', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMine();
      fetchOrders();
    }
  }, [token]);

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        alert('Order status updated!');
        fetchOrders();
      } else {
        const err = await response.json();
        alert(err.message || 'Failed to update order');
      }
    } catch (err) {
      console.error('Update status failed', err);
    }
  };

  const handleUpload = async () => {
    if (!file || !title || !price || !description || !category) {
      alert('Please fill all fields');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('category', category);

    try {
      setUploading(true);
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/designs`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
      });
      alert('Design uploaded and pending approval!');
      fetchMine();
      // Reset form
      setTitle(''); setPrice(''); setDescription(''); setCategory(''); setFile(null);
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const stats = {
    totalDesigns: designs.length,
    activeOrders: orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length,
    revenue: orders.filter(o => o.paymentStatus === 'paid').reduce((acc, o) => acc + (o.total || 0), 0)
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Profile Header */}
      <ProfileHeader role="designer" />

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-purple-100 text-purple-600 rounded-xl"><Package size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Your Designs</p>
            <h3 className="text-2xl font-bold">{stats.totalDesigns}</h3>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-xl"><Activity size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Active Orders</p>
            <h3 className="text-2xl font-bold">{stats.activeOrders}</h3>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-green-100 text-green-600 rounded-xl"><DollarSign size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Estimated Revenue</p>
            <h3 className="text-2xl font-bold">₦{stats.revenue.toLocaleString()}</h3>
          </div>
        </motion.div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Designs and Upload */}
        <div className="lg:w-2/3 space-y-8">
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Your Workshop</h1>
              <Link 
                href="/dashboard/designer/share"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-md transition-all text-sm font-bold"
              >
                <Share2 className="w-4 h-4" />
                Share Portfolio
              </Link>
            </div>

            {loading ? (
              <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            ) : designs.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <p className="text-gray-400">No designs uploaded yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {designs.map((d: any) => (
                  <div key={d._id || d.id} className="group bg-gray-50 rounded-xl overflow-hidden border border-gray-100 hover:border-purple-200 transition-all">
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${d.imageUrl || d.image}`}
                        alt={d.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          d.status === 'approved' ? 'bg-green-500 text-white' : 
                          d.status === 'pending' ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white'
                        }`}>
                          {d.status || 'pending'}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-800">{d.title}</h3>
                      <p className="text-purple-600 font-extrabold">₦{d.price?.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Piece</h2>
            {uploading && (
              <div className="mb-4 flex items-center gap-2 text-blue-600 animate-pulse">
                <Activity size={18} />
                <span className="font-bold text-sm">Uploading your creation...</span>
              </div>
            )}
            <UploadForm
              file={file}
              title={title}
              price={price}
              description={description}
              category={category}
              setFile={setFile}
              setTitle={setTitle}
              setPrice={setPrice}
              setDescription={setDescription}
              setCategory={setCategory}
              setUploading={setUploading}
              onUpload={handleUpload}
            />
          </section>
        </div>

        {/* Right Column: Active Invoices/Orders */}
        <div className="lg:w-1/3">
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              Active Orders
            </h2>
            
            {ordersLoading ? (
              <div className="space-y-4">
                {[1, 2].map(i => <div key={i} className="h-24 bg-gray-50 animate-pulse rounded-xl"></div>)}
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-xl">
                 <p className="text-gray-400 text-sm">No active orders found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((o: any) => (
                  <div key={o._id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-white hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] text-gray-400 font-mono">#{o._id.slice(-8).toUpperCase()}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        o.status === 'completed' ? 'bg-green-100 text-green-700' :
                        o.status === 'processing' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {o.status}
                      </span>
                    </div>
                    <div className="font-bold text-gray-800 mb-1">₦{o.total?.toLocaleString()}</div>
                    <div className="text-xs text-gray-600 mb-4">
                      Client: {o.userId?.fullName || 'Anonymous'}
                      <br />
                      Item: {o.catalogueId?.title || 'Unknown Item'}
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setSelectedOrder(o)}
                        className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg text-[10px] font-bold hover:bg-gray-300 transition-colors"
                      >
                        Details
                      </button>
                      {o.status !== 'processing' && o.status !== 'completed' && (
                        <button 
                          onClick={() => handleUpdateStatus(o._id, 'processing')}
                          className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-[10px] font-bold hover:bg-blue-700 transition-colors"
                        >
                          Process
                        </button>
                      )}
                      {o.status === 'processing' && (
                        <button 
                          onClick={() => handleUpdateStatus(o._id, 'completed')}
                          className="flex-1 py-2 bg-green-600 text-white rounded-lg text-[10px] font-bold hover:bg-green-700 transition-colors"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Order #{selectedOrder._id.slice(-8).toUpperCase()}</h3>
                  <p className="text-sm text-gray-500">Placed on {new Date(selectedOrder.createdAt || Date.now()).toLocaleDateString()}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Client Info */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-purple-600 uppercase tracking-wider flex items-center gap-2">
                      <User size={16} /> Client Information
                    </h4>
                    <div className="bg-purple-50 p-4 rounded-xl">
                      <p className="font-bold text-gray-800">{selectedOrder.userId?.fullName || 'Anonymous'}</p>
                      <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                        <Mail size={12} /> {selectedOrder.userId?.email || 'N/A'}
                      </p>
                    </div>

                    <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wider flex items-center gap-2 mt-6">
                      <Package size={16} /> Request
                    </h4>
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <p className="font-bold text-gray-800 text-sm">{selectedOrder.catalogueId?.title || 'Custom Piece'}</p>
                      <p className="text-xs text-gray-600 mt-1">{selectedOrder.customizationRequest || 'No specific requests provided.'}</p>
                    </div>
                  </div>

                  {/* Measurements */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-green-600 uppercase tracking-wider flex items-center gap-2">
                      <Ruler size={16} /> Measurements
                    </h4>
                    {selectedOrder.measurements ? (
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(selectedOrder.measurements).map(([key, value]) => (
                          key !== '_id' && key !== 'notes' && value && (
                            <div key={key} className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-center">
                              <p className="text-[10px] text-gray-400 uppercase font-bold">{key}</p>
                              <p className="text-lg font-extrabold text-gray-800">{value as string}</p>
                            </div>
                          )
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-400 text-sm">No measurements provided.</p>
                      </div>
                    )}
                    
                    {selectedOrder.measurements?.notes && (
                      <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 mt-4">
                        <p className="text-[10px] font-bold text-yellow-700 uppercase mb-1">Observation Notes</p>
                        <p className="text-xs text-gray-700 italic">"{selectedOrder.measurements.notes}"</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="px-6 py-2 border border-gray-300 rounded-xl text-sm font-bold text-gray-600 hover:bg-white"
                >
                  Close
                </button>
                {selectedOrder.status === 'pending' && (
                  <button 
                    onClick={() => {
                      handleUpdateStatus(selectedOrder._id, 'processing');
                      setSelectedOrder(null);
                    }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all"
                  >
                    Start Production
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DesignerDashboard;