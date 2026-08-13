"use client";

import React from "react";
import Link from "next/link";
import { Network, ArrowRight, Server, Shield, Database } from "lucide-react";

export default function ResolverPage() {
  return (
    <div className="space-y-6 text-xs select-none max-w-4xl">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-white flex items-center space-x-2">
          <Network className="w-5 h-5 text-blue-400" />
          <span>Route 53 Resolver</span>
        </h1>
        <p className="text-gray-400 text-xs mt-1">
          Route 53 Resolver responds recursively to DNS queries from AWS VPCs and hybrid cloud networks.
        </p>
      </div>

      {/* Feature Showcase Card */}
      <div className="bg-[#161e2e] border border-[#384c63] rounded-lg p-6 space-y-4 shadow-xl">
        <div className="flex items-center space-x-2 text-blue-400">
          <Server className="w-5 h-5" />
          <span className="font-bold text-sm">Hybrid DNS Resolution Endpoints — Coming Soon</span>
        </div>

        <p className="text-gray-300 leading-relaxed text-xs">
          Route 53 Resolver provides inbound and outbound endpoints to seamlessly resolve DNS names between Amazon VPCs and your on-premises infrastructure over AWS Direct Connect or VPN.
        </p>

        {/* Mock Endpoint Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="bg-[#0f1b2a] border border-[#384c63] rounded-lg p-4 space-y-2">
            <h3 className="font-bold text-white text-sm flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              <span>Inbound Endpoints</span>
            </h3>
            <p className="text-gray-400 text-[11px]">
              Allows on-premises DNS resolvers to query Route 53 private hosted zones in VPCs.
            </p>
          </div>

          <div className="bg-[#0f1b2a] border border-[#384c63] rounded-lg p-4 space-y-2">
            <h3 className="font-bold text-white text-sm flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span>
              <span>Outbound Endpoints</span>
            </h3>
            <p className="text-gray-400 text-[11px]">
              Forwards DNS queries from Amazon VPCs to your on-premises DNS servers.
            </p>
          </div>
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
