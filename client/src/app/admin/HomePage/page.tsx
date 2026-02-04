"use client";
import React from 'react';
import { LayoutDashboard, Image as ImageIcon,SlidersHorizontal } from 'lucide-react';

const HomePageSettingsPage = () => {
  // This is a placeholder page for managing home page content, like banners.

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-8 space-y-6">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="text-gray-500" size={28} />
            <h1 className="text-2xl font-bold text-gray-800">Home Page Settings</h1>
          </div>
          {/* Action buttons like "Add Banner" could go here */}
        </header>

        <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col items-center justify-center text-center py-16">
                <SlidersHorizontal size={48} className="text-gray-300 mb-4" />
                <h2 className="text-xl font-bold text-gray-700">Coming Soon!</h2>
                <p className="text-gray-500 mt-2 max-w-md">
                    This section will allow you to manage the content displayed on your client-facing home page, such as promotional banners, featured products, and more.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default HomePageSettingsPage;