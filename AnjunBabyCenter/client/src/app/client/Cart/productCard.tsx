"use client";

import React from "react";
import { Trash2, Plus, Minus } from "lucide-react";
import Image from "next/image";

export type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  images?: { url: string }[];
};

type Props = {
  item: CartItem;
  onQuantityChange: (delta: number) => void;
  onDelete: () => void;
};

const CartProductCard = ({ item, onQuantityChange, onDelete }: Props) => {
  return (
    <div className="flex items-center gap-4 p-3 rounded-xl bg-white border border-gray-100 hover:border-theme-border transition-all">
      {/* Image Container - Matches Homepage Card */}
      <div className="relative w-16 h-16 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-50">
        <Image
          src={item.images?.[0]?.url || "/placeholder.png"}
          alt={item.name}
          fill
          sizes="64px"
          className="object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold text-gray-800 truncate mb-0.5">
          {item.name}
        </h3>
        <p className="text-sm font-extrabold text-theme-primary">Rs. {Number(item.price).toFixed(2)}
        </p>

        {/* Updated Quantity Control - Slimmer */}
        <div className="flex items-center mt-2">
          <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
            <button
              onClick={() => onQuantityChange(-1)}
              className="px-2 py-1 hover:bg-gray-50 text-gray-500 transition-colors"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="px-2 text-xs font-bold text-gray-700 border-x border-gray-100 min-w-[30px] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => onQuantityChange(1)}
              className="px-2 py-1 hover:bg-gray-50 text-gray-500 transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete/Total Section */}
      <div className="flex flex-col items-end justify-between self-stretch">
        <button
          onClick={onDelete}
          className="p-1.5 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        <p className="text-xs font-bold text-gray-400">Rs. {(item.price * item.quantity).toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default CartProductCard;