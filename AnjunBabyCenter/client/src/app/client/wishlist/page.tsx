"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Heart, X, ShoppingCart, Trash2, HeartOff, XCircle } from "lucide-react";
import { useAddToCartMutation } from "@/state/api";
import WishlistProductCard from "./productCard";

// ─── Toast System ────────────────────────────────────────────────────────────
type Toast = {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
  thumbnail?: string;
  icon?: React.ReactNode;
};

let toastCounter = 0;

function ToastStack({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) {
  return (
    <div className="fixed top-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3.5 rounded-2xl shadow-2xl border backdrop-blur-sm
            scale-100 opacity-100 animate-in slide-in-from-right-8 duration-300
            ${t.type === 'success' ? 'bg-theme-toggle-bg border-theme-border text-theme-primary' :
              t.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-700' :
                'bg-blue-50 border-blue-200 text-blue-700'
            }`}
        >
          {t.thumbnail ? (
            <img src={t.thumbnail} alt="" className="w-10 h-10 rounded-xl object-cover bg-white shadow-sm" />
          ) : (
            <div className="p-1.5 bg-white/50 rounded-xl">
              {t.icon || (t.type === 'success' ? <ShoppingCart className="w-5 h-5 fill-current" /> :
                t.type === 'error' ? <XCircle className="w-5 h-5" /> : null)}
            </div>
          )}
          <p className="font-bold text-sm pr-4">{t.message}</p>
          <button onClick={() => onDismiss(t.id)} className="p-1 hover:bg-black/5 rounded-lg transition-colors absolute right-2 top-1/2 -translate-y-1/2">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

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

  const [addToCartMutation] = useAddToCartMutation();
  const [addingToCart, setAddingToCart] = useState<number | null>(null);

  // ── Toasts ──
  const [toasts, setToasts] = useState<Toast[]>([]);
  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = ++toastCounter;
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);
  const dismissToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

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
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/wishlist/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

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

  const handleAddToCart = async (product: WishlistItem) => {
    try {
      const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (!userStr) {
        addToast({ message: 'Please log in to add items to cart', type: 'error', icon: <XCircle className="w-5 h-5" /> });
        return;
      }

      const user = JSON.parse(userStr);
      setAddingToCart(product.id);

      await addToCartMutation({ userId: Number(user.id), productId: product.id, quantity: 1 }).unwrap();

      const thumbnail = product.images?.find(img => img.isMain)?.url || product.images?.[0]?.url;
      addToast({ message: `${product.name} added to cart!`, type: 'success', thumbnail });

      window.dispatchEvent(new Event('cartUpdated'));
    } catch {
      addToast({ message: 'Failed to add to cart. Please try again.', type: 'error', icon: <XCircle className="w-5 h-5" /> });
    } finally {
      setAddingToCart(null);
    }
  };

  const handleDelete = async (id: number) => {
    const item = wishlistItems.find(i => i.id === id);
    if (!item?.wishlistItemId) return;
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/wishlist/${item.wishlistItemId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
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
      <ToastStack toasts={toasts} onDismiss={dismissToast} />
      {/* Backdrop - Matches Cart style */}
      <div
        className={`absolute inset-0 bg-black/30 backdrop-blur-[2px] transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"
          }`}
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full">
        <aside
          className={`relative w-screen max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          {/* Header - Identical to Cart Header */}
          <div className="px-6 py-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-6 h-6 text-theme-primary fill-theme-primary" />
                <h2 className="text-xl font-extrabold text-gray-800">My Wishlist</h2>
                <span className="bg-theme-toggle-bg text-theme-primary text-xs px-2 py-0.5 rounded-full font-bold">
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
              <div className="h-full flex items-center justify-center text-theme-primary">
                <div className="w-8 h-8 border-3 border-current border-t-transparent rounded-full animate-spin" />
              </div>
            ) : wishlistItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <HeartOff className="w-16 h-16 mb-4 opacity-20" />
                <p className="font-semibold text-sm uppercase tracking-wider">Your wishlist is empty</p>
                <button onClick={onClose} className="mt-2 text-theme-primary text-sm font-bold hover:underline">
                  Find something you love
                </button>
              </div>
            ) : (
              wishlistItems.map((item) => (
                <WishlistProductCard
                  key={item.id}
                  item={item}
                  onAddToCart={() => handleAddToCart(item)}
                  onDelete={() => handleDelete(item.id)}
                />
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 bg-white p-6">
            <button
              onClick={onClose}
              className="w-full bg-theme-bg text-theme-primary py-4 rounded-xl font-bold transition-all hover:bg-theme-border active:scale-[0.99] uppercase text-xs tracking-widest"
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