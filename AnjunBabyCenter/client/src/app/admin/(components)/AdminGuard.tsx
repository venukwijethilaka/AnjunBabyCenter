"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/app/redux";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // 1. Wait for User data
    if (!user) {
        // Double check session storage directly in case Redux is slow
        const sessionUser = typeof window !== 'undefined' ? sessionStorage.getItem("user") : null;
        
        if (!sessionUser) {
            router.replace("/admin/sign-in");
            return;
        }
        // If session exists but redux is empty, let SessionGuard finish (it will refresh this component)
        return; 
    }

    // 2. Check Role (Using explicit strings to be safe)
    const role = String(user.role);
    
    if (role === "ADMIN" || role === "SUPER_ADMIN") {
      setIsAuthorized(true);
      setIsChecking(false);
    } else {
      console.warn("Access Denied. Current Role:", role);
      alert("Access Denied: You are not an Administrator.");
      router.replace("/client/homePage");
    }
  }, [user, router]);

  if (isChecking && !isAuthorized) {
    return (
        <div className="h-screen w-full flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
    );
  }

  return <>{children}</>;
}