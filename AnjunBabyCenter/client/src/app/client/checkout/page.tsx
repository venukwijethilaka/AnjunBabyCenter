'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, MapPin, CreditCard, CheckCircle } from 'lucide-react';
import Navbar from '@/app/client/(components)/NavBar';
import { useGetCartQuery, useCreateOrderMutation, useGetProfileQuery } from '@/state/api';

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

  // Fetch fresh user profile for address autocomplete
  const { data: profile } = useGetProfileQuery(userId?.toString() || '', {
    skip: !userId
  });

  useEffect(() => {
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!userStr) {
      router.push('/client/sign-in');
      return;
    }

    const user = JSON.parse(userStr);
    setUserId(user.id);
  }, [router]);

  // Pre-fill address when profile data loads
  useEffect(() => {
    if (profile && profile.city && profile.country && profile.postalCode && profile.phone) {
      setAddress({
        street: profile.street || '',
        city: profile.city || '',
        postalCode: profile.postalCode || '',
        country: profile.country || '',
        phone: profile.phone || '',
      });
      setUseExistingAddress(true);
    }
  }, [profile]);

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
      <div className="min-h-screen bg-gray-50/40">
        <Navbar />
        <div className="flex justify-center items-center min-h-screen text-theme-primary font-semibold text-lg">
          Loading checkout...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/40">
      <Navbar />

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-6 right-6 px-6 py-4 border shadow-2xl z-50 transition-all duration-200 font-bold text-base tracking-wide rounded-2xl ${notification.type === 'success'
            ? 'bg-theme-toggle-bg text-theme-primary border-theme-border'
            : 'bg-rose-50 border-rose-200 text-rose-700'
          }`}>
          {notification.message}
        </div>
      )}

      <div className="mt-[110px] max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-32">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-theme-primary" />
            Checkout
          </h1>
          <p className="text-theme-light mt-2 font-medium">Complete your order securely</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Address & Payment */}
          <div className="lg:col-span-2 space-y-6">

            {/* Delivery Address */}
            <div className="bg-white border border-gray-100 shadow-sm rounded-[28px] p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="p-2 bg-theme-bg rounded-xl">
                  <MapPin className="w-5 h-5 text-theme-primary" />
                </div>
                Delivery Address
              </h2>

              {useExistingAddress && (
                <div className="mb-6 p-5 bg-theme-bg border border-theme-border rounded-2xl">
                  <p className="text-sm text-theme-primary font-bold mb-2">Using saved address</p>
                  <button
                    onClick={() => setUseExistingAddress(false)}
                    className="text-sm text-theme-primary hover:text-theme-bg-hover font-bold underline transition-colors"
                  >
                    Use different address
                  </button>
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 pl-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={address.street}
                    onChange={handleInputChange}
                    className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-theme-primary outline-none transition-all placeholder:text-gray-400 font-medium"
                    placeholder="123 Main Street"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 pl-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={address.city}
                      onChange={handleInputChange}
                      className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-theme-primary outline-none transition-all placeholder:text-gray-400 font-medium"
                      placeholder="New York"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 pl-1">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={address.postalCode}
                      onChange={handleInputChange}
                      className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-theme-primary outline-none transition-all placeholder:text-gray-400 font-medium"
                      placeholder="10001"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 pl-1">
                      Country *
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={address.country}
                      onChange={handleInputChange}
                      className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-theme-primary outline-none transition-all placeholder:text-gray-400 font-medium"
                      placeholder="United States"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 pl-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={address.phone}
                      onChange={handleInputChange}
                      className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-theme-primary outline-none transition-all placeholder:text-gray-400 font-medium"
                      placeholder="+1 234 567 8900"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white border border-gray-100 shadow-sm rounded-[28px] p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="p-2 bg-theme-bg rounded-xl">
                  <CreditCard className="w-5 h-5 text-theme-primary" />
                </div>
                Payment Method
              </h2>

              <div className="bg-theme-bg/50 border-2 border-theme-border rounded-2xl p-5 cursor-pointer hover:bg-theme-bg transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full border-[3px] border-theme-primary flex items-center justify-center bg-white shadow-sm">
                    <div className="w-2.5 h-2.5 rounded-full bg-theme-primary"></div>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">Cash on Delivery</p>
                    <p className="text-sm text-theme-primary font-medium mt-0.5">Pay when you receive your order</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-100 shadow-sm rounded-[28px] p-6 sm:p-8 sticky top-32">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
                {cartItems.map((item) => {
                  const thumbnail = item.product?.images?.find(img => img.isMain)?.url ||
                    item.product?.images?.[0]?.url ||
                    '/placeholder-baby.png';
                  return (
                    <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="w-16 h-16 bg-gray-50 rounded-2xl border border-gray-100 shrink-0 overflow-hidden">
                        <img
                          src={thumbnail}
                          alt={item.product?.name || 'Product Image'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <p className="font-bold text-gray-800 text-sm line-clamp-2 leading-snug">
                          {item.product?.name || 'Product Name'}
                        </p>
                        <div className="flex items-center justify-between mt-1.5">
                          <p className="text-xs font-bold text-theme-light">
                            Qty: {item.quantity}
                          </p>
                          <p className="font-black text-theme-primary">Rs. {(Number(item.product?.price || 0) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-3 bg-gray-50 p-5 rounded-2xl mb-6">
                <div className="flex justify-between text-gray-600 font-medium text-sm">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">Rs. {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 font-medium text-sm">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-gray-900">Rs. {deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center border-t border-gray-200 pt-3 mt-3">
                  <span className="font-bold text-gray-800">Total</span>
                  <span className="text-2xl font-black text-theme-primary">Rs. {total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing || cartItems.length === 0}
                className="w-full bg-theme-primary text-white py-4 text-lg font-bold rounded-2xl hover:bg-theme-bg-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg active:scale-[0.98]"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-[3px] border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-6 h-6" />
                    Place Order
                  </>
                )}
              </button>

              <p className="text-xs font-medium text-gray-400 text-center mt-5 px-4">
                By placing this order, you agree to our <span className="underline cursor-pointer hover:text-gray-600">terms and conditions</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}