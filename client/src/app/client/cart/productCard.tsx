"use client";

import React from "react";
import { Trash2, Plus, Minus } from "lucide-react";

export type CartItem = {
  id: number;
  cartItemId?: number;
  name: string;
  price: number;
  quantity: number;
  images?: { url: string; isMain: boolean }[];
  stockQuantity?: number;
};
type CartProductCardProps = {
  item: CartItem;
  onQuantityChange: (delta: number) => void;
  onDelete: () => void;
};

const CartProductCard = ({ item, onQuantityChange, onDelete }: CartProductCardProps) => {
  const totalPrice = Number(item.price) * item.quantity;
  const mainImage = item.images?.find(img => img.isMain)?.url;

  return (
    <div className="group flex items-center gap-6 p-5 rounded-3xl bg-gradient-to-r from-white to-pink-50 hover:from-pink-50 hover:to-rose-50 shadow-md hover:shadow-xl border border-pink-100/50 transition-all duration-300 hover:-translate-y-1">
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
      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-800 text-base sm:text-lg">{item.name}</p>
        <p className="text-pink-600 font-semibold text-md mt-1">$ {Number(item.price).toFixed(2)}</p>
        
        {/* Stock Status */}
        <div className="mt-2">
          {item.stockQuantity !== undefined && (
            <span className={`text-xs font-semibold ${
              item.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {item.stockQuantity > 0 
                ? `✓ Stock: ${item.stockQuantity} available`
                : '🔴 Out of Stock'
              }
            </span>
          )}
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-3 mt-4 bg-white rounded-xl p-2 w-fit border border-gray-200 shadow-sm">
          <button
            onClick={() => onQuantityChange(-1)}
            className="w-8 h-8 rounded-md flex items-center justify-center text-gray-600 hover:bg-red-100 hover:text-red-600 transition-colors active:scale-95"
          >
            <Minus className="w-5 h-5" />
          </button>
          <span className="w-10 text-center font-bold text-gray-800 text-base">
            {item.quantity}
          </span>
          <button
            onClick={() => onQuantityChange(1)}
            className="w-8 h-8 rounded-md flex items-center justify-center text-gray-600 hover:bg-green-100 hover:text-green-600 transition-colors active:scale-95"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Delete Button */}
      <div className="flex flex-col items-end gap-4">
        <button
          onClick={onDelete}
          className="p-3 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all active:scale-95 shadow-sm hover:shadow-md"
          title="Remove from cart"
        >
          <Trash2 className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default CartProductCard;
