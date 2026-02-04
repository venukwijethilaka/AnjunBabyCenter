"use client";

import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import WishlistProductCard, { WishlistItem } from "./productCard";
import { useRouter } from "next/navigation";

type Props = {};

const page = (props: Props) => {
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Fetch wishlist items from API
  const fetchWishlist = async () => {
    try {
      const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (!userStr) {
        setWishlistItems([]);
        setLoading(false);
        return;
      }

      const user = JSON.parse(userStr);
      const userId = user.id;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/wishlist/${userId}`
      );
      
      if (response.ok) {
        const data = await response.json();
        // Transform API response to WishlistItem format
        const items = data.items?.map((item: any) => {
          return {
            id: item.productId,
            wishlistItemId: item.id,
            name: item.product?.name || 'Product',
            price: Number(item.product?.price) || 0,
            images: item.product?.images || [],
            description: item.product?.description || '',
          };
        }) || [];
        setWishlistItems(items);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchWishlist();

    // Poll wishlist every 1 second for instant updates
    const pollInterval = setInterval(() => {
      fetchWishlist();
    }, 30000);

    // Also listen for wishlistUpdated event
    const handleWishlistUpdate = () => {
      console.log('🔄 Wishlist update event detected - refetching immediately...');
      fetchWishlist();
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, []);

  const handleAddToCart = async (id: number) => {
    try {
      const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (!userStr) {
        setNotification({ message: '❌ Please login first', type: 'error' });
        setTimeout(() => setNotification(null), 3000);
        return;
      }

      const user = JSON.parse(userStr);
      const userId = user.id;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/cart`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, productId: id, quantity: 1 }),
        }
      );

      if (response.ok) {
        setNotification({ message: '✓ Added to cart!', type: 'success' });
        setTimeout(() => setNotification(null), 2000);
        // Dispatch cart update event
        window.dispatchEvent(new Event('cartUpdated'));
      } else {
        const error = await response.json();
        setNotification({ message: error.message || '❌ Could not add to cart', type: 'error' });
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      setNotification({ message: '❌ Failed to add to cart', type: 'error' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      // Find the wishlist item to get wishlistItemId
      const wishlistItem = wishlistItems.find(item => item.id === id);
      if (!wishlistItem?.wishlistItemId) return;

      // Delete from backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/wishlist/${wishlistItem.wishlistItemId}`,
        { method: 'DELETE' }
      );

      if (response.ok) {
        // Remove from local state only after successful deletion
        setWishlistItems((items) => items.filter((item) => item.id !== id));
        setNotification({ message: '✓ Removed from wishlist', type: 'success' });
        setTimeout(() => setNotification(null), 2000);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      setNotification({ message: '❌ Failed to remove from wishlist', type: 'error' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-yellow-50 to-blue-50 relative overflow-hidden">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-6 right-6 px-6 py-4 rounded-xl shadow-lg z-50 transition-all duration-300 ${
          notification.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-pink-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-yellow-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Overlay + Sidebar Wishlist */}
      <main className="fixed inset-0 z-10 flex justify-end p-4 sm:p-8">
        <div 
          className="absolute inset-0 bg-black/25" 
          onClick={() => router.back()} 
        />

        <aside className="relative z-10 w-full max-w-2xl bg-white/85 rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-white/60">
          {/* Sidebar Header */}
          <div className="bg-gradient-to-r from-pink-400 via-pink-500 to-rose-400 px-6 py-6 border-b border-pink-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-white/80 font-semibold mb-2">Anjun Baby Center</p>
                <h2 className="text-3xl font-bold text-white">Your Wishlist</h2>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-white font-semibold">
                  <Heart className="w-5 h-5" />
                  <span>{wishlistItems.length}</span>
                </div>
                <button 
                  onClick={() => router.back()}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                  aria-label="Close wishlist"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Wishlist Content */}
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
              <Heart className="w-12 h-12 text-gray-400 mb-3 animate-spin" />
              <p className="text-lg font-bold text-gray-600">Loading wishlist...</p>
            </div>
          ) : wishlistItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
              <Heart className="w-12 h-12 text-gray-400 mb-3" />
              <p className="text-lg font-bold text-gray-600">Your wishlist is empty</p>
              <p className="text-gray-500 text-sm">Save your favorite baby products!</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                {wishlistItems.map((item) => (
                  <WishlistProductCard
                    key={item.id}
                    item={item}
                    onAddToCart={() => handleAddToCart(item.id)}
                    onDelete={() => handleDelete(item.id)}
                  />
                ))}
              </div>


            </>
          )}
        </aside>
      </main>
    </div>
  );
};

export default page;
