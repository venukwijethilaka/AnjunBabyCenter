"use client";

import React, { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import CartProductCard, { CartItem } from "./productCard";

type Props = {};

const page = (props: Props) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Fetch cart items from API
  const fetchCart = async () => {
    try {
      const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (!userStr) {
        setCartItems([]);
        setLoading(false);
        return;
      }

      const user = JSON.parse(userStr);
      const userId = user.id;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/cart/${userId}`
      );
      
      if (response.ok) {
        const data = await response.json();
        // Transform API response to CartItem format
        const items = data.items?.map((item: any) => {
          // Get image from product images array
          const productImage = item.product?.images?.[0]?.url || '/images/placeholder.jpg';
          return {
            id: item.productId,
            cartItemId: item.id,
            name: item.product?.name || 'Product',
            price: Number(item.product?.price) || 0,
            quantity: item.quantity,
            image: productImage,
            stockQuantity: item.product?.quantity || 0,
          };
        }) || [];
        setCartItems(items);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchCart();

    // Poll cart every 1 second for instant updates
    const pollInterval = setInterval(() => {
      fetchCart();
    }, 1000);

    // Also listen for cartUpdated event
    const handleCartUpdate = () => {
      console.log('🔄 Cart update event detected - refetching immediately...');
      fetchCart();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const handleQuantityChange = async (id: number, cartItemId: number | undefined, delta: number) => {
    if (!cartItemId) return;

    const currentItem = cartItems.find(item => item.id === id);
    if (!currentItem) return;

    const newQuantity = Math.max(1, currentItem.quantity + delta);

    try {
      // Update on backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/cart/${cartItemId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantity: newQuantity }),
        }
      );

      if (response.ok) {
        // Optimistically update UI
        setCartItems((items) =>
          items.map((item) =>
            item.id === id
              ? { ...item, quantity: newQuantity }
              : item
          )
        );
        setNotification({ message: 'Quantity updated!', type: 'success' });
        setTimeout(() => setNotification(null), 2000);
      } else {
        const error = await response.json();
        const errorMsg = error.message || 'Could not update quantity';
        
        // Show red error message
        setNotification({ 
          message: errorMsg.includes('stock') ? '❌ Out of Stock - Not enough quantity available' : errorMsg, 
          type: 'error' 
        });
        setTimeout(() => setNotification(null), 3000);
        
        // Refetch if there was an error
        fetchCart();
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      setNotification({ 
        message: '❌ Failed to update quantity', 
        type: 'error' 
      });
      setTimeout(() => setNotification(null), 3000);
      // Refetch on error
      fetchCart();
    }
  };

  const handleDelete = async (id: number) => {
    try {
      // Find the cart item to get cartItemId
      const cartItem = cartItems.find(item => item.id === id);
      if (!cartItem?.cartItemId) return;

      // Delete from backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/cart/${cartItem.cartItemId}`,
        { method: 'DELETE' }
      );

      if (response.ok) {
        // Remove from local state only after successful deletion
        setCartItems((items) => items.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

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

      {/* Overlay + Sidebar Cart */}
      <main className="fixed inset-0 z-10 flex justify-end p-4 sm:p-8">
        <div className="absolute inset-0 bg-black/25 backdrop-blur-sm" />

        <aside className="relative z-10 w-full max-w-lg bg-white/85 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-white/60">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-pink-100">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">Anjun Baby Center</p>
              <h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ShoppingCart className="w-4 h-4" />
              <span>{cartItems.length} items</span>
            </div>
          </div>

          {/* Cart Content */}
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
              <ShoppingCart className="w-12 h-12 text-gray-400 mb-3 animate-spin" />
              <p className="text-lg font-bold text-gray-600">Loading cart...</p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
              <ShoppingCart className="w-12 h-12 text-gray-400 mb-3" />
              <p className="text-lg font-bold text-gray-600">Your cart is empty</p>
              <p className="text-gray-500 text-sm">Add some adorable baby products!</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                {cartItems.map((item) => (
                  <CartProductCard
                    key={item.id}
                    item={item}
                    onQuantityChange={(delta) => handleQuantityChange(item.id, item.cartItemId, delta)}
                    onDelete={() => handleDelete(item.id)}
                  />
                ))}
              </div>

              {/* Summary & Actions */}
              <div className="border-t border-gray-200 bg-white/80 px-6 py-5 space-y-3">
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold"> {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="text-lg font-bold text-gray-800">Total</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                    $ {subtotal.toFixed(2)}
                  </span>
                </div>

                <button className="w-full bg-gradient-to-r from-pink-400 via-pink-500 to-rose-400 text-white py-3 rounded-xl font-bold text-sm hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Checkout
                </button>

                <button className="w-full bg-white border-2 border-gray-200 text-gray-700 py-2 rounded-xl font-semibold text-sm hover:border-pink-400 hover:bg-pink-50 transition-all duration-300">
                  Continue Shopping
                </button>
              </div>
            </>
          )}
        </aside>
      </main>
    </div>
  );
};

export default page;





