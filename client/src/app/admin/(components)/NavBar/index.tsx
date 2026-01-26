"use client"
import { Bell, Menu, Moon, Search, Settings, Sun } from "lucide-react";

import React from 'react'
import Link from "next/link";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/state";


const Navbar = () => {
    const dispatch = useDispatch();
        const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);
        
        const toggleSidebar = () => {
            dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
        }
  return (
    <div className="flex justify-between items-center w-full mb-7">
        {/* left side */}
        <div className="flex justify-start w-1/3 items-center gap-5">
            <button className='px-3 py-3 bg-gray-100 rounded-full hover:bg-blue-100' onClick={toggleSidebar}>
                <Menu className="w-4 h-4" />
            </button>
        </div>

        {/* center */}
        <div className="flex justify-center items-center w-1/3">
            <div className="text-4xl font-bold font-sans text-gray-700">Admin Dashboard</div>
        </div>

        <div className="w-1/3"> </div>



        

    </div>
  )
}

export default Navbar 