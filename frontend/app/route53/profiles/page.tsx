"use client";

import React from "react";
import Link from "next/link";
import { Layers, ArrowRight, ShieldCheck, Sparkles, FolderGit2 } from "lucide-react";

export default function ProfilesPage() {
  return (
    <div className="space-y-6 text-xs select-none max-w-4xl">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-white flex items-center space-x-2">
          <Layers className="w-5 h-5 text-purple-400" />
          <span>Route 53 Profiles</span>
        </h1>
        <p className="text-gray-400 text-xs mt-1">
          Route 53 Profiles allow you to group DNS configurations (such as private hosted zones, Resolver rules, and Firewall rule groups) into a single profile.
        </p>
      </div>

      {/* Feature Showcase Card */}
      <div className="bg-[#161e2e] border border-[#384c63] rounded-lg p-6 space-y-4 shadow-xl">
        <div className="flex items-center space-x-2 text-purple-400">
          <FolderGit2 className="w-5 h-5" />
          <span className="font-bold text-sm">Multi-VPC Profile Distribution — Coming Soon</span>
        </div>

        <p className="text-gray-300 leading-relaxed text-xs">
          Associate a single Profile with multiple VPCs across AWS accounts in your AWS Organization to ensure consistent DNS resolution policies and security compliance.
        </p>

        <div className="bg-[#0f1b2a] border border-[#384c63] rounded-lg p-4 space-y-3 my-4">
          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Profile Capabilities</div>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Standardize Private Hosted Zone associations across 100+ VPCs</span>
            </li>
            <li className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Apply DNS Firewall Domain Lists to prevent data exfiltration</span>
            </li>
            <li className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Share profiles across organizational units via AWS Resource Access Manager (RAM)</span>
            </li>
          </ul>
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
