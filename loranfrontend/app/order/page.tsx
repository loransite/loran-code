'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { orderAPI, paymentAPI } from '@/lib/api';
import { Order } from '@/app/types';

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clientInfo, setClientInfo] = useState<any>(null);

  const fetchOrders = () => {
    setLoading(true);
    orderAPI
      .getClientOrders()
      .then((res) => setOrders(res.data || []))
      .catch((err) => {
        console.error('Failed to load orders:', err);
        setError('Failed to load orders');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return router.push('/login');
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (userStr) {
      try {
        setClientInfo(JSON.parse(userStr));
      } catch (err) {
        console.error('Failed to parse user info', err);
      }
    }
    fetchOrders();
  }, [router]);

  const completePayment = async (order: Order) => {
    try {
      const storedUser = localStorage.getItem('user');
      const email = storedUser ? JSON.parse(storedUser).email : null;
      if (!email) return router.push('/login');
      const initResp = await paymentAPI.initialize({ email, amount: order.total, orderId: order._id });
      const authorization_url = initResp.data?.authorization_url;
      if (!authorization_url) throw new Error('No authorization_url returned');
      window.location.href = authorization_url;
    } catch (err: any) {
      console.error('Complete payment error', err);
      alert(err?.message || 'Failed to initialize payment');
    }
  };

  const removeFromCart = async (orderId: string) => {
    if (!confirm('Remove this item from your cart?')) return;
    try {
      await orderAPI.delete(orderId);
      fetchOrders();
    } catch (err) {
      console.error('Failed to remove order', err);
      alert('Failed to remove order');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4 flex items-center justify-center">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
        <h2 className="text-xl font-bold text-red-700 mb-2">Error</h2>
        <p className="text-red-600 mb-4">{error}</p>
      </div>
    </div>
  );

  const successfulOrders = orders.filter(o => o.paymentStatus === 'paid' || o.status === 'confirmed');
  const cartItems = orders.filter(o => o.paymentStatus === 'pending' && o.status === 'pending');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4 mt-20">
      <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center gap-4 mb-12">
          {clientInfo?.avatar && (
            <img
              src={clientInfo.avatar.startsWith('http') ? clientInfo.avatar : `${process.env.NEXT_PUBLIC_BACKEND_URL}${clientInfo.avatar}`}
              alt={clientInfo.fullName}
              className="w-16 h-16 rounded-full object-cover border-2 border-pink-600"
            />
          )}
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-2">My Orders</h1>
            {clientInfo?.fullName && (
              <p className="text-lg text-gray-600">Welcome, <span className="font-semibold text-pink-600">{clientInfo.fullName}</span></p>
            )}
            <p className="text-gray-600">View your purchases and cart items</p>
          </div>
        </div>

        {/* Successful Orders */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
            <span className="text-green-600">✓</span> Successful Orders ({successfulOrders.length})
          </h2>
          {successfulOrders.length > 0 ? (
            <div className="grid gap-6">
              {successfulOrders.map((order) => (
                <motion.div key={order._id} whileHover={{ scale: 1.02 }} className="bg-white rounded-lg shadow-lg overflow-hidden border-l-4 border-green-500">
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Order ID</p>
                      <p className="font-mono text-sm text-gray-700 mb-4">{order._id}</p>
                      <p className="text-sm text-gray-500 mb-2">Status</p>
                      <div className="flex gap-2 mb-4">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">{order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}</span>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">Total Amount</p>
                      <p className="text-2xl font-bold text-pink-600 mb-4">₦{order.total.toLocaleString()}</p>
                      {order.paymentReference && (<><p className="text-sm text-gray-500 mb-2">Payment Ref</p><p className="text-xs text-gray-600 font-mono">{order.paymentReference}</p></>)}
                    </div>
                    <div className="border-t md:border-t-0 md:border-l pt-6 md:pt-0 md:pl-6">
                      {order.measurements ? (
                        <div className="mb-6">
                          <p className="text-sm text-gray-500 mb-2 font-semibold">Measurements</p>
                          <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                            {order.measurements.height && <p>Height: {order.measurements.height} cm</p>}
                            {order.measurements.chest && <p>Chest: {order.measurements.chest} cm</p>}
                            {order.measurements.waist && <p>Waist: {order.measurements.waist} cm</p>}
                            {order.measurements.hips && <p>Hips: {order.measurements.hips} cm</p>}
                          </div>
                        </div>
                      ) : null}
                      {order.shipping ? (
                        <div>
                          <p className="text-sm text-gray-500 mb-2 font-semibold">Shipping</p>
                          <div className="text-sm text-gray-700">{order.shipping.name}, {order.shipping.city}</div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="bg-gray-50 px-6 py-3 text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center text-gray-600">No successful orders yet</div>
          )}
        </motion.div>

        {/* Cart Items */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
            <span>🛒</span> Cart Items ({cartItems.length})
          </h2>
          {cartItems.length > 0 ? (
            <div className="grid gap-6">
              {cartItems.map((order) => (
                <motion.div key={order._id} whileHover={{ scale: 1.02 }} className="bg-white rounded-lg shadow-lg overflow-hidden border-l-4 border-orange-500">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div><p className="text-sm text-gray-500 mb-2">Order ID</p><p className="font-mono text-sm text-gray-700">{order._id}</p></div>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">Pending</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div><p className="text-sm text-gray-500 mb-2">Amount</p><p className="text-2xl font-bold text-pink-600">₦{order.total.toLocaleString()}</p></div>
                      <div className="flex items-end gap-2">
                        <button onClick={() => completePayment(order)} className="w-full px-4 py-2 bg-gradient-to-r from-pink-500 to-indigo-600 text-white rounded font-semibold hover:shadow-lg">Complete Payment</button>
                        <button onClick={() => removeFromCart(order._id)} className="w-full px-4 py-2 border border-red-300 text-red-600 rounded font-semibold hover:bg-red-50">Remove</button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center"><p className="text-gray-600 mb-4">Cart is empty</p><button onClick={() => router.push('/catalogue')} className="px-6 py-2 bg-gradient-to-r from-pink-500 to-indigo-600 text-white rounded font-semibold">Shop Now</button></div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
