"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setCredentials, logout } from "@/state/authSlice";

export default function SessionGuard({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      // If user is already in Redux memory, we can stop loading immediately
      if (user) {
        setLoading(false);
        return;
      }

      try {
        // Check both storages
        const lToken = localStorage.getItem("token");
        const lUser = localStorage.getItem("user");
        const sToken = sessionStorage.getItem("token");
        const sUser = sessionStorage.getItem("user");

        const token = lToken || sToken;
        const userStr = lUser || sUser;

        // ✅ CRITICAL FIX: Ensure userStr is NOT the string "undefined"
        if (token && userStr && userStr !== "undefined") {
          const parsedUser = JSON.parse(userStr);
          dispatch(setCredentials({
            user: parsedUser,
            token: token,
            refreshToken: localStorage.getItem("refreshToken") || sessionStorage.getItem("refreshToken") || undefined,
            isRestoring: true 
          }));
        }
      } catch (error) {
        console.error("Session restore failed:", error);
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, [dispatch]); // Removed 'user' from dependency to prevent re-triggering during hydration

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}