"use client";

import React from 'react';
import { usePathname } from 'next/navigation';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const isForgotPassword = pathname.includes('forgot-password');
  const isSignUp = pathname.includes('sign-up');

  // Dynamic Content & Image Switcher
  const bannerConfig = isSignUp ? {
    title: "Start Your Journey.",
    subtext: "We’re so glad you’re here. Join us and discover something special today.",
    image: "/images/signup-banner.png"
  } : {
    title: "Welcome Back.",
    subtext: "Continue where you left off. Your personalized dashboard awaits.",
    image: "/images/signin-banner.png"
  };

  // ---------------------------------------------------------
  // SCENARIO 1: FORGOT PASSWORD (Simple, No Banner)
  // ---------------------------------------------------------
  if (isForgotPassword) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
             {children}
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------
  // SCENARIO 2: SIGN IN & SIGN UP (Split Screen with Dynamic Banner)
  // ---------------------------------------------------------
  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-4 lg:p-8">
      
      <div className="w-full max-w-6xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex min-h-[800px]">
        
        {/* --- LEFT SIDE: THE BANNER --- */}
        {/* ✅ FIX: Removed 'bg-gray-900' background color */}
        <div className="hidden lg:flex w-5/12 relative text-white flex-col justify-between p-12">
            
            {/* Background Image */}
            {/* ✅ FIX: Changed opacity-90 to opacity-100 for full brightness */}
            <img 
                src={bannerConfig.image} 
                alt="Banner" 
                className="absolute inset-0 w-full h-full object-cover opacity-100 transition-opacity duration-500"
            />
            
            {/* ✅ FIX: Removed the dark gradient overlay div entirely */}

            {/* Content Over the Image */}
            {/* Added a subtle text shadow so white text is readable on bright images */}
            <div className="relative z-10 mt-auto space-y-4 drop-shadow-lg">
                <h2 className="text-4xl font-bold tracking-tight leading-tight">{bannerConfig.title}</h2>
                <p className="text-white text-lg font-medium leading-relaxed">
                    {bannerConfig.subtext}
                </p>
            </div>
        </div>

        {/* --- RIGHT SIDE: THE FORM --- */}
        <div className="w-full lg:w-7/12 bg-white p-8 md:p-16 flex items-center justify-center">
            <div className="w-full max-w-md">
                {children}
            </div>
        </div>

      </div>
    </div>
  );
}