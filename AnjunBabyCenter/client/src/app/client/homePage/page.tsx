'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Heart, ShoppingCart, ArrowRight, Sparkles, TrendingUp,
  ChevronLeft, ChevronRight, Tag, XCircle, X,
  Flame
} from 'lucide-react';
import Navbar from '@/app/client/(components)/NavBar';
import Footer from '@/app/client/Footer/page';
import { useAppSelector } from '@/app/redux';
import {
  useGetTrendingProductsQuery,
  useGetFeaturedProductsQuery,
  useAddToCartMutation,
  useGetActiveBannersQuery,
  useGetCategoriesQuery,
  useGetAllOffersQuery,
  Product
} from '@/state/api';

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

// ─── Shared Components ───────────────────────────────────────────────────────
function CountdownTimer({ endDate }: { endDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!endDate) return;
    const targetDate = new Date(endDate).getTime();

    const updateTime = () => {
      const distance = targetDate - Date.now();
      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className="flex gap-3">
      {[
        { val: String(timeLeft.days).padStart(2, '0'), label: 'Days' },
        { val: String(timeLeft.hours).padStart(2, '0'), label: 'Hours' },
        { val: String(timeLeft.minutes).padStart(2, '0'), label: 'Min' },
        { val: String(timeLeft.seconds).padStart(2, '0'), label: 'Sec' }
      ].map((unit, idx) => (
        <div key={idx} className="bg-white border border-theme-border/50 rounded-2xl p-3 min-w-[68px] text-center shadow-sm">
          <div className="text-2xl font-black text-gray-900">{unit.val}</div>
          <div className="text-[10px] text-theme-primary font-bold mt-0.5 uppercase">{unit.label}</div>
        </div>
      ))}
    </div>
  );
}

function SpecialOffersCarousel({ allOffers }: { allOffers: any[] }) {
  const router = useRouter();
  const [selectedOfferIdx, setSelectedOfferIdx] = useState(0);

  const activeOffers = allOffers.filter(o => o.isActive && o.product);
  const currentOffer = activeOffers[selectedOfferIdx] ?? null;

  useEffect(() => {
    if (activeOffers.length <= 1) return;
    const interval = setInterval(() => setSelectedOfferIdx(prev => (prev + 1) % activeOffers.length), 4000);
    return () => clearInterval(interval);
  }, [activeOffers.length]);

  if (activeOffers.length === 0 || !currentOffer) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-theme-bg rounded-xl"><Tag className="w-6 h-6 text-theme-primary" /></div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800">Special Offers</h2>
        </div>
        {activeOffers.length > 1 && (
          <div className="flex items-center gap-2">
            {activeOffers.map((_, idx) => (
              <button key={idx} onClick={() => setSelectedOfferIdx(idx)} className={`rounded-full transition-all duration-300 ${idx === selectedOfferIdx ? 'w-8 h-3 bg-theme-primary' : 'w-3 h-3 bg-gray-200 hover:bg-theme-border'}`} aria-label={`Offer ${idx + 1}`} />
            ))}
          </div>
        )}
      </div>
      <div className="bg-white rounded-[40px] border border-theme-border/40 shadow-sm overflow-hidden flex flex-col md:flex-row items-stretch">
        <div className="w-full md:w-[45%] flex justify-center items-center p-6 md:p-10 bg-white">
          <img
            key={currentOffer.id}
            src={currentOffer.product!.images?.find((img: any) => img.isMain)?.url || currentOffer.product!.images?.[0]?.url}
            className="w-full h-[300px] md:h-[400px] object-contain transition-all duration-500 hover:scale-105"
            alt={currentOffer.product!.name}
          />
        </div>
        <div className="w-full md:w-[55%] p-8 md:p-12 space-y-5">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-theme-bg text-theme-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-theme-border">🏷️ Special Offer</span>
            {activeOffers.length > 1 && <span className="text-xs font-bold text-gray-400">{selectedOfferIdx + 1} / {activeOffers.length}</span>}
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">{currentOffer.product!.name}</h2>
            <p className="text-theme-primary text-base font-medium leading-relaxed">{currentOffer.description || currentOffer.title}</p>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-3xl font-black text-theme-primary">LKR {Number(currentOffer.offerPrice).toLocaleString()}.00</span>
            <span className="text-base text-gray-400 font-medium line-through">LKR {Number(currentOffer.product!.price).toLocaleString()}.00</span>
          </div>
          <button onClick={() => router.push(`/client/product/${currentOffer.productId}`)} className="w-full py-4 bg-theme-primary text-white rounded-2xl font-black text-sm tracking-widest shadow-lg shadow-theme-primary/20 hover:bg-theme-bg-hover active:scale-95 transition-all">
            VIEW PRODUCT
          </button>
          <div className="pt-5 border-t border-theme-border/40">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Hurry Up! Offer Ends In:</p>
            <CountdownTimer endDate={currentOffer.endDate} />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroBannerCarousel({ banners, theme }: { banners: any[]; theme: 'boy' | 'girl' }) {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  // ── Banner filtering by theme ──
  const allHeroBanners = banners.filter(b => b.bannerPosition === 'HERO');
  const themeTitle = theme === 'boy' ? 'BOYS_THEME' : 'GIRLS_THEME';
  const themeBanners = allHeroBanners.filter(b => b.title === themeTitle);
  const heroBanners = themeBanners.length > 0 ? themeBanners : allHeroBanners.filter(b => !b.title || !b.title.endsWith('_THEME'));

  useEffect(() => {
    if (heroBanners.length <= 1) return;
    const interval = setInterval(() => setCurrentSlide(prev => (prev + 1) % heroBanners.length), 5000);
    return () => clearInterval(interval);
  }, [heroBanners.length]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 relative h-[250px] sm:h-[400px] md:h-[500px] rounded-[32px] overflow-hidden group shadow-sm">
      {heroBanners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 cursor-pointer ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          onClick={() => banner.link && router.push(banner.link)}
        >
          <img src={banner.imageUrl} alt={banner.title || 'Banner'} className="w-full h-full object-cover object-center md:object-fill" />
        </div>
      ))}

      {heroBanners.length > 1 && (
        <>
          <button
            onClick={() => setCurrentSlide(prev => (prev - 1 + heroBanners.length) % heroBanners.length)}
            className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full z-20 hover:bg-white shadow-lg text-theme-primary"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => setCurrentSlide(prev => (prev + 1) % heroBanners.length)}
            className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full z-20 hover:bg-white shadow-lg text-theme-primary"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {heroBanners.map((_, idx) => (
              <button key={idx} onClick={() => setCurrentSlide(idx)} className={`h-2 rounded-full transition-all ${idx === currentSlide ? 'bg-theme-primary w-8' : 'bg-white/50 w-2'}`} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default function HomePage() {
  const router = useRouter();
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const theme = useAppSelector((state) => state.global.theme);

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

  const [wishlistedProducts, setWishlistedProducts] = useState<number[]>([]);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);

  // ── Data — 2 dedicated algorithm endpoints + shared data ──
  const { data: trendingProducts = [], isLoading: trendingLoading } = useGetTrendingProductsQuery();
  const { data: featuredProducts = [], isLoading: featuredLoading } = useGetFeaturedProductsQuery();
  const { data: banners = [], isLoading: bannersLoading } = useGetActiveBannersQuery();
  const { data: categories = [], isLoading: categoriesLoading } = useGetCategoriesQuery();
  const { data: allOffers = [] } = useGetAllOffersQuery();

  const [addToCartMutation] = useAddToCartMutation();

  // ── Banner filtering by theme ──
  const allHeroBanners = banners.filter(b => b.bannerPosition === 'HERO');
  const themeTitle = theme === 'boy' ? 'BOYS_THEME' : 'GIRLS_THEME';
  const themeBanners = allHeroBanners.filter(b => b.title === themeTitle);
  const heroBanners = themeBanners.length > 0 ? themeBanners : allHeroBanners.filter(b => !b.title || !b.title.endsWith('_THEME'));

  const mainCategories = categories.filter(c => !c.parentId);

  // ── Effects ──
  useEffect(() => {
    const fetchWishlist = async () => {
      const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/wishlist/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const wishlist = await res.json();
          setWishlistedProducts(wishlist.items.map((item: any) => item.productId));
        }
      }
    };
    fetchWishlist();
  }, []);

  // The ticker timer has been extracted to <CountdownTimer> to prevent full page re-renders.

  // ── Handlers ──
  const scrollCategories = (direction: 'left' | 'right') => {
    categoryScrollRef.current?.scrollBy({ left: direction === 'left' ? -300 : 300, behavior: 'smooth' });
  };

  const handleAddToCart = async (product: Product) => {
    try {
      const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (!userStr) {
        addToast({ message: 'Please log in to add items to cart', type: 'error', icon: <XCircle className="w-5 h-5" /> });
        router.push('/client/sign-in');
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

  const handleWishlistToggle = async (product: Product) => {
    try {
      const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (!userStr) {
        addToast({ message: 'Please log in to use wishlist', type: 'error', icon: <XCircle className="w-5 h-5" /> });
        router.push('/client/sign-in');
        return;
      }
      const user = JSON.parse(userStr);
      const isWishlisted = wishlistedProducts.includes(product.id);
      const thumbnail = product.images?.find(img => img.isMain)?.url || product.images?.[0]?.url;

      if (isWishlisted) {
        setWishlistedProducts(prev => prev.filter(id => id !== product.id));
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/wishlist/${user.id}/${product.id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        addToast({ message: `Removed from wishlist`, type: 'info', thumbnail });
      } else {
        setWishlistedProducts(prev => [...prev, product.id]);
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/wishlist`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
          },
          body: JSON.stringify({ userId: Number(user.id), productId: product.id }),
        });
        addToast({ message: `${product.name} added to wishlist! ❤️`, type: 'success', thumbnail });
      }
      window.dispatchEvent(new Event('wishlistUpdated'));
    } catch {
      addToast({ message: 'Failed to update wishlist', type: 'error', icon: <XCircle className="w-5 h-5" /> });
    }
  };

  // ── Sub Components ──
  const CategoryCircle = ({ category }: { category: any }) => (
    <div
      onClick={() => router.push(`/client/product?category=${category.id}`)}
      className="flex flex-col items-center gap-4 cursor-pointer group shrink-0 w-28 md:w-40"
    >
      <div className="w-24 h-24 md:w-36 md:h-36 rounded-full border-[4px] border-white bg-white p-1.5 group-hover:border-theme-primary transition-all shadow-md group-hover:shadow-xl group-hover:scale-105 duration-300">
        <img src={category.imageUrl || '/placeholder-category.png'} className="w-full h-full object-cover rounded-full" alt={category.name} />
      </div>
      <span className="text-sm md:text-base font-extrabold text-gray-800 group-hover:text-theme-primary transition-colors text-center line-clamp-2">{category.name}</span>
    </div>
  );

  // Generic product card used in all 3 sections
  const ProductCard = ({
    product,
    rank,
    isHot,
    offerPrice,
  }: {
    product: Product;
    rank?: number;
    isHot?: boolean;
    offerPrice?: number;
  }) => {
    const thumbnail = product.images?.find(img => img.isMain)?.url || product.images?.[0]?.url || '/placeholder.png';
    const isWishlisted = wishlistedProducts.includes(product.id);
    const originalPrice = Number(product.price);
    const discount = product.discountPercentage ? Number(product.discountPercentage) : 0;

    const salePrice = offerPrice ?? (discount > 0 ? originalPrice * (1 - discount / 100) : null);
    const hasDiscount = salePrice !== null && salePrice < originalPrice;

    return (
      <div className="p-2 -m-2 group">
        <div
          className="bg-white rounded-[28px] p-4 border border-theme-border/50 shadow-sm group-hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer group-hover:-translate-y-1 relative"
          onClick={() => router.push(`/client/product/${product.id}`)}
        >
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-theme-bg/30 mb-4">
            <img src={thumbnail} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />

            {/* Rank badge — gold/silver/bronze for top 3 trending */}
            {rank && rank <= 3 && (
              <div className={`absolute top-3 left-3 w-8 h-8 flex items-center justify-center rounded-full text-white text-sm font-black z-20 shadow-lg
              ${rank === 1 ? 'bg-yellow-400' : rank === 2 ? 'bg-slate-400' : 'bg-amber-600'}`}>
                #{rank}
              </div>
            )}

            {/* 🔥 HOT badge for top-sellers */}
            {isHot && (
              <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-orange-500 text-white px-2.5 py-1 rounded-full text-[10px] font-black z-10 shadow-sm">
                <Flame className="w-3 h-3" /> HOT
              </div>
            )}

            {/* Offer / discount badge */}
            {!rank && offerPrice && (
              <div className="absolute top-3 left-3 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10 shadow-sm flex items-center gap-1 animate-pulse">
                <Tag className="w-3 h-3" /> SALE
              </div>
            )}
            {!rank && !offerPrice && discount > 0 && (
              <div className="absolute top-3 left-3 bg-theme-primary text-white px-3 py-1 rounded-full text-xs font-bold z-10 shadow-sm">
                -{discount}%
              </div>
            )}

            <button
              onClick={e => { e.stopPropagation(); handleWishlistToggle(product); }}
              className="absolute top-3 right-3 p-2.5 hover:bg-theme-bg transition-all active:scale-95 shadow-sm hover:shadow-md bg-white/90 backdrop-blur-sm rounded-2xl z-10"
            >
              <Heart className={`w-5 h-5 transition-all duration-200 ${isWishlisted ? 'fill-theme-primary text-theme-primary scale-110' : 'text-gray-400'}`} />
            </button>
          </div>

          <div className="flex flex-col flex-grow px-1">
            <h3 className="font-extrabold text-gray-800 text-sm leading-snug line-clamp-2 mb-2 h-10">{product.name}</h3>
            <div className="mt-auto pb-4">
              {hasDiscount ? (
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className={`text-lg font-black ${offerPrice ? 'text-blue-600' : 'text-theme-primary'}`}>
                    Rs. {salePrice!.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-gray-400 line-through">Rs. {originalPrice.toLocaleString()}</span>
                </div>
              ) : (
                <span className="text-lg font-black text-theme-primary">Rs. {originalPrice.toLocaleString()}</span>
              )}
            </div>
            <button
              onClick={e => { e.stopPropagation(); handleAddToCart(product); }}
              disabled={addingToCart === product.id}
              className="w-full bg-theme-bg text-theme-primary py-3 rounded-2xl font-bold hover:bg-theme-primary hover:text-white transition-colors flex justify-center items-center gap-2 shadow-sm disabled:opacity-70"
            >
              {addingToCart === product.id
                ? <div className="w-5 h-5 border-[3px] border-current border-t-transparent rounded-full animate-spin" />
                : <><ShoppingCart className="w-5 h-5" /> Add to Cart</>}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const isInitialLoading = bannersLoading || categoriesLoading;

  if (isInitialLoading) {
    return (
      <div className={`min-h-screen bg-theme-bg flex items-center justify-center flex-col gap-4 ${theme === 'boy' ? 'theme-boy' : ''}`}>
        <div className="w-12 h-12 border-4 border-theme-border border-t-theme-primary rounded-full animate-spin" />
        <p className="text-theme-primary font-bold">
          {theme === 'boy' ? 'Loading Boys Store...' : 'Loading Girls Store...'}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* ── Rich Toast System ── */}
      <ToastStack toasts={toasts} onDismiss={dismissToast} />

      <div className="mt-[110px] pb-20 space-y-16">

        {/* 1. Hero Banner Slider */}
        {banners.length > 0 && (
          <HeroBannerCarousel banners={banners} theme={theme} />
        )}

        {/* 2. Categories */}
        {mainCategories.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800">Shop by Category</h2>
              <button onClick={() => router.push('/client/category')} className="text-theme-primary font-bold flex items-center gap-2 hover:underline">
                View All <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <div className="relative group/slider px-2 md:px-14">
              {mainCategories.length > 3 && (
                <button onClick={() => scrollCategories('left')} className="absolute left-0 top-[64px] md:top-[88px] -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2.5 flex hover:scale-110 transition-transform text-theme-primary border border-gray-100 md:opacity-0 md:group-hover/slider:opacity-100">
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              <div ref={categoryScrollRef} className={`flex gap-6 md:gap-10 overflow-x-auto py-4 snap-x scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${mainCategories.length <= 5 ? 'md:justify-center' : ''}`}>
                {mainCategories.map(cat => (
                  <div key={cat.id} className="snap-start"><CategoryCircle category={cat} /></div>
                ))}
              </div>
              {mainCategories.length > 3 && (
                <button onClick={() => scrollCategories('right')} className="absolute right-0 top-[64px] md:top-[88px] -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2.5 flex hover:scale-110 transition-transform text-theme-primary border border-gray-100 md:opacity-0 md:group-hover/slider:opacity-100">
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </section>
        )}

        {/* 3. New Arrivals — newest products first */}
        {!featuredLoading && featuredProducts.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-theme-bg rounded-xl"><Sparkles className="w-6 h-6 text-theme-primary" /></div>
                <div>
                  <h2 className="text-3xl font-extrabold text-gray-800">New Arrivals</h2>
                  <p className="text-xs text-gray-400 font-semibold">Fresh picks from the last 30 days</p>
                </div>
              </div>
              <button onClick={() => router.push('/client/product?sort=newest')} className="text-theme-primary font-bold flex items-center gap-2 hover:translate-x-1 transition-transform">
                View All <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map(product => <ProductCard key={product.id} product={product} />)}
            </div>
          </section>
        )}

        {/* 4. Special Offers Carousel */}
        <SpecialOffersCarousel allOffers={allOffers} />

        {/* 5. Trending Now — powered by real order data */}
        {!trendingLoading && trendingProducts.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-theme-bg rounded-xl">
                  <TrendingUp className="w-6 h-6 text-theme-primary" />
                </div>
                <div>
                  <h2 className="text-3xl font-extrabold text-gray-800">Trending Now</h2>
                  <p className="text-xs text-gray-400 font-semibold">Based on orders in the last 14 days</p>
                </div>
              </div>
              <button onClick={() => router.push('/client/product?sort=newest')} className="text-theme-primary font-bold flex items-center gap-2 hover:translate-x-1 transition-transform">
                View All <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {trendingProducts.map((product, idx) => {
                const rank = idx + 1;
                const isHot = (product._orderCount ?? 0) > 3;
                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    rank={rank}
                    isHot={isHot}
                  />
                );
              })}
            </div>
          </section>
        )}

      </div>
      <Footer />
    </div>
  );
}