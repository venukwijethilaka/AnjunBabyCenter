'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Heart,
  ShoppingCart,
  Star,
  Truck,
  Shield,
  RotateCcw,
  ArrowLeft,
} from 'lucide-react';

import { useGetProductByIdQuery } from '@/state/api';
import StoreProvider from '@/app/redux';
import Navbar from '../../(components)/NavBar';
/* ---------------- TYPES ---------------- */

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

type ProductDetailPageContentProps = {
  id: string;
};

/* ---------------- CONTENT COMPONENT ---------------- */
function ProductDetailPageContent({ id }: ProductDetailPageContentProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const { data: product, isLoading, error } = useGetProductByIdQuery(parseInt(id), {
    skip: !id,
  });

  const handleAddToBag = async () => {
    try {
      // Get user from localStorage or sessionStorage
      const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (!userStr) {
        setNotification({ message: 'Please log in to add items to cart', type: 'error' });
        router.push('/client/sign-in');
        return;
      }

      const user = JSON.parse(userStr);
      setIsAddingToCart(true);

      // Add to cart for each quantity
      for (let i = 0; i < quantity; i++) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/cart`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.id,
              productId: parseInt(id),
            }),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to add to cart');
        }

        console.log(`Item ${i + 1} added to cart`);
      }

      setNotification({ 
        message: `${product?.name} added to bag!`, 
        type: 'success' 
      });

      // Trigger cart refresh
      console.log('Dispatching cartUpdated event from product detail...');
      window.dispatchEvent(new Event('cartUpdated'));
      localStorage.setItem('cartUpdated', Date.now().toString());

      // Auto-hide notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
    } catch (error: any) {
      console.error('Error adding to bag:', error);
      setNotification({ 
        message: 'Failed to add item to bag', 
        type: 'error' 
      });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlistToggle = async () => {
    try {
      const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (!userStr) {
        setNotification({ message: 'Please log in to add to wishlist', type: 'error' });
        router.push('/client/sign-in');
        return;
      }

      const user = JSON.parse(userStr);
      const userId = user.id;
      const productId = parseInt(id);

      if (isWishlisted) {
        // Remove from wishlist
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/wishlist/${userId}/${productId}`,
          { method: 'DELETE' }
        );

        if (response.ok) {
          setIsWishlisted(false);
          setNotification({ 
            message: 'Removed from wishlist', 
            type: 'success' 
          });
          window.dispatchEvent(new Event('wishlistUpdated'));
        }
      } else {
        // Add to wishlist
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/wishlist`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId,
              productId,
            }),
          }
        );

        if (response.ok) {
          setIsWishlisted(true);
          setNotification({ 
            message: 'Added to wishlist!', 
            type: 'success' 
          });
          window.dispatchEvent(new Event('wishlistUpdated'));
        }
      }

      setTimeout(() => setNotification(null), 2000);
    } catch (error: any) {
      console.error('Error toggling wishlist:', error);
      setNotification({ 
        message: 'Failed to update wishlist', 
        type: 'error' 
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold">Loading...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-pink-700 mb-4">Product not found</h2>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-pink-500 text-white font-semibold hover:bg-rose-500 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 
    ? product.images 
    : [{ url: '/placeholder.svg' }];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="mt-[70px]">
       {/* bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 */}
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-6 right-6 px-6 py-4 border shadow-lg z-50 transition-all duration-200 font-semibold text-base tracking-wide rounded-lg ${
          notification.type === 'success' 
            ? 'bg-pink-100 text-pink-700 border-pink-300' 
            : 'bg-rose-100 text-rose-700 border-rose-300'
        }`}>
          {notification.message}
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <button onClick={() => router.back()} className="flex items-center gap-3 pb-10 text-pink-500 font-medium">
          <ArrowLeft className="w-5 h-5 text-pink-400" /> <span className="text-pink-600">Back to Shop</span>
        </button>
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          {/* LEFT COLUMN: Images */}
          <div className="flex flex-col gap-10">
            <div className="bg-white p-10 shadow-md border border-pink-100/50 rounded-lg overflow-hidden flex items-center justify-center">
              <img
                src={images[activeImage].url}
                alt={product.name}
                className="w-full max-h-125 object-contain transition-transform duration-500 hover:scale-105"
              />
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-4">
                {images.map((img: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`aspect-square overflow-hidden border-2 rounded-md transition-all ${
                      activeImage === index 
                        ? 'border-pink-400 shadow-md ring-2 ring-pink-100' 
                        : 'border-white opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} className="w-full h-full object-cover" alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Info */}
          <div className="relative flex flex-col h-full">
            <div className="grow overflow-y-auto pb-32">
              <div className="mb-12">
                <span className="inline-block px-3 py-1 bg-pink-100 text-pink-600 text-xs font-bold uppercase tracking-widest mb-6 rounded-md">
                  {product.category?.name || 'Category'}
                </span>
                <h1 className="text-5xl font-extrabold text-pink-700 leading-tight mb-8">
                  {product.name}
                </h1>
                <div className="flex items-center gap-6">
                  <span className="text-4xl font-bold text-pink-500">
                    ${Number(product.price).toFixed(2)}
                  </span>
                  {(product.discountPercentage ?? 0) > 0 && (
                    <span className="bg-pink-100 text-pink-600 px-3 py-1 text-sm font-bold rounded-md">
                      Save {product.discountPercentage}%
                    </span>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-10 mb-12">
                <p className="text-pink-600 leading-relaxed text-lg">
                  {product.description}
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="flex flex-col gap-6 mb-16">
                <h3 className="text-sm font-bold text-[#2B1E14] uppercase tracking-wide">Quantity</h3>
                <div className="flex items-center gap-10">
                  <div className="flex items-center bg-white border border-pink-200 p-1 shadow-sm rounded-md">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-pink-100 text-pink-500 transition-colors rounded-md"
                    >
                      −
                    </button>
                    <span className="font-bold text-xl w-12 text-center text-pink-700">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.quantity ?? 1, quantity + 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-pink-100 text-pink-500 transition-colors rounded-md"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm font-medium text-pink-400 italic">
                    {product.quantity} units available
                  </span>
                </div>
              </div>
            </div>

            {/* Primary Actions - Fixed Footer */}
            <div className="absolute bottom-0 left-0 right-0 bg-white p-8 border-t border-gray-100 rounded-b-lg">
              <div className="flex gap-6">
                <button
                  onClick={handleAddToBag}
                  disabled={!product.availability || product.quantity === 0 || isAddingToCart}
                  className="flex-4 bg-pink-500 text-white py-5 font-bold text-lg flex items-center justify-center gap-4 shadow-lg hover:bg-rose-500 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0 rounded-md"
                >
                  {isAddingToCart ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-6 h-6 text-white" />
                      {product.quantity === 0 ? 'Out of Stock' : 'Add to Bag'}
                    </>
                  )}
                </button>

                <button
                  onClick={handleWishlistToggle}
                  className="flex-1 bg-white border border-pink-200 flex items-center justify-center hover:bg-pink-50 transition-all active:scale-95 rounded-md"
                >
                  <Heart
                    className={`w-7 h-7 transition-colors ${
                      isWishlisted ? 'fill-pink-500 text-pink-500' : 'text-pink-300'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
    </div>
  );
}
/* ---------------- PAGE (DEFAULT EXPORT) ---------------- */

export default function ProductDetailPage({ params }: PageProps) {
  const { id } = use(params); // ✅ unwrap params ONCE

  return (
    <StoreProvider>
      <ProductDetailPageContent id={id} />
    </StoreProvider>
  );
}
