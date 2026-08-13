"use client";

import React from "react";
import Link from "next/link";
import { Network, ArrowLeft } from "lucide-react";

export default function ResolverPage() {
  return (
    <div className="max-w-2xl space-y-4 text-xs select-none">
      <Link href="/route53/hosted-zones" className="inline-flex items-center space-x-1 text-[#0073bb] hover:underline">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Hosted zones</span>
      </Link>

      <h1 className="text-xl font-bold text-white flex items-center space-x-2">
        <Network className="w-5 h-5 text-blue-400" />
        <span>Route 53 Resolver</span>
      </h1>

      <div className="bg-[#161e2e] border border-[#384c63] rounded-lg p-6 space-y-3 text-center shadow-lg">
        <span className="inline-block bg-blue-900/40 text-blue-400 font-bold px-3 py-1 rounded text-xs border border-blue-700/50">
          Coming Soon
        </span>
        <h2 className="text-base font-bold text-white">VPC Resolver Endpoints</h2>
        <p className="text-gray-400 max-w-md mx-auto text-xs">
          This feature will allow you to configure inbound and outbound DNS resolution rules for Amazon VPC networks.
        </p>
      </div>
    </div>
  );
}
