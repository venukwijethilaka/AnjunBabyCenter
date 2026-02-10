"use client";

import React from "react";
import { Trash2, Plus, Minus } from "lucide-react";

export type CartItem = {
  id: number;
  cartItemId?: number;
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
    <div className="group flex items-center gap-4 p-4 rounded-2xl bg-white border border-pink-100 shadow-sm hover:shadow-md transition-all">
      {/* Image */}
      <div className="w-20 h-20 bg-pink-50 rounded-xl overflow-hidden shrink-0">
        <img
          src={item.images?.[0]?.url || "/placeholder.png"}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-[13px] font-black text-gray-800 truncate uppercase tracking-tight">
          {item.name}
        </h3>
        <p className="text-[14px] font-bold text-pink-500">
          ${Number(item.price).toFixed(2)}
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center bg-gray-50 rounded-lg border border-gray-100 p-1">
            <button 
              onClick={() => onQuantityChange(-1)}
              className="p-1 hover:bg-pink-100 rounded-md text-gray-400 hover:text-pink-600 transition-colors"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-[12px] font-black w-8 text-center text-gray-700">
              {item.quantity}
            </span>
            <button 
              onClick={() => onQuantityChange(1)}
              className="p-1 hover:bg-pink-100 rounded-md text-gray-400 hover:text-pink-600 transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-end justify-between h-20">
        <button 
          onClick={onDelete}
          className="p-2 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        <p className="text-[12px] font-black text-gray-400">
          ${(item.price * item.quantity).toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default CartProductCard;