"use client";

import React from "react";
import { Trash2, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

export type WishlistItem = {
  id: number;
  wishlistItemId?: number;
  name: string;
  price: number;
  images?: { url: string; isMain: boolean }[];
  description?: string;
};

type WishlistProductCardProps = {
  item: WishlistItem;
  onAddToCart: () => void;
  onDelete: () => void;
};

const WishlistProductCard = ({ item, onAddToCart, onDelete }: WishlistProductCardProps) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/client/product/${item.id}`);
  };

  const mainImage = item.images?.find(img => img.isMain)?.url;
  
  return (
    <div className="group flex items-center gap-6 p-5 rounded-3xl bg-gradient-to-r from-white to-pink-50 hover:from-pink-50 hover:to-rose-50 shadow-md hover:shadow-xl border border-pink-100/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer" onClick={handleCardClick}>
      {/* Image */}
      <div className="w-32 h-32 bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-100 rounded-2xl flex-shrink-0 shadow-md group-hover:shadow-lg transition-all overflow-hidden flex items-center justify-center">
        {mainImage ? (
          <img
            src={mainImage}
            alt={item.name}
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
            No image
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        {/* Title Section */}
        <div className="mb-3">
          <p className="font-bold text-gray-800 text-lg sm:text-xl leading-tight hover:text-pink-600 transition-colors">
            {item.name}
          </p>
        </div>
        
        {/* Description */}
        {item.description && (
          <p className="text-gray-600 text-xs sm:text-sm mt-1 line-clamp-2 mb-2">
            {item.description}
          </p>
        )}

        {/* Price Badge */}
        <div className="inline-block">
          <p className="text-pink-600 font-bold text-base sm:text-lg bg-gradient-to-r from-pink-100 to-rose-100 px-3 py-1 rounded-full">
            $ {Number(item.price).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col items-end gap-2">
        {/* Add to Cart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart();
          }}
          className="p-3 rounded-xl text-gray-400 hover:text-green-500 hover:bg-green-50 transition-all active:scale-95 shadow-sm hover:shadow-md"
          title="Add to cart"
        >
          <ShoppingCart className="w-6 h-6" />
        </button>

        {/* Delete Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-3 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all active:scale-95 shadow-sm hover:shadow-md"
          title="Remove from wishlist"
        >
          <Trash2 className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default WishlistProductCard;
