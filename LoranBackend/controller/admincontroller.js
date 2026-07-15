import User from '../model/user.js';
import Order from '../model/order.js';
import Catalogue from '../model/catalogue.js';
import Activity from '../model/activity.js';
import bcrypt from 'bcryptjs';
import { sendDesignerApprovalEmail } from '../services/emailService.js';


export const getAllUsers = async (req, res) => {
try {
const users = await User.find().select('-password');
res.json({ users });
} catch (err) {
res.status(500).json({ message: err.message });
}
};


export const getAllOrders = async (req, res) => {
try {
const orders = await Order.find().populate('client', 'name email').populate('designer', 'name email').populate('design');
res.json({ orders });
} catch (err) {
res.status(500).json({ message: err.message });
}
};

export const getAllCatalogue = async (req, res) => {
  try {
    const items = await Catalogue.find().populate('uploadedBy', 'fullName email');
    res.json({ items });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const approveDesigner = async (req, res) => {
  try {
    const { userId, action } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (action === 'approve') {
      user.designerStatus = 'approved';
      if (!user.roles.includes('designer')) {
        user.roles.push('designer');
      }
      if (user.role === 'client') {
        user.role = 'designer';
      }
      await user.save();

      // Notify approved designer via email (best-effort)
      try {
        const emailResult = await sendDesignerApprovalEmail(user.email, user.fullName || 'Designer');
        if (emailResult.success) {
          user.designerApprovalNotifiedAt = new Date();
          await user.save();
        }
      } catch (emailErr) {
        console.error('[ADMIN] Failed to send designer approval email:', emailErr.message);
      }

      return res.json({ message: "Designer approved successfully", user });
    } else {
      user.designerStatus = 'rejected';
      await user.save();
      return res.json({ message: "Designer application rejected", user });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const notifyApprovedDesigners = async (req, res) => {
  try {
    const approvedDesigners = await User.find({
      designerStatus: 'approved',
      $or: [
        { designerApprovalNotifiedAt: { $exists: false } },
        { designerApprovalNotifiedAt: null },
      ],
    }).select('_id fullName email');

    if (approvedDesigners.length === 0) {
      return res.json({ message: 'No approved designers pending email notification', sent: 0, failed: 0 });
    }

    let sent = 0;
    let failed = 0;

    for (const designer of approvedDesigners) {
      try {
        const result = await sendDesignerApprovalEmail(designer.email, designer.fullName || 'Designer');
        if (result.success) {
          designer.designerApprovalNotifiedAt = new Date();
          await designer.save();
          sent += 1;
        } else {
          failed += 1;
        }
      } catch (err) {
        console.error('[ADMIN] notifyApprovedDesigners error:', err.message);
        failed += 1;
      }
    }

    return res.json({
      message: `Designer approval notifications processed. Sent: ${sent}, Failed: ${failed}`,
      sent,
      failed,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const approveCatalogueItem = async (req, res) => {
  try {
    const { itemId, action } = req.body;
    const item = await Catalogue.findById(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });
    item.status = action === 'approve' ? 'approved' : 'rejected';
    await item.save();
    res.json({ message: `Item ${item.status} successfully`, item });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Analytics ────────────────────────────────────────────────────────────────
export const getAnalytics = async (req, res) => {
  try {
    const now = new Date();
    const startOf30Days = new Date(now);
    startOf30Days.setDate(startOf30Days.getDate() - 29);
    startOf30Days.setHours(0, 0, 0, 0);

    // ── Parallel fetches ──────────────────────────────────────────────────────
    const [allOrders, allUsers, allCatalogue] = await Promise.all([
      Order.find().populate('userId', 'fullName email').populate('designerId', 'fullName brandName'),
      User.find().select('-password'),
      Catalogue.find().populate('uploadedBy', 'fullName brandName'),
    ]);

    // ── Revenue ───────────────────────────────────────────────────────────────
    const paidOrders = allOrders.filter(o => o.paymentStatus === 'paid');
    const totalRevenue = paidOrders.reduce((s, o) => s + (o.total || 0), 0);
    const revenueThisMonth = paidOrders
      .filter(o => new Date(o.createdAt) >= startOf30Days)
      .reduce((s, o) => s + (o.total || 0), 0);

    // ── Order status breakdown ────────────────────────────────────────────────
    const orderStatusMap = {};
    allOrders.forEach(o => {
      orderStatusMap[o.status] = (orderStatusMap[o.status] || 0) + 1;
    });

    // ── Daily order volume (last 30 days) ────────────────────────────────────
    const dailyOrdersMap = {};
    for (let i = 0; i < 30; i++) {
      const d = new Date(startOf30Days);
      d.setDate(d.getDate() + i);
      dailyOrdersMap[d.toISOString().slice(0, 10)] = { orders: 0, revenue: 0 };
    }
    allOrders.forEach(o => {
      const day = new Date(o.createdAt).toISOString().slice(0, 10);
      if (dailyOrdersMap[day]) {
        dailyOrdersMap[day].orders += 1;
        if (o.paymentStatus === 'paid') dailyOrdersMap[day].revenue += (o.total || 0);
      }
    });
    const dailyTrend = Object.entries(dailyOrdersMap).map(([date, v]) => ({ date, ...v }));

    // ── User growth (last 30 days) ────────────────────────────────────────────
    const dailyUsersMap = {};
    for (let i = 0; i < 30; i++) {
      const d = new Date(startOf30Days);
      d.setDate(d.getDate() + i);
      dailyUsersMap[d.toISOString().slice(0, 10)] = 0;
    }
    allUsers.forEach(u => {
      const day = new Date(u.createdAt).toISOString().slice(0, 10);
      if (dailyUsersMap[day] !== undefined) dailyUsersMap[day] += 1;
    });
    const userGrowth = Object.entries(dailyUsersMap).map(([date, count]) => ({ date, count }));

    // ── User roles breakdown ──────────────────────────────────────────────────
    const clients = allUsers.filter(u => u.roles?.includes('client')).length;
    const designers = allUsers.filter(u => u.roles?.includes('designer')).length;
    const admins = allUsers.filter(u => u.roles?.includes('admin')).length;
    const pendingDesigners = allUsers.filter(u => u.designerStatus === 'pending').length;
    const approvedDesigners = allUsers.filter(u => u.designerStatus === 'approved').length;

    // ── Top designers by order count ─────────────────────────────────────────
    const designerOrderMap = {};
    allOrders.forEach(o => {
      if (!o.designerId) return;
      const id = o.designerId._id?.toString() || o.designerId.toString();
      if (!designerOrderMap[id]) {
        designerOrderMap[id] = {
          id,
          name: o.designerId.fullName || o.designerId.brandName || 'Unknown',
          orders: 0,
          revenue: 0,
        };
      }
      designerOrderMap[id].orders += 1;
      if (o.paymentStatus === 'paid') designerOrderMap[id].revenue += (o.total || 0);
    });
    const topDesigners = Object.values(designerOrderMap)
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 5);

    // ── Catalogue stats ───────────────────────────────────────────────────────
    const catalogueByStatus = {
      approved: allCatalogue.filter(c => c.status === 'approved').length,
      pending:  allCatalogue.filter(c => c.status === 'pending').length,
      rejected: allCatalogue.filter(c => c.status === 'rejected').length,
    };

    // ── Recent orders (last 10) ───────────────────────────────────────────────
    const recentOrders = [...allOrders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)
      .map(o => ({
        id: o._id,
        client: o.userId?.fullName || 'N/A',
        total: o.total,
        status: o.status,
        paymentStatus: o.paymentStatus,
        createdAt: o.createdAt,
      }));

    // ── Payment status breakdown ──────────────────────────────────────────────
    const paymentBreakdown = {
      paid:    allOrders.filter(o => o.paymentStatus === 'paid').length,
      pending: allOrders.filter(o => o.paymentStatus === 'pending').length,
      failed:  allOrders.filter(o => o.paymentStatus === 'failed').length,
    };

    // ── New signups this month ────────────────────────────────────────────────
    const newUsersThisMonth = allUsers.filter(u => new Date(u.createdAt) >= startOf30Days).length;
    const newOrdersThisMonth = allOrders.filter(o => new Date(o.createdAt) >= startOf30Days).length;

    res.json({
      summary: {
        totalRevenue,
        revenueThisMonth,
        totalOrders: allOrders.length,
        newOrdersThisMonth,
        totalUsers: allUsers.length,
        newUsersThisMonth,
        totalCatalogue: allCatalogue.length,
        pendingCatalogue: catalogueByStatus.pending,
      },
      orderStatusBreakdown: orderStatusMap,
      paymentBreakdown,
      dailyTrend,
      userGrowth,
      userRoles: { clients, designers, admins },
      designerStatus: { pending: pendingDesigners, approved: approvedDesigners },
      topDesigners,
      catalogueByStatus,
      recentOrders,
    });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ message: err.message });
  }
};

export const getAllActivities = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 200);
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.method) filter.method = req.query.method.toUpperCase();
    if (req.query.statusCode) filter.statusCode = Number(req.query.statusCode);
    if (req.query.role) filter.role = req.query.role;
    if (req.query.action) filter.action = req.query.action;
    if (req.query.path) filter.path = { $regex: req.query.path, $options: 'i' };

    if (req.query.startDate || req.query.endDate) {
      filter.createdAt = {};
      if (req.query.startDate) filter.createdAt.$gte = new Date(req.query.startDate);
      if (req.query.endDate) filter.createdAt.$lte = new Date(req.query.endDate);
    }

    if (req.query.search) {
      const q = req.query.search;
      filter.$or = [
        { userEmail: { $regex: q, $options: 'i' } },
        { path: { $regex: q, $options: 'i' } },
        { action: { $regex: q, $options: 'i' } },
      ];
    }

    const [activities, total] = await Promise.all([
      Activity.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'fullName email role roles'),
      Activity.countDocuments(filter),
    ]);

    res.json({
      activities,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createAdminUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({ message: 'Full name and email are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      const existingRoles = existingUser.roles && existingUser.roles.length > 0
        ? existingUser.roles
        : (existingUser.role ? [existingUser.role] : []);

      if (existingRoles.includes('admin')) {
        return res.status(400).json({ message: 'User is already an admin' });
      }

      existingUser.roles = [...new Set([...existingRoles, 'admin'])];
      existingUser.role = 'admin';
      await existingUser.save();

      return res.status(200).json({
        message: 'Existing user upgraded to admin successfully',
        user: {
          id: existingUser._id,
          fullName: existingUser.fullName,
          email: existingUser.email,
          role: existingUser.role,
          roles: existingUser.roles,
        },
      });
    }

    const generatedPassword = password || Math.random().toString(36).slice(-12) + 'A!9';
    const hashedPassword = await bcrypt.hash(generatedPassword, 12);

    const adminUser = await User.create({
      fullName,
      email: normalizedEmail,
      password: hashedPassword,
      role: 'admin',
      roles: ['admin'],
      designerStatus: 'none',
      isEmailVerified: true,
    });

    res.status(201).json({
      message: 'Admin user created successfully',
      user: {
        id: adminUser._id,
        fullName: adminUser.fullName,
        email: adminUser.email,
        role: adminUser.role,
        roles: adminUser.roles,
      },
      generatedPassword: password ? undefined : generatedPassword,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
