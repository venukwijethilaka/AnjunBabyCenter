"use client";

import React, { useState } from "react";
import { ShoppingCart, X, CreditCard, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetCartQuery, useAddToCartMutation, useDeleteCartItemMutation } from "@/state/api";
import CartProductCard from "./productCard";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartPage = ({ isOpen, onClose }: CartProps) => {
  const router = useRouter();
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const userStr = typeof window !== 'undefined' ? (localStorage.getItem('user') || sessionStorage.getItem('user')) : null;
  const user = userStr ? JSON.parse(userStr) : null;
  const userId = user?.id;

  const { data: cartData, isLoading, refetch } = useGetCartQuery(userId, { 
    skip: !userId || !isOpen,
    refetchOnMountOrArgChange: true 
  });
  
  const [addToCart] = useAddToCartMutation();
  const [deleteCartItem] = useDeleteCartItemMutation();

  if (!isOpen) return null;

  const handleQuantityChange = async (productId: number, delta: number) => {
    if (!userId) return;
    try {
      await addToCart({ userId, productId, quantity: delta }).unwrap();
      await refetch(); 
      setNotification({ message: 'Cart updated!', type: 'success' });
      setTimeout(() => setNotification(null), 2000);
    } catch (error: any) {
      setNotification({ message: error.data?.message || '❌ Stock limit reached', type: 'error' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  function handleDeleteCartItem(cartItemId: number) {
    deleteCartItem({ cartItemId }).unwrap().then(async () => {
      await refetch();
      setNotification({ message: 'Item removed', type: 'success' });
      setTimeout(() => setNotification(null), 2000);
    }).catch(() => {
      setNotification({ message: 'Failed to remove item', type: 'error' });
      setTimeout(() => setNotification(null), 3000);
    });
  }

  const subtotal = cartData?.items?.reduce(
    (sum: number, item: any) => sum + (Number(item.product?.price || 0) * item.quantity),
    0
  ) || 0;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-6 right-6 px-6 py-3 rounded-lg shadow-2xl z-[110] border transition-all animate-in fade-in slide-in-from-top-4 ${
          notification.type === 'success' ? 'bg-pink-50 border-pink-200 text-pink-700' : 'bg-rose-50 border-rose-200 text-rose-700'
        }`}>
          <p className="font-bold text-sm">{notification.message}</p>
        </div>
      )}

      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 flex max-w-full">
        <aside className="relative w-screen max-w-md transform transition-all duration-300 ease-in-out">
          <div className="flex h-full flex-col bg-white shadow-2xl">
            
            {/* Header - Matches Homepage style */}
            <div className="px-6 py-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-6 h-6 text-pink-500" />
                  <h2 className="text-xl font-extrabold text-gray-800">My Cart</h2>
                  <span className="bg-pink-100 text-pink-600 text-xs px-2 py-0.5 rounded-full font-bold">
                    {cartData?.items?.length || 0}
                  </span>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-gray-50/30">
              {isLoading ? (
                <div className="h-full flex flex-col items-center justify-center text-pink-500">
                  <div className="w-8 h-8 border-3 border-current border-t-transparent rounded-full animate-spin" />
                </div>
              ) : !cartData?.items?.length ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <ShoppingCart className="w-16 h-16 mb-4 opacity-20" />
                  <p className="font-semibold">Your bag is empty</p>
                  <button onClick={onClose} className="mt-2 text-pink-500 text-sm font-bold hover:underline">
                    Start Shopping
                  </button>
                </div>
              ) : (
                cartData.items.map((item: any) => (
                  <CartProductCard
                    key={item.id}
                    item={{
                      id: item.productId,
                      name: item.product?.name,
                      price: item.product?.price,
                      quantity: item.quantity,
                      images: item.product?.images
                    }}
                    onQuantityChange={(delta: number) => handleQuantityChange(item.productId, delta)}
                    onDelete={() => handleDeleteCartItem(item.id)}
                  />
                ))
              )}
            </div>

            {/* Footer - Simple & Clean */}
            <div className="border-t border-gray-100 bg-white p-6 space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-tight">Total Amount</p>
                  <span className="text-2xl font-extrabold text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-400 italic font-medium">Taxes included</p>
              </div>

              <button 
                onClick={() => { onClose(); router.push('/client/checkout'); }}
                className="w-full bg-pink-500 hover:bg-rose-500 text-white py-4 rounded-xl font-bold transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                Checkout Now
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CartPage;