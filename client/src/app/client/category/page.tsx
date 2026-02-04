"use client";
import React from "react";
import { useGetCategoriesQuery } from "@/state/api";
import { ShoppingBag } from "lucide-react";

export default function CustomerStorefront() {
  const { data: allCategories = [], isLoading } = useGetCategoriesQuery();

  // Logic to separate top-level categories from their children
  const mainCategories = allCategories.filter((c) => !c.parentId);

  if (isLoading) return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-yellow-50 to-blue-50 flex items-center justify-center">
      <div className="animate-bounce text-pink-500 font-bold text-xl tracking-tighter uppercase">
        Anjun...
      </div>
    </div>
  );

  return (
    <main className="min-h-screen flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-pink-50 via-yellow-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Title Section */}
        <div className="mb-12 text-center lg:text-left">
          <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            Our Collections
          </h2>
          <p className="text-gray-500 mt-2">
            Quality essentials for your little one's happy journey.
          </p>
        </div>

        {/* Dynamic Category Sections */}
        <div className="space-y-16">
          {mainCategories.map((main) => {
            // Filter sub-categories that belong to this specific main category
            const subCats = allCategories.filter((c) => c.parentId === main.id);
            
            return (
              <section 
                key={main.id} 
                className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 lg:p-12 border border-white shadow-lg overflow-hidden"
              >
                {/* Visual Category Header */}
                <div className="flex items-center gap-4 mb-10 border-b border-pink-100 pb-6">
                  <div className="h-10 w-2 bg-pink-500 rounded-full shadow-lg shadow-pink-200" />
                  <h3 className="text-xl font-black text-gray-800 tracking-wider uppercase">
                    {main.name}
                  </h3>
                </div>

                {/* Sub-Category Interactive Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 lg:gap-12">
                  {subCats.map((sub) => (
                    <div key={sub.id} className="group flex flex-col items-center cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-4">
                      <div className="relative w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-pink-50 border-[4px] border-white shadow-lg overflow-hidden transition-transform duration-500 group-hover:scale-105">
                        {sub.imageUrl ? (
                          <img 
                            src={sub.imageUrl} 
                            alt={sub.name} 
                            className="object-cover w-full h-full" 
                          />
                        ) : (
                          <div className="w-full h-full bg-pink-50 flex items-center justify-center">
                            <ShoppingBag className="text-pink-200" size={40} />
                          </div>
                        )}
                      </div>
                      <span className="mt-4 text-sm font-black text-gray-700 text-center uppercase tracking-tighter group-hover:text-pink-500">
                        {sub.name}
                      </span>
                    </div>
                  ))}

                  {/* Empty State for Categories with no sub-items */}
                  {subCats.length === 0 && (
                    <div className="col-span-full py-10 flex flex-col items-center">
                      <div className="text-pink-400 italic font-medium text-sm tracking-tight">
                        Our new arrivals for {main.name} are coming soon!
                      </div>
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}