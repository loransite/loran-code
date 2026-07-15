"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, DollarSign, ShoppingBag, Users, Package,
  BarChart2, CheckCircle, Clock, XCircle, AlertCircle,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface AnalyticsData {
  summary: {
    totalRevenue: number;
    revenueThisMonth: number;
    totalOrders: number;
    newOrdersThisMonth: number;
    totalUsers: number;
    newUsersThisMonth: number;
    totalCatalogue: number;
    pendingCatalogue: number;
  };
  orderStatusBreakdown: Record<string, number>;
  paymentBreakdown: { paid: number; pending: number; failed: number };
  dailyTrend: { date: string; orders: number; revenue: number }[];
  userGrowth: { date: string; count: number }[];
  userRoles: { clients: number; designers: number; admins: number };
  designerStatus: { pending: number; approved: number };
  topDesigners: { id: string; name: string; orders: number; revenue: number }[];
  catalogueByStatus: { approved: number; pending: number; rejected: number };
  recentOrders: {
    id: string;
    client: string;
    total: number;
    status: string;
    paymentStatus: string;
    createdAt: string;
  }[];
}

// ─── Mini sparkline (pure CSS bar chart) ──────────────────────────────────────
function MiniBar({ values, color = "var(--highlight)" }: { values: number[]; color?: string }) {
  const max = Math.max(...values, 1);
  return (
    <div className="flex items-end gap-[2px] h-10">
      {values.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm transition-all duration-300"
          style={{
            height: `${Math.round((v / max) * 100)}%`,
            minHeight: 2,
            background: color,
            opacity: 0.7 + (i / values.length) * 0.3,
          }}
        />
      ))}
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  trend,
  trendValues,
}: {
  icon: any;
  label: string;
  value: string | number;
  sub?: string;
  trend?: string;
  trendValues?: number[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, borderColor: "rgba(232,220,192,0.25)" }}
      className="rounded-2xl p-5 flex flex-col gap-3"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
      }}
    >
      <div className="flex items-start justify-between">
        <div
          className="p-2 rounded-lg"
          style={{ background: "var(--surface-2)", color: "var(--highlight)" }}
        >
          <Icon size={18} />
        </div>
        {trend && (
          <span
            className="text-xs px-2 py-0.5 rounded-full font-semibold"
            style={{
              background: "rgba(110,189,138,0.12)",
              color: "#6EBD8A",
              border: "1px solid rgba(110,189,138,0.2)",
            }}
          >
            {trend}
          </span>
        )}
      </div>
      <div>
        <p
          className="text-2xl md:text-3xl font-medium"
          style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--highlight)" }}
        >
          {value}
        </p>
        <p className="text-xs mt-0.5 uppercase tracking-widest" style={{ color: "var(--muted)" }}>
          {label}
        </p>
        {sub && (
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
            {sub}
          </p>
        )}
      </div>
      {trendValues && trendValues.length > 0 && (
        <MiniBar values={trendValues} />
      )}
    </motion.div>
  );
}

// ─── Donut chart (CSS conic-gradient) ─────────────────────────────────────────
function DonutChart({
  segments,
}: {
  segments: { label: string; value: number; color: string }[];
}) {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  let cumulative = 0;
  const gradient = segments
    .map((seg) => {
      const start = (cumulative / total) * 360;
      cumulative += seg.value;
      const end = (cumulative / total) * 360;
      return `${seg.color} ${start}deg ${end}deg`;
    })
    .join(", ");

  return (
    <div className="flex items-center gap-6">
      <div
        className="w-20 h-20 rounded-full flex-shrink-0"
        style={{
          background: `conic-gradient(${gradient})`,
          mask: "radial-gradient(circle at center, transparent 35%, black 36%)",
          WebkitMask: "radial-gradient(circle at center, transparent 35%, black 36%)",
        }}
      />
      <div className="flex flex-col gap-1.5">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: seg.color }} />
            <span className="text-xs" style={{ color: "var(--muted)" }}>
              {seg.label}
            </span>
            <span
              className="text-xs font-medium ml-auto pl-3"
              style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--text)" }}
            >
              {total > 0 ? Math.round((seg.value / total) * 100) : 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; icon: any }> = {
    completed:        { bg: "rgba(110,189,138,0.12)",  text: "#6EBD8A", icon: CheckCircle },
    paid:             { bg: "rgba(110,189,138,0.12)",  text: "#6EBD8A", icon: CheckCircle },
    pending:          { bg: "rgba(232,220,192,0.08)",  text: "var(--muted)", icon: Clock },
    "awaiting-payment": { bg: "rgba(232,220,192,0.08)", text: "var(--muted)", icon: Clock },
    "awaiting-contact": { bg: "rgba(232,220,192,0.08)", text: "var(--muted)", icon: Clock },
    processing:       { bg: "rgba(100,160,255,0.12)",  text: "#7FB3FF", icon: AlertCircle },
    cancelled:        { bg: "rgba(248,113,113,0.12)",  text: "#F87171", icon: XCircle },
    failed:           { bg: "rgba(248,113,113,0.12)",  text: "#F87171", icon: XCircle },
    rejected:         { bg: "rgba(248,113,113,0.12)",  text: "#F87171", icon: XCircle },
    confirmed:        { bg: "rgba(110,189,138,0.12)",  text: "#6EBD8A", icon: CheckCircle },
  };
  const s = map[status] || { bg: "rgba(232,220,192,0.08)", text: "var(--muted)", icon: AlertCircle };
  const Icon = s.icon;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium capitalize"
      style={{ background: s.bg, color: s.text, border: `1px solid ${s.text}22` }}
    >
      <Icon size={10} />
      {status.replace(/-/g, " ")}
    </span>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function AnalyticsTab() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) { setError("Not authenticated"); setLoading(false); return; }

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/analytics`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.message) throw new Error(d.message);
        setData(d);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div
          className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "var(--highlight)", borderTopColor: "transparent" }}
        />
        <span className="ml-3 text-sm" style={{ color: "var(--muted)" }}>
          Loading analytics…
        </span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div
        className="rounded-2xl p-8 text-center"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <p style={{ color: "#F87171" }}>Failed to load analytics: {error}</p>
      </div>
    );
  }

  const { summary, orderStatusBreakdown, paymentBreakdown, dailyTrend,
          userGrowth, userRoles, designerStatus, topDesigners,
          catalogueByStatus, recentOrders } = data;

  const last14Revenue = dailyTrend.slice(-14).map((d) => d.revenue);
  const last14Orders  = dailyTrend.slice(-14).map((d) => d.orders);
  const last14Users   = userGrowth.slice(-14).map((d) => d.count);

  return (
    <div className="space-y-8">

      {/* ── Section label ───────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: "var(--text)", fontSize: "clamp(20px,5vw,28px)", fontWeight: 500 }}>
            Platform Analytics
          </h2>
          <p className="text-xs uppercase tracking-widest mt-1" style={{ color: "var(--muted)" }}>
            Last 30 days · Live data
          </p>
        </div>
        <span
          className="flex items-center gap-1.5 text-xs px-3 py-1.5"
          style={{ background: "rgba(110,189,138,0.08)", color: "#6EBD8A", borderRadius: "999px", border: "1px solid rgba(110,189,138,0.2)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#6EBD8A" }} />
          Live
        </span>
      </div>

      {/* ── KPI row ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={`₦${summary.totalRevenue.toLocaleString()}`}
          sub={`₦${summary.revenueThisMonth.toLocaleString()} this month`}
          trend={`+${summary.revenueThisMonth > 0 ? "↑" : "↓"}`}
          trendValues={last14Revenue}
        />
        <StatCard
          icon={ShoppingBag}
          label="Total Orders"
          value={summary.totalOrders}
          sub={`${summary.newOrdersThisMonth} new this month`}
          trendValues={last14Orders}
        />
        <StatCard
          icon={Users}
          label="Total Users"
          value={summary.totalUsers}
          sub={`${summary.newUsersThisMonth} joined this month`}
          trendValues={last14Users}
        />
        <StatCard
          icon={Package}
          label="Catalogue Items"
          value={summary.totalCatalogue}
          sub={`${summary.pendingCatalogue} pending review`}
        />
      </div>

      {/* ── Charts row ──────────────────────────────────────────── */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* Order status donut */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-6"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}
        >
          <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "var(--highlight)", fontWeight: 600 }}>Order Status</p>
          <DonutChart segments={[
            { label: "Completed",  value: orderStatusBreakdown.completed  || 0, color: "#6EBD8A" },
            { label: "Pending",    value: orderStatusBreakdown.pending    || 0, color: "var(--highlight)" },
            { label: "Processing", value: orderStatusBreakdown.processing || 0, color: "#7FB3FF" },
            { label: "Cancelled",  value: orderStatusBreakdown.cancelled  || 0, color: "#F87171" },
            { label: "Awaiting",   value: (orderStatusBreakdown["awaiting-payment"] || 0) + (orderStatusBreakdown["awaiting-contact"] || 0), color: "#C4A87A" },
          ]} />
        </motion.div>

        {/* Payment breakdown donut */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-2xl p-6"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}
        >
          <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "var(--highlight)", fontWeight: 600 }}>Payment Status</p>
          <DonutChart segments={[
            { label: "Paid",    value: paymentBreakdown.paid,    color: "#6EBD8A" },
            { label: "Pending", value: paymentBreakdown.pending, color: "var(--highlight)" },
            { label: "Failed",  value: paymentBreakdown.failed,  color: "#F87171" },
          ]} />
        </motion.div>

        {/* User roles donut */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-2xl p-6"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}
        >
          <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "var(--highlight)", fontWeight: 600 }}>User Roles</p>
          <DonutChart segments={[
            { label: "Clients",   value: userRoles.clients,   color: "#7FB3FF" },
            { label: "Designers", value: userRoles.designers, color: "var(--highlight)" },
            { label: "Admins",    value: userRoles.admins,    color: "#F87171" },
          ]} />
          <div className="mt-4 pt-4 flex gap-4" style={{ borderTop: "1px solid var(--border)" }}>
            <div>
              <p className="text-xs" style={{ color: "var(--muted)" }}>Designer applications</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs" style={{ color: "#6EBD8A", fontFamily: "monospace" }}>{designerStatus.approved} approved</span>
                <span className="text-xs" style={{ color: "var(--highlight)", fontFamily: "monospace" }}>{designerStatus.pending} pending</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Order volume bar chart (last 30 days) ───────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl p-6"
        style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}
      >
        <div className="flex items-center justify-between mb-5">
          <p className="text-xs uppercase tracking-widest" style={{ color: "var(--highlight)", fontWeight: 600 }}>Daily Order Volume — Last 30 Days</p>
          <BarChart2 size={16} style={{ color: "var(--muted)" }} />
        </div>
        <div className="flex items-end gap-[3px] h-20">
          {dailyTrend.map((d) => {
            const maxOrders = Math.max(...dailyTrend.map(x => x.orders), 1);
            return (
              <div key={d.date} className="flex-1 group relative" style={{ minWidth: 0 }}>
                <div
                  className="rounded-sm transition-all duration-300 group-hover:opacity-100"
                  style={{
                    height: `${Math.max((d.orders / maxOrders) * 100, 4)}%`,
                    background: d.orders > 0 ? "var(--highlight)" : "var(--surface-2)",
                    opacity: 0.6,
                  }}
                />
                <div
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10 transition-opacity"
                  style={{ background: "var(--surface-2)", color: "var(--text)", border: "1px solid var(--border)" }}
                >
                  {d.date.slice(5)}: {d.orders} orders
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[10px]" style={{ color: "var(--muted)" }}>{dailyTrend[0]?.date.slice(5)}</span>
          <span className="text-[10px]" style={{ color: "var(--muted)" }}>{dailyTrend[dailyTrend.length - 1]?.date.slice(5)}</span>
        </div>
      </motion.div>

      {/* ── Revenue trend bar chart (last 30 days) ──────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="rounded-2xl p-6"
        style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}
      >
        <div className="flex items-center justify-between mb-5">
          <p className="text-xs uppercase tracking-widest" style={{ color: "var(--highlight)", fontWeight: 600 }}>Daily Revenue (₦) — Last 30 Days</p>
          <TrendingUp size={16} style={{ color: "var(--muted)" }} />
        </div>
        <div className="flex items-end gap-[3px] h-20">
          {dailyTrend.map((d) => {
            const maxRev = Math.max(...dailyTrend.map(x => x.revenue), 1);
            return (
              <div key={d.date} className="flex-1 group relative" style={{ minWidth: 0 }}>
                <div
                  className="rounded-sm transition-all duration-300"
                  style={{
                    height: `${Math.max((d.revenue / maxRev) * 100, 4)}%`,
                    background: d.revenue > 0 ? "#6EBD8A" : "var(--surface-2)",
                    opacity: 0.7,
                  }}
                />
                <div
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10 transition-opacity"
                  style={{ background: "var(--surface-2)", color: "var(--text)", border: "1px solid var(--border)" }}
                >
                  {d.date.slice(5)}: ₦{d.revenue.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[10px]" style={{ color: "var(--muted)" }}>{dailyTrend[0]?.date.slice(5)}</span>
          <span className="text-[10px]" style={{ color: "var(--muted)" }}>{dailyTrend[dailyTrend.length - 1]?.date.slice(5)}</span>
        </div>
      </motion.div>

      {/* ── Bottom row: top designers + catalogue + recent orders ── */}
      <div className="grid md:grid-cols-2 gap-4">

        {/* Top designers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-2xl p-6"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}
        >
          <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "var(--highlight)", fontWeight: 600 }}>Top Designers by Orders</p>
          {topDesigners.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--muted)" }}>No order data yet.</p>
          ) : (
            <div className="space-y-3">
              {topDesigners.map((d, i) => {
                const maxOrders = topDesigners[0]?.orders || 1;
                return (
                  <div key={d.id} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold" style={{ color: "var(--muted)", fontFamily: "monospace", minWidth: 16 }}>#{i + 1}</span>
                        <span className="text-sm" style={{ color: "var(--text)" }}>{d.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs" style={{ color: "var(--muted)", fontFamily: "monospace" }}>{d.orders} orders</span>
                        <span className="text-xs font-medium" style={{ color: "var(--highlight)", fontFamily: "monospace" }}>₦{d.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="h-1 rounded-full" style={{ background: "var(--surface-2)" }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${(d.orders / maxOrders) * 100}%`, background: "var(--highlight)", opacity: 0.7 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Catalogue + user growth stats */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="rounded-2xl p-6"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}
          >
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "var(--highlight)", fontWeight: 600 }}>Catalogue Status</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Approved", value: catalogueByStatus.approved, color: "#6EBD8A" },
                { label: "Pending",  value: catalogueByStatus.pending,  color: "var(--highlight)" },
                { label: "Rejected", value: catalogueByStatus.rejected, color: "#F87171" },
              ].map((item) => (
                <div key={item.label} className="text-center p-3 rounded-xl" style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                  <p className="text-xl font-medium" style={{ fontFamily: "monospace", color: item.color }}>{item.value}</p>
                  <p className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color: "var(--muted)" }}>{item.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="rounded-2xl p-5"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}
          >
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "var(--highlight)", fontWeight: 600 }}>User Signups — Last 30 Days</p>
            <MiniBar values={userGrowth.map(d => d.count)} color="#7FB3FF" />
          </motion.div>
        </div>
      </div>

      {/* ── Recent orders table ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="rounded-2xl overflow-hidden"
        style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}
      >
        <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
          <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: "var(--highlight)" }}>Recent Orders</p>
          <span className="text-xs" style={{ color: "var(--muted)" }}>Latest 10</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Order ID", "Client", "Amount", "Status", "Payment", "Date"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3 text-[11px] uppercase tracking-widest font-semibold"
                    style={{ color: "var(--muted)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, i) => (
                <tr
                  key={order.id}
                  style={{
                    borderBottom: i < recentOrders.length - 1 ? "1px solid var(--border)" : "none",
                  }}
                >
                  <td className="px-5 py-3">
                    <span style={{ fontFamily: "monospace", color: "var(--muted)", fontSize: "11px" }}>
                      {String(order.id).slice(-8).toUpperCase()}
                    </span>
                  </td>
                  <td className="px-5 py-3" style={{ color: "var(--text)" }}>{order.client}</td>
                  <td className="px-5 py-3">
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--highlight)" }}>
                      ₦{(order.total || 0).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-5 py-3"><StatusBadge status={order.status} /></td>
                  <td className="px-5 py-3"><StatusBadge status={order.paymentStatus} /></td>
                  <td className="px-5 py-3">
                    <span style={{ fontFamily: "monospace", color: "var(--muted)", fontSize: "11px" }}>
                      {new Date(order.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

    </div>
  );
}
