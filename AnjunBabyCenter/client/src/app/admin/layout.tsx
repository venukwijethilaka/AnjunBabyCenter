"use client";

import React from "react";
import AdminWrapper from "./adminWrapper";
import { usePathname } from "next/navigation";
import AdminGuard from "./(components)/AdminGuard"; 

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/sign-in";

  if (isLoginPage) {
      return <div className="h-screen w-full">{children}</div>;
  }

  return (
    <AdminGuard>
        {/* AdminWrapper should handle the Flex-Column logic */}
        <AdminWrapper>
            {children}
        </AdminWrapper>
    </AdminGuard>
  );
}