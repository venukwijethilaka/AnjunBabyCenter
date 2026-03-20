"use client";
import React, { useMemo } from 'react';
import { Users, Package, ShoppingCart, DollarSign, ArrowRight, TrendingUp, Activity, Zap, Clock, RefreshCw } from 'lucide-react';
import {
  useGetUsersQuery,
  useGetProductsQuery,
  useGetAllOrdersQuery,
} from '@/state/api';

const quickActions = [
  { label: 'Manage Products', desc: 'Add, edit, or remove products', icon: Package, href: '/admin/Products' },
  { label: 'Manage Users', desc: 'View accounts & loyalty tiers', icon: Users, href: '/admin/Users' },
  { label: 'View Orders', desc: 'Track and update order statuses', icon: ShoppingCart, href: '/admin/orders' },
  { label: 'Storefront Displays', desc: 'Update banners & promotions', icon: Zap, href: '/admin/HomePage' },
];

const StatCard = ({
  title, icon: Icon, value, sub, bg, text, isLoading,
}: {
  title: string; icon: React.ElementType; value: string; sub: string;
  bg: string; text: string; isLoading?: boolean;
}) => (
  <div className="bg-white rounded-[28px] border border-blue-50 shadow-sm p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
    <div className="flex items-center justify-between mb-5">
      <p className="font-bold text-slate-500 text-sm">{title}</p>
      <div className={`w-11 h-11 flex items-center justify-center rounded-2xl ${bg} ${text} group-hover:scale-110 transition-transform`}>
        <Icon size={22} />
      </div>
    </div>
    {isLoading ? (
      <div className="flex items-center gap-2 text-slate-300">
        <RefreshCw size={18} className="animate-spin" />
        <span className="text-sm font-bold">Loading…</span>
      </div>
    ) : (
      <>
        <p className="text-4xl font-black text-slate-800 mb-2">{value}</p>
        <p className="text-sm font-bold text-slate-400 flex items-center gap-1">
          <TrendingUp size={13} className="text-blue-400" /> {sub}
        </p>
      </>
    )}
  </div>
);

const AdminDashboard = () => {
  const { data: users = [], isLoading: usersLoading } = useGetUsersQuery();
  const { data: products = [], isLoading: productsLoading } = useGetProductsQuery();
  const { data: orders = [], isLoading: ordersLoading } = useGetAllOrdersQuery();

  const stats = useMemo(() => {
    const totalUsers = users.length;
    const totalProducts = products.length;
    const pendingOrders = (orders || []).filter(o => o.status === 'PENDING').length;
    const totalRevenue = (orders || [])
      .filter(o => o.status !== 'CANCELLED')
      .reduce((sum, o) => sum + Number(o.totalAmount), 0);

    // Recent counts (last 7 days) for sub-labels
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentOrders = (orders || []).filter(o => new Date(o.createdAt) >= sevenDaysAgo).length;

    return {
      totalUsers,
      totalProducts,
      pendingOrders,
      totalRevenue,
      recentOrders,
    };
  }, [users, products, orders]);

  const isLoading = usersLoading || productsLoading || ordersLoading;

  // Format currency nicely
  const fmtRevenue = (n: number) => {
    if (n >= 1_000_000) return `Rs. ${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `Rs. ${(n / 1_000).toFixed(1)}K`;
    return `Rs. ${n.toLocaleString()}`;
  };

  // Recent 5 orders for activity feed
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  const statusColor: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    ARRANGING: 'bg-blue-100 text-blue-700',
    SHIPPING: 'bg-purple-100 text-purple-700',
    DELIVERED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
  };

  const adminName = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}')?.name || 'Admin'
    : 'Admin';

  return (
    <div className="min-h-full bg-slate-50">
      <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-10">

        {/* ── Header ── */}
        <header className="space-y-1">
          <p className="text-sm font-bold text-blue-500 uppercase tracking-widest">Overview</p>
          <h1 className="text-3xl md:text-4xl font-black text-slate-800">
            Welcome back, <span className="text-blue-600">{adminName}</span>!
          </h1>
          <p className="text-slate-500 font-medium">Here's a live summary of your store's performance.</p>
        </header>

        {/* ── Stat Cards ── */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              title="Total Users"
              icon={Users}
              value={stats.totalUsers.toLocaleString()}
              sub={`${stats.totalUsers} registered customers`}
              bg="bg-blue-100" text="text-blue-600"
              isLoading={usersLoading}
            />
            <StatCard
              title="Total Products"
              icon={Package}
              value={stats.totalProducts.toLocaleString()}
              sub="Listed in the store"
              bg="bg-blue-200" text="text-blue-700"
              isLoading={productsLoading}
            />
            <StatCard
              title="Pending Orders"
              icon={ShoppingCart}
              value={stats.pendingOrders.toLocaleString()}
              sub={`${stats.recentOrders} new in last 7 days`}
              bg="bg-blue-300" text="text-blue-800"
              isLoading={ordersLoading}
            />
            <StatCard
              title="Total Revenue"
              icon={DollarSign}
              value={fmtRevenue(stats.totalRevenue)}
              sub="All time (excl. cancelled)"
              bg="bg-blue-600" text="text-white"
              isLoading={ordersLoading}
            />
          </div>
        </section>

        {/* ── Body Grid ── */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Quick Actions */}
          <div className="bg-white rounded-[28px] border border-blue-50 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-7">
              <div className="p-2.5 bg-blue-50 rounded-xl">
                <Zap className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-black text-slate-800">Quick Actions</h2>
            </div>
            <div className="space-y-3">
              {quickActions.map((action) => (
                <a
                  key={action.label}
                  href={action.href}
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 hover:border-blue-100 border border-transparent transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:bg-blue-600 transition-colors">
                      <action.icon size={16} className="text-slate-500 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-700 group-hover:text-blue-700 text-sm transition-colors">{action.label}</p>
                      <p className="text-xs text-slate-400">{action.desc}</p>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </a>
              ))}
            </div>
          </div>

          {/* Recent Orders Activity */}
          <div className="lg:col-span-2 bg-white rounded-[28px] border border-blue-50 shadow-sm p-8">
            <div className="flex items-center justify-between mb-7">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 rounded-xl">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-black text-slate-800">Recent Orders</h2>
              </div>
              <a href="/admin/orders" className="text-xs font-black text-blue-500 hover:text-blue-700 flex items-center gap-1 transition-colors">
                View All <ArrowRight size={13} />
              </a>
            </div>

            {ordersLoading ? (
              <div className="h-48 flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-blue-300 animate-spin" />
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center gap-3 border-2 border-dashed border-blue-100 rounded-2xl">
                <ShoppingCart className="w-8 h-8 text-blue-200" />
                <p className="font-bold text-slate-400 text-sm">No orders yet</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between py-3.5 hover:bg-slate-50/50 transition-colors px-2 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                        <ShoppingCart size={15} className="text-blue-500" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-700 text-sm">
                          Order #{order.id}
                          {order.user?.name && <span className="text-slate-400 font-semibold"> · {order.user.name}</span>}
                        </p>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock size={10} /> {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wide ${statusColor[order.status] || 'bg-slate-100 text-slate-500'}`}>
                        {order.status}
                      </span>
                      <span className="font-black text-slate-700 text-sm">Rs. {Number(order.totalAmount).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
};

export default AdminDashboard;