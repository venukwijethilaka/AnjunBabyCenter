"use client";

import React from 'react';
import Navbar from "./(components)/NavBar/index";
import Sidebar from "./(components)/SideBar/index";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {

  return (
    <div className="flex bg-slate-50 text-slate-900 w-full h-screen overflow-hidden relative">
      <Sidebar />

      {/* Main content always takes full width — sidebar is an overlay */}
      <main className="flex flex-col w-full h-screen overflow-hidden">

        <Navbar />

        {/* The single scrollable content area */}
        <div className="flex-1 overflow-y-auto w-full custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  )
}

const AdminWrapper = ({ children }: { children: React.ReactNode }) => {
  return <AdminLayout>{children}</AdminLayout>
}

export default AdminWrapper;