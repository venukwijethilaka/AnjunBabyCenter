"use client";
import React from 'react';
import { ShoppingCart, Package } from 'lucide-react';

const OrderPage = () => {
  // This is a placeholder page.
  // In the future, you would fetch orders from your API here.
  // const { data: orders, isLoading, isError } = useGetOrdersQuery();

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-8 space-y-6">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingCart className="text-gray-500" size={28} />
            <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
          </div>
          {/* Action buttons like "Export" could go here in the future */}
        </header>

        <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col items-center justify-center text-center py-16">
                <Package size={48} className="text-gray-300 mb-4" />
                <h2 className="text-xl font-bold text-gray-700">Coming Soon!</h2>
                <p className="text-gray-500 mt-2 max-w-md">
                    The order management section is currently under construction. You will soon be able to view, track, and manage all customer orders from this dashboard.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;