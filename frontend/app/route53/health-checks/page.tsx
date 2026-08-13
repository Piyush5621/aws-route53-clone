"use client";

import React from "react";
import Link from "next/link";
import { HeartPulse, ArrowLeft } from "lucide-react";

export default function HealthChecksPage() {
  return (
    <div className="max-w-2xl space-y-4 text-xs select-none">
      <Link href="/route53/hosted-zones" className="inline-flex items-center space-x-1 text-[#0073bb] hover:underline">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Hosted zones</span>
      </Link>

      <h1 className="text-xl font-bold text-white flex items-center space-x-2">
        <HeartPulse className="w-5 h-5 text-green-400" />
        <span>Health Checks</span>
      </h1>

      <div className="bg-[#161e2e] border border-[#384c63] rounded-lg p-6 space-y-3 text-center shadow-lg">
        <span className="inline-block bg-green-900/40 text-green-400 font-bold px-3 py-1 rounded text-xs border border-green-700/50">
          Coming Soon
        </span>
        <h2 className="text-base font-bold text-white">Route 53 Health Monitoring</h2>
        <p className="text-gray-400 max-w-md mx-auto text-xs">
          This feature will allow you to monitor web servers and IP endpoints automatically for 100% uptime health checks.
        </p>
      </div>
    </div>
  );
}
