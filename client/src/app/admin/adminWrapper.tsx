"use client";
import React from 'react'
import StoreProvider, { useAppSelector} from '../redux'
import Navbar from "./(components)/NavBar/index"
import Sidebar from "./(components)/SideBar/index"


const AdminLayout = ({children}: {children: React.ReactNode}) => {

    const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);

  return (
    <div className={` flex bg-white text-gray-900 w-full min-h-screen`}>
        <Sidebar />
        <main className={`flex flex-col w-full h-full py-7 px-9 bg-gray-200 ${ isSidebarCollapsed ? "md:pl-24" : "md:pl-72" }`}>
            <Navbar />
            {children}
        </main>
        </div>
  )
}

const AdminWrapper = ({children}: {children: React.ReactNode}) => {
    return (
    <StoreProvider><AdminLayout>{children}</AdminLayout></StoreProvider>
  )
}

export default AdminWrapper