"use client";

import React from "react";
import Link from "next/link";
import { GitMerge, ArrowLeft } from "lucide-react";

export default function TrafficPoliciesPage() {
  return (
    <div className="max-w-2xl space-y-4 text-xs select-none">
      <Link href="/route53/hosted-zones" className="inline-flex items-center space-x-1 text-[#0073bb] hover:underline">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Hosted zones</span>
      </Link>

      <h1 className="text-xl font-bold text-white flex items-center space-x-2">
        <GitMerge className="w-5 h-5 text-[#ec7211]" />
        <span>Traffic Policies</span>
      </h1>

      <div className="bg-[#161e2e] border border-[#384c63] rounded-lg p-6 space-y-3 text-center shadow-lg">
        <span className="inline-block bg-[#ec7211]/20 text-[#ec7211] font-bold px-3 py-1 rounded text-xs">
          Coming Soon
        </span>
        <h2 className="text-base font-bold text-white">Route 53 Traffic Flow Management</h2>
        <p className="text-gray-400 max-w-md mx-auto text-xs">
          This feature will allow you to create visual routing policies for latency, geolocation, and failover traffic management.
        </p>
      </div>
    </div>
  );
}
