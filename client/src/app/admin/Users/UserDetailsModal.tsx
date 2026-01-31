"use client";
import React from 'react';
import { User } from '@/state/api';
import { X, Package, Calendar, DollarSign, CheckCircle, ShieldAlert } from 'lucide-react';

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const UserDetailsModal = ({ isOpen, onClose, user }: UserDetailsModalProps) => {
  if (!isOpen || !user) return null;

  // ✅ Calculate Total Purchases
  const totalSpent = user.orders?.reduce((sum, order) => sum + order.totalAmount, 0) || 0;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    // ✅ FIXED: Blue Shadow Blur Background (bg-slate-900/20 backdrop-blur-md)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-white/50">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-white">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">User Profile</h2>
            <p className="text-sm text-gray-500">ID: #{user.id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-8 bg-gray-50/50">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Info */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700 border-l-4 border-blue-500 pl-3">Personal Information</h3>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 space-y-3">
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-500">Full Name</span>
                        <span className="font-medium text-gray-900">{user.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-500">Email</span>
                        <span className="font-medium text-gray-900">{user.email}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-500">Phone</span>
                        <span className="font-medium text-gray-900">{user.phone || "N/A"}</span>
                    </div>
                    <div className="flex justify-between pt-1">
                        <span className="text-gray-500">Joined</span>
                        <span className="font-medium text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            {/* Account Status */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700 border-l-4 border-purple-500 pl-3">Account Status</h3>
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                        <span className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">Role</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                            {user.role}
                        </span>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                        <span className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">Status</span>
                        <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {user.isActive ? <CheckCircle className="w-3 h-3"/> : <ShieldAlert className="w-3 h-3"/>}
                            {user.isActive ? "Active" : "Banned"}
                        </span>
                    </div>
                    
                    {/* ✅ Total Purchases Calculation Added */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 col-span-2 flex justify-between items-center px-6">
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-xs uppercase font-bold tracking-wider">Total Purchases</span>
                            <span className="text-green-600 font-bold text-xl">${totalSpent.toFixed(2)}</span>
                        </div>
                        <div className="flex flex-col items-end border-l border-gray-100 pl-6">
                            <span className="text-gray-500 text-xs uppercase font-bold tracking-wider">Loyalty Points</span>
                            <span className="text-yellow-600 font-bold text-xl flex items-center gap-1">
                                <DollarSign className="w-5 h-5" /> {user.loyaltyPoints}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
          </div>

          {/* Ban Information (If Banned) */}
          {!user.isActive && user.banReason && (
             <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-in slide-in-from-top-2">
                <h4 className="text-red-800 font-bold mb-1 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5"/> Account Suspended
                </h4>
                <p className="text-red-700 text-sm"><strong>Reason:</strong> {user.banReason}</p>
                {user.banExpiresAt && (
                    <p className="text-red-700 text-sm"><strong>Expires:</strong> {new Date(user.banExpiresAt).toLocaleDateString()}</p>
                )}
             </div>
          )}

          {/* Order History */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 border-l-4 border-green-500 pl-3 mb-4">Order History</h3>
            
            {!user.orders || user.orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl border border-gray-200 border-dashed">
                    <Package className="w-12 h-12 text-gray-300 mb-2" />
                    <p className="text-gray-500 font-medium">No orders found.</p>
                </div>
            ) : (
                <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Items</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {user.orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">#{order.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center gap-2">
                                        <Calendar className="w-4 h-4"/>
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                        ${order.totalAmount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {order.items?.length || 0} Items
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
          </div>

        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-white flex justify-end">
            <button onClick={onClose} className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors">
                Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;