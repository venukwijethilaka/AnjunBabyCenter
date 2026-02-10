"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useGetCategoriesQuery } from "@/state/api";
import CategorySection from "./components/CategorySection";
import Navbar from "../(components)/NavBar";

export default function CustomerStorefront() {
  const { data: allCategories = [], isLoading } = useGetCategoriesQuery();
  const router = useRouter();
  const mainCategories = allCategories.filter((c) => !c.parentId);

  if (isLoading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      {/* Sharp, fast-spinning loader to match the theme */}
      <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const handleSubCategoryClick = (sub: any) => {
    router.push(`/client/product?category=${encodeURIComponent(sub.name)}`);
  };

  return (
    <main className="min-h-screen bg-gray-50/50 pb-20">
      <Navbar />  
      
      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[120px]">
        
        

        {/* Dynamic Category Sections */}
        {/* We use space-y-24 to give it a premium, spaced-out editorial look */}
        <div className="space-y-24">
          {mainCategories.map((main) => {
            const subCats = allCategories.filter((c) => c.parentId === main.id);
            return (
              <div key={main.id} className="relative">
                {/* We pass a prop or wrap the CategorySection to ensure its internal UI is sharp */}
                <CategorySection
                  main={main}
                  subCategories={subCats}
                  onSubCategoryClick={handleSubCategoryClick}
                />
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}