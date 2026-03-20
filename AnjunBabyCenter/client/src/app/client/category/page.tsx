"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useGetCategoriesQuery } from "@/state/api";
import CategorySection from "./components/CategorySection";
import Navbar from "../(components)/NavBar";
import Footer from "../Footer/page"; 

export default function CustomerStorefront() {
  const { data: allCategories = [], isLoading } = useGetCategoriesQuery();
  const router = useRouter();
  
  // Filter for top-level categories
  const mainCategories = allCategories.filter((c) => !c.parentId);

  if (isLoading) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      {/* ✅ CHANGED: Spinner colors to theme variables */}
      <div className="w-10 h-10 border-4 border-theme-toggle-bg border-t-theme-primary rounded-full animate-spin mb-4" />
      <p className="text-theme-primary font-bold animate-pulse">Loading Collections...</p>
    </div>
  );

  const handleSubCategoryClick = (sub: any) => {
    // Navigates to product page and automatically filters by this Sub-Category
    router.push(`/client/product?category=${encodeURIComponent(sub.name.toLowerCase())}`);
  };

  const handleExploreAllClick = (main: any) => {
    // Navigates to product page and automatically filters by the Main Category (which selects all its children)
    router.push(`/client/product?category=${encodeURIComponent(main.name.toLowerCase())}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />  
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[140px] pb-32">
        {/* Dynamic Category Sections */}
        <div className="space-y-20 md:space-y-32">
          {mainCategories.map((main) => {
            const subCats = allCategories.filter((c) => c.parentId === main.id);
            return (
              <CategorySection
                key={main.id}
                main={main}
                subCategories={subCats}
                onSubCategoryClick={handleSubCategoryClick}
                onExploreAllClick={handleExploreAllClick}
              />
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}