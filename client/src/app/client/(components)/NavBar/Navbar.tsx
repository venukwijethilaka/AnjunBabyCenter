"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  ShoppingCart, Package, Heart, User, LogOut, 
  Search, X, Star, Home, LayoutGrid
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { logout } from "@/state/authSlice";
import { 
  useGetLoyaltyLevelsQuery, 
  useGetProductsQuery, 
  useGetProfileQuery 
} from "@/state/api";
import CartSidebar from "../../Cart/page";
import WishlistSidebar from "../../wishlist/page";

const DEFAULT_AVATAR = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAppSelector((state) => state.auth);
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const getLoyaltyStyle = (points: number = 0) => {
    if (points >= 5000) return { name: "Diamond", color: "from-cyan-400 to-blue-500", ring: "ring-cyan-400" };
    if (points >= 2000) return { name: "Platinum", color: "from-indigo-400 to-purple-500", ring: "ring-indigo-400" };
    if (points >= 500) return { name: "Gold", color: "from-amber-400 to-yellow-500", ring: "ring-amber-400" };
    return { name: "Silver", color: "from-slate-300 to-slate-400", ring: "ring-slate-200" };
  };

  const loyalty = getLoyaltyStyle(user?.loyaltyPoints || 0);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/client/sign-in");
  };

  return (
    <>
      {/* --- MOBILE SEARCH OVERLAY --- */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] bg-white p-6 animate-in fade-in zoom-in-95 duration-200 lg:hidden">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-grow flex items-center bg-gray-100 rounded-2xl px-4 py-3">
              <Search className="w-5 h-5 text-gray-400 mr-2" />
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Search for baby products..." 
                className="bg-transparent border-none focus:ring-0 w-full text-base"
              />
            </div>
            <button onClick={() => setIsSearchOpen(false)} className="p-2 bg-gray-100 rounded-full">
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
          <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">Recent Searches</div>
          {/* Add recent search items here if needed */}
        </div>
      )}

      {/* --- DESKTOP TOP BAR (Hidden on Mobile) --- */}
      <div className="hidden lg:block fixed top-6 left-0 right-0 z-50 px-6">
        <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-md border border-gray-100 rounded-[2rem] px-8 py-3 flex items-center justify-between shadow-sm">
          <Link href="/client/homePage" className="shrink-0">
            <span className="font-black text-2xl text-pink-500 tracking-tighter">AnjunBaby</span>
          </Link>

          <div className={`flex items-center gap-6 transition-all duration-500 ${isSearchOpen ? 'flex-grow px-10' : ''}`}>
            {!isSearchOpen ? (
              <nav className="flex items-center gap-2">
                <Link href="/client/homePage" className={`p-2 rounded-2xl ${pathname === '/client/homePage' ? 'bg-pink-50 text-pink-500' : 'text-slate-500 hover:bg-gray-50'}`}>
                  <Home className="w-5 h-5" />
                </Link>
                <Link href="/client/category" className={`p-2 rounded-2xl ${pathname === '/client/category' ? 'bg-pink-50 text-pink-500' : 'text-slate-500 hover:bg-gray-50'}`}>
                  <LayoutGrid className="w-5 h-5" />
                </Link>
                <button onClick={() => setIsSearchOpen(true)} className="p-2 text-slate-500 hover:bg-gray-50 rounded-2xl"><Search className="w-5 h-5" /></button>
                <div className="w-px h-6 bg-gray-200 mx-2" />
                <button onClick={() => setIsWishlistOpen(true)} className="p-2 text-slate-500 hover:bg-gray-50 rounded-2xl"><Heart className="w-5 h-5" /></button>
                <button onClick={() => setIsCartOpen(true)} className="p-2 text-slate-500 hover:bg-gray-50 rounded-2xl"><ShoppingCart className="w-5 h-5" /></button>
                <Link href="/client/my-orders" className={`p-2 rounded-2xl ${pathname === '/client/my-orders' ? 'bg-pink-50 text-pink-500' : 'text-slate-500 hover:bg-gray-50'}`}>
                  <Package className="w-5 h-5" />
                </Link>
              </nav>
            ) : (
              <div className="flex items-center w-full bg-gray-50/50 rounded-2xl px-5 py-2">
                <Search className="w-4 h-4 text-pink-400 mr-3" />
                <input ref={searchInputRef} type="text" placeholder="Search..." className="bg-transparent border-none focus:ring-0 w-full text-sm" />
                <button onClick={() => setIsSearchOpen(false)}><X className="w-4 h-4" /></button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {user ? (
              <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
                <div className="text-right">
                  <p className="text-[11px] font-bold text-slate-800 leading-none">{user.name}</p>
                  <span className={`text-[9px] font-black bg-gradient-to-r ${loyalty.color} bg-clip-text text-transparent uppercase`}>{loyalty.name}</span>
                </div>
                <Link href="/client/profile" className={`w-11 h-11 rounded-2xl p-0.5 ring-2 ${loyalty.ring} overflow-hidden`}>
                  <img src={user.avatar || DEFAULT_AVATAR} className="w-full h-full object-cover rounded-[0.6rem]" alt="Profile" />
                </Link>
                <button onClick={handleLogout} className="p-2 text-slate-300 hover:text-rose-500"><LogOut className="w-5 h-5" /></button>
              </div>
            ) : (
              <Link href="/client/sign-in" className="px-5 py-2 bg-pink-500 text-white text-sm font-bold rounded-xl">Login</Link>
            )}
          </div>
        </div>
      </div>

      {/* --- MOBILE TOP BAR --- */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-50 px-6 py-4 flex justify-between items-center">
        <span className="font-black text-xl text-pink-500 tracking-tighter">AnjunBaby</span>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsWishlistOpen(true)} className="p-2 text-slate-500"><Heart className="w-6 h-6" /></button>
          <button onClick={() => setIsSearchOpen(true)} className="p-2 text-slate-500"><Search className="w-6 h-6" /></button>
        </div>
      </div>

      {/* --- MOBILE BOTTOM NAV --- */}
      <nav className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] bg-white/95 backdrop-blur-xl border border-gray-100 rounded-3xl px-6 py-4 flex justify-between items-center z-50 shadow-xl">
        <Link href="/client/homePage" className={pathname === '/client/homePage' ? 'text-pink-500' : 'text-slate-400'}>
          <Home className="w-6 h-6" />
        </Link>
        <Link href="/client/products" className={pathname === '/client/products' ? 'text-pink-500' : 'text-slate-400'}>
          <LayoutGrid className="w-6 h-6" />
        </Link>
        <button onClick={() => setIsCartOpen(true)} className="text-slate-400 p-2">
          <ShoppingCart className="w-6 h-6" />
        </button>
        <Link href="/client/my-orders" className={pathname === '/client/my-orders' ? 'text-pink-500' : 'text-slate-400'}>
          <Package className="w-6 h-6" />
        </Link>
        <Link href="/client/profile" className={pathname === '/client/profile' ? 'text-pink-500' : 'text-slate-400'}>
          <User className="w-6 h-6" />
        </Link>
      </nav>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <WishlistSidebar isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
    </>
  );
}