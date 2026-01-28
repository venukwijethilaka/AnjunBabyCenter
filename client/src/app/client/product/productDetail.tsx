'use client';

import { useState } from 'react';
import { Heart, ShoppingCart, Star, Truck, Shield, RotateCcw } from 'lucide-react';

export default function BabyProductPage() {
  const [selectedColor, setSelectedColor] = useState('blush');
  const [selectedSize, setSelectedSize] = useState('medium');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const colors = [
    { name: 'blush', label: 'Blush Pink', class: 'bg-pink-200' },
    { name: 'sky', label: 'Sky Blue', class: 'bg-blue-200' },
    { name: 'mint', label: 'Mint Green', class: 'bg-emerald-200' },
    { name: 'sunshine', label: 'Sunshine Yellow', class: 'bg-amber-100' }
  ];

  const sizes = ['Newborn', 'Small', 'Medium', 'Large'];

  const productImages = [
    { emoji: '🧸', bg: 'bg-gradient-to-br from-pink-100 to-pink-200' },
    { emoji: '🌟', bg: 'bg-gradient-to-br from-yellow-100 to-amber-200' },
    { emoji: '🎀', bg: 'bg-gradient-to-br from-purple-100 to-pink-200' },
    { emoji: '☁️', bg: 'bg-gradient-to-br from-blue-100 to-sky-200' }
  ];

  const reviews = [
    { name: 'Sarah M.', rating: 5, text: 'Absolutely love this! So soft and perfect for my little one.', date: '2 weeks ago' },
    { name: 'Emma L.', rating: 5, text: 'Best baby product I\'ve purchased. Worth every penny!', date: '1 month ago' },
    { name: 'Jessica K.', rating: 5, text: 'My baby sleeps so much better with this. Highly recommend!', date: '3 weeks ago' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-yellow-50 to-blue-50">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-pink-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-yellow-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b-2 border-pink-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 via-pink-500 to-rose-400 bg-clip-text text-transparent" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            Little Wonders
          </h1>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-gray-600 hover:text-pink-500 font-medium transition-colors relative group">
              Shop
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-400 to-rose-400 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#" className="text-gray-600 hover:text-pink-500 font-medium transition-colors relative group">
              Collections
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-400 to-rose-400 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#" className="text-gray-600 hover:text-pink-500 font-medium transition-colors relative group">
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-400 to-rose-400 group-hover:w-full transition-all duration-300"></span>
            </a>
            <button className="bg-gradient-to-r from-pink-400 to-rose-400 text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Cart (0)
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-8 font-medium">
          Home / Baby Essentials / <span className="text-pink-500">Organic Cotton Blanket</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Image Section */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className={`${productImages[activeImage].bg} rounded-3xl p-12 shadow-2xl relative overflow-hidden group`}>
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 flex items-center justify-center h-96">
                <div className="text-9xl animate-bounce" style={{ animationDuration: '3s' }}>
                  {productImages[activeImage].emoji}
                </div>
              </div>
              
              {/* Floating badge */}
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                <span className="text-sm font-bold text-pink-500">NEW</span>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-4">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`${img.bg} rounded-2xl p-6 transition-all duration-300 hover:scale-105 ${
                    activeImage === index ? 'ring-4 ring-pink-400 shadow-lg' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className="text-5xl">{img.emoji}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="space-y-8">
            {/* Title and Rating */}
            <div>
              <h2 className="text-5xl font-bold text-gray-800 mb-4 leading-tight" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                Cloud Nine Organic Baby Blanket
              </h2>
              
              <p className="text-gray-600 text-lg leading-relaxed">
                Wrap your little one in pure comfort with our ultra-soft organic cotton blanket. 
                Hypoallergenic, breathable, and made with love for the gentlest touch on baby's delicate skin.
              </p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <span className="text-5xl font-bold text-pink-500">$49.99</span>
              <span className="text-2xl text-gray-400 line-through">$69.99</span>
              <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-bold">30% OFF</span>
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-gray-700 font-semibold mb-3 text-lg">
                Color: <span className="text-pink-500 font-bold">{colors.find(c => c.name === selectedColor)?.label}</span>
              </label>
              <div className="flex gap-3">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-14 h-14 rounded-full ${color.class} transition-all duration-300 hover:scale-110 ${
                      selectedColor === color.name ? 'ring-4 ring-pink-400 ring-offset-2 shadow-lg' : 'opacity-60 hover:opacity-100'
                    }`}
                    title={color.label}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <label className="block text-gray-700 font-semibold mb-3 text-lg">Size</label>
              <div className="grid grid-cols-4 gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size.toLowerCase())}
                    className={`py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                      selectedSize === size.toLowerCase()
                        ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-lg scale-105'
                        : 'bg-white text-gray-700 hover:bg-pink-50 border-2 border-gray-200'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-gray-700 font-semibold mb-3 text-lg">Quantity</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 rounded-xl bg-white border-2 border-gray-200 hover:border-pink-400 hover:bg-pink-50 transition-all duration-300 font-bold text-xl"
                >
                  −
                </button>
                <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 rounded-xl bg-white border-2 border-gray-200 hover:border-pink-400 hover:bg-pink-50 transition-all duration-300 font-bold text-xl"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button className="flex-1 bg-gradient-to-r from-pink-400 via-pink-500 to-rose-400 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3">
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`w-16 py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center ${
                  isWishlisted
                    ? 'bg-pink-500 text-white hover:bg-pink-600'
                    : 'bg-white border-2 border-gray-200 hover:border-pink-400 hover:bg-pink-50'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6">
              <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-2xl">
                <Truck className="w-8 h-8 mx-auto mb-2 text-pink-500" />
                <p className="text-sm font-semibold text-gray-700">Free Shipping</p>
              </div>
              <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-2xl">
                <Shield className="w-8 h-8 mx-auto mb-2 text-pink-500" />
                <p className="text-sm font-semibold text-gray-700">Safe & Tested</p>
              </div>
              <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-2xl">
                <RotateCcw className="w-8 h-8 mx-auto mb-2 text-pink-500" />
                <p className="text-sm font-semibold text-gray-700">30-Day Returns</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-20 grid lg:grid-cols-2 gap-12">
          {/* Description */}
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
            <h3 className="text-3xl font-bold text-gray-800 mb-6" style={{ fontFamily: "'Fredoka', sans-serif" }}>Product Details</h3>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Our Cloud Nine blanket is crafted from 100% certified organic cotton, ensuring the softest and safest experience for your precious little one.
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-3">
                  <span className="text-pink-500 font-bold">•</span>
                  <span><strong>Material:</strong> 100% GOTS certified organic cotton</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-pink-500 font-bold">•</span>
                  <span><strong>Size:</strong> 30" x 40" (perfect for cribs and strollers)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-pink-500 font-bold">•</span>
                  <span><strong>Care:</strong> Machine washable, tumble dry low</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-pink-500 font-bold">•</span>
                  <span><strong>Safety:</strong> Hypoallergenic, chemical-free, breathable</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-pink-500 font-bold">•</span>
                  <span><strong>Weight:</strong> Lightweight yet cozy (0.5 lbs)</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
            <h3 className="text-3xl font-bold text-gray-800 mb-6" style={{ fontFamily: "'Fredoka', sans-serif" }}>Customer Reviews</h3>
            <div className="space-y-6">
              {reviews.map((review, index) => (
                <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-300 to-rose-300 flex items-center justify-center text-white font-bold">
                      {review.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{review.name}</p>
                      <p className="text-sm text-gray-500">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700">{review.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      
    </div>
  );
}