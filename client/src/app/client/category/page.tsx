"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useGetCategoriesQuery } from "@/state/api";
import CategorySection from "./components/CategorySection";
import Navbar from "../(components)/NavBar";
import Footer from "../Footer/page"; // Added Footer for consistency

export default function CustomerStorefront() {
  const { data: allCategories = [], isLoading } = useGetCategoriesQuery();
  const router = useRouter();
  
  // Filter for top-level categories
  const mainCategories = allCategories.filter((c) => !c.parentId);

  if (isLoading) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="w-10 h-10 border-4 border-pink-100 border-t-pink-500 rounded-full animate-spin mb-4" />
      <p className="text-pink-500 font-bold animate-pulse">Loading Collections...</p>
    </div>
  );

  const handleSubCategoryClick = (sub: any) => {
    router.push(`/client/product?category=${encodeURIComponent(sub.name)}`);
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
              />
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}