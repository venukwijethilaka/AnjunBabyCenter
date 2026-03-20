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
    <div className="min-h-screen bg-gray-50/40">
      <Navbar />
      
      <div className="mt-[110px] max-w-2xl mx-auto px-4 sm:px-6 py-16 pb-32">
        <div className="bg-white border border-gray-100 shadow-xl rounded-[32px] p-8 sm:p-12 text-center animate-in fade-in zoom-in duration-500">
          
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-theme-bg rounded-full flex items-center justify-center shadow-inner">
              <CheckCircle className="w-12 h-12 text-theme-primary" />
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-4 tracking-tight">
            Order Placed Successfully!
          </h1>
          
          <p className="text-theme-primary font-bold text-lg mb-10">
            Thank you for your order. We'll start preparing it right away!
          </p>

          <div className="bg-theme-bg border border-theme-border rounded-3xl p-6 sm:p-8 mb-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
              <div className="p-4 bg-white rounded-2xl shadow-sm shrink-0">
                <Package className="w-8 h-8 text-theme-primary" />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="font-bold text-gray-900 text-lg mb-3">What's Next?</h3>
                <ul className="text-sm font-medium text-gray-600 space-y-2.5">
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
              className="px-8 py-4 bg-theme-primary text-white font-bold rounded-2xl hover:bg-theme-bg-hover transition-colors shadow-lg active:scale-[0.98] flex-1"
            >
              View My Orders
            </button>
            
            <button
              onClick={() => router.push('/client/product')}
              className="px-8 py-4 bg-white text-theme-primary font-bold border-2 border-theme-border hover:border-theme-primary rounded-2xl hover:bg-theme-bg transition-colors active:scale-[0.98] flex-1"
            >
              Continue Shopping
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}