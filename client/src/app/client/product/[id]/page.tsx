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

import { useGetProductsQuery } from '@/state/api';
import StoreProvider from '@/app/redux';

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

  const { data: products = [] } = useGetProductsQuery();
  const product = products.find((p) => String(p.id) === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-linear-to-br from-pink-50 via-yellow-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Product not found</h2>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-linear-to-r from-pink-400 to-rose-400 text-white rounded-xl font-semibold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 
    ? product.images 
    : [{ url: '/placeholder.png' }];

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-yellow-50 to-blue-50">
      {/* Header */}
      

      <main className="max-w-7xl mx-auto px-6 py-12">
        <button onClick={() => router.back()} className="flex items-center gap-2 pb-7 text-pink-500 font-medium">
             <ArrowLeft className="w-5 h-5" /> Back to Shop
           </button>
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* LEFT COLUMN: Images */}
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm overflow-hidden flex items-center justify-center">
              <img
                src={images[activeImage].url}
                alt={product.name}
                className="w-full max-h-[500px] object-contain transition-transform duration-500 hover:scale-105"
              />
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {images.map((img: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
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
          <div className="flex flex-col py-2">
            <div className="mb-8">
              <span className="inline-block px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                {product.category?.name || 'Category'}
              </span>
              <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-pink-500">
                  ${Number(product.price).toFixed(2)}
                </span>
                {(product.discountPercentage ?? 0) > 0 && (
                  <span className="bg-rose-100 text-rose-600 px-3 py-1 rounded-lg text-sm font-bold">
                    Save {product.discountPercentage}%
                  </span>
                )}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-8 mb-8">
              <p className="text-gray-600 leading-relaxed text-lg">
                {product.description}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="flex flex-col gap-4 mb-10">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Quantity</h3>
              <div className="flex items-center gap-6">
                <div className="flex items-center bg-white border border-gray-200 rounded-2xl p-1 shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-pink-50 text-gray-600 transition-colors"
                  >
                    −
                  </button>
                  <span className="font-bold text-xl w-12 text-center text-gray-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.quantity ?? 1, quantity + 1))}
                    className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-pink-50 text-gray-600 transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm font-medium text-gray-400 italic">
                   {product.quantity} units available
                </span>
              </div>
            </div>

            {/* Primary Actions */}
            <div className="flex gap-4">
              <button
                disabled={!product.availability || product.quantity === 0}
                className="flex-[4] bg-linear-to-r from-pink-500 to-rose-500 text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-pink-200 hover:shadow-pink-300 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0"
              >
                <ShoppingCart className="w-6 h-6" />
                {product.quantity === 0 ? 'Out of Stock' : 'Add to Bag'}
              </button>

              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="flex-1 bg-white border border-gray-200 rounded-2xl flex items-center justify-center hover:bg-pink-50 transition-all active:scale-95"
              >
                <Heart
                  className={`w-7 h-7 transition-colors ${
                    isWishlisted ? 'fill-pink-500 text-pink-500' : 'text-gray-300'
                  }`}
                />
              </button>
            </div>
          </div>
          
        </div>
      </main>
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
