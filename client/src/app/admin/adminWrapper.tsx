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
        <main className={`flex flex-col w-full h-screen bg-gray-200 overflow-hidden transition-all duration-300 ${ isSidebarCollapsed ? "md:pl-24" : "md:pl-72" }`}>
            <div className="pt-7 px-9 shrink-0">
                <Navbar />
            </div>
            {/* The wrapper below allows children to fill the screen but not push it down */}
            <div className="flex-1 overflow-hidden flex flex-col px-9 pb-7">
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