'use client';

import { useState, useMemo } from 'react';
import { Heart, ShoppingCart, Filter, Search } from 'lucide-react'; // Added Search icon
import { useRouter } from 'next/navigation';
import { useGetProductsQuery, useGetCategoriesQuery, Product, useAddToCartMutation } from '@/state/api';

export default function BabyProductsContent() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // 1. FETCH DATA FROM BACKEND
  const { data: products = [], isLoading: productsLoading, error: productsError } = useGetProductsQuery();
  const { data: rawCategories = [], isLoading: categoriesLoading } = useGetCategoriesQuery();
  const [addToCartMutation] = useAddToCartMutation();

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
  }, [products, selectedCategory, searchQuery, sortBy, rawCategories]); // Dependencies look good

  // Handle Add to Cart
  const handleAddToCart = async (product: Product) => {
    try {
      // Get user from localStorage or sessionStorage
      const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (!userStr) {
        setNotification({ message: 'Please log in to add items to cart', type: 'error' });
        router.push('/client/sign-in');
        return;
      }

      const user = JSON.parse(userStr);
      setAddingToCart(product.id);

      console.log('🔵 Step 1: User data:', { userId: user.id, productId: product.id });

      // Call add to cart mutation
      console.log('🔵 Step 2: Calling mutation...');
      const result = addToCartMutation({
        userId: user.id,
        productId: product.id,
      });
      
      console.log('🔵 Step 3: Mutation promise created');
      
      const response = await result.unwrap();
      
      console.log('🟢 Step 4: Success! Response:', response);

      setNotification({ 
        message: `${product.name} added to cart!`, 
        type: 'success' 
      });

      window.dispatchEvent(new Event('cartUpdated'));
      localStorage.setItem('cartUpdated', Date.now().toString());

      setTimeout(() => setNotification(null), 3000);
    } catch (error: any) {
      console.error('🔴 ERROR CAUGHT');
      console.error('Error:', error);
      console.error('Error?.status:', error?.status);
      console.error('Error?.data:', error?.data);
      console.error('Error?.message:', error?.message);
      
      let errorMessage = 'Failed to add item to cart';
      
      if (error?.status === 'FETCH_ERROR') {
        errorMessage = 'Cannot connect to server - is it running?';
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.data?.error) {
        errorMessage = error.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      console.error('🔴 Final error message:', errorMessage);
      
      setNotification({ 
        message: errorMessage, 
        type: 'error' 
      });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setAddingToCart(null);
    }
  };

  // Loading/Error States
  if (productsLoading) return <div className="flex justify-center items-center min-h-screen">Loading sweet things...</div>;
  if (productsError) return <div className="text-center py-20 text-red-500">Failed to load products.</div>;

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-yellow-50 to-blue-50">
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

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        
        {/* Search Bar (Missing from your previous snippet but used in logic) */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 w-5 h-5" />
          <input 
            type="text"
            placeholder="Search for baby essentials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4  text-gray-700 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border-none focus:ring-2 focus:ring-pink-300 outline-none transition-all"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {/* Categories Filter */}
          <div className="flex-1">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="w-5 h-5 text-pink-500" />
                <h3 className="font-bold text-gray-700">Categories</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {categoriesLoading ? (
                  <p className="text-sm text-gray-400">Loading categories...</p>
                ) : (
                  displayCategories.map((cat) => (
                    <button
                      key={cat.key}
                      onClick={() => setSelectedCategory(cat.key)}
                      className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 ${
                        selectedCategory === cat.key
                          ? 'bg-linear-to-r from-pink-400 to-rose-400 text-white shadow-lg'
                          : 'bg-white text-gray-600 hover:bg-pink-50 border-2 border-gray-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="md:w-64">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <h3 className="font-bold text-gray-700 mb-3">Sort By</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)} // Ensure this state update triggers useMemo
                className="w-full px-4 py-2 rounded-xl border-2 text-gray-700 border-gray-200 focus:border-pink-400 focus:outline-none bg-white"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const thumbnail = product.images?.find(img => img.isMain)?.url || 
                              product.images?.[0]?.url || 
                              '/placeholder-baby.png';

            return (
              <div key={product.id} className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                <div 
                  onClick={() => router.push(`/client/product/${product.id}`)}
                  className="relative bg-pink-100 p-8 h-64 flex items-center justify-center overflow-hidden cursor-pointer"
                >
                  <img src={thumbnail} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-800 mb-2">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-bold text-pink-500">${Number(product.price).toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={() => handleAddToCart(product)}
                    disabled={addingToCart === product.id}
                    className="w-full bg-linear-to-r from-pink-400 to-rose-400 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {addingToCart === product.id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Adding...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        Add to Cart
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
             <h3 className="text-2xl font-bold text-gray-700">No products found</h3>
             <p className="text-gray-600">Try changing your filters or search query.</p>
          </div>
        )}
      </main>
    </div>
  );
}