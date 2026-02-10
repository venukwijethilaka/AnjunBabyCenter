"use client";

import React, { useState } from "react";
import { ShoppingCart, X, CreditCard } from "lucide-react";
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

  // 1. Destructure 'refetch' from the query hook
  const { data: cartData, isLoading, refetch } = useGetCartQuery(userId, { 
    skip: !userId || !isOpen,
    refetchOnMountOrArgChange: true // Optional: ensures fresh data whenever sidebar opens
  });
  
  const [addToCart] = useAddToCartMutation();
  const [deleteCartItem] = useDeleteCartItemMutation();

  if (!isOpen) return null;

  // 2. Updated Quantity Change Logic
  const handleQuantityChange = async (productId: number, delta: number) => {
    if (!userId) return;
    try {
      // We wait for the API to succeed
      await addToCart({ userId, productId, quantity: delta }).unwrap();
      
      // TRIGGER REFRESH
      await refetch(); 
      
      setNotification({ message: 'Cart updated!', type: 'success' });
      setTimeout(() => setNotification(null), 2000);
    } catch (error: any) {
      setNotification({ 
        message: error.data?.message || '❌ Stock limit reached', 
        type: 'error' 
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  // 3. Updated Delete Logic
  function handleDeleteCartItem(cartItemId: number) {
    deleteCartItem({ cartItemId })
      .unwrap()
      .then(async () => {
        // TRIGGER REFRESH
        await refetch();
        
        setNotification({ message: 'Item removed from cart!', type: 'success' });
        setTimeout(() => setNotification(null), 2000);
      })
      .catch((error: any) => {
        setNotification({ 
          message: error.data?.message || '❌ Failed to remove item', 
          type: 'error' 
        });
        setTimeout(() => setNotification(null), 3000);
      });
  }

  const subtotal = cartData?.items?.reduce(
    (sum: number, item: any) => sum + (Number(item.product?.price || 0) * item.quantity),
    0
  ) || 0;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {notification && (
        <div className={`fixed top-6 right-6 px-6 py-4 rounded-xl shadow-lg z-60 transition-all ${
          notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {notification.message}
        </div>
      )}

      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <aside className="relative w-screen max-w-2xl transform transition-transform duration-500 ease-in-out">
          <div className="flex h-full flex-col overflow-y-scroll bg-white/95 shadow-2xl border-l border-white/60">
            
            <div className="bg-gradient-to-r from-pink-400 via-pink-500 to-rose-400 px-6 py-8 text-white shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/80 font-black mb-1">Anjun Baby Center</p>
                  <h2 className="text-3xl font-black">Your Cart</h2>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors outline-none">
                  <X className="w-8 h-8" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
              {isLoading ? (
                <div className="h-full flex flex-col items-center justify-center text-pink-400">
                  <div className="w-10 h-10 border-4 border-current border-t-transparent rounded-full animate-spin" />
                  <p className="mt-4 font-bold animate-pulse">Fetching your treats...</p>
                </div>
              ) : !cartData?.items?.length ? (
                <div className="h-full flex flex-col items-center justify-center opacity-30 text-gray-500">
                  <ShoppingCart className="w-20 h-20 mb-4" />
                  <p className="font-black uppercase tracking-widest text-xl">Bag is Empty</p>
                  <button onClick={onClose} className="mt-4 text-pink-500 font-bold underline">Continue Shopping</button>
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

            <div className="border-t border-gray-100 bg-white px-8 py-8 space-y-4 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Subtotal</p>
                  <span className="text-3xl font-black text-pink-600">${subtotal.toFixed(2)}</span>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Items</p>
                  <p className="font-bold text-gray-700">{cartData?.items?.length || 0}</p>
                </div>
              </div>

              <button 
                onClick={() => { onClose(); router.push('/client/checkout'); }}
                className="w-full bg-gray-900 hover:bg-pink-500 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-3"
              >
                <CreditCard className="w-5 h-5" />
                Secure Checkout
              </button>
              <p className="text-center text-[10px] text-gray-400 font-medium">Shipping and taxes calculated at checkout</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CartPage;