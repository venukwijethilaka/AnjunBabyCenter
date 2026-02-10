import React from "react";
import { ShoppingBag } from "lucide-react";

interface SubCategoryCardProps {
  sub: any;
  onClick: () => void;
}

const SubCategoryCard: React.FC<SubCategoryCardProps> = ({ sub, onClick }) => (
  <div
    className="group flex flex-col items-center cursor-pointer bg-white transition-all duration-300"
    onClick={onClick}
  >
    {/* SHARP IMAGE CONTAINER */}
    <div className="relative w-full aspect-square bg-gray-50 border border-gray-100 overflow-hidden">
      {sub.imageUrl ? (
        <img
          src={sub.imageUrl}
          alt={sub.name}
          className="object-cover w-full h-full grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <ShoppingBag className="text-gray-200" size={32} />
        </div>
      )}

      {/* SHARP BADGES (No rounding) */}
      <div className="absolute top-0 left-0 flex flex-col gap-1">
        {sub.isNew && (
          <span className="bg-pink-500 text-white text-[9px] font-black uppercase tracking-widest px-2 py-1">
            New
          </span>
        )}
        {sub.isFeatured && (
          <span className="bg-gray-900 text-white text-[9px] font-black uppercase tracking-widest px-2 py-1">
            Featured
          </span>
        )}
      </div>

      {/* HOVER OVERLAY */}
      <div className="absolute inset-0 bg-pink-500/0 group-hover:bg-pink-500/5 transition-colors duration-300" />
    </div>

    {/* TEXT CONTENT */}
    <div className="mt-4 flex flex-col items-center w-full">
      <span className="text-[11px] font-black text-gray-800 text-center uppercase tracking-[0.15em] group-hover:text-pink-600 transition-colors">
        {sub.name}
      </span>
      
      {sub.description && (
        <span className="mt-1 text-[10px] font-bold text-gray-400 text-center uppercase tracking-tighter line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {sub.description}
        </span>
      )}

      {/* BOTTOM INDICATOR */}
      <div className="h-0.5 w-0 bg-pink-500 mt-2 group-hover:w-1/3 transition-all duration-300" />
    </div>
  </div>
);

export default SubCategoryCard;