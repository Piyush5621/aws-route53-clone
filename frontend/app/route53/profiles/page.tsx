"use client";

import React from "react";
import Link from "next/link";
import { Layers, ArrowLeft } from "lucide-react";

export default function ProfilesPage() {
  return (
    <div className="max-w-2xl space-y-4 text-xs select-none">
      <Link href="/route53/hosted-zones" className="inline-flex items-center space-x-1 text-[#0073bb] hover:underline">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Hosted zones</span>
      </Link>

      <h1 className="text-xl font-bold text-white flex items-center space-x-2">
        <Layers className="w-5 h-5 text-purple-400" />
        <span>Route 53 Profiles</span>
      </h1>

      <div className="bg-[#161e2e] border border-[#384c63] rounded-lg p-6 space-y-3 text-center shadow-lg">
        <span className="inline-block bg-purple-900/40 text-purple-400 font-bold px-3 py-1 rounded text-xs border border-purple-700/50">
          Coming Soon
        </span>
        <h2 className="text-base font-bold text-white">Route 53 Profile Management</h2>
        <p className="text-gray-400 max-w-md mx-auto text-xs">
          This feature will allow you to share private hosted zone policies and DNS firewall rule groups across multiple AWS VPCs.
        </p>
      </div>
    </div>
  );
}
