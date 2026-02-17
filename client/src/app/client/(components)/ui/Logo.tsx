// src/(components)/ui/Logo.tsx
"use client";

import React from 'react';
import Image from 'next/image';

export const Logo = ({ className }: { className?: string }) => {
  return (
    /* We use h-full to make the image fill the height of the navbar container */
    <div className={`${className} flex items-center`}>
      <Image 
        src="/logo.png" 
        alt="Logo"
        width={500} 
        height={200}
        priority
        className="object-contain w-auto h-full" 
      />
    </div>
  );
};
