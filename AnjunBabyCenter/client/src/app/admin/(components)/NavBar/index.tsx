"use client";

import { Menu } from "lucide-react";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/state/globalSlice";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);

  const toggleSidebar = () => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));

  return (
    <div className="flex justify-between items-center w-full py-3.5 px-6 bg-white/80 backdrop-blur-xl shadow-sm border-b border-blue-50 sticky top-0 z-30 shrink-0">

      {/* Left: Hamburger */}
      <div className="flex justify-start w-1/3 items-center">
        <button
          className="p-2.5 bg-blue-50 rounded-xl hover:bg-blue-100 text-blue-600 transition-all hover:scale-105 active:scale-95"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Center: Brand */}
      <div className="flex justify-center items-center w-1/3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span className="text-xl font-black tracking-tight text-slate-800 whitespace-nowrap">
            Admin Console
          </span>
        </div>
      </div>

      {/* Right: Spacer */}
      <div className="w-1/3" />
    </div>
  );
};

export default Navbar;