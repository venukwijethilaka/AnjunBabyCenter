"use client";

import React from "react";
import { Trash2, ShoppingCart, Heart } from "lucide-react";
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

  const mainImage = item.images?.find(img => img.isMain)?.url || item.images?.[0]?.url;
  
  return (
    <div 
      className="group flex items-center gap-4 p-3 rounded-xl bg-white border border-gray-100 hover:border-pink-200 transition-all cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Image - Consistent sizing with Cart */}
      <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-50">
        {mainImage ? (
          <img
            src={mainImage}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <Heart className="w-6 h-6" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold text-gray-800 truncate mb-0.5">
          {item.name}
        </h3>
        <p className="text-sm font-extrabold text-pink-600 mb-2">
          ${Number(item.price).toFixed(2)}
        </p>
        
        {/* Action Button - Subtle but clear */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart();
          }}
          className="flex items-center gap-1.5 bg-pink-500 text-white px-3 py-1.5 rounded-lg text-[11px] font-bold hover:bg-rose-500 transition-colors shadow-sm"
        >
          <ShoppingCart className="w-3 h-3" /> Add to Cart
        </button>
      </div>

      {/* Delete Section */}
      <div className="flex flex-col items-end justify-start self-stretch">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1.5 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default WishlistProductCard;