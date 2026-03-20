'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Package, MapPin, CreditCard, Clock, Truck, CheckCircle, XCircle } from 'lucide-react';
import Navbar from '@/app/client/(components)/NavBar';
import { useGetOrderByIdQuery, useCancelOrderMutation } from '@/state/api';

const statusConfig = {
  PENDING: {
    label: 'Pending',
    icon: Clock,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    description: 'Your order has been received and is being processed',
  },
  ARRANGING: {
    label: 'Arranging',
    icon: Package,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    description: 'We are preparing your order for shipment',
  },
  SHIPPING: {
    label: 'Shipping',
    icon: Truck,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    description: 'Your order is on its way to you',
  },
  DELIVERED: {
    label: 'Delivered',
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    description: 'Your order has been successfully delivered',
  },
  CANCELLED: {
    label: 'Cancelled',
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    description: 'This order has been cancelled',
  },
};

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = Number(params.id);
  
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [cancellingOrder, setCancellingOrder] = useState(false);

  const { data: order, isLoading, refetch } = useGetOrderByIdQuery(orderId);
  const [cancelOrder] = useCancelOrderMutation();

  const handleCancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    setCancellingOrder(true);
    try {
      await cancelOrder(orderId).unwrap();
      setNotification({ message: 'Order cancelled successfully', type: 'success' });
      // Refetch order to update status immediately
      await refetch();
    } catch (error: any) {
      setNotification({ 
        message: error?.data?.message || 'Failed to cancel order', 
        type: 'error' 
      });
    } finally {
      setCancellingOrder(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const canCancelOrder = (status: string) => {
    return status === 'PENDING' || status === 'ARRANGING';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/40">
        <Navbar />
        <div className="flex justify-center items-center min-h-screen text-theme-primary font-semibold text-lg">
          Loading order details...
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50/40">
        <Navbar />
        <div className="mt-[110px] max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="text-center py-24 bg-white border border-gray-100 rounded-[32px] shadow-sm">
            <div className="w-20 h-20 bg-theme-bg rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-theme-primary" />
            </div>
            <h3 className="text-2xl font-black text-gray-800 mb-2">Order not found</h3>
            <p className="text-theme-light mb-8 font-medium">We couldn't find the order you're looking for.</p>
            <button
              onClick={() => router.push('/client/my-orders')}
              className="px-8 py-3.5 bg-theme-primary text-white font-bold rounded-2xl hover:bg-theme-bg-hover transition-colors shadow-lg active:scale-[0.98]"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  const status = order.status as keyof typeof statusConfig;
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <div className="min-h-screen bg-gray-50/40">
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

      <div className="mt-[110px] max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-32">
        {/* Back Button */}
        <button
          onClick={() => router.push('/client/my-orders')}
          className="flex items-center gap-2 text-theme-primary hover:text-theme-bg-hover font-bold mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Orders
        </button>

        {/* Order Header */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-[28px] p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-2">
                Order #{order.id}
              </h1>
              <p className="text-sm font-medium text-theme-light">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-sm font-bold text-gray-400 uppercase tracking-tight mb-1">Total Amount</p>
              <p className="text-3xl font-black text-theme-primary">Rs. {Number(order.totalAmount).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Status */}
          <div className={`p-5 rounded-2xl ${config.bgColor} ${config.borderColor} border`}>
            <div className="flex items-center gap-3 mb-1.5">
              <StatusIcon className={`w-6 h-6 ${config.color}`} />
              <h3 className={`text-lg font-black ${config.color}`}>{config.label}</h3>
            </div>
            <p className={`text-sm font-medium ${config.color}`}>{config.description}</p>
          </div>

          {/* Tracking Info */}
          {order.trackingId && order.status === 'SHIPPING' && (
            <div className="mt-5 p-5 bg-purple-50 border border-purple-200 rounded-2xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-purple-800 mb-1">Tracking ID</p>
                  <p className="text-2xl font-black text-purple-600">{order.trackingId}</p>
                  <p className="text-sm font-medium text-purple-600 mt-1">
                    Track your package on the Domex website
                  </p>
                </div>
                <a
                  href={`https://www.domex.lk/track?id=${order.trackingId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 bg-purple-600 text-white font-bold rounded-2xl hover:bg-purple-700 transition-colors shadow-md text-center w-full sm:w-auto"
                >
                  Track Package
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Items & Address */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Order Items */}
            <div className="bg-white border border-gray-100 shadow-sm rounded-[28px] p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="p-2 bg-theme-bg rounded-xl">
                  <Package className="w-5 h-5 text-theme-primary" />
                </div>
                Order Items ({order.items.length})
              </h2>

              <div className="space-y-4">
                {order.items.map((item) => {
                  const thumbnail = item.product.images?.find(img => img.isMain)?.url || 
                                  item.product.images?.[0]?.url || 
                                  '/placeholder-baby.png';
                  return (
                    <div 
                      key={item.id} 
                      className="flex gap-4 p-4 border border-gray-100 rounded-2xl hover:border-theme-border transition-colors"
                    >
                      <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                        <img 
                          src={thumbnail} 
                          alt={item.product.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <h3 className="font-bold text-gray-800 mb-1.5 leading-snug line-clamp-2">
                          {item.product.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-bold text-theme-light">
                          <span>Qty: {item.quantity}</span>
                          <span className="hidden sm:inline">•</span>
                          <span>Price: ${Number(item.price).toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="text-right flex flex-col justify-center pl-2">
                        <p className="text-lg font-black text-theme-primary">Rs. {(Number(item.price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white border border-gray-100 shadow-sm rounded-[28px] p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="p-2 bg-theme-bg rounded-xl">
                  <MapPin className="w-5 h-5 text-theme-primary" />
                </div>
                Delivery Address
              </h2>

              <div className="bg-gray-50 p-5 rounded-2xl text-gray-700 space-y-2">
                <p className="font-bold text-gray-900">{order.address.street}</p>
                <p className="font-medium">{order.address.city}, {order.address.postalCode}</p>
                <p className="font-medium">{order.address.country}</p>
                <p className="pt-3 border-t border-gray-200 mt-3 font-medium">
                  <span className="font-bold text-gray-900">Phone:</span> {order.address.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Summary & Actions */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Payment Method */}
            <div className="bg-white border border-gray-100 shadow-sm rounded-[28px] p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="p-2 bg-theme-bg rounded-xl">
                  <CreditCard className="w-5 h-5 text-theme-primary" />
                </div>
                Payment
              </h2>

              <div className="bg-theme-bg/50 border-2 border-theme-border rounded-2xl p-5">
                <p className="font-bold text-gray-900 text-lg mb-0.5">Cash on Delivery</p>
                <p className="text-sm font-medium text-theme-primary">Pay when you receive your order</p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white border border-gray-100 shadow-sm rounded-[28px] p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>

              <div className="space-y-4 bg-gray-50 p-5 rounded-2xl mb-6">
                <div className="flex justify-between text-gray-600 font-medium text-sm">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">Rs. {(Number(order.totalAmount) - 5).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 font-medium text-sm">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-gray-900">Rs. 5.00</span>
                </div>
                <div className="flex justify-between items-center border-t border-gray-200 pt-3 mt-3">
                  <span className="font-bold text-gray-800">Total</span>
                  <span className="text-2xl font-black text-theme-primary">Rs. {Number(order.totalAmount).toFixed(2)}</span>
                </div>
              </div>

              {/* Cancel Button */}
              {canCancelOrder(order.status) && (
                <button
                  onClick={handleCancelOrder}
                  disabled={cancellingOrder}
                  className="w-full px-6 py-4 bg-white text-red-600 font-bold border-2 border-red-100 rounded-2xl hover:bg-red-50 hover:border-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  {cancellingOrder ? (
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
          </div>
        </div>
      </div>
    </div>
  );
}