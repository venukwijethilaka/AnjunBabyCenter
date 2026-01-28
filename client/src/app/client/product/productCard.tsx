'use client';

import { useState } from 'react';
import { Heart, ShoppingCart, Star, Filter, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useGetProductsQuery, Product } from '@/state/api';
import StoreProvider from '@/app/redux';

export default function BabyProductsContent() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { key: 'all', label: 'All' },
    { key: 'clothing', label: 'Clothing' },
    { key: 'toys', label: 'Toys' },
    { key: 'nursery', label: 'Nursery' },
    { key: 'feeding', label: 'Feeding' },
    { key: 'bath', label: 'Bath Time' },
  ];
  
  const { data: products = [], isLoading, error } = useGetProductsQuery();

  // fallback for demo/development if API returns empty
  const demoProductsFallback: Product[] = [];

  const productSource = (products && products.length > 0) ? products : demoProductsFallback;

  const filteredProducts = productSource.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category?.name === selectedCategory;
    const matchesSearch = (product.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-yellow-50 to-blue-50">
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 left-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>


      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        

        {/* Filters and Sort */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {/* Categories */}
          <div className="flex-1">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="w-5 h-5 text-pink-500" />
                <h3 className="font-bold text-gray-700">Categories</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
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
                ))}
              </div>
            </div>
          </div>

          {/* Sort */}
          <div className="md:w-64">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <h3 className="font-bold text-gray-700 mb-3">Sort By</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-pink-400 focus:outline-none bg-white"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => router.push(`/client/product/${product.id}`)}
              className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden cursor-pointer"
            >
              {/* Image Container */}
              <div className={`relative bg-linear-to-br ${product.color || 'from-pink-100 to-yellow-100'} p-8 h-64 flex items-center justify-center overflow-hidden`}>
                {product.isFeatured && (
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-pink-500 shadow-lg">
                    Featured
                  </div>
                )}
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <button className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-pink-500 hover:text-white transition-all duration-300 shadow-lg opacity-0 group-hover:opacity-100">
                  <Heart className="w-5 h-5" />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-pink-500 transition-colors">
                  {product.name}
                </h3>

                

                {/* Price */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl font-bold text-pink-500">
                    ${product.price}
                  </span>
                  {product.discountPercentage && (
                    <span className="text-sm text-gray-400 line-through">
                      ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Add to Cart Button */}
                <button className="w-full bg-linear-to-r from-pink-400 to-rose-400 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group-hover:scale-105">
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <div className="text-9xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your filters or search query</p>
          </div>
        )}
      </main>

       
    </div>
  );
}


