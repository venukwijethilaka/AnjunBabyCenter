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

  // ✅ FIXED: Flex layout with padding instead of margin
  if (isLoading) {
    return (
      <div className="min-h-[100dvh] flex flex-col bg-gray-50/40">
        <Navbar />
        <div className="flex-1 flex justify-center items-center text-theme-primary font-semibold text-lg pt-[110px]">
          Loading orders...
        </div>
      </div>
    );
  }

  return (
    // ✅ FIXED: Outer wrapper uses flex-col and 100dvh
    <div className="min-h-[100dvh] flex flex-col bg-gray-50/40">
      <Navbar />

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-6 right-6 px-6 py-4 border shadow-2xl z-50 transition-all duration-200 font-bold text-base tracking-wide rounded-2xl ${
          notification.type === 'success' 
            ? 'bg-theme-toggle-bg text-theme-primary border-theme-border' 
            : 'bg-rose-50 text-rose-700 border-rose-300'
        }`}>
          {notification.message}
        </div>
      )}

      {/* ✅ FIXED: flex-1 ensures it fills space, pt-[110px] cleanly clears the fixed navbar */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-[130px] pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-3">
            <Package className="w-8 h-8 text-theme-primary" />
            My Orders
          </h1>
          <p className="text-theme-light mt-2 font-medium">Track and manage your orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-24 bg-white border border-gray-100 rounded-[32px] shadow-sm">
            <div className="w-20 h-20 bg-theme-bg rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-theme-primary" />
            </div>
            <h3 className="text-2xl font-black text-gray-800 mb-2">No orders yet</h3>
            <p className="text-theme-light mb-8 font-medium">Start shopping to see your orders here</p>
            <button
              onClick={() => router.push('/client/product')}
              className="px-8 py-3.5 bg-theme-primary text-white font-bold rounded-2xl hover:bg-theme-bg-hover transition-colors shadow-lg active:scale-95"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const status = order.status as keyof typeof statusConfig;
              const config = statusConfig[status];
              const StatusIcon = config.icon;

              return (
                <div 
                  key={order.id} 
                  className="bg-white border border-gray-100 shadow-sm rounded-[28px] overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  {/* Order Header */}
                  <div className="p-6 sm:p-8 border-b border-gray-50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-extrabold text-gray-800 text-xl">
                            Order #{order.id}
                          </h3>
                          <div className={`px-3 py-1 rounded-xl ${config.bgColor} ${config.borderColor} border flex items-center gap-2 shadow-sm`}>
                            <StatusIcon className={`w-4 h-4 ${config.color}`} />
                            <span className={`text-sm font-bold ${config.color}`}>
                              {config.label}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm font-medium text-theme-light">
                          Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-left sm:text-right">
                          <p className="text-sm font-bold text-gray-400 uppercase tracking-tight">Total Amount</p>
                          <p className="text-2xl font-black text-theme-primary">Rs. {Number(order.totalAmount).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Tracking ID */}
                    {order.trackingId && order.status === 'SHIPPING' && (
                      <div className="mt-6 p-5 bg-purple-50 border border-purple-200 rounded-2xl">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-bold text-purple-800 mb-1">
                              Tracking ID: {order.trackingId}
                            </p>
                            <p className="text-xs font-medium text-purple-600">
                              Track your package on the Domex website
                            </p>
                          </div>
                          <a
                            href={`https://www.domex.lk/track?id=${order.trackingId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-5 py-2.5 bg-purple-600 text-white text-sm font-bold rounded-xl hover:bg-purple-700 transition-colors shadow-md text-center"
                          >
                            Track Now
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Order Items Preview */}
                  <div className="p-6 sm:p-8 bg-gray-50/40">
                    <div className="space-y-4 mb-6">
                      {order.items.slice(0, 2).map((item) => {
                        const thumbnail = item.product.images?.find(img => img.isMain)?.url || 
                                        item.product.images?.[0]?.url || 
                                        '/placeholder-baby.png';
                        return (
                          <div key={item.id} className="flex gap-4 items-center bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-50">
                              <img 
                                src={thumbnail} 
                                alt={item.product.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-gray-800 text-sm leading-snug">
                                {item.product.name}
                              </p>
                              <p className="text-xs font-bold text-theme-light mt-1">
                                Qty: {item.quantity} × Rs. {Number(item.price).toFixed(2)}
                              </p>
                            </div>
                            <p className="font-black text-theme-primary px-2">Rs. {(Number(item.price) * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {order.items.length > 2 && (
                      <p className="text-sm text-theme-primary font-bold mb-6 pl-2">
                        +{order.items.length - 2} more item(s)
                      </p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 mt-2">
                      <button
                        onClick={() => router.push(`/client/orders/${order.id}`)}
                        className="flex-1 px-6 py-4 bg-theme-primary text-white font-bold rounded-2xl hover:bg-theme-bg-hover transition-all flex items-center justify-center gap-2 shadow-md active:scale-[0.98]"
                      >
                        View Details
                        <ChevronRight className="w-5 h-5" />
                      </button>

                      {canCancelOrder(order.status) && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={cancellingOrderId === order.id}
                          className="px-6 py-4 bg-white text-red-600 font-bold border-2 border-red-100 hover:border-red-500 rounded-2xl hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]"
                        >
                          {cancellingOrderId === order.id ? (
                            <>
                              <div className="w-5 h-5 border-[3px] border-red-600 border-t-transparent rounded-full animate-spin"></div>
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
                      <div className="mt-5 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                        <p className="text-sm font-semibold text-yellow-700 leading-relaxed">
                          This order cannot be cancelled as it is already being arranged or shipped.
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