"use client";
import React from "react";
import { useGetCategoriesQuery } from "@/state/api"; //
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  Facebook, 
  Instagram, 
  Twitter, 
  ChevronRight,
  Heart
} from "lucide-react";

// Matches the IDs and names in your Neon database
const MAIN_CATS = [
  { id: 1, name: "BABY GEAR" },
  { id: 2, name: "PLAYTIME & TOYS" },
  { id: 3, name: "FEEDING" },
  { id: 4, name: "BATHING" },
  { id: 5, name: "BABY SAFETY" },
  { id: 6, name: "FURNITURE" },
  { id: 7, name: "LAUNDRY" },
];

export default function CustomerStorefront() {
  const { data: allCategories = [], isLoading } = useGetCategoriesQuery(); //

  if (isLoading) return (
    <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center">
      <div className="animate-bounce text-pink-500 font-bold text-xl tracking-tighter uppercase">Anjun...</div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF5F7]">
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-pink-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex flex-col items-center cursor-pointer">
              <h1 className="text-3xl font-black text-gray-800 tracking-tighter leading-none italic">ANJUN</h1>
              <span className="text-[10px] text-pink-500 font-bold tracking-[0.2em] uppercase">Baby Center</span>
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-5">
              <button className="text-gray-600 hover:text-pink-500 transition-all"><Search size={20} /></button>
              <button className="text-gray-600 hover:text-pink-500 transition-all"><Heart size={20} /></button>
              <button className="relative text-gray-600 hover:text-pink-500 transition-all">
                <ShoppingBag size={20} />
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">0</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="mb-12 text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Our Collections</h2>
            <p className="text-gray-500 mt-2">Quality essentials for your little one's happy journey.</p>
          </div>

          <div className="space-y-16">
            {MAIN_CATS.map((main) => {
              // Filtering sub-categories based on the hierarchy in your database
              const subCats = allCategories.filter((c) => c.parentId === main.id);
              
              return (
                <section key={main.id} className="bg-white/50 rounded-[2.5rem] p-8 lg:p-12 border border-white shadow-sm overflow-hidden">
                  {/* Category Header with Light Pink Accent */}
                  <div className="flex items-center gap-4 mb-10 border-b border-pink-50 pb-6">
                    <div className="h-10 w-2 bg-pink-500 rounded-full shadow-lg shadow-pink-200" />
                    <h3 className="text-xl font-black text-gray-800 tracking-wider uppercase">{main.name}</h3>
                  </div>

                  {/* Sub-Category Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 lg:gap-12">
                    {subCats.map((sub) => (
                      <div key={sub.id} className="group flex flex-col items-center cursor-pointer">
                        <div className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-white border-[6px] border-white shadow-xl shadow-pink-100 overflow-hidden transition-transform duration-500 group-hover:scale-110">
                          {sub.imageUrl ? (
                            <img 
                              src={sub.imageUrl} // Fetches the specific image URL added via admin UI
                              alt={sub.name} 
                              className="object-cover w-full h-full" 
                            />
                          ) : (
                            <div className="w-full h-full bg-pink-50 flex items-center justify-center">
                              <ShoppingBag className="text-pink-200" size={40} />
                            </div>
                          )}
                        </div>
                        <span className="mt-5 text-sm font-black text-gray-600 text-center uppercase tracking-tighter group-hover:text-pink-500">
                          {sub.name}
                        </span>
                      </div>
                    ))}

                    {/* Updated Empty State: Notify Me Button Removed */}
                    {subCats.length === 0 && (
                      <div className="col-span-full py-10 flex flex-col items-center">
                        <div className="text-pink-300 italic font-medium text-sm tracking-tight">
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

      {/* --- FOOTER --- */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            
            <div className="space-y-4">
              <h4 className="text-2xl font-black tracking-tighter italic">ANJUN</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Premium baby essentials and care items in Sri Lanka.
              </p>
              <div className="flex space-x-4 pt-4">
                <Facebook size={18} className="text-gray-400 hover:text-pink-500 cursor-pointer transition-colors" />
                <Instagram size={18} className="text-gray-400 hover:text-pink-500 cursor-pointer transition-colors" />
              </div>
            </div>

            <div className="space-y-4">
              <h5 className="font-bold text-pink-500 uppercase text-xs tracking-[0.2em]">Quick Links</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="hover:text-white cursor-pointer transition-colors">About Us</li>
                <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
                <li className="hover:text-white cursor-pointer transition-colors">Contact Us</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h5 className="font-bold text-pink-500 uppercase text-xs tracking-[0.2em]">Customer Care</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="hover:text-white cursor-pointer transition-colors">Shipping & Returns</li>
                <li className="hover:text-white cursor-pointer transition-colors">Order Tracking</li>
                <li className="hover:text-white cursor-pointer transition-colors">FAQs</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h5 className="font-bold text-pink-500 uppercase text-xs tracking-[0.2em]">Newsletter</h5>
              <div className="flex bg-gray-800 rounded-lg overflow-hidden">
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  className="bg-transparent border-none text-sm px-4 w-full focus:ring-0 outline-none" 
                />
                <button className="bg-pink-500 px-4 py-2 hover:bg-pink-600">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-xs text-gray-500 font-medium">
            © 2026 ANJUN BABY CENTER. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}