"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/app/redux";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    // Only redirect if we definitely have no user
    // The SessionGuard handles the initial loading state, so if we reach here
    // with no user, it means we are truly logged out.
    if (!user) {
      router.replace("/client/sign-in");
    }
  }, [user, router]);

  if (!user) {
    return null; 
  }

  return <>{children}</>;
}