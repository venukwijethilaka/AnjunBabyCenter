"use client";

import React, { useState, useEffect } from "react";
import { Heart, X, ShoppingCart, Trash2, HeartOff } from "lucide-react";
import WishlistProductCard from "./productCard";

export type WishlistItem = {
  id: number;
  wishlistItemId?: number;
  name: string;
  price: number;
  images?: { url: string; isMain: boolean }[];
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
      setLoading(true);
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
          description: item.product?.description
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
    // Logic for adding to cart goes here
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
      window.dispatchEvent(new Event('wishlistUpdated'));
    } catch (err) {
      console.error(err);
    }
  };

  if (!isVisible && !isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* Backdrop - Matches Cart style */}
      <div 
        className={`absolute inset-0 bg-black/30 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full">
        <aside 
          className={`relative w-screen max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header - Identical to Cart Header */}
          <div className="px-6 py-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
                <h2 className="text-xl font-extrabold text-gray-800">My Wishlist</h2>
                <span className="bg-pink-100 text-pink-600 text-xs px-2 py-0.5 rounded-full font-bold">
                  {wishlistItems.length}
                </span>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-gray-50/30">
            {loading ? (
               <div className="h-full flex items-center justify-center text-pink-500">
                  <div className="w-8 h-8 border-3 border-current border-t-transparent rounded-full animate-spin" />
               </div>
            ) : wishlistItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <HeartOff className="w-16 h-16 mb-4 opacity-20" />
                <p className="font-semibold text-sm uppercase tracking-wider">Your wishlist is empty</p>
                <button onClick={onClose} className="mt-2 text-pink-500 text-sm font-bold hover:underline">
                  Find something you love
                </button>
              </div>
            ) : (
              wishlistItems.map((item) => (
                <WishlistProductCard 
                  key={item.id} 
                  item={item} 
                  onAddToCart={() => handleAddToCart(item.id)}
                  onDelete={() => handleDelete(item.id)}
                />
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 bg-white p-6">
            <button 
              onClick={onClose}
              className="w-full bg-pink-50 text-pink-500 py-4 rounded-xl font-bold transition-all hover:bg-pink-100 active:scale-[0.99] uppercase text-xs tracking-widest"
            >
              Continue Shopping
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default WishlistSidebar;