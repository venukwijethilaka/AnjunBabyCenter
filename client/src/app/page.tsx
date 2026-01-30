"use client";

import Link from "next/link";
import { useAppSelector } from "@/app/redux";
import { Button } from "@/app/client/(components)/ui/Button";
import { 
  ShoppingBag, 
  LayoutDashboard, 
  ArrowRight, 
  Users, 
  ShieldCheck, 
  Package, 
  ChevronRight 
} from "lucide-react";

export default function Home() {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-blue-100 selection:text-blue-900">
      {/* --- Navigation Header --- */}
      <nav className="w-full bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:rotate-6 transition-transform">
            <Package size={22} />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl text-gray-900 leading-none tracking-tighter">
              ANJUN
            </span>
            <span className="text-[10px] uppercase font-bold text-blue-600 tracking-[0.2em] leading-none mt-1">
              Baby Center
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {!user ? (
            <>
              <Link href="/client/sign-in" className="text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors">
                Sign In
              </Link>
              <Link href="/client/sign-up">
                <Button className="px-6 rounded-full shadow-lg shadow-blue-100 hover:shadow-blue-200 transition-all">
                  Register Now
                </Button>
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-bold text-gray-700">Hi, {user.name.split(' ')[0]}</span>
            </div>
          )}
        </div>
      </nav>

      {/* --- Main Content --- */}
      <main className="flex-grow flex flex-col items-center">
        
        {/* Hero Section */}
        <section className="w-full max-w-7xl px-6 pt-20 pb-16 text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest animate-fade-in">
            <ShieldCheck size={14} />
            Enterprise Retail Solution
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-[1.1]">
            Your Premium Hub for <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-pink-500">
              Baby Care Management
            </span>
          </h1>
          
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
            A specialized digital ecosystem designed to streamline inventory, 
            optimize sales, and provide world-class service to every parent.
          </p>
        </section>

        {/* Portal Selection */}
        <section className="w-full max-w-6xl px-6 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Card 1: Client Store */}
            <div className="group relative bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col">
              <div className="absolute top-8 right-8 text-gray-200 group-hover:text-pink-100 group-hover:rotate-12 transition-all duration-500">
                <ShoppingBag size={80} strokeWidth={1} />
              </div>
              
              <div className="w-14 h-14 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <ShoppingBag size={28} />
              </div>
              
              <h2 className="text-3xl font-black text-gray-900 mb-4">Customer Experience</h2>
              <p className="text-gray-500 text-lg leading-relaxed mb-10 flex-grow pr-10">
                Access the curated collection of baby essentials. Experience seamless checkout, 
                order tracking, and personalized wishlists.
              </p>
              
              <Link href="/client/homePage">
                <Button className="w-full h-14 rounded-2xl bg-gray-900 hover:bg-pink-600 text-white shadow-xl shadow-gray-200 transition-all group/btn">
                  <span className="flex items-center justify-center gap-2 font-bold text-lg">
                    Enter Public Store <ArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
            </div>

            {/* Card 2: Admin Dashboard */}
            <div className="group relative bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl transition-all duration-500 flex flex-col overflow-hidden">
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />
              
              <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <LayoutDashboard size={28} />
              </div>
              
              <h2 className="text-3xl font-black text-white mb-4">Management Portal</h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-10 flex-grow pr-10">
                Powerful administrative tools for authorized staff. Monitor real-time analytics, 
                manage global inventory, and oversee user permissions.
              </p>
              
              <Link href="/admin/HomePage">
                <Button className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-900/20 transition-all group/btn">
                  <span className="flex items-center justify-center gap-2 font-bold text-lg">
                    Open Dashboard <LayoutDashboard className="group-hover/btn:rotate-12 transition-transform" />
                  </span>
                </Button>
              </Link>
            </div>

          </div>

          {/* Quick Stats / Info Footer */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
             {[
               { icon: <Package size={16}/>, label: "Live Inventory" },
               { icon: <Users size={16}/>, label: "Secure Auth" },
               { icon: <ShieldCheck size={16}/>, label: "Admin Control" },
               { icon: <ChevronRight size={16}/>, label: "Fast Delivery" },
             ].map((item, idx) => (
               <div key={idx} className="flex items-center justify-center gap-2 py-4 px-2 rounded-2xl border border-gray-50 bg-gray-50/30 text-gray-400 font-bold text-[10px] uppercase tracking-tighter">
                 {item.icon} {item.label}
               </div>
             ))}
          </div>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="w-full py-10 border-t border-gray-100 flex flex-col items-center gap-4">
        <div className="flex gap-8">
            <a href="#" className="text-xs font-bold text-gray-400 hover:text-blue-600">Privacy Policy</a>
            <a href="#" className="text-xs font-bold text-gray-400 hover:text-blue-600">Terms of Service</a>
            <a href="#" className="text-xs font-bold text-gray-400 hover:text-blue-600">Support</a>
        </div>
        <p className="text-xs font-black text-gray-300 tracking-[0.3em]">
          &copy; {new Date().getFullYear()} ANJUN BABY CENTER • SYSTEM V1.0
        </p>
      </footer>
    </div>
  );
}