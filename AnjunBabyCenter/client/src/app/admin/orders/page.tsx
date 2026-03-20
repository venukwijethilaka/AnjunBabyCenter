'use client';

import { useState } from 'react';
import { Package, Search, Filter, Eye, Edit2, XCircle, Clock, Truck, CheckCircle } from 'lucide-react';
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation, useUpdateTrackingIdMutation } from '../../../state/api';
import ProtectedRoute from '../../client/(components)/ProtectedRoute';

const statusConfig = {
  PENDING: { label: 'Pending', color: 'bg-amber-100  text-amber-700  border-amber-200', iconBg: 'bg-amber-100', icon: Clock },
  ARRANGING: { label: 'Arranging', color: 'bg-blue-100   text-blue-700   border-blue-200', iconBg: 'bg-blue-100', icon: Package },
  SHIPPING: { label: 'Shipping', color: 'bg-purple-100 text-purple-700 border-purple-200', iconBg: 'bg-purple-100', icon: Truck },
  DELIVERED: { label: 'Delivered', color: 'bg-green-100  text-green-700  border-green-200', iconBg: 'bg-green-100', icon: CheckCircle },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-100    text-red-700    border-red-200', iconBg: 'bg-red-100', icon: XCircle },
};

interface OrderModalData { orderId: number; currentStatus: string; trackingId?: string; }

export default function AdminOrderManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderModalData | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [newTrackingId, setNewTrackingId] = useState('');

  const { data: orders = [], isLoading, refetch } = useGetAllOrdersQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [updateTrackingId] = useUpdateTrackingIdMutation();

  const filteredOrders = (orders || []).filter(order => {
    const matchesSearch =
      order.id.toString().includes(searchQuery) ||
      order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openUpdateModal = (order: any) => {
    setSelectedOrder({ orderId: order.id, currentStatus: order.status, trackingId: order.trackingId || '' });
    setNewStatus(order.status);
    setNewTrackingId(order.trackingId || '');
  };

  const closeModal = () => { setSelectedOrder(null); setNewStatus(''); setNewTrackingId(''); };

  const handleUpdateOrder = async () => {
    if (!selectedOrder) return;
    setIsUpdating(true);
    try {
      if (newStatus !== selectedOrder.currentStatus) await updateOrderStatus({ orderId: selectedOrder.orderId, status: newStatus }).unwrap();
      if (newStatus === 'SHIPPING' && newTrackingId && newTrackingId !== selectedOrder.trackingId) await updateTrackingId({ orderId: selectedOrder.orderId, trackingId: newTrackingId }).unwrap();
      setNotification({ message: 'Order updated successfully', type: 'success' });
      refetch(); closeModal();
    } catch (error: any) {
      setNotification({ message: error?.data?.message || 'Failed to update order', type: 'error' });
    } finally {
      setIsUpdating(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    try {
      await updateOrderStatus({ orderId, status: 'CANCELLED' }).unwrap();
      setNotification({ message: 'Order cancelled successfully', type: 'success' });
      refetch();
    } catch (error: any) {
      setNotification({ message: error?.data?.message || 'Failed to cancel order', type: 'error' });
    } finally { setTimeout(() => setNotification(null), 3000); }
  };

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-full bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
        <p className="text-blue-600 font-bold">Loading Orders…</p>
      </div>
    </div>
  );

  return (
    <ProtectedRoute>
      <div className="min-h-full bg-slate-50">

        {/* Toast */}
        {notification && (
          <div className={`fixed top-6 right-6 px-6 py-4 rounded-2xl font-bold shadow-2xl z-50 animate-in slide-in-from-top-4 ${notification.type === 'success' ? 'bg-white text-green-600 border border-green-100' : 'bg-white text-red-600 border border-red-100'
            }`}>
            {notification.message}
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

          {/* ── Header ── */}
          <header className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-2xl">
              <Package className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-800">Order Management</h1>
              <p className="text-slate-500 text-sm font-medium mt-0.5">Track and update all customer orders</p>
            </div>
          </header>

          {/* ── Stats + Filters Card ── */}
          <div className="bg-white rounded-[28px] border border-blue-50 shadow-sm p-6 space-y-6">

            {/* Search + Filter row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by Order ID, name, or email…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-13 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-200 focus:border-blue-300 outline-none font-medium transition-all"
                  style={{ paddingLeft: '3.25rem' }}
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-400 w-5 h-5" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-13 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-200 outline-none font-medium transition-all appearance-none"
                  style={{ paddingLeft: '3.25rem' }}
                >
                  <option value="all">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="ARRANGING">Arranging</option>
                  <option value="SHIPPING">Shipping</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Status stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-4 border-t border-slate-100">
              {Object.entries(statusConfig).map(([key, config]) => {
                const count = (orders || []).filter(o => o.status === key).length;
                const Icon = config.icon;
                return (
                  <div key={key} className={`flex items-center gap-3 p-3.5 rounded-2xl border ${config.color}`}>
                    <div className={`w-8 h-8 flex items-center justify-center rounded-xl ${config.iconBg}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-wide">{config.label}</p>
                      <p className="text-xl font-black">{count}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Table ── */}
          <div className="bg-white rounded-[28px] border border-blue-50 shadow-sm overflow-hidden">
            {filteredOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="p-5 bg-blue-50 rounded-[24px]">
                  <Package className="w-10 h-10 text-blue-300" />
                </div>
                <h3 className="text-xl font-black text-slate-700">No orders found</h3>
                <p className="text-slate-400 text-sm">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-blue-50/60 border-b border-blue-100">
                    <tr>
                      {['Order ID', 'Customer', 'Date', 'Total', 'Status', 'Tracking', 'Actions'].map((h, i) => (
                        <th key={h} className={`px-6 py-4 text-xs font-black text-blue-600 uppercase tracking-widest ${i === 6 ? 'text-right' : ''}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredOrders.map((order) => {
                      const status = order.status as keyof typeof statusConfig;
                      const config = statusConfig[status];
                      const StatusIcon = config.icon;
                      return (
                        <tr key={order.id} className="hover:bg-blue-50/30 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-black text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg text-sm">#{order.id}</span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-800 text-sm">{order.user?.name || 'N/A'}</p>
                            <p className="text-xs text-slate-400 font-medium">{order.user?.email}</p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-black text-blue-600">Rs. {Number(order.totalAmount).toLocaleString()}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black border ${config.color}`}>
                              <StatusIcon className="w-3 h-3" /> {config.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">
                            {order.trackingId || <span className="text-slate-300">—</span>}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex justify-end gap-2">
                              <button onClick={() => openUpdateModal(order)} className="p-2.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all active:scale-95" title="Edit Order">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                                <button onClick={() => handleCancelOrder(order.id)} className="p-2.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all active:scale-95" title="Cancel Order">
                                  <XCircle className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* ── Update Modal ── */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[32px] shadow-2xl max-w-md w-full p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-2xl">
                  <Edit2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-800">Update Order</h2>
                  <p className="text-sm text-slate-400 font-medium">#{selectedOrder.orderId}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Order Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-blue-200 outline-none font-semibold transition-all appearance-none"
                  >
                    {Object.entries(statusConfig).map(([key, { label }]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>

                {newStatus === 'SHIPPING' && (
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Tracking ID (Domex)</label>
                    <input
                      type="text"
                      value={newTrackingId}
                      onChange={(e) => setNewTrackingId(e.target.value)}
                      placeholder="Enter Domex tracking ID"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-blue-200 outline-none font-medium transition-all"
                    />
                    <p className="text-xs text-slate-400 mt-1 ml-1">Customer can track on domex.lk</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={closeModal} disabled={isUpdating} className="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 disabled:opacity-50 transition-all">
                  Cancel
                </button>
                <button onClick={handleUpdateOrder} disabled={isUpdating}
                  className="flex-1 py-3.5 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-600/20 hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 active:scale-95">
                  {isUpdating ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Updating…</> : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}