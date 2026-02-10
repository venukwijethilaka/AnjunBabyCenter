'use client';

import { useState, useEffect, useMemo } from 'react';
import { Heart, ShoppingCart, Filter, Search } from 'lucide-react'; // Added Search icon
import { useRouter, useSearchParams } from 'next/navigation';
import { useGetProductsQuery, useGetCategoriesQuery, Product, useAddToCartMutation } from '@/state/api';
import ProtectedRoute from '../(components)/ProtectedRoute';
import Navbar from '../(components)/NavBar';

export default function BabyProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [wishlistedProducts, setWishlistedProducts] = useState<number[]>([]);

  // 1. FETCH DATA FROM BACKEND
  const { data: products = [], isLoading: productsLoading, error: productsError } = useGetProductsQuery();
  const { data: rawCategories = [], isLoading: categoriesLoading } = useGetCategoriesQuery();
  const [addToCartMutation] = useAddToCartMutation();

  useEffect(() => {
    const fetchWishlist = async () => {
      const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/wishlist/${user.id}`);
        if (response.ok) {
          const wishlist = await response.json();
          const wishlistedIds = wishlist.items.map((item: any) => item.productId);
          setWishlistedProducts(wishlistedIds);
        }
      }
    };
    fetchWishlist();
  }, []);

  // Update selectedCategory if query param changes
  useEffect(() => {
    const categoryFromQuery = searchParams.get('category') || 'all';
    setSelectedCategory(categoryFromQuery);
  }, [searchParams]);

  // 2. PROCESS CATEGORIES (Main categories only + "All")
  const displayCategories = useMemo(() => {
    const mainCategories = rawCategories
      .filter((cat) => !cat.parentId && cat.isActive)
      .map((cat) => ({
        key: cat.name.toLowerCase(),
        label: cat.name,
      }));

    return [{ key: 'all', label: 'All Categories' }, ...mainCategories];
  }, [rawCategories]);

  // 3. COMBINED FILTER & SORT LOGIC
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    // Find the selected category object ONCE, outside the filter loop
    const selectedCatObj = rawCategories.find(
      (c) => c.name.toLowerCase() === selectedCategory.toLowerCase()
    );

    return products
      .filter((product: Product) => {
        // 1. Availability check
        const isAvailable = product.availability === true;

        // 2. Category logic (Standard JS logic, no nested Hooks!)
        let matchesCategory = true;
        if (selectedCategory !== 'all') {
          if (!selectedCatObj) {
            matchesCategory = false;
          } else {
            const isDirectMatch = product.categoryId === selectedCatObj.id;
            const isChildMatch = product.category?.parentId === selectedCatObj.id;
            matchesCategory = isDirectMatch || isChildMatch;
          }
        }

        // 3. Search check
        const matchesSearch = (product.name || '')
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

        return isAvailable && matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return Number(a.price) - Number(b.price);
        if (sortBy === 'price-high') return Number(b.price) - Number(a.price);
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return 0;
      });
  }, [products, selectedCategory, searchQuery, sortBy, rawCategories]);

  const productsWithWishlist = useMemo(() => {
    return filteredProducts.map(p => ({
        ...p,
        isWishlisted: wishlistedProducts.includes(p.id)
    }));
  }, [filteredProducts, wishlistedProducts]);

  // Handle Add to Cart
  // --- Updated handleAddToCart ---
  const handleAddToCart = async (product: Product) => {
    try {
      const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (!userStr) {
        setNotification({ message: 'Please log in to add items to cart', type: 'error' });
        router.push('/client/sign-in');
        return;
      }

      const user = JSON.parse(userStr);
      const userId = Number(user.id); // Ensure it's a number
      setAddingToCart(product.id);

      // ✅ Now passing quantity: 1 to satisfy the Redux API requirement
      const result = addToCartMutation({
        userId: userId,
        productId: product.id,
        quantity: 1, 
      });
      
      const response = await result.unwrap();
      
      setNotification({ 
        message: `${product.name} added to cart!`, 
        type: 'success' 
      });

      window.dispatchEvent(new Event('cartUpdated'));
      localStorage.setItem('cartUpdated', Date.now().toString());

      setTimeout(() => setNotification(null), 3000);
    } catch (error: any) {
      let errorMessage = error?.data?.message || error?.message || 'Failed to add item to cart';
      setNotification({ message: errorMessage, type: 'error' });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setAddingToCart(null);
    }
  };

  const handleWishlistToggle = async (product: Product) => {
    try {
      const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (!userStr) {
        setNotification({ message: 'Please log in to add to wishlist', type: 'error' });
        router.push('/client/sign-in');
        return;
      }

      const user = JSON.parse(userStr);
      const userId = user.id;
      const productId = product.id;

      const isWishlisted = wishlistedProducts.includes(productId);

      if (isWishlisted) {
        // Remove from wishlist
        setWishlistedProducts(prev => prev.filter(id => id !== productId));
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/wishlist/${userId}/${productId}`,
          { method: 'DELETE' }
        );

        if (response.ok) {
          setNotification({ 
            message: 'Removed from wishlist', 
            type: 'success' 
          });
          window.dispatchEvent(new Event('wishlistUpdated'));
        }
      } else {
        // Add to wishlist
        setWishlistedProducts(prev => [...prev, productId]);
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

  // Loading/Error States
  if (productsLoading) return <div className="flex justify-center items-center min-h-screen bg-white text-pink-500 font-semibold text-lg">Loading sweet things...</div>;
  if (productsError) return <div className="text-center py-20 text-rose-500 font-extrabold bg-white text-lg">Failed to load products.</div>;

  return ( 
    
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="mt-[70px]">
      {/* bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 */}
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-6 right-6 px-6 py-4 border shadow-lg z-50 transition-all duration-200 font-semibold text-base tracking-wide ${
          notification.type === 'success' 
            ? 'bg-pink-100 text-pink-700 border-pink-300' 
            : 'bg-rose-100 text-rose-700 border-rose-300'
        }`}>
          {notification.message}
        </div>
      )}

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400 w-5 h-5 pointer-events-none" />
          <input 
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 text-pink-900 bg-white border border-pink-200 shadow focus:ring-2 focus:ring-pink-300 outline-none transition-all placeholder:text-pink-300 focus:bg-pink-50/40"
            aria-label="Search products"
            autoComplete="off"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {/* Categories & Sort Controls - New Visual Pattern */}
          <div className="w-full flex flex-col sm:flex-row items-center gap-4 mb-6">
            {/* Categories: pills on all views, horizontal scroll on mobile, wrap on desktop. Only one rendering per view. */}
            <div className="w-full sm:w-auto flex-1 flex flex-col items-center sm:items-start">
              {/* Desktop & tablet: flex-wrap pills */}
              <div className="hidden sm:flex flex-wrap gap-3 pb-1 w-full max-w-7xl">
                {categoriesLoading ? (
                  <p className="text-sm text-pink-400">Loading categories...</p>
                ) : (
                  displayCategories.map((cat) => (
                    <button
                      key={cat.key}
                      onClick={() => setSelectedCategory(cat.key)}
                      className={`px-4 py-2 font-semibold border text-sm transition-colors duration-150 whitespace-nowrap shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 rounded-md ${
                        selectedCategory === cat.key
                          ? 'bg-pink-500 text-white border-pink-500 shadow-md scale-105'
                          : 'bg-white text-pink-700 border-pink-200 hover:bg-pink-100/60 hover:text-pink-900'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))
                )}
              </div>
              {/* Mobile: horizontal scroll pills */}
              <div className="sm:hidden w-full overflow-x-auto pb-1 -mt-2">
                <div className="flex gap-3 min-w-max w-full max-w-7xl mx-auto">
                  {categoriesLoading ? (
                    <p className="text-sm text-pink-400">Loading categories...</p>
                  ) : (
                    displayCategories.map((cat) => (
                      <button
                        key={cat.key}
                        onClick={() => setSelectedCategory(cat.key)}
                        className={`px-4 py-2 font-semibold border text-sm transition-colors duration-150 whitespace-nowrap shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 rounded-md ${
                          selectedCategory === cat.key
                            ? 'bg-pink-500 text-white border-pink-500 shadow-md scale-105'
                            : 'bg-white text-pink-700 border-pink-200 hover:bg-pink-100/60 hover:text-pink-900'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
            {/* Sort dropdown, always modern style */}
            <div className="w-full sm:w-auto shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-auto px-4 py-2 border text-pink-700 border-pink-200 focus:border-pink-400 focus:outline-none bg-white font-semibold shadow-sm focus:ring-2 focus:ring-pink-300 rounded-md"
                aria-label="Sort products"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Low to High</option>
                <option value="price-high">High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
          {productsWithWishlist.map((product) => {
            const thumbnail = product.images?.find(img => img.isMain)?.url ||
                              product.images?.[0]?.url ||
                              '/placeholder-baby.png';
            return (
              <div 
                key={product.id} 
                className="group flex flex-col h-full cursor-pointer w-full mx-auto overflow-hidden bg-white shadow-md hover:shadow-xl border border-pink-100/50 transition-all duration-300 hover:-translate-y-1 focus-within:ring-2 focus-within:ring-pink-300 rounded-md"
                tabIndex={0}
                onClick={() => router.push(`/client/product/${product.id}`)}
                onKeyDown={e => { if (e.key === 'Enter') router.push(`/client/product/${product.id}`); }}
              >
                {/* Image container: Square aspect ratio is taller than your original but balanced */}
                <div className="relative aspect-square w-full flex items-center justify-center overflow-hidden bg-white shrink-0 shadow-md group-hover:shadow-lg transition-all">
                  <img 
                    src={thumbnail} 
                    alt={product.name} 
                    className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105 rounded-md" 
                    loading="lazy"
                  />
                  <button 
                    onClick={e => { e.stopPropagation(); handleWishlistToggle(product); }}
                    className={`absolute top-2 right-2 p-2 text-pink-400 hover:text-rose-500 hover:bg-rose-50 transition-all active:scale-95 shadow-sm hover:shadow-md bg-white/80 focus:outline-none focus:ring-2 focus:ring-pink-300 rounded-md`}
                    title="Add to wishlist"
                    aria-label={product.isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart className={`w-5 h-5 ${product.isWishlisted ? 'fill-pink-500 text-pink-500' : 'text-pink-300'}`} />
                  </button>
                </div>
                {/* Compact text area */}
                <div className="py-8 px-5 flex flex-col grow justify-between gap-6">
                  <div>
                    <h3 className="font-extrabold text-gray-700 text-base sm:text-lg line-clamp-2 mb-2">{product.name}</h3>
                    <p className="text-pink-500 font-bold text-md pt-1 pb-2 mt-0">${Number(product.price).toFixed(2)}</p>
                  </div>
                  <button 
                    onClick={e => { e.stopPropagation(); handleAddToCart(product); }}
                    disabled={addingToCart === product.id}
                    className="w-full bg-pink-500 text-white py-3 font-bold hover:bg-rose-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-3 text-sm sm:text-base shadow focus:outline-none focus:ring-2 focus:ring-pink-300 rounded-md"
                    aria-label="Add to cart"
                  >
                    {addingToCart === product.id ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <h3 className="text-2xl font-extrabold text-pink-700 mb-2">No products found</h3>
              <p className="text-pink-400 text-base">Try changing your filters or search query.</p>
            </div>
        )}
      </main>
    </div>
    </div>
  );
}