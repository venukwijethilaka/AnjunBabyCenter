"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/state/globalSlice";
import { logout } from "@/state/authSlice";
import {
  Baby,
  Clipboard,
  Home,
  List,
  ShoppingBag,
  User,
  LucideIcon,
  X,
  LogOut,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  onNavigate: () => void;
}

const SidebarLink = ({ href, icon: Icon, label, onNavigate }: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (pathname === "/admin" && href === "/admin");

  return (
    <Link href={href} onClick={onNavigate}>
      <div
        className={`cursor-pointer flex items-center justify-start px-6 py-3.5 gap-4 transition-all duration-150 relative ${isActive
          ? "bg-blue-50 text-blue-700"
          : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
          }`}
      >
        {/* Active Indicator */}
        {isActive && (
          <div className="absolute left-0 top-0 h-full w-1 bg-blue-600 rounded-r-full" />
        )}
        <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "scale-110" : ""}`} />
        <span className="font-semibold text-sm whitespace-nowrap">{label}</span>
      </div>
    </Link>
  );
};

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );

  const closeSidebar = () => dispatch(setIsSidebarCollapsed(true));

  const handleLogout = () => {
    dispatch(logout());
    router.push("/admin/sign-in");
  };

  const isOpen = !isSidebarCollapsed;

  return (
    <>
      {/* Dark Backdrop Overlay — clicking it closes the sidebar */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      {/* Sidebar Drawer */}
      <div
        className={`fixed inset-y-0 left-0 flex flex-col bg-white h-screen w-72 shadow-2xl z-50 border-r border-slate-100 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Top Logo + Close Button */}
        <div className="flex items-center justify-between px-6 pt-8 pb-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
              <Baby className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="font-black text-xl tracking-tight text-slate-800">
              ARJUN
            </h1>
          </div>
          <button
            className="p-2 bg-slate-100 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <SidebarLink href="/admin" icon={Home} label="Dashboard" onNavigate={closeSidebar} />
          <SidebarLink href="/admin/HomePage" icon={ImageIcon} label="Storefront Displays" onNavigate={closeSidebar} />
          <SidebarLink href="/admin/Products" icon={Clipboard} label="Products" onNavigate={closeSidebar} />
          <SidebarLink href="/admin/Category" icon={List} label="Categories" onNavigate={closeSidebar} />
          <SidebarLink href="/admin/orders" icon={ShoppingBag} label="Orders" onNavigate={closeSidebar} />
          <SidebarLink href="/admin/Users" icon={User} label="Users" onNavigate={closeSidebar} />
        </nav>

        {/* Logout + Footer */}
        <div className="shrink-0 pb-6 pt-4 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-3.5 text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors group"
          >
            <div className="p-1.5 rounded-xl group-hover:bg-red-50 transition-colors">
              <LogOut className="w-5 h-5 flex-shrink-0" />
            </div>
            <span className="font-semibold text-sm">Logout</span>
          </button>
          <p className="text-center text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-4">
            &copy; 2026 Anjun
          </p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;