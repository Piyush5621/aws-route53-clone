"use client";

import React from "react";
import Link from "next/link";
import { HeartPulse, ArrowRight, Activity, ShieldCheck, Clock } from "lucide-react";

export default function HealthChecksPage() {
  return (
    <div className="space-y-6 text-xs select-none max-w-4xl">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-white flex items-center space-x-2">
          <HeartPulse className="w-5 h-5 text-green-400" />
          <span>Health Checks</span>
        </h1>
        <p className="text-gray-400 text-xs mt-1">
          Route 53 health checks monitor the health and performance of your web servers, HTTP endpoints, and CloudWatch alarms.
        </p>
      </div>

      {/* Feature Showcase Card */}
      <div className="bg-[#161e2e] border border-[#384c63] rounded-lg p-6 space-y-4 shadow-xl">
        <div className="flex items-center space-x-2 text-green-400">
          <Activity className="w-5 h-5" />
          <span className="font-bold text-sm">Automated Endpoint Monitoring — Coming Soon</span>
        </div>

        <p className="text-gray-300 leading-relaxed text-xs">
          Route 53 sends HTTP, HTTPS, or TCP requests to your specified IP address or domain name at regular intervals. If your endpoint becomes unreachable, Route 53 triggers DNS failover.
        </p>

        {/* Mock Health Check List */}
        <div className="bg-[#0f1b2a] border border-[#384c63] rounded-lg overflow-hidden my-4">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-[#232f3e] text-gray-400 font-semibold text-[11px] uppercase tracking-wider">
              <tr>
                <th className="p-3">Health Check Name</th>
                <th className="p-3">Target Endpoint</th>
                <th className="p-3">Protocol</th>
                <th className="p-3">Health Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#232f3e]">
              <tr className="hover:bg-[#1f2937]">
                <td className="p-3 font-semibold text-white">web-prod-us-east-1</td>
                <td className="p-3 font-mono text-gray-300">192.0.2.10:443</td>
                <td className="p-3 font-mono text-gray-400">HTTPS</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-900/40 text-green-300 border border-green-700/50 flex items-center space-x-1 w-fit">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Healthy (100%)</span>
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-[#1f2937]">
                <td className="p-3 font-semibold text-white">api-gateway-eu-west-1</td>
                <td className="p-3 font-mono text-gray-300">198.51.100.25:443</td>
                <td className="p-3 font-mono text-gray-400">HTTPS</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-900/40 text-green-300 border border-green-700/50 flex items-center space-x-1 w-fit">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Healthy (100%)</span>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <span className="text-[11px] text-gray-400">
            Phase 6 — Assignment Mocked Section
          </span>

          <Link
            href="/route53/hosted-zones"
            className="inline-flex items-center space-x-1.5 bg-[#ec7211] hover:bg-[#eb5f07] text-white px-4 py-2 rounded font-semibold text-xs transition-colors"
          >
            <span>Manage Hosted Zones</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
