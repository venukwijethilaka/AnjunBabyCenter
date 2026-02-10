import React from "react";
import SubCategoryCard from "./SubCategoryCard";

interface CategorySectionProps {
  main: any;
  subCategories: any[];
  onSubCategoryClick: (sub: any) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({ main, subCategories, onSubCategoryClick }) => (
  <section 
    key={main.id} 
    className="bg-white border border-gray-100 shadow-sm overflow-hidden"
  >
    {/* SHARP HEADER */}
    <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
      <div className="flex items-center gap-3">
        {/* Sharp pink indicator (no rounding) */}
        <div className="h-4 w-1 bg-pink-500" />
        <h3 className="text-[13px] font-black text-gray-900 tracking-[0.2em] uppercase">
          {main.name}
        </h3>
      </div>
      
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
        {subCategories.length} Collections
      </span>
    </div>

    {/* SUB-CATEGORY GRID */}
    <div className="p-8 lg:p-10">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 lg:gap-8">
        {subCategories.map((sub) => (
          <SubCategoryCard 
            key={sub.id} 
            sub={sub} 
            onClick={() => onSubCategoryClick(sub)} 
          />
        ))}

        {/* EMPTY STATE */}
        {subCategories.length === 0 && (
          <div className="col-span-full py-12 flex flex-col items-center border-2 border-dashed border-gray-50">
            <div className="text-gray-400 font-black text-[10px] uppercase tracking-[0.2em]">
              Coming Soon
            </div>
            <div className="text-pink-500 font-bold text-[11px] mt-1">
              New arrivals for {main.name}
            </div>
          </div>
        )}
      </div>
    </div>
  </section>
);

export default CategorySection;