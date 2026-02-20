import React from "react";
import SubCategoryCard from "./SubCategoryCard";
import { ArrowRight } from "lucide-react";

interface CategorySectionProps {
  main: any;
  subCategories: any[];
  onSubCategoryClick: (sub: any) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({ main, subCategories, onSubCategoryClick }) => (
  <section 
    key={main.id} 
    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-pink-50/50"
  >
    {/* HEADER - Matches Homepage Section Style */}
    <div className="flex items-center justify-between px-6 py-8 md:px-10 border-b border-gray-50">
      <div className="flex items-center gap-4">
        <div className="h-8 w-1.5 bg-pink-500 rounded-full" />
        <div>
          <h3 className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight">
            {main.name}
          </h3>
          <p className="text-xs font-semibold text-pink-400 uppercase tracking-widest mt-1">
            {subCategories.length} Curated Collections
          </p>
        </div>
      </div>
      
      <button className="hidden sm:flex items-center gap-2 text-pink-500 font-bold text-sm hover:text-rose-500 transition-colors">
        Explore All <ArrowRight className="w-4 h-4" />
      </button>
    </div>

    {/* SUB-CATEGORY GRID */}
    <div className="p-6 md:p-10 bg-gradient-to-b from-white to-gray-50/30">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
        {subCategories.map((sub) => (
          <SubCategoryCard 
            key={sub.id} 
            sub={sub} 
            onClick={() => onSubCategoryClick(sub)} 
          />
        ))}

        {/* EMPTY STATE */}
        {subCategories.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-pink-100 bg-pink-50/30">
            <div className="text-pink-300 font-bold text-sm uppercase tracking-widest">
              Coming Soon
            </div>
            <div className="text-gray-500 font-medium mt-2">
              We're preparing new arrivals for {main.name}
            </div>
          </div>
        )}
      </div>
    </div>
  </section>
);

export default CategorySection;