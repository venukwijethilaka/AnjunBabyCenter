"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingCart,Package, Heart, User, LogOut, LogIn, UserPlus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { logout } from "@/state/authSlice";
import CartSidebar from "../../Cart/page";
import WishlistSidebar from "../../wishlist/page";
export default function Navbar() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/client/sign-in");
  };

  return (
    <>
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 
                    w-[95%] max-w-7xl
                    bg-white/95 backdrop-blur-md
                    shadow-lg border border-pink-100/70
                    rounded-2xl transition-all duration-300 hover:shadow-xl">
        
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
          {/* Logo */}
          <Link href="/client/homePage" className="flex items-center gap-2 select-none">
            <span className="font-extrabold text-pink-500 text-xl tracking-tight">AnjunBaby</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2 sm:gap-4">
            {user ? (
              <>
                {/* Cart Toggle */}
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="p-2 rounded-md hover:bg-pink-100/60 transition-colors text-pink-500"
                  title="Cart"
                >
                  <ShoppingCart className="w-5 h-5" />
                </button>

                {/* Wishlist */}
                <button 
                  onClick={() => setIsWishlistOpen(true)} 
                  className="p-2 rounded-md hover:bg-pink-100/60 transition-colors text-pink-500"
                >
                  <Heart className="w-5 h-5" />
                </button>

                {/* My Orders */}
               
                  
               
                <Link
                  href="/client/my-orders"
                  className="p-2 rounded-md hover:bg-pink-100/60 transition-colors text-pink-500 hover:text-pink-700"
                  title="My Orders"
                >
                  <Package className="w-5 h-5" />
                </Link>

                {/* Profile */}
                <Link
                  href="/client/profile"
                  className="p-2 rounded-md hover:bg-pink-100/60 transition-colors text-pink-500 hover:text-pink-700"
                  title="My Profile"
                >
                  <User className="w-5 h-5" />
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="ml-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-md shadow-sm transition-colors text-sm"
                >
                  <LogOut className="inline w-4 h-4 mr-1 -mt-0.5" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/client/sign-in"
                  className="px-4 py-2 bg-pink-500 hover:bg-rose-500 text-white font-bold rounded-md shadow-sm text-sm"
                >
                  <LogIn className="inline w-4 h-4 mr-1 -mt-0.5" /> Login
                </Link>
                <Link
                  href="/client/sign-up"
                  className="ml-2 px-4 py-2 bg-white text-pink-500 border border-pink-300 hover:bg-pink-50 font-bold rounded-md text-sm"
                >
                  <UserPlus className="inline w-4 h-4 mr-1 -mt-0.5" /> Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* CartSidebar positioned outside nav for full-screen overlay behavior */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <WishlistSidebar isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
    
    </>
  );
}