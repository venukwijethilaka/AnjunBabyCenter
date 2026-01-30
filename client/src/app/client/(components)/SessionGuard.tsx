"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setCredentials, logout } from "@/state/authSlice";

export default function SessionGuard({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // 1. If Redux already has a user, we are good.
      if (user) {
        setLoading(false);
        return;
      }

      // 2. If Redux is empty (e.g., page refresh), try to find data in Storage
      try {
        // Check LocalStorage first (Remember Me)
        let token = localStorage.getItem("token");
        let userStr = localStorage.getItem("user");
        let refreshToken = localStorage.getItem("refreshToken");

        // If not in Local, check SessionStorage (Session Only)
        if (!token || !userStr) {
            token = sessionStorage.getItem("token");
            userStr = sessionStorage.getItem("user");
            refreshToken = sessionStorage.getItem("refreshToken");
        }

        // 3. If found, Restore to Redux
        if (token && userStr) {
            const parsedUser = JSON.parse(userStr);
            dispatch(setCredentials({
                user: parsedUser,
                token: token,
                refreshToken: refreshToken || undefined,
                isRestoring: true // ✅ Important: Don't re-save to storage
            }));
        }
      } catch (error) {
        console.error("Session restore failed", error);
        // If data is corrupted, clear everything
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [dispatch, user]);

  // 4. Show a Spinner while checking (Prevents redirect flicker)
  if (loading) {
    return (
        <div className="h-screen w-full flex items-center justify-center bg-gray-50">
            {/* Using blue-600 to be neutral for both Admin/Client */}
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
    );
  }

  return <>{children}</>;
}