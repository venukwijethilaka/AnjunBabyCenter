"use client";


import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/app/redux";

export default function Home() {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/client/homePage");
    } else {
      router.replace("/client/homePage");
    }
  }, [user, router]);

  return null;
}