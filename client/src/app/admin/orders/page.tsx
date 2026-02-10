'use client';

import { useState } from 'react';
import { Package, Search, Filter, Eye, Edit2, XCircle, Clock, Truck, CheckCircle } from 'lucide-react';
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation, useUpdateTrackingIdMutation } from '../../../state/api';
import ProtectedRoute from '../../client/(components)/ProtectedRoute';
const statusConfig = {
  PENDING: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700 border-yellow-300', icon: Clock },
  ARRANGING: { label: 'Arranging', color: 'bg-blue-100 text-blue-700 border-blue-300', icon: Package },
  SHIPPING: { label: 'Shipping', color: 'bg-purple-100 text-purple-700 border-purple-300', icon: Truck },
  DELIVERED: { label: 'Delivered', color: 'bg-green-100 text-green-700 border-green-300', icon: CheckCircle },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-700 border-red-300', icon: XCircle },
};

interface OrderModalData {
  orderId: number;
  currentStatus: string;
  trackingId?: string;
}

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

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toString().includes(searchQuery) ||
      order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Open modal
  const openUpdateModal = (order: any) => {
    setSelectedOrder({
      orderId: order.id,
      currentStatus: order.status,
      trackingId: order.trackingId || '',
    });
    setNewStatus(order.status);
    setNewTrackingId(order.trackingId || '');
  };

  // Close modal
  const closeModal = () => {
    setSelectedOrder(null);
    setNewStatus('');
    setNewTrackingId('');
  };

  // Update order
  const handleUpdateOrder = async () => {
    if (!selectedOrder) return;

    setIsUpdating(true);
    try {
      // Update status if changed
      if (newStatus !== selectedOrder.currentStatus) {
        await updateOrderStatus({
          orderId: selectedOrder.orderId,
          status: newStatus,
        }).unwrap();
      }

      // Update tracking ID if provided and status is SHIPPING
      if (newStatus === 'SHIPPING' && newTrackingId && newTrackingId !== selectedOrder.trackingId) {
        await updateTrackingId({
          orderId: selectedOrder.orderId,
          trackingId: newTrackingId,
        }).unwrap();
      }

      setNotification({ message: 'Order updated successfully', type: 'success' });
      refetch();
      closeModal();
    } catch (error: any) {
      setNotification({ 
        message: error?.data?.message || 'Failed to update order', 
        type: 'error' 
      });
    } finally {
      setIsUpdating(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  // Cancel order
  const handleCancelOrder = async (orderId: number) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    try {
      await updateOrderStatus({
        orderId,
        status: 'CANCELLED',
      }).unwrap();

      setNotification({ message: 'Order cancelled successfully', type: 'success' });
      refetch();
    } catch (error: any) {
      setNotification({ 
        message: error?.data?.message || 'Failed to cancel order', 
        type: 'error' 
      });
    } finally {
      setTimeout(() => setNotification(null), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 text-pink-500 font-semibold text-lg">
        Loading orders...
      </div>
    );
  }

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-gray-50 h-screen overflow-y-auto">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-6 right-6 px-6 py-4 border shadow-lg z-50 transition-all duration-200 font-semibold text-base tracking-wide rounded-md ${
          notification.type === 'success' 
            ? 'bg-green-100 text-green-700 border-green-300' 
            : 'bg-red-100 text-red-700 border-red-300'
        }`}>
          {notification.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-3">
            <Package className="w-8 h-8 text-pink-500" />
            Order Management
          </h1>
          <p className="text-gray-500 mt-2">Manage and track all customer orders</p>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text"
                placeholder="Search by Order ID, Customer Name, or Email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-300 focus:border-pink-400 outline-none transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-300 focus:border-pink-400 outline-none transition-all appearance-none bg-white"
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

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6 pt-6 border-t border-gray-200">
            {Object.entries(statusConfig).map(([key, config]) => {
              const count = orders.filter(o => o.status === key).length;
              const Icon = config.icon;
              return (
                <div key={key} className={`p-4 border rounded-md ${config.color}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4" />
                    <p className="text-xs font-semibold">{config.label}</p>
                  </div>
                  <p className="text-2xl font-bold">{count}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-20">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">No orders found</h3>
              <p className="text-gray-500">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Tracking
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.map((order) => {
                    const status = order.status as keyof typeof statusConfig;
                    const config = statusConfig[status];
                    const StatusIcon = config.icon;

                    return (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-bold text-gray-900">#{order.id}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-gray-900">{order.user?.name || 'N/A'}</p>
                            <p className="text-sm text-gray-500">{order.user?.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-bold text-pink-600">
                            ${Number(order.totalAmount).toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 w-fit ${config.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {config.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {order.trackingId || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => openUpdateModal(order)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                              title="Update Order"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                              <button
                                onClick={() => handleCancelOrder(order.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                title="Cancel Order"
                              >
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

      {/* Update Order Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Update Order #{selectedOrder.orderId}
            </h2>

            <div className="space-y-4">
              {/* Status Update */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Order Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-300 focus:border-pink-400 outline-none"
                >
                  <option value="PENDING">Pending</option>
                  <option value="ARRANGING">Arranging</option>
                  <option value="SHIPPING">Shipping</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              {/* Tracking ID (only show for SHIPPING status) */}
              {newStatus === 'SHIPPING' && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Tracking ID (Domex)
                  </label>
                  <input
                    type="text"
                    value={newTrackingId}
                    onChange={(e) => setNewTrackingId(e.target.value)}
                    placeholder="Enter Domex tracking ID"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-300 focus:border-pink-400 outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Customer will be able to track on domex.lk
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={closeModal}
                disabled={isUpdating}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 font-bold rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateOrder}
                disabled={isUpdating}
                className="flex-1 px-4 py-3 bg-pink-500 text-white font-bold rounded-md hover:bg-rose-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isUpdating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Updating...
                  </>
                ) : (
                  'Update Order'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </ProtectedRoute>
  );
}
