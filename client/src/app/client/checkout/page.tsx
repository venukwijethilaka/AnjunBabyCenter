'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, MapPin, CreditCard, CheckCircle } from 'lucide-react';
import Navbar from '@/app/client/(components)/NavBar';
import { useGetCartQuery } from '@/state/api';
import { useCreateOrderMutation } from '@/state/api';
interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<number | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // Address form state
  const [address, setAddress] = useState<Address>({
    street: '',
    city: '',
    postalCode: '',
    country: '',
    phone: '',
  });

  const [useExistingAddress, setUseExistingAddress] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch user data
  useEffect(() => {
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!userStr) {
      router.push('/client/sign-in');
      return;
    }
    
    const user = JSON.parse(userStr);
    setUserId(user.id);

    // Pre-fill address if available
    if (user.city && user.country && user.postalCode && user.phone) {
      setAddress({
        street: user.bio || '',
        city: user.city,
        postalCode: user.postalCode,
        country: user.country,
        phone: user.phone,
      });
      setUseExistingAddress(true);
    }
  }, [router]);

  const { data: cartData, isLoading: cartLoading } = useGetCartQuery(userId!, {
    skip: !userId,
  });

  const [createOrder] = useCreateOrderMutation();

  // Calculate total
  const cartItems = cartData?.items || [];
  const subtotal = cartItems.reduce((sum, item) => {
    return sum + Number(item.product?.price || 0) * item.quantity;
  }, 0);
  const deliveryFee = subtotal > 0 ? 5.0 : 0;
  const total = subtotal + deliveryFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  const validateAddress = () => {
    if (!address.street || !address.city || !address.postalCode || !address.country || !address.phone) {
      setNotification({ message: 'Please fill in all address fields', type: 'error' });
      setTimeout(() => setNotification(null), 3000);
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateAddress()) return;
    if (cartItems.length === 0) {
      setNotification({ message: 'Your cart is empty', type: 'error' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        userId: userId!,
        address,
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: Number(item.product?.price || 0),
        })),
        totalAmount: total,
      };

      await createOrder(orderData).unwrap();
      
      // Redirect to confirmation page
      router.push('/client/order-confirmation');
    } catch (error: any) {
      console.error('Order creation failed:', error);
      setNotification({ 
        message: error?.data?.message || 'Failed to place order. Please try again.', 
        type: 'error' 
      });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex justify-center items-center min-h-screen text-pink-500 font-semibold text-lg">
          Loading checkout...
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
            <ShoppingBag className="w-8 h-8 text-pink-500" />
            Checkout
          </h1>
          <p className="text-pink-400 mt-2">Complete your order</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Address & Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="bg-white border border-pink-100 shadow-md rounded-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-pink-500" />
                Delivery Address
              </h2>

              {useExistingAddress && (
                <div className="mb-4 p-4 bg-pink-50 border border-pink-200 rounded-md">
                  <p className="text-sm text-pink-700 font-semibold mb-2">Using saved address</p>
                  <button
                    onClick={() => setUseExistingAddress(false)}
                    className="text-sm text-pink-600 hover:text-pink-700 font-semibold underline"
                  >
                    Use different address
                  </button>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={address.street}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-pink-200 rounded-md focus:ring-2 focus:ring-pink-300 focus:border-pink-400 outline-none transition-all"
                    placeholder="123 Main Street"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={address.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-pink-200 rounded-md focus:ring-2 focus:ring-pink-300 focus:border-pink-400 outline-none transition-all"
                      placeholder="New York"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={address.postalCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-pink-200 rounded-md focus:ring-2 focus:ring-pink-300 focus:border-pink-400 outline-none transition-all"
                      placeholder="10001"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={address.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-pink-200 rounded-md focus:ring-2 focus:ring-pink-300 focus:border-pink-400 outline-none transition-all"
                    placeholder="United States"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={address.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-pink-200 rounded-md focus:ring-2 focus:ring-pink-300 focus:border-pink-400 outline-none transition-all"
                    placeholder="+1 234 567 8900"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white border border-pink-100 shadow-md rounded-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-pink-500" />
                Payment Method
              </h2>
              
              <div className="bg-pink-50 border border-pink-200 rounded-md p-4">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-pink-500 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Cash on Delivery</p>
                    <p className="text-sm text-pink-600">Pay when you receive your order</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-pink-100 shadow-md rounded-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                {cartItems.map((item) => {
                  const thumbnail = item.product?.images?.find(img => img.isMain)?.url || 
                                  item.product?.images?.[0]?.url || 
                                  '/placeholder-baby.png';
                  return (
                    <div key={item.id} className="flex gap-3 pb-3 border-b border-pink-100">
                      <img 
                        src={thumbnail} 
                        alt={item.product?.name || 'Product Image'} 
                        className="w-16 h-16 object-cover rounded-md border border-pink-100"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-sm line-clamp-2">
                          {item.product?.name || 'Product Name'}
                        </p>
                        <p className="text-xs text-pink-600 mt-1">
                          Qty: {item.quantity} × ${Number(item.product?.price || 0).toFixed(2)}
                        </p>
                      </div>
                      <p className="font-bold text-pink-600">
                        ${(Number(item.product?.price || 0) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-2 border-t border-pink-200 pt-4">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Delivery Fee</span>
                  <span className="font-semibold">${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-800 border-t border-pink-200 pt-2 mt-2">
                  <span>Total</span>
                  <span className="text-pink-600">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing || cartItems.length === 0}
                className="w-full mt-6 bg-pink-500 text-white py-4 font-bold rounded-md hover:bg-rose-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow focus:outline-none focus:ring-2 focus:ring-pink-300"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Place Order
                  </>
                )}
              </button>

              <p className="text-xs text-pink-400 text-center mt-4">
                By placing this order, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
