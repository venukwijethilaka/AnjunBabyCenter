"use client";

import React, { useState, useEffect } from "react";
import { Heart, X, ShoppingCart, Trash2 } from "lucide-react";

export type WishlistItem = {
  id: number;
  wishlistItemId?: number;
  name: string;
  price: number;
  images?: { url: string }[];
  description?: string;
};

interface WishlistSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const WishlistSidebar = ({ isOpen, onClose }: WishlistSidebarProps) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  // Sync animation visibility
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      fetchWishlist();
      document.body.style.overflow = "hidden";
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      document.body.style.overflow = "unset";
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const fetchWishlist = async () => {
    try {
      const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (!userStr) return;
      const user = JSON.parse(userStr);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/wishlist/${user.id}`);
      
      if (response.ok) {
        const data = await response.json();
        const items = data.items?.map((item: any) => ({
          id: item.productId,
          wishlistItemId: item.id,
          name: item.product?.name || 'Product',
          price: Number(item.product?.price) || 0,
          images: item.product?.images || [],
        })) || [];
        setWishlistItems(items);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (id: number) => {
    // ... (Keep your handleAddToCart logic)
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleDelete = async (id: number) => {
    const item = wishlistItems.find(i => i.id === id);
    if (!item?.wishlistItemId) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/wishlist/${item.wishlistItemId}`, {
        method: 'DELETE'
      });
      if (res.ok) setWishlistItems(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (!isVisible && !isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex justify-end">
      {/* SHARP CLICKABLE BACKGROUND */}
      <div 
        className={`absolute inset-0 bg-black/10 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* SIDEBAR PANEL */}
      <aside 
        className={`relative z-10 w-full max-w-[380px] bg-white h-screen shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header - Small Font Style */}
        <div className="p-5 border-b flex items-center justify-between">
          <div>
            <h2 className="text-[13px] font-black uppercase tracking-tight text-gray-800">Your Wishlist</h2>
            <p className="text-[10px] font-bold text-pink-500">{wishlistItems.length} saved items</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
             <div className="flex justify-center pt-10"><div className="w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" /></div>
          ) : wishlistItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center pt-20 opacity-40">
              <Heart className="w-8 h-8 mb-2" />
              <p className="text-[11px] font-bold uppercase tracking-widest">Wishlist is empty</p>
            </div>
          ) : (
            wishlistItems.map((item) => (
              <div key={item.id} className="flex gap-3 pb-3 border-b border-gray-50">
                <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                  <img src={item.images?.[0]?.url} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <h3 className="text-[11px] font-bold text-gray-700 truncate">{item.name}</h3>
                    <button onClick={() => handleDelete(item.id)} className="text-gray-300 hover:text-rose-500">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[12px] font-black text-pink-600">${item.price.toFixed(2)}</p>
                    <button 
                      onClick={() => handleAddToCart(item.id)}
                      className="flex items-center gap-1 bg-pink-50 text-pink-500 px-2 py-1 rounded-md text-[10px] font-bold hover:bg-pink-500 hover:text-white transition-colors"
                    >
                      <ShoppingCart className="w-3 h-3" /> Add
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t">
          <button 
            onClick={onClose}
            className="w-full text-center text-[10px] font-bold text-gray-400 hover:text-pink-500 uppercase tracking-widest"
          >
            Return to Shopping
          </button>
        </div>
      </aside>
    </div>
  );
};

export default WishlistSidebar;