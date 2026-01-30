"use client";

import React from 'react';
import Link from 'next/link';
import { useAppSelector } from "@/app/redux";
import { User, ShoppingCart, Heart, Home } from 'lucide-react';

export default function SimpleHomePage() {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* 1. Simple Welcome Header */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
          <h1 className="text-3xl font-black text-gray-900">Demo Home</h1>
          <p className="text-gray-500 mt-2">Welcome back to Anjun Baby Center.</p>
          
          {/* User Session Check */}
          <div className="mt-6 p-4 bg-blue-50 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div>
              <p className="font-bold text-gray-800">{user?.name || "Guest User"}</p>
              <p className="text-xs text-blue-600 font-medium">{user?.email || "Not logged in"}</p>
              <p className="text-[10px] uppercase tracking-widest font-black mt-1 text-gray-400">
                Role: {user?.role || "NONE"}
              </p>
            </div>
          </div>
        </div>

        {/* 2. Main Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Profile Link */}
          <Link href="/client/profile">
            <div className="bg-white p-6 rounded-3xl border border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all group cursor-pointer text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 transition-colors">
                <User className="text-gray-600 group-hover:text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900">My Profile</h3>
              <p className="text-xs text-gray-400 mt-1">Edit your account details</p>
            </div>
          </Link>

          {/* Shop Link (Future) */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 opacity-60 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="text-gray-400" />
            </div>
            <h3 className="font-bold text-gray-400">Products</h3>
            <p className="text-xs text-gray-400 mt-1">Coming Soon</p>
          </div>

          {/* Wishlist Link (Future) */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 opacity-60 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Heart className="text-gray-400" />
            </div>
            <h3 className="font-bold text-gray-400">Favorites</h3>
            <p className="text-xs text-gray-400 mt-1">Coming Soon</p>
          </div>

        </div>

        {/* 3. Back to Landing Page */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-blue-600 transition-colors">
            <Home size={16} /> Back to Main Landing
          </Link>
        </div>

      </div>
    </div>
  );
}