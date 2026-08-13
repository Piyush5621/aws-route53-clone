"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/aws/Header";
import { Sidebar } from "@/components/aws/Sidebar";
import { ToastProvider } from "@/components/aws/Toast";
import { isAuthenticated } from "@/lib/auth";

export default function Route53Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated()) {
      router.push("/login");
    }
  }, [router]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0f1b2a] flex items-center justify-center text-white text-xs">
        Loading Route 53 Console...
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-[#0f1b2a] text-white font-sans selection:bg-[#ec7211] selection:text-white">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6 overflow-y-auto min-w-0">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
