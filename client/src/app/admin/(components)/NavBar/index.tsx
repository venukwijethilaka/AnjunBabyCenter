"use client";

import { Menu, X } from "lucide-react";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/state/globalSlice";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );

  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };

  return (
    // Changed mb-7 to py-4 to maintain height consistency without breaking layout
    <div className="flex justify-between items-center w-full py-4 px-4 bg-white border-b border-gray-100 shrink-0">
      {/* Left Side: Sidebar Toggle */}
      <div className="flex justify-start w-1/3 items-center gap-5">
        <button
          className="px-3 py-3 bg-gray-100 rounded-full hover:bg-blue-100 transition-colors md:hidden"
          onClick={toggleSidebar}
        >
          {isSidebarCollapsed ? (
            <Menu className="w-4 h-4 text-gray-700" />
          ) : (
            <X className="w-4 h-4 text-gray-700" />
          )}
        </button>
      </div>

      {/* Center: Title */}
      <div className="flex justify-center items-center w-1/3">
        <div className="text-xl md:text-2xl font-black tracking-tight text-gray-800 whitespace-nowrap">
          Admin Console
        </div>
      </div>

      {/* Right Side: Spacer */}
      <div className="w-1/3"></div>
    </div>
  );
};

export default Navbar;