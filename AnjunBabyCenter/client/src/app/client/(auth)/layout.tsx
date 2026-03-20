"use client";

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAppSelector } from "@/app/redux";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const theme = useAppSelector((state) => state.global.theme);
  const [mounted, setMounted] = useState(false); // ✅ Prevents "hydration flicker"

  const isForgotPassword = pathname.includes('forgot-password');
  const isSignUp = pathname.includes('sign-up');

  // ✅ FORCE THEME ON REFRESH
  useEffect(() => {
    setMounted(true);
  }, [theme]);

  const getBannerImage = () => {
    // While mounting, we use a fallback or the current theme
    const activeTheme = theme;
    if (activeTheme === 'girl') {
      return isSignUp ? "/images/Gsignup-banner.png" : "/images/Gsignin-banner.png";
    } else {
      return isSignUp ? "/images/Bsignup-banner.png" : "/images/Bsignin-banner.png";
    }
  };

  const bannerConfig = {
    title: isSignUp ? "Start Your Journey." : "Welcome Back.",
    subtext: isSignUp
      ? "Join Anjun Baby Center and discover something special for your little one."
      : "Continue where you left off. Your personalized experience awaits.",
    image: getBannerImage()
  };

  // ✅ Prevent rendering until we know the theme (avoids the "Pink Flash" on refresh)
  if (!mounted) return <div className="min-h-screen bg-gray-50/40" />;

  if (isForgotPassword) {
    return (
      <div className="min-h-[100dvh] w-full bg-gray-50/40 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] w-full bg-gray-50/40 flex items-center justify-center p-4 lg:p-8">
      <div className="w-full max-w-6xl bg-white rounded-[32px] shadow-xl border border-gray-100 overflow-hidden flex min-h-[800px]">

        <div className="hidden lg:flex w-5/12 relative text-white flex-col justify-between p-12">
          <img
            src={bannerConfig.image}
            alt="Theme Banner"
            className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
            key={bannerConfig.image}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-[5]" />
          <div className="relative z-10 mt-auto space-y-4 drop-shadow-lg">
            <h2 className="text-4xl font-extrabold tracking-tight leading-tight">{bannerConfig.title}</h2>
            <p className="text-white/90 text-lg font-medium leading-relaxed">
              {bannerConfig.subtext}
            </p>
          </div>
        </div>

        <div className="w-full lg:w-7/12 bg-white p-8 md:p-16 flex items-center justify-center">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}