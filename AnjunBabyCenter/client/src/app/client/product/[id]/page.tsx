'use client';

import { use, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Heart,
  ShoppingCart,
  Star,
  Truck,
  Shield,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
  X,
  XCircle,
} from 'lucide-react';

import { useGetProductByIdQuery, useGetProductsQuery, Product } from '@/state/api';

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
              {t.icon || (t.type === 'success' ? <Heart className="w-5 h-5 fill-current" /> :
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

/* ---------------- SIMILAR PRODUCTS COMPONENT ---------------- */
function SimilarProducts({ currentProduct }: { currentProduct: Product }) {
  const router = useRouter();
  const { data: allProducts = [] } = useGetProductsQuery();

  const similar = allProducts
    .filter((p) => p.id !== currentProduct.id && p.availability)
    .sort((a, b) => {
      // Same category first, then everything else
      const aMatch = a.categoryId === currentProduct.categoryId ? 0 : 1;
      const bMatch = b.categoryId === currentProduct.categoryId ? 0 : 1;
      return aMatch - bMatch;
    })
    .slice(0, 8); // Showing up to 8 products fits perfectly in a 4-column desktop grid

  if (similar.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-theme-primary mb-1">
            You May Also Like
          </p>
          <h2 className="text-2xl font-black text-gray-900">Similar Products</h2>
        </div>
        <button
          onClick={() => router.push('/client')}
          className="flex items-center gap-1.5 text-sm font-bold text-theme-primary hover:text-theme-bg-hover transition-colors"
        >
          See All <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* RESPONSIVE GRID: 2 cols on mobile, 3 on tablet, 4 on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {similar.map((p) => {
          const mainImg =
            p.images?.find((img: any) => img.isMain)?.url ||
            p.images?.[0]?.url ||
            '/placeholder.svg';
          const hasDiscount = (p.discountPercentage ?? 0) > 0;
          const discountedPrice = hasDiscount
            ? (Number(p.price) * (1 - (p.discountPercentage ?? 0) / 100)).toFixed(2)
            : null;

          return (
            <div
              key={p.id}
              onClick={() => router.push(`/client/product/${p.id}`)}
              // Removed fixed widths and shrink-0. Now it fills its grid cell.
              className="p-2 -m-2 group cursor-pointer flex flex-col"
            >
              <div className="flex flex-col h-full bg-white rounded-3xl group-hover:-translate-y-1 transition-all duration-300">
                {/* Image */}
                <div className="relative aspect-square w-full rounded-3xl overflow-hidden border border-gray-100 shadow-sm group-hover:shadow-xl transition-all duration-300 mb-3">
                  <img
                    src={mainImg}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {hasDiscount && (
                    <span className="absolute top-2.5 left-2.5 bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow-sm z-10">
                      -{p.discountPercentage}%
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-col flex-grow">
                  <p className="text-xs font-bold text-theme-light truncate mb-1">
                    {p.category?.name || ''}
                  </p>
                  <p className="text-sm font-black text-gray-800 line-clamp-2 mb-2 leading-snug">
                    {p.name}
                  </p>
                  <div className="flex items-center gap-2 mt-auto">
                    <span className="text-base font-black text-theme-primary">Rs. {discountedPrice ?? Number(p.price).toFixed(2)}
                    </span>
                    {hasDiscount && (
                      <span className="text-xs text-gray-400 line-through font-medium">Rs. {Number(p.price).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------------- CONTENT COMPONENT ---------------- */
function ProductDetailPageContent({ id }: ProductDetailPageContentProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const [toasts, setToasts] = useState<Toast[]>([]);
  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = ++toastCounter;
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);
  const dismissToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const { data: product, isLoading, error } = useGetProductByIdQuery(parseInt(id), {
    skip: !id,
  });

  useEffect(() => {
    const fetchWishlistStatus = async () => {
      const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (userStr && id) {
        const user = JSON.parse(userStr);
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/wishlist/${user.id}/${id}/status`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.ok) {
            const data = await response.json();
            setIsWishlisted(data.isInWishlist);
          }
        } catch (error) {
          console.error('Error fetching wishlist status:', error);
        }
      }
    };
    fetchWishlistStatus();
  }, [id]);

  const handleAddToBag = async () => {
    try {
      const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (!userStr) {
        addToast({ message: 'Please log in to add items to cart', type: 'error', icon: <XCircle className="w-5 h-5" /> });
        router.push('/client/sign-in');
        return;
      }

      const user = JSON.parse(userStr);
      setIsAddingToCart(true);

      const token = localStorage.getItem('token') || sessionStorage.getItem('token');

      for (let i = 0; i < quantity; i++) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/cart`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify({
              userId: Number(user.id),
              productId: parseInt(id),
              quantity: 1
            }),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to add to cart');
        }
      }

      const thumbnail = product?.images?.find((img: any) => img.isMain)?.url || product?.images?.[0]?.url;
      addToast({
        message: `${product?.name} added to cart!`,
        type: 'success',
        thumbnail
      });

      window.dispatchEvent(new Event('cartUpdated'));
      localStorage.setItem('cartUpdated', Date.now().toString());
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      addToast({ message: 'Failed to add item to cart', type: 'error', icon: <XCircle className="w-5 h-5" /> });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlistToggle = async () => {
    try {
      const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (!userStr) {
        addToast({ message: 'Please log in to use wishlist', type: 'error', icon: <XCircle className="w-5 h-5" /> });
        router.push('/client/sign-in');
        return;
      }

      const user = JSON.parse(userStr);
      const userId = user.id;
      const productId = parseInt(id);

      if (isWishlisted) {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/wishlist/${userId}/${productId}`,
          {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (response.ok) {
          setIsWishlisted(false);
          const thumbnail = product?.images?.find((img: any) => img.isMain)?.url || product?.images?.[0]?.url;
          addToast({ message: 'Removed from wishlist', type: 'info', thumbnail });
          window.dispatchEvent(new Event('wishlistUpdated'));
        }
      } else {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/wishlist`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              userId: Number(userId),
              productId: Number(productId),
            }),
          }
        );

        if (response.ok) {
          setIsWishlisted(true);
          const thumbnail = product?.images?.find((img: any) => img.isMain)?.url || product?.images?.[0]?.url;
          addToast({ message: `${product?.name} added to wishlist! ❤️`, type: 'success', thumbnail });
          window.dispatchEvent(new Event('wishlistUpdated'));
        }
      }
    } catch (error: any) {
      console.error('Error toggling wishlist:', error);
      addToast({ message: 'Failed to update wishlist', type: 'error', icon: <XCircle className="w-5 h-5" /> });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/40">
        <Navbar />
        <div className="flex justify-center items-center min-h-screen text-theme-primary font-semibold text-lg">
          Loading product...
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50/40">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h2 className="text-2xl font-black text-gray-800 mb-6">Product not found</h2>
          <button
            onClick={() => router.back()}
            className="px-8 py-3.5 bg-theme-primary text-white font-bold rounded-2xl hover:bg-theme-bg-hover transition-colors shadow-lg"
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

  const activeOffer = product.promotionalOffers?.find(
    (offer) => offer.isActive && new Date(offer.endDate).getTime() > Date.now()
  );
  const offerPrice = activeOffer?.offerPrice ?? product._offerPrice;
  const originalPrice = Number(product.price);
  const discount = product.discountPercentage ?? 0;
  const salePrice = offerPrice ?? (discount > 0 ? originalPrice * (1 - discount / 100) : null);
  const finalPrice = salePrice ?? originalPrice;

  return (
    <div className="min-h-screen bg-gray-50/40">
      <Navbar />
      <div className="mt-[110px]">

        {/* ── Rich Toast System ── */}
        <ToastStack toasts={toasts} onDismiss={dismissToast} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-32">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 pb-8 text-theme-primary hover:text-theme-bg-hover font-bold transition-colors"
          >
            <ArrowLeft className="w-5 h-5" /> <span>Back to Shop</span>
          </button>

          <div className="grid lg:grid-cols-2 gap-8 items-start">

            {/* LEFT COLUMN: Images */}
            <div className="flex flex-col gap-6">
              <div className="bg-white p-8 sm:p-12 shadow-sm border border-gray-100 rounded-[32px] overflow-hidden flex items-center justify-center">
                <img
                  src={images[activeImage].url}
                  alt={product.name}
                  className="w-full max-h-[500px] object-contain transition-transform duration-500 hover:scale-105"
                />
              </div>

              {images.length > 1 && (
                <div className="grid grid-cols-5 gap-4">
                  {images.map((img: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`aspect-square overflow-hidden border-2 rounded-2xl transition-all ${activeImage === index
                        ? 'border-theme-primary shadow-md ring-4 ring-theme-toggle-bg'
                        : 'border-white opacity-60 hover:opacity-100'
                        }`}
                    >
                      <img src={img.url} className="w-full h-full object-cover rounded-xl" alt="" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Info Card */}
            <div className="bg-white p-8 sm:p-10 rounded-[32px] shadow-sm border border-gray-100 flex flex-col h-full relative">
              <div className="grow mb-10">
                <div className="mb-8">
                  <span className="inline-block px-4 py-1.5 bg-theme-toggle-bg text-theme-primary text-xs font-black uppercase tracking-widest mb-6 rounded-xl">
                    {product.category?.name || 'Category'}
                  </span>
                  <h1 className="text-3xl sm:text-5xl font-black text-gray-900 leading-tight mb-6">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-4">
                    <span className="text-4xl font-black text-theme-primary">Rs. {Number(finalPrice).toFixed(2)}</span>
                    {salePrice && (
                      <span className="text-xl text-gray-400 line-through font-medium">Rs. {Number(originalPrice).toFixed(2)}</span>
                    )}
                    {offerPrice ? (
                      <span className="bg-blue-600 text-white px-3 py-1 text-sm font-black rounded-xl shadow-sm">
                        Special Offer
                      </span>
                    ) : discount > 0 ? (
                      <span className="bg-rose-500 text-white px-3 py-1 text-sm font-black rounded-xl shadow-sm">
                        -{discount}%
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-8 mb-10">
                  <div
                    className="text-gray-600 leading-relaxed font-medium text-base
                      [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-gray-800 [&_h2]:mt-4 [&_h2]:mb-2
                      [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-gray-700 [&_h3]:mt-3 [&_h3]:mb-1
                      [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-3 [&_ul]:space-y-1
                      [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-3 [&_ol]:space-y-1
                      [&_li]:leading-relaxed
                      [&_strong]:font-bold [&_strong]:text-gray-800
                      [&_em]:italic
                      [&_u]:underline
                      [&_s]:line-through
                      [&_p]:mb-3 [&_p:last-child]:mb-0"
                    dangerouslySetInnerHTML={{ __html: product.description || '' }}
                  />
                </div>

                {/* Quantity Selector */}
                <div className="flex flex-col gap-4 mb-8">
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Quantity</h3>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center bg-gray-50 border-2 border-transparent focus-within:border-theme-border p-1 shadow-sm rounded-2xl transition-all">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-12 h-12 flex items-center justify-center hover:bg-white text-gray-500 hover:text-theme-primary transition-colors rounded-xl font-bold text-xl shadow-sm"
                      >
                        −
                      </button>
                      <span className="font-black text-xl w-14 text-center text-gray-800">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(product.quantity ?? 1, quantity + 1))}
                        className="w-12 h-12 flex items-center justify-center hover:bg-white text-gray-500 hover:text-theme-primary transition-colors rounded-xl font-bold text-xl shadow-sm"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm font-bold text-theme-light bg-theme-bg px-3 py-1.5 rounded-xl">
                      {product.quantity} units available
                    </span>
                  </div>
                </div>
              </div>

              {/* Primary Actions */}
              <div className="flex gap-4 mt-auto pt-8 border-t border-gray-100">
                <button
                  onClick={handleAddToBag}
                  disabled={!product.availability || product.quantity === 0 || isAddingToCart}
                  className="flex-1 bg-theme-primary text-white py-5 font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-theme-primary/30 hover:bg-theme-bg-hover hover:-translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none rounded-2xl active:scale-[0.98]"
                >
                  {isAddingToCart ? (
                    <>
                      <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-6 h-6" />
                      {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </>
                  )}
                </button>

                <button
                  onClick={handleWishlistToggle}
                  className="w-20 bg-white border-2 border-gray-100 flex items-center justify-center hover:bg-theme-bg hover:border-theme-border transition-all active:scale-95 rounded-2xl"
                >
                  <Heart
                    className={`w-7 h-7 transition-colors ${isWishlisted ? 'fill-theme-primary text-theme-primary' : 'text-gray-400'
                      }`}
                  />
                </button>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* ─── SIMILAR PRODUCTS ─────────────────────────────────────────── */}
      <SimilarProducts currentProduct={product} />
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