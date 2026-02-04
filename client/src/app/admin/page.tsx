"use client";
import React from 'react';
import { Users, Package, ShoppingCart, DollarSign, ArrowRight } from 'lucide-react';

// Placeholder data for summary stats
const summaryStats = [
  {
    title: 'Total Users',
    icon: Users,
    value: '1,254',
    change: '+12%',
    changeType: 'increase',
    color: 'blue'
  },
  {
    title: 'Total Products',
    icon: Package,
    value: '380',
    change: '+5',
    changeType: 'increase',
    color: 'green'
  },
  {
    title: 'Pending Orders',
    icon: ShoppingCart,
    value: '28',
    change: '-3%',
    changeType: 'decrease',
    color: 'orange'
  },
  {
    title: 'Total Revenue',
    icon: DollarSign,
    value: '$15,890',
    change: '+8.5%',
    changeType: 'increase',
    color: 'purple'
  }
];

const AdminDashboard = () => {
    // In a real app, you would get the admin's name from the auth state
    const adminName = "Admin"; 

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-8 space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-gray-800">Welcome back, {adminName}!</h1>
          <p className="text-gray-500 mt-1">Here's a summary of your store's activity.</p>
        </header>

        {/* Summary Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {summaryStats.map((stat) => {
            const colors = {
                blue: 'bg-blue-100 text-blue-600',
                green: 'bg-green-100 text-green-600',
                orange: 'bg-orange-100 text-orange-600',
                purple: 'bg-purple-100 text-purple-600',
            };
            const ringColors = {
                blue: 'ring-blue-200',
                green: 'ring-green-200',
                orange: 'ring-orange-200',
                purple: 'ring-purple-200',
            }

            return(
                <div key={stat.title} className={`bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all`}>
                    <div className="flex items-center justify-between">
                        <p className="font-semibold text-gray-500">{stat.title}</p>
                        <div className={`w-10 h-10 flex items-center justify-center rounded-full ${colors[stat.color as keyof typeof colors]}`}>
                            <stat.icon size={20} />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-800 mt-4">{stat.value}</p>
                    <p className={`text-sm font-semibold mt-2 ${stat.changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
                        {stat.change} vs last month
                    </p>
                </div>
            )}
        )}
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
                <div className="space-y-3">
                    <button className="w-full flex justify-between items-center px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                        <span className="font-semibold text-gray-700">Manage Products</span>
                        <ArrowRight size={18} className="text-gray-400" />
                    </button>
                    <button className="w-full flex justify-between items-center px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                        <span className="font-semibold text-gray-700">Manage Users</span>
                        <ArrowRight size={18} className="text-gray-400" />
                    </button>
                     <button className="w-full flex justify-between items-center px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                        <span className="font-semibold text-gray-700">View Orders</span>
                        <ArrowRight size={18} className="text-gray-400" />
                    </button>
                </div>
            </div>
             <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
                <p className="text-center text-gray-400 py-10">Activity feed is not yet implemented.</p>
             </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;