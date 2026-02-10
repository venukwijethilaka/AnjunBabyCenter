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
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex justify-center items-center min-h-screen text-pink-500 font-semibold text-lg">
          Loading order details...
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="mt-20 max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-pink-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">Order not found</h3>
            <button
              onClick={() => router.push('/client/my-orders')}
              className="mt-4 px-6 py-3 bg-pink-500 text-white font-bold rounded-md hover:bg-rose-500 transition-colors"
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

      <div className="mt-20 max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push('/client/my-orders')}
          className="flex items-center gap-2 text-pink-600 hover:text-pink-700 font-semibold mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Orders
        </button>

        {/* Order Header */}
        <div className="bg-white border border-pink-100 shadow-md rounded-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-800 mb-2">
                Order #{order.id}
              </h1>
              <p className="text-sm text-pink-400">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Total Amount</p>
              <p className="text-3xl font-extrabold text-pink-600">
                ${Number(order.totalAmount).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Status */}
          <div className={`p-4 rounded-md ${config.bgColor} ${config.borderColor} border`}>
            <div className="flex items-center gap-3 mb-2">
              <StatusIcon className={`w-6 h-6 ${config.color}`} />
              <h3 className={`text-lg font-bold ${config.color}`}>{config.label}</h3>
            </div>
            <p className={`text-sm ${config.color}`}>{config.description}</p>
          </div>

          {/* Tracking Info */}
          {order.trackingId && order.status === 'SHIPPING' && (
            <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-md">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-purple-700 mb-1">Tracking ID</p>
                  <p className="text-2xl font-extrabold text-purple-600">{order.trackingId}</p>
                  <p className="text-xs text-purple-600 mt-2">
                    Track your package on Domex website
                  </p>
                </div>
                <a
                  href={`https://www.domex.lk/track?id=${order.trackingId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-purple-600 text-white font-bold rounded-md hover:bg-purple-700 transition-colors shadow"
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
            <div className="bg-white border border-pink-100 shadow-md rounded-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-pink-500" />
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
                      className="flex gap-4 p-4 border border-pink-100 rounded-md hover:bg-pink-50/30 transition-colors"
                    >
                      <img 
                        src={thumbnail} 
                        alt={item.product.name} 
                        className="w-24 h-24 object-cover rounded-md border border-pink-100"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 mb-2">
                          {item.product.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-pink-600">
                          <span>Quantity: {item.quantity}</span>
                          <span>•</span>
                          <span>Price: ${Number(item.price).toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-pink-600">
                          ${(Number(item.price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white border border-pink-100 shadow-md rounded-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-pink-500" />
                Delivery Address
              </h2>

              <div className="text-gray-700 space-y-2">
                <p className="font-semibold">{order.address.street}</p>
                <p>{order.address.city}, {order.address.postalCode}</p>
                <p>{order.address.country}</p>
                <p className="pt-2 border-t border-pink-100 mt-2">
                  <span className="font-semibold">Phone:</span> {order.address.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Summary & Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Payment Method */}
            <div className="bg-white border border-pink-100 shadow-md rounded-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-pink-500" />
                Payment
              </h2>

              <div className="bg-pink-50 border border-pink-200 rounded-md p-4">
                <p className="font-bold text-gray-800 mb-1">Cash on Delivery</p>
                <p className="text-sm text-pink-600">Pay when you receive your order</p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white border border-pink-100 shadow-md rounded-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>

              <div className="space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">
                    ${(Number(order.totalAmount) - 5).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Delivery Fee</span>
                  <span className="font-semibold">$5.00</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-800 border-t border-pink-200 pt-3 mt-3">
                  <span>Total</span>
                  <span className="text-pink-600">${Number(order.totalAmount).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Cancel Button */}
            {canCancelOrder(order.status) && (
              <button
                onClick={handleCancelOrder}
                disabled={cancellingOrder}
                className="w-full px-6 py-4 bg-white text-red-600 font-bold border-2 border-red-500 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow"
              >
                {cancellingOrder ? (
                  <>
                    <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
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
  );
}
