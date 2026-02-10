'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Package } from 'lucide-react';
import Navbar from '@/app/client/(components)/NavBar';

export default function OrderConfirmationPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear cart after successful order
    window.dispatchEvent(new Event('cartUpdated'));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="mt-[70px] max-w-2xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-white border border-pink-100 shadow-lg rounded-md p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-pink-500" />
            </div>
          </div>

          <h1 className="text-3xl font-extrabold text-gray-800 mb-4">
            Order Placed Successfully!
          </h1>
          
          <p className="text-pink-600 text-lg mb-8">
            Thank you for your order. We'll start preparing it right away!
          </p>

          <div className="bg-pink-50 border border-pink-200 rounded-md p-6 mb-8">
            <div className="flex items-start gap-4">
              <Package className="w-6 h-6 text-pink-500 mt-1 flex-shrink-0" />
              <div className="text-left">
                <h3 className="font-bold text-gray-800 mb-2">What's Next?</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• You'll receive a confirmation via email</li>
                  <li>• Track your order status in "My Orders"</li>
                  <li>• We'll notify you when your order is shipped</li>
                  <li>• Payment will be collected upon delivery</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/client/my-orders')}
              className="px-8 py-3 bg-pink-500 text-white font-bold rounded-md hover:bg-rose-500 transition-colors shadow focus:outline-none focus:ring-2 focus:ring-pink-300"
            >
              View My Orders
            </button>
            
            <button
              onClick={() => router.push('/client/product')}
              className="px-8 py-3 bg-white text-pink-600 font-bold border-2 border-pink-500 rounded-md hover:bg-pink-50 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-300"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
