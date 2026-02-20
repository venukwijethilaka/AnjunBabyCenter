import React from "react";
import { ShoppingBag } from "lucide-react";

interface SubCategoryCardProps {
  sub: any;
  onClick: () => void;
}

const SubCategoryCard: React.FC<SubCategoryCardProps> = ({ sub, onClick }) => (
  <div
    className="group flex flex-col items-center cursor-pointer transition-all duration-300"
    onClick={onClick}
  >
    {/* IMAGE CONTAINER - Matches Product Card Aspect Ratio */}
    <div className="relative w-full aspect-square bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group-hover:shadow-md group-hover:border-pink-200 group-hover:-translate-y-1 transition-all duration-300">
      {sub.imageUrl ? (
        <img
          src={sub.imageUrl}
          alt={sub.name}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-50">
          <ShoppingBag className="text-pink-200" size={32} />
        </div>
      )}

      {/* BADGES - Rounded to match theme */}
      <div className="absolute top-2 left-2 flex flex-col gap-1.5">
        {sub.isNew && (
          <span className="bg-pink-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-sm">
            New
          </span>
        )}
      </div>

      {/* SOFT OVERLAY */}
      <div className="absolute inset-0 bg-pink-500/0 group-hover:bg-pink-500/5 transition-colors duration-300" />
    </div>

    {/* TEXT CONTENT */}
    <div className="mt-4 flex flex-col items-center w-full px-2">
      <span className="text-sm font-bold text-gray-700 text-center group-hover:text-pink-600 transition-colors line-clamp-1">
        {sub.name}
      </span>
      
      {/* INDICATOR LINE */}
      <div className="h-1 w-0 bg-pink-400 rounded-full mt-2 group-hover:w-8 transition-all duration-300 ease-out" />
    </div>
  </div>
);

export default SubCategoryCard;