"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/route53");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0f1b2a] flex flex-col justify-center items-center text-white text-xs font-sans">
      <div className="flex items-center space-x-2 animate-pulse">
        <div className="bg-[#ec7211] text-white font-bold px-2 py-1 rounded text-xs">AWS</div>
        <span>Redirecting to Amazon Route 53 Console...</span>
      </div>
    </div>
  );
}
