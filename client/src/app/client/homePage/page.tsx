'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingCart, Sparkles, TrendingUp, Zap, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Navbar from '@/app/client/(components)/NavBar';
import Footer from '@/app/client/Footer/page';
import { useGetProductsQuery, useAddToCartMutation, Product } from '@/state/api';
import { useGetActiveBannersQuery } from '@/state/api';

export default function HomePage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [wishlistedProducts, setWishlistedProducts] = useState<number[]>([]);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);

  // Fetch data
  const { data: products = [], isLoading: productsLoading } = useGetProductsQuery();
  const { data: banners = [], isLoading: bannersLoading } = useGetActiveBannersQuery();
  const [addToCartMutation] = useAddToCartMutation();

  // Debug: Log banners and heroBanners
  useEffect(() => {
    console.log('Fetched banners:', banners);
    const heroBanners = banners.filter(b => b.bannerPosition === 'HERO' && b.isSlider);
    console.log('Filtered heroBanners:', heroBanners);
  }, [banners]);

  // Filter products by type
  const featuredProducts = products.filter(p => p.isFeatured && p.availability).slice(0, 8);
  const trendingProducts = products.filter(p => p.isTrending && p.availability).slice(0, 8);
  const flashSaleProducts = products.filter(p => p.isFlashSale && p.availability).slice(0, 8);

  // Filter banners
  const heroBanners = banners.filter(b => b.bannerPosition === 'HERO');
  const secondaryBanners = banners.filter(b => b.bannerPosition === 'SECONDARY' && !b.isSlider);
  const promotionalBanners = banners.filter(b => b.bannerPosition === 'PROMOTIONAL');

  // Detect screen size
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-slide for hero banner
  useEffect(() => {
    if (heroBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroBanners.length]);

  // Fetch wishlist
  useEffect(() => {
    const fetchWishlist = async () => {
      const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/wishlist/${user.id}`);
        if (response.ok) {
          const wishlist = await response.json();
          setWishlistedProducts(wishlist.items.map((item: any) => item.productId));
        }
      }
    };
    fetchWishlist();
  }, []);

  const handleAddToCart = async (product: Product) => {
    try {
      const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (!userStr) {
        setNotification({ message: 'Please log in to add items to cart', type: 'error' });
        router.push('/client/sign-in');
        return;
      }

      const user = JSON.parse(userStr);
      setAddingToCart(product.id);

      await addToCartMutation({
        userId: Number(user.id),
        productId: product.id,
        quantity: 1,
      }).unwrap();

      setNotification({ message: `${product.name} added to cart!`, type: 'success' });
      window.dispatchEvent(new Event('cartUpdated'));
      setTimeout(() => setNotification(null), 3000);
    } catch (error: any) {
      setNotification({ message: 'Failed to add to cart', type: 'error' });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setAddingToCart(null);
    }
  };

  const handleWishlistToggle = async (product: Product) => {
    try {
      const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (!userStr) {
        setNotification({ message: 'Please log in', type: 'error' });
        router.push('/client/sign-in');
        return;
      }

      const user = JSON.parse(userStr);
      const isWishlisted = wishlistedProducts.includes(product.id);

      if (isWishlisted) {
        setWishlistedProducts(prev => prev.filter(id => id !== product.id));
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/wishlist/${user.id}/${product.id}`, {
          method: 'DELETE',
        });
        setNotification({ message: 'Removed from wishlist', type: 'success' });
      } else {
        setWishlistedProducts(prev => [...prev, product.id]);
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/wishlist`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, productId: product.id }),
        });
        setNotification({ message: 'Added to wishlist!', type: 'success' });
      }

      window.dispatchEvent(new Event('wishlistUpdated'));
      setTimeout(() => setNotification(null), 2000);
    } catch (error) {
      setNotification({ message: 'Failed to update wishlist', type: 'error' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const ProductCard = ({ product }: { product: Product }) => {
    const thumbnail = product.images?.find(img => img.isMain)?.url || product.images?.[0]?.url || '/placeholder-baby.png';
    const isWishlisted = wishlistedProducts.includes(product.id);
    const discount = product.discountPercentage ? Number(product.discountPercentage) : 0;
    const originalPrice = Number(product.price);
    const discountedPrice = discount > 0 ? originalPrice * (1 - discount / 100) : originalPrice;

    return (
      <div 
        className="group flex flex-col h-full cursor-pointer w-full bg-white shadow-md hover:shadow-xl border border-pink-100/50 transition-all duration-300 hover:-translate-y-1 rounded-md overflow-hidden"
        onClick={() => router.push(`/client/product/${product.id}`)}
      >
        <div className="relative aspect-square w-full overflow-hidden bg-white">
          <img 
            src={thumbnail} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
            loading="lazy"
          />
          {discount > 0 && (
            <div className="absolute top-2 left-2 bg-rose-500 text-white px-3 py-1 rounded-full text-xs font-bold">
              -{discount}%
            </div>
          )}
          <button 
            onClick={e => { e.stopPropagation(); handleWishlistToggle(product); }}
            className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-rose-50 rounded-full shadow-md transition-all"
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-pink-500 text-pink-500' : 'text-pink-300'}`} />
          </button>
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-bold text-gray-800 text-sm line-clamp-2 mb-2">{product.name}</h3>
          
          <div className="mb-3">
            {discount > 0 ? (
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-pink-600">${discountedPrice.toFixed(2)}</span>
                <span className="text-sm text-gray-400 line-through">${originalPrice.toFixed(2)}</span>
              </div>
            ) : (
              <span className="text-lg font-bold text-pink-600">${originalPrice.toFixed(2)}</span>
            )}
          </div>

          <button 
            onClick={e => { e.stopPropagation(); handleAddToCart(product); }}
            disabled={addingToCart === product.id}
            className="w-full bg-pink-500 text-white py-2.5 px-4 font-semibold rounded-md hover:bg-rose-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm shadow mt-auto"
          >
            {addingToCart === product.id ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroBanners.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroBanners.length) % heroBanners.length);

  if (productsLoading || bannersLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex justify-center items-center min-h-screen text-pink-500 font-semibold text-lg">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Notification */}
      {notification && (
        <div className={`fixed top-6 right-6 px-6 py-4 border shadow-lg z-50 rounded-md ${
          notification.type === 'success' 
            ? 'bg-pink-100 text-pink-700 border-pink-300' 
            : 'bg-rose-100 text-rose-700 border-rose-300'
        }`}>
          {notification.message}
        </div>
      )}

      <div className="mt-[110px]">
        {/* Hero Banner Slider */}
        {heroBanners.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <section className="relative h-[300px] sm:h-[350px] md:h-[400px] lg:h-[600px] overflow-hidden bg-gradient-to-br">
              {heroBanners.map((banner, index) => {
                const imageUrl = isMobile && banner.mobileImageUrl ? banner.mobileImageUrl : banner.imageUrl;
                return (
                  <div className="w-full h-full absolute inset-0 transition-opacity duration-1000 rounded-xl overflow-hidden"
                    key={banner.id}
                    style={{ zIndex: index === currentSlide ? 1 : 0 }}
                  >
                    <div className={index === currentSlide ? 'opacity-100 h-full' : 'opacity-0 h-full'}>
                      <img 
                        src={imageUrl}
                        alt={banner.title || 'Banner'} 
                        className="w-full h-full object-cover rounded-xl"
                        style={{ display: 'block', height: '100%' }}
                      />
                      {banner.title && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                          <div className="p-8 md:p-12 text-white">
                            <h2 className="text-3xl md:text-5xl font-extrabold mb-4">{banner.title}</h2>
                            {banner.link && (
                              <button
                                onClick={() => router.push(banner.link!)}
                                className="bg-white text-pink-600 px-6 py-3 rounded-md font-bold hover:bg-pink-50 transition-colors"
                              >
                                Shop Now
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {heroBanners.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/40 hover:bg-white p-3 rounded-full shadow-lg transition-all z-10"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-800" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/40 hover:bg-white p-3 rounded-full shadow-lg transition-all z-10"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-800" />
                  </button>

                  <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {heroBanners.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </section>
          </div>
        )}

        {/* Secondary Banners */}
        {secondaryBanners.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-3 ">
            <div className={`grid grid-cols-1 gap-6 ${secondaryBanners.length === 2 ? 'md:grid-cols-2' : secondaryBanners.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4'} gap-6`}>
              {secondaryBanners.slice(0, 4).map((banner) => {
                const imageUrl = isMobile && banner.mobileImageUrl ? banner.mobileImageUrl : banner.imageUrl;
                return (
                  <div 
                    key={banner.id}
                    className="relative h-48 md:h-64 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer group"
                    onClick={() => banner.link && router.push(banner.link)}
                  >
                    <img 
                      src={imageUrl}
                      alt={banner.title || 'Banner'} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {banner.title && (
                      <div className="absolute inset-0  flex items-end p-4">
                        <h3 className="text-white font-bold text-lg">{banner.title}</h3>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Flash Sale Section */}
        {flashSaleProducts.length > 0 && (
          <section className="bg-white mt-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div>
                    <h1 className="text-3xl py-4 font-extrabold text-gray-800">Flash Sale</h1>
                  </div>
                </div>
                <button
                  onClick={() => router.push('/client/product?filter=flash-sale')}
                  className="flex items-center gap-2 text-pink-600 hover:text-rose-600 font-semibold transition-colors"
                >
                  View All <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {flashSaleProducts.map(product => <ProductCard key={product.id} product={product} />)}
              </div>
            </div>
          </section>
        )}

        {/* Promotional Banner */}
        {promotionalBanners.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-10 py-8">
            {promotionalBanners.slice(0, 1).map((banner) => {
              const imageUrl = isMobile && banner.mobileImageUrl ? banner.mobileImageUrl : banner.imageUrl;
              return (
                <div 
                  key={banner.id}
                  className="relative h-48 md:h-80 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer group"
                  onClick={() => banner.link && router.push(banner.link)}
                >
                  <img 
                    src={imageUrl}
                    alt={banner.title || 'Promotional Banner'} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {banner.title && (
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
                      <div className="p-8 md:p-12 text-white max-w-2xl">
                        <h3 className="text-2xl md:text-4xl font-extrabold mb-4">{banner.title}</h3>
                        {banner.link && (
                          <button className="bg-white text-pink-600 px-6 py-3 rounded-md font-bold hover:bg-pink-50 transition-colors">
                            Discover More
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        )}

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 rounded-xl overflow-hidden bg-white shadow">
            <section>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div>
                    <h1 className="text-3xl font-extrabold text-gray-800">Featured Products</h1>
                  </div>
                </div>
                <button
                  onClick={() => router.push('/client/product?filter=featured')}
                  className="flex items-center gap-2 text-pink-600 hover:text-rose-600 font-semibold transition-colors"
                >
                  View All <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {featuredProducts.map(product => <ProductCard key={product.id} product={product} />)}
              </div>
            </section>
          </div>
        )}

        {/* Trending Products */}
        {trendingProducts.length > 0 && (
          <section className="bg-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  
                  <div>
                    <h1 className="text-3xl font-extrabold text-gray-800">Trending Now</h1>
                    
                  </div>
                </div>
                <button
                  onClick={() => router.push('/client/product?filter=trending')}
                  className="flex items-center gap-2 text-pink-600 hover:text-rose-600 font-semibold transition-colors"
                >
                  View All <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {trendingProducts.map(product => <ProductCard key={product.id} product={product} />)}
              </div>
            </div>
          </section>
        )}

        
      </div>

      <Footer />
    </div>
  );
}
