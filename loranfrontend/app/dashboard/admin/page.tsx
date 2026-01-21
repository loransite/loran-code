'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { orderAPI } from '@/lib/api';
import { Order } from '@/app/types';
import { 
  ShoppingBag, 
  Users, 
  Palette, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle,
  DollarSign,
  Activity,
  Eye,
  Edit,
  Mail,
  Phone,
  ShieldCheck,
  Image
} from 'lucide-react';

type User = {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  roles?: string[];
  phone?: string;
  city?: string;
  brandName?: string;
  designerStatus?: string;
  createdAt: string;
};

type CatalogueItem = {
  _id: string;
  title: string;
  description: string;
  price: number;
  status: 'pending' | 'approved' | 'rejected';
  image: string;
  uploadedBy: {
    fullName: string;
    email: string;
  };
};

type Stats = {
  totalOrders: number;
  totalUsers: number;
  totalDesigners: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [catalogueItems, setCatalogueItems] = useState<CatalogueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'users' | 'designers' | 'pending' | 'catalogue'>('overview');
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalUsers: 0,
    totalDesigners: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0
  });

  useEffect(() => {
    // Check admin access
    const token = localStorage.getItem('token');
    const activeRole = localStorage.getItem('activeRole');
    
    if (!token) {
      router.push('/login');
      return;
    }

    if (activeRole !== 'admin') {
      alert('Access denied. Admin only.');
      router.push('/');
      return;
    }

    fetchData();
  }, [router]);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    
    try {
      // Fetch orders
      const ordersRes = await orderAPI.getAdminOrders();
      const ordersData = ordersRes.data || [];
      setOrders(ordersData);

      // Fetch users
      const usersRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const usersData = await usersRes.json();
      setUsers(usersData.users || []);

      // Fetch catalogue items
      const catalogueRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/catalogue`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const catalogueData = await catalogueRes.json();
      setCatalogueItems(catalogueData.items || []);

      // Calculate stats
      const totalRevenue = ordersData.reduce((sum: number, o: Order) => sum + (o.total || 0), 0);
      const pendingOrders = ordersData.filter((o: Order) => o.status === 'pending' || o.status === 'awaiting-contact').length;
      const completedOrders = ordersData.filter((o: Order) => o.status === 'completed').length;
      const totalDesigners = (usersData.users || []).filter((u: User) => u.roles?.includes('designer') || u.role === 'designer').length;

      setStats({
        totalOrders: ordersData.length,
        totalUsers: (usersData.users || []).length,
        totalDesigners,
        totalRevenue,
        pendingOrders,
        completedOrders
      });
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await orderAPI.updateStatus(id, status);
      fetchData();
    } catch (err) { 
      console.error('Update status failed', err); 
      alert('Failed to update status'); 
    }
  };

  const handleApproveDesigner = async (userId: string, action: 'approve' | 'reject') => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/approve-designer`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ userId, action })
      });
      if (res.ok) {
        alert(`Designer ${action}d successfully`);
        fetchData();
      }
    } catch (err) {
      console.error('Designer action failed', err);
    }
  };

  const handleApproveItem = async (itemId: string, action: 'approve' | 'reject') => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/approve-item`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ itemId, action })
      });
      if (res.ok) {
        alert(`Item ${action}d successfully`);
        fetchData();
      }
    } catch (err) {
      console.error('Item action failed', err);
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, gradient }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-xl ${gradient}`}
    >
      <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
      <div className="relative">
        <Icon className="w-10 h-10 mb-3 opacity-90" />
        <h3 className="text-3xl font-bold mb-1">{value}</h3>
        <p className="text-sm font-medium opacity-90">{title}</p>
        {subtitle && <p className="text-xs opacity-70 mt-1">{subtitle}</p>}
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-white border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-gray-300">Manage your platform with powerful insights</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={ShoppingBag}
            title="Total Orders"
            value={stats.totalOrders}
            subtitle={`${stats.pendingOrders} pending`}
            gradient="bg-gradient-to-br from-blue-500 to-cyan-600"
          />
          <StatCard
            icon={Users}
            title="Total Users"
            value={stats.totalUsers}
            subtitle="Registered members"
            gradient="bg-gradient-to-br from-purple-500 to-pink-600"
          />
          <StatCard
            icon={Palette}
            title="Designers"
            value={stats.totalDesigners}
            subtitle="Active creators"
            gradient="bg-gradient-to-br from-orange-500 to-red-600"
          />
          <StatCard
            icon={DollarSign}
            title="Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            subtitle={`${stats.completedOrders} completed`}
            gradient="bg-gradient-to-br from-green-500 to-emerald-600"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white/10 backdrop-blur-lg rounded-xl p-2 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'orders', label: 'Orders', icon: ShoppingBag },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'designers', label: 'Designers', icon: Palette },
            { id: 'pending', label: 'Applications', icon: ShieldCheck },
            { id: 'catalogue', label: 'Catalogue', icon: Image }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all min-w-[120px] ${
                activeTab === id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
              {id === 'pending' && users.filter(u => u.designerStatus === 'pending').length > 0 && (
                <span className="ml-1 bg-white text-blue-600 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {users.filter(u => u.designerStatus === 'pending').length}
                </span>
              )}
              {id === 'catalogue' && catalogueItems.filter(i => i.status === 'pending').length > 0 && (
                <span className="ml-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {catalogueItems.filter(i => i.status === 'pending').length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Clock className="w-6 h-6" />
                  Recent Orders
                </h3>
                <div className="space-y-3">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order._id} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-white font-medium">Order #{order._id.slice(-6)}</p>
                          <p className="text-sm text-gray-400">${order.total}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          order.status === 'completed' ? 'bg-green-500' :
                          order.status === 'pending' ? 'bg-yellow-500' : 'bg-blue-500'
                        } text-white`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6" />
                  Quick Insights
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Pending Orders</span>
                    <span className="text-2xl font-bold text-yellow-400">{stats.pendingOrders}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Completed</span>
                    <span className="text-2xl font-bold text-green-400">{stats.completedOrders}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Active Designers</span>
                    <span className="text-2xl font-bold text-purple-400">{stats.totalDesigners}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-white mb-6">All Orders</h3>
              <div className="space-y-3">
                {orders.map((order) => (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white/5 rounded-xl p-5 hover:bg-white/10 transition-all"
                  >
                    <div className="flex flex-wrap justify-between items-start gap-4">
                      <div>
                        <p className="text-white font-semibold text-lg">Order #{order._id.slice(-8)}</p>
                        <p className="text-gray-400 text-sm">Amount: ${order.total?.toLocaleString()}</p>
                        <div className="flex gap-4 mt-2 text-xs text-gray-300">
                          <span>Status: <strong>{order.status}</strong></span>
                          <span>Payment: <strong>{order.paymentStatus}</strong></span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateStatus(order._id, 'confirmed')}
                          className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Confirm
                        </button>
                        <button
                          onClick={() => updateStatus(order._id, 'cancelled')}
                          className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-white mb-6">All Users</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {users.filter(u => u.role === 'client').map((user) => (
                  <motion.div
                    key={user._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/5 rounded-xl p-5 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                        {user.fullName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-semibold">{user.fullName}</p>
                        <span className="text-xs px-2 py-1 bg-blue-500 text-white rounded">Client</span>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Mail className="w-4 h-4" />
                        {user.email}
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <Phone className="w-4 h-4" />
                          {user.phone}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'designers' && (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-white mb-6">All Designers</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {users.filter(u => u.roles?.includes('designer') || u.role === 'designer').map((designer) => (
                  <motion.div
                    key={designer._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-5 hover:from-purple-500/30 hover:to-pink-500/30 transition-all border border-white/5"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold">
                        {designer.fullName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-semibold">{designer.fullName}</p>
                        <div className="flex gap-1 mt-1">
                          <span className="text-[10px] px-1.5 py-0.5 bg-orange-500 text-white rounded font-bold uppercase tracking-wider">Designer</span>
                          {designer.designerStatus === 'approved' && <span className="text-[10px] px-1.5 py-0.5 bg-green-500 text-white rounded font-bold uppercase tracking-wider">Verified</span>}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Mail className="w-4 h-4" />
                        {designer.email}
                      </div>
                      <div className="flex items-center gap-2 text-gray-300 mt-2 pt-2 border-t border-white/10">
                        <Palette className="w-4 h-4" />
                        Status: <span className="capitalize text-white font-medium">{designer.designerStatus || 'Member'}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'pending' && (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-yellow-400" />
                Pending Applications
              </h3>
              <div className="grid gap-4">
                {users.filter(u => u.designerStatus === 'pending').length === 0 ? (
                  <div className="text-center py-12 text-gray-400">No pending applications at the moment.</div>
                ) : (
                  users.filter(u => u.designerStatus === 'pending').map((user) => (
                    <motion.div
                      key={user._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white/5 border border-yellow-500/30 rounded-xl p-6 flex flex-wrap justify-between items-center gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500 font-bold border border-yellow-500/50 text-xl">
                          {user.fullName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-white font-bold text-lg">{user.fullName}</h4>
                          <p className="text-gray-400 text-sm">{user.email}</p>
                          <div className="mt-2 flex gap-2">
                             <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30">Application Status: Pending</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleApproveDesigner(user._id, 'approve')}
                          className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-bold hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all flex items-center gap-2"
                        >
                          <CheckCircle className="w-5 h-5" />
                          Approve Designer
                        </button>
                        <button
                          onClick={() => handleApproveDesigner(user._id, 'reject')}
                          className="px-6 py-2.5 bg-white/5 hover:bg-red-500/20 text-red-400 rounded-lg font-bold border border-red-500/30 transition-all flex items-center gap-2"
                        >
                          <XCircle className="w-5 h-5" />
                          Reject
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'catalogue' && (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white text-center">
              <h3 className="text-2xl font-bold text-white mb-6">Catalogue Moderation</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {catalogueItems.map((item) => (
                  <motion.div
                    key={item._id}
                    className="bg-white/5 rounded-xl overflow-hidden border border-white/10 text-left"
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-white font-bold">{item.title}</h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          item.status === 'approved' ? 'bg-green-500/80' : 
                          item.status === 'pending' ? 'bg-yellow-500/80' : 'bg-red-500/80'
                        } text-white`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-blue-400 font-bold mb-4">${item.price}</p>
                      <div className="text-xs text-gray-400 mb-4 pb-4 border-b border-white/5">
                        Uploaded by: <span className="text-gray-200">{item.uploadedBy?.fullName || 'Unknown'}</span>
                      </div>
                      
                      {item.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApproveItem(item._id, 'approve')}
                            className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white rounded text-xs font-bold transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleApproveItem(item._id, 'reject')}
                            className="flex-1 py-2 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white border border-red-500 rounded text-xs font-bold transition-all"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
