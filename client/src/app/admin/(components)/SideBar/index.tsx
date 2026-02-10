"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/state/globalSlice";
import { logout } from "@/state/authSlice"; // ✅ Import logout action
import {
  Archive,
  Baby,
  Clipboard,
  Home,
  List,
  ShoppingBag,
  User,
  LucideIcon,
  X,
  LogOut, // ✅ Import LogOut icon
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // ✅ Import useRouter
import React from "react";

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isCollapsed: boolean;
}

const SidebarLink = ({
  href,
  icon: Icon,
  label,
  isCollapsed,
}: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (pathname === "/" && href === "/admin/HomePage");

  return (
    <Link href={href}>
      <div
        className={`cursor-pointer flex items-center ${
          isCollapsed ? "justify-center py-4" : "justify-start px-8 py-4"
        } hover:text-blue-500 hover:bg-blue-100 gap-3 transition-colors ${
          isActive ? "bg-blue-200 text-blue-800" : "text-gray-700"
        }`}
      >
        <Icon className="w-6 h-6 flex-shrink-0" />
        <span
          className={`font-medium whitespace-nowrap transition-all duration-300 ${
            isCollapsed
              ? "hidden group-hover:block opacity-0 group-hover:opacity-100"
              : "block"
          }`}
        >
          {label}
        </span>
      </div>
    </Link>
  );
};

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const router = useRouter(); // ✅ Initialize router
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );

  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };

  // ✅ Handle Logout
  const handleLogout = () => {
    dispatch(logout());
    router.push("/admin/sign-in");
  };

  const sidebarClassNames = `fixed flex flex-col bg-white transition-all duration-300 overflow-hidden h-full shadow-md z-40 group ${
    isSidebarCollapsed 
      ? "w-0 md:w-16 md:hover:w-64" 
      : "w-72 md:w-64"
  }`;

  return (
    <div className={sidebarClassNames}>
      {/* Top Logo Area */}
      <div
        className={`flex gap-3 justify-between md:justify-center items-center pt-8 ${
          isSidebarCollapsed ? "px-5" : "px-8"
        }`}
      >
        <div className="flex items-center gap-2">
            <Baby className="w-8 h-8 text-blue-600 flex-shrink-0" />
            <h1
            className={`font-extrabold text-2xl tracking-wide transition-opacity duration-300 ${
                isSidebarCollapsed ? "hidden group-hover:block opacity-0 group-hover:opacity-100" : "block"
            }`}
            >
            ARJUN
            </h1>
        </div>

        <button
          className="md:hidden px-2 py-2 bg-gray-100 rounded-full hover:bg-red-100 text-gray-600 hover:text-red-500"
          onClick={toggleSidebar}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Links Area */}
      <div className="grow mt-8">
        <SidebarLink
          href="/admin/HomePage"
          icon={Home}
          label="Home"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/admin/Products"
          icon={Clipboard}
          label="Products"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/admin/Category"
          icon={List}
          label="Categories"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/admin/orders"
          icon={ShoppingBag}
          label="Orders"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/admin/Users"
          icon={User}
          label="Users"
          isCollapsed={isSidebarCollapsed}
        />
      </div>

      {/* ✅ Logout Button Area */}
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 transition-colors py-4 ${
            isSidebarCollapsed ? "justify-center" : "px-8 justify-start"
          } text-gray-500 hover:text-red-600 hover:bg-red-50`}
        >
          <LogOut className="w-6 h-6 flex-shrink-0" />
          <span
            className={`font-bold whitespace-nowrap transition-all duration-300 ${
              isSidebarCollapsed
                ? "hidden group-hover:block opacity-0 group-hover:opacity-100"
                : "block"
            }`}
          >
            Logout
          </span>
        </button>

        {/* Footer */}
        <div className={`${isSidebarCollapsed ? "hidden group-hover:block" : "block"} mb-10 mt-4 transition-all duration-300`}>
          <p className="text-center text-xs text-gray-500 whitespace-nowrap">
            &copy; 2026 Anjun
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;