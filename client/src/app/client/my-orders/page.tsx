'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package, ChevronRight, Clock, Truck, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Navbar from '@/app/client/(components)/NavBar';
import { useGetUserOrdersQuery, useCancelOrderMutation } from '@/state/api';

const statusConfig = {
  PENDING: {
    label: 'Pending',
    icon: Clock,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
  },
  ARRANGING: {
    label: 'Arranging',
    icon: Package,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  SHIPPING: {
    label: 'Shipping',
    icon: Truck,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
  DELIVERED: {
    label: 'Delivered',
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  CANCELLED: {
    label: 'Cancelled',
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
};

export default function MyOrdersPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<number | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [cancellingOrderId, setCancellingOrderId] = useState<number | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!userStr) {
      router.push('/client/sign-in');
      return;
    }
    const user = JSON.parse(userStr);
    setUserId(user.id);
  }, [router]);

  const { data: orders = [], isLoading, refetch } = useGetUserOrdersQuery(userId!, {
    skip: !userId,
  });

  const [cancelOrder] = useCancelOrderMutation();

  const handleCancelOrder = async (orderId: number) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    setCancellingOrderId(orderId);
    try {
      await cancelOrder(orderId).unwrap();
      setNotification({ message: 'Order cancelled successfully', type: 'success' });
      refetch();
    } catch (error: any) {
      setNotification({ 
        message: error?.data?.message || 'Failed to cancel order', 
        type: 'error' 
      });
    } finally {
      setCancellingOrderId(null);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const canCancelOrder = (status: string) => {
    return status === 'PENDING' || status === 'ARRANGING';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex justify-center items-center min-h-screen text-pink-500 font-semibold text-lg">
          Loading orders...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-6 right-6 px-6 py-4 border shadow-lg z-50 transition-all duration-200 font-semibold text-base tracking-wide rounded-md ${
          notification.type === 'success' 
            ? 'bg-pink-100 text-pink-700 border-pink-300' 
            : 'bg-rose-100 text-rose-700 border-rose-300'
        }`}>
          {notification.message}
        </div>
      )}

      <div className="mt-[70px] max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-3">
            <Package className="w-8 h-8 text-pink-500" />
            My Orders
          </h1>
          <p className="text-pink-400 mt-2">Track and manage your orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white border border-pink-100 rounded-md shadow-md">
            <Package className="w-16 h-16 text-pink-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No orders yet</h3>
            <p className="text-pink-400 mb-6">Start shopping to see your orders here</p>
            <button
              onClick={() => router.push('/client/product')}
              className="px-8 py-3 bg-pink-500 text-white font-bold rounded-md hover:bg-rose-500 transition-colors shadow"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = order.status as keyof typeof statusConfig;
              const config = statusConfig[status];
              const StatusIcon = config.icon;

              return (
                <div 
                  key={order.id} 
                  className="bg-white border border-pink-100 shadow-md rounded-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Order Header */}
                  <div className="p-6 border-b border-pink-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-gray-800 text-lg">
                            Order #{order.id}
                          </h3>
                          <div className={`px-3 py-1 rounded-md ${config.bgColor} ${config.borderColor} border flex items-center gap-2`}>
                            <StatusIcon className={`w-4 h-4 ${config.color}`} />
                            <span className={`text-sm font-semibold ${config.color}`}>
                              {config.label}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-pink-400">
                          Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Total Amount</p>
                          <p className="text-2xl font-bold text-pink-600">
                            ${Number(order.totalAmount).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Tracking ID */}
                    {order.trackingId && order.status === 'SHIPPING' && (
                      <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-md">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold text-purple-700 mb-1">
                              Tracking ID: {order.trackingId}
                            </p>
                            <p className="text-xs text-purple-600">
                              Track your package on Domex website
                            </p>
                          </div>
                          <a
                            href={`https://www.domex.lk/track?id=${order.trackingId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-md hover:bg-purple-700 transition-colors"
                          >
                            Track Now
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Order Items Preview */}
                  <div className="p-6 bg-pink-50/30">
                    <div className="space-y-3 mb-4">
                      {order.items.slice(0, 2).map((item) => {
                        const thumbnail = item.product.images?.find(img => img.isMain)?.url || 
                                        item.product.images?.[0]?.url || 
                                        '/placeholder-baby.png';
                        return (
                          <div key={item.id} className="flex gap-4 items-center">
                            <img 
                              src={thumbnail} 
                              alt={item.product.name} 
                              className="w-16 h-16 object-cover rounded-md border border-pink-100"
                            />
                            <div className="flex-1">
                              <p className="font-semibold text-gray-800 text-sm">
                                {item.product.name}
                              </p>
                              <p className="text-xs text-pink-600 mt-1">
                                Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                              </p>
                            </div>
                            <p className="font-bold text-pink-600">
                              ${(Number(item.price) * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {order.items.length > 2 && (
                      <p className="text-sm text-pink-500 font-semibold">
                        +{order.items.length - 2} more item(s)
                      </p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-6">
                      <button
                        onClick={() => router.push(`/client/orders/${order.id}`)}
                        className="flex-1 px-6 py-3 bg-pink-500 text-white font-bold rounded-md hover:bg-rose-500 transition-colors flex items-center justify-center gap-2 shadow"
                      >
                        View Details
                        <ChevronRight className="w-5 h-5" />
                      </button>

                      {canCancelOrder(order.status) && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={cancellingOrderId === order.id}
                          className="px-6 py-3 bg-white text-red-600 font-bold border-2 border-red-500 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {cancellingOrderId === order.id ? (
                            <>
                              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                              Cancelling...
                            </>
                          ) : (
                            <>
                              <XCircle className="w-5 h-5" />
                              Cancel Order
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {!canCancelOrder(order.status) && order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-yellow-700">
                          This order cannot be cancelled as it's already being shipped.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
