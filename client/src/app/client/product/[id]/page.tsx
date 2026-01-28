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

  const { data: products = [] } = useGetProductsQuery();
  const product = products.find((p) => String(p.id) === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-linear-to-br from-pink-50 via-yellow-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-4">
            Product not found
          </h2>
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

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-yellow-50 to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-pink-500"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <h1 className="text-2xl font-bold text-pink-500">Little Wonders</h1>

          <div className="w-24" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-12">
        {/* Image */}
        <div className="bg-white rounded-3xl p-6 shadow">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-96 object-cover rounded-2xl"
          />
        </div>

        {/* Details */}
        <div className="flex flex-col gap-6">
          <h1 className="text-4xl font-bold text-gray-800">
            {product.name}
          </h1>

          

          <div className="text-3xl font-bold text-pink-500">
            ${product.price}
          </div>

          <p className="text-gray-700">{product.description}</p>

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 bg-pink-200 rounded font-bold"
            >
              −
            </button>

            <span className="font-bold text-lg">{quantity}</span>

            <button
              onClick={() =>
                setQuantity(Math.min(product.quantity, quantity + 1))
              }
              className="w-10 h-10 bg-pink-200 rounded font-bold"
            >
              +
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              disabled={!product.availability}
              className="flex-1 bg-linear-to-r from-pink-400 to-rose-400 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>

            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="w-14 border rounded-xl flex items-center justify-center"
            >
              <Heart
                className={`w-6 h-6 ${
                  isWishlisted
                    ? 'fill-pink-500 text-pink-500'
                    : 'text-pink-400'
                }`}
              />
            </button>
          </div>

          {/* Benefits */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-pink-500" />
              Free shipping over $50
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-pink-500" />
              30-day guarantee
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-pink-500" />
              Easy returns
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
