"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  ShoppingCart, Package, Heart, LogOut,
  Search, X, Star, Home, LayoutGrid, Mars, Venus
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { logout } from "@/state/authSlice";
import { toggleTheme, setTheme } from "@/state/globalSlice";
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

  // --- REDUX THEME STATE ---
  const theme = useAppSelector((state) => state.global.theme);

  // DB DATA FETCHING
  const { data: loyaltyTiers = [] } = useGetLoyaltyLevelsQuery(undefined, { skip: !user });
  const { data: products = [] } = useGetProductsQuery();
  const { data: profileData } = useGetProfileQuery(user?.id?.toString() || "", { skip: !user });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // --- SEARCH LOGIC ---
  const searchResults = useMemo(() => {
    if (searchTerm.length < 2) return [];
    return products.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 6);
  }, [searchTerm, products]);

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim() !== '') {
      setIsSearchOpen(false);
      router.push(`/client/product?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  // --- LOYALTY LOGIC ---
  const loyalty = useMemo(() => {
    const points = profileData?.loyaltyPoints || 0;
    if (!loyaltyTiers || loyaltyTiers.length === 0) return { name: "New", gradient: "linear-gradient(to right, #94a3b8, #64748b)", isSupreme: false };

    const sortedTiers = [...loyaltyTiers].sort((a, b) => b.minPoints - a.minPoints);
    const currentTier = sortedTiers.find(t => points >= t.minPoints) || sortedTiers[sortedTiers.length - 1];

    if (!currentTier) return { name: "New", gradient: "linear-gradient(to right, #94a3b8, #64748b)", isSupreme: false };
    const colors = currentTier.color?.split('|') || ['#94a3b8', '#64748b'];
    return { name: currentTier.name, gradient: `linear-gradient(135deg, ${colors[0]}, ${colors[1] || colors[0]})`, isSupreme: currentTier.minPoints >= 5000 || currentTier.id === 7 };
  }, [profileData?.loyaltyPoints, loyaltyTiers]);

  // --- AVATAR LOGIC ---
  const avatarSrc = useMemo(() => {
    const url = profileData?.avatar || DEFAULT_AVATAR;
    if (url.startsWith('data:')) return url;
    const version = profileData?.updatedAt ? new Date(profileData.updatedAt).getTime() : Date.now();
    return `${url}?v=${version}`;
  }, [profileData?.avatar, profileData?.updatedAt]);

  useEffect(() => {
    if (isSearchOpen) setTimeout(() => searchInputRef.current?.focus(), 100);
  }, [isSearchOpen]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/client/sign-in");
  };

  // --- NEW SWITCH TOGGLE COMPONENT (Now uses Redux Dispatch) ---
  const ThemeToggle = () => (
    <button
      onClick={() => dispatch(toggleTheme())}
      className={`relative w-14 h-8 rounded-full transition-colors duration-300 focus:outline-none shadow-inner border border-gray-100 bg-theme-toggle-bg`}
      title={`Switch to ${theme === 'girl' ? 'Boys' : 'Girls'} Theme`}
    >
      <div
        className={`absolute top-[3px] left-[3px] w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center transition-transform duration-300 text-theme-primary ${theme === 'girl' ? 'translate-x-0' : 'translate-x-6'
          }`}
      >
        {theme === 'girl' ? <Venus className="w-4 h-4" strokeWidth={3} /> : <Mars className="w-4 h-4" strokeWidth={3} />}
      </div>
    </button>
  );

  return (
    <>
      {/* --- MOBILE SEARCH OVERLAY --- */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] bg-white p-6 animate-in fade-in zoom-in-95 duration-200 lg:hidden">
          <div className="flex items-center gap-4 mb-8">
            <div className={`flex-grow flex items-center bg-gray-100 rounded-2xl px-4 py-3 border border-transparent focus-within:border-theme-border`}>
              <Search className={`w-5 h-5 mr-2 text-theme-light`} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search products..."
                className="bg-transparent border-none outline-none focus:outline-none ring-0 focus:ring-0 w-full text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearchSubmit}
              />
            </div>
            <button onClick={() => { setIsSearchOpen(false); setSearchTerm(""); }} className="p-2 bg-gray-100 rounded-full">
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
          <div className="space-y-4">
            {searchResults.map(p => (
              <Link key={p.id} href={`/client/product/${p.id}`} onClick={() => setIsSearchOpen(false)} className="flex items-center gap-4 p-2 border-b border-gray-50">
                <img src={p.images[0]?.url} className="w-12 h-12 rounded-lg object-cover" />
                <span className="font-bold text-gray-800">{p.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* --- DESKTOP NAVBAR --- */}
      <div className="hidden lg:block fixed top-6 left-0 right-0 z-50 px-6">
        <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-md border border-gray-100 rounded-[2rem] px-8 py-3 flex items-center justify-between shadow-sm relative">

          <Link href="/client/homePage" className="shrink-0 flex items-center group">
            <div className="transition-all duration-300 transform group-hover:scale-105">
              <img
                src={theme === 'girl' ? '/Glogo.png' : '/Blogo.png'}
                alt="Anjun Baby Center Logo"
                className="h-12 w-auto object-contain"
              />
            </div>
          </Link>

          {/* SEARCH COMPONENT */}
          <div className="flex-grow max-w-md mx-8 relative">
            <div className={`flex items-center bg-gray-50/50 rounded-2xl px-5 py-2 border border-transparent transition-all focus-within:border-theme-border focus-within:bg-white`}>
              <Search className={`w-4 h-4 mr-3 text-theme-light`} />
              <input
                type="text"
                placeholder="Search products..."
                className="bg-transparent border-none outline-none ring-0 focus:ring-0 w-full text-sm font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearchSubmit}
              />
              {searchTerm && <X className={`w-4 h-4 cursor-pointer text-gray-400 hover:text-theme-primary`} onClick={() => setSearchTerm("")} />}
            </div>

            {/* DB SEARCH RESULTS DROPDOWN */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[60] animate-in slide-in-from-top-2">
                {searchResults.map(p => (
                  <Link
                    key={p.id}
                    href={`/client/product/${p.id}`}
                    onClick={() => setSearchTerm("")}
                    className={`flex items-center gap-3 p-3 transition-colors border-b last:border-0 border-gray-50 bg-theme-bg`}
                  >
                    <img src={p.images[0]?.url} className="w-10 h-10 rounded-lg object-cover" />
                    <div className="flex-grow">
                      <p className="text-sm font-bold text-gray-800 line-clamp-1">{p.name}</p>
                      <p className={`text-xs font-black text-theme-primary`}>Rs. {Number(p.price).toFixed(2)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* NAV ACTIONS */}
          <div className="flex items-center gap-4">

            {/* Desktop Theme Toggle */}
            <ThemeToggle />

            <nav className="flex items-center gap-2 mr-4 ml-2">
              <Link href="/client/homePage" className={`p-2 rounded-2xl transition-colors ${pathname === '/client/homePage' ? `bg-theme-bg text-theme-primary` : `text-slate-500 hover:bg-gray-50 hover:text-theme-primary`}`}><Home className="w-5 h-5" /></Link>
              <Link href="/client/product" className={`p-2 rounded-2xl transition-colors ${pathname === '/client/product' ? `bg-theme-bg text-theme-primary` : `text-slate-500 hover:bg-gray-50 hover:text-theme-primary`}`}><LayoutGrid className="w-5 h-5" /></Link>
              <button onClick={() => setIsWishlistOpen(true)} className={`p-2 rounded-2xl text-slate-500 hover:bg-gray-50 transition-colors hover:text-theme-primary`}><Heart className="w-5 h-5" /></button>
              <button onClick={() => setIsCartOpen(true)} className={`p-2 rounded-2xl text-slate-500 hover:bg-gray-50 transition-colors hover:text-theme-primary`}><ShoppingCart className="w-5 h-5" /></button>
              <Link href="/client/my-orders" className={`p-2 rounded-2xl transition-colors ${pathname === '/client/my-orders' ? `bg-theme-bg text-theme-primary` : `text-slate-500 hover:bg-gray-50 hover:text-theme-primary`}`}><Package className="w-5 h-5" /></Link>
            </nav>

            {user ? (
              <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
                <div className="text-right">
                  <p className="text-[11px] font-bold text-slate-800 leading-none">{profileData?.name || user.name}</p>
                  <span className="text-[9px] font-black uppercase bg-clip-text text-transparent" style={{ backgroundImage: loyalty.gradient }}>
                    {loyalty.name} Member
                  </span>
                </div>
                <Link href="/client/profile" className="relative p-[2px] transition-transform hover:scale-110 active:scale-95" style={{ background: loyalty.gradient, borderRadius: '9999px' }}>
                  <div className="bg-white rounded-full p-[2px]">
                    <img src={avatarSrc} className="w-10 h-10 object-cover rounded-full" alt="Profile" />
                  </div>
                  {loyalty.isSupreme && (
                    <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-gray-100">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    </div>
                  )}
                </Link>
                <button onClick={handleLogout} className="p-2 text-slate-300 hover:text-rose-500"><LogOut className="w-5 h-5" /></button>
              </div>
            ) : (
              <Link href="/client/sign-in" className={`px-5 py-2 text-white text-sm font-bold rounded-xl shadow-md transition-all bg-theme-primary hover:bg-theme-bg-hover`}>Login</Link>
            )}
          </div>
        </div>
      </div>

      {/* --- MOBILE TOP BAR --- */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 px-6 py-3 flex justify-between items-center">
        <Link href="/client/homePage" className="flex items-center">
          <img
            src={theme === 'girl' ? '/Glogo.png' : '/Blogo.png'}
            alt="Anjun Baby Center Logo"
            className="h-10 w-auto object-contain"
          />
        </Link>
        <div className="flex items-center gap-3">
          {/* Mobile Theme Toggle */}
          <ThemeToggle />
          <button onClick={() => setIsWishlistOpen(true)} className={`p-2 text-slate-500 transition-colors hover:text-theme-primary`}><Heart className="w-6 h-6" /></button>
          <button onClick={() => setIsSearchOpen(true)} className={`p-2 text-slate-500 transition-colors hover:text-theme-primary`}><Search className="w-6 h-6" /></button>
        </div>
      </div>

      {/* --- MOBILE BOTTOM NAV --- */}
      <nav className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] bg-white/95 backdrop-blur-xl border border-gray-100 rounded-[2rem] px-6 py-4 flex justify-between items-center z-50 shadow-2xl">
        <Link href="/client/homePage" className={`transition-colors ${pathname === '/client/homePage' ? 'text-theme-primary' : 'text-slate-400'}`}><Home className="w-6 h-6" /></Link>
        <Link href="/client/product" className={`transition-colors ${pathname === '/client/product' ? 'text-theme-primary' : 'text-slate-400'}`}><LayoutGrid className="w-6 h-6" /></Link>
        <Link href="/client/profile" className="p-[2px] rounded-full" style={{ background: loyalty.gradient }}>
          <div className="bg-white rounded-full p-[1.5px]">
            <img src={avatarSrc} className="w-9 h-9 rounded-full object-cover" alt="Profile" />
          </div>
        </Link>
        <Link href="/client/my-orders" className={`transition-colors ${pathname === '/client/my-orders' ? 'text-theme-primary' : 'text-slate-400'}`}><Package className="w-6 h-6" /></Link>
        <button onClick={() => setIsCartOpen(true)} className="text-slate-400"><ShoppingCart className="w-6 h-6" /></button>
      </nav>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <WishlistSidebar isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
    </>
  );
}