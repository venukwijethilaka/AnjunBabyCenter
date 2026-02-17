"use client";
import React from 'react'
import { useAppSelector } from '../redux' 
import Navbar from "./(components)/NavBar/index"
import Sidebar from "./(components)/SideBar/index"

const AdminLayout = ({children}: {children: React.ReactNode}) => {
    const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);

  return (
    <div className="flex bg-white text-gray-900 w-full h-screen overflow-hidden">
        <Sidebar />
        {/* Changed main to overflow-hidden so it doesn't scroll the Navbar away */}
        <main className={`flex flex-col w-full h-screen bg-gray-50 overflow-hidden transition-all duration-300 ${ isSidebarCollapsed ? "md:pl-24" : "md:pl-72" }`}>
            
            <div className="pt-7 px-9 shrink-0">
                <Navbar />
            </div>

            {/* ✅ FIXED: Changed overflow-hidden to overflow-y-auto */}
            {/* Added custom-scrollbar for better visibility */}
            <div className="flex-1 overflow-y-auto px-9 pb-10 custom-scrollbar">
                {children}
            </div>
        </main>
    </div>
  )
}

const AdminWrapper = ({children}: {children: React.ReactNode}) => {
    return <AdminLayout>{children}</AdminLayout>
}

export default AdminWrapper;