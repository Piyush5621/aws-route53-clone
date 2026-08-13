"use client";

import React from "react";
import Link from "next/link";
import { GitMerge, ArrowRight, Sparkles, Layers, ShieldCheck, Zap } from "lucide-react";

export default function TrafficPoliciesPage() {
  return (
    <div className="space-y-6 text-xs select-none max-w-4xl">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-white flex items-center space-x-2">
          <GitMerge className="w-5 h-5 text-[#ec7211]" />
          <span>Traffic Policies (Traffic Flow)</span>
        </h1>
        <p className="text-gray-400 text-xs mt-1">
          Simplify DNS routing management using visual traffic policies for failover, latency, geolocation, and multi-value answers.
        </p>
      </div>

      {/* Feature Showcase Card */}
      <div className="bg-[#161e2e] border border-[#384c63] rounded-lg p-6 space-y-4 shadow-xl">
        <div className="flex items-center space-x-2 text-[#ec7211]">
          <Sparkles className="w-5 h-5" />
          <span className="font-bold text-sm">Traffic Flow Visual Editor — Coming Soon</span>
        </div>

        <p className="text-gray-300 leading-relaxed text-xs">
          Traffic policies allow you to design complex routing configurations with a drag-and-drop visual editor. Automatically re-route end users based on endpoint health, geographical origin, or network latency.
        </p>

        {/* Visual Mock Diagram */}
        <div className="bg-[#0f1b2a] border border-[#384c63] rounded-lg p-6 my-4 space-y-4">
          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Preview Architecture</div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-[#161e2e] border border-[#384c63] rounded p-3 text-gray-300">
              <Zap className="w-5 h-5 text-[#ec7211] mx-auto mb-1" />
              <p className="font-bold text-white">DNS Query</p>
              <p className="text-[10px] text-gray-400 mt-0.5">app.example.com</p>
            </div>

            <div className="bg-[#232f3e] border border-[#ec7211]/50 rounded p-3 text-[#ec7211]">
              <GitMerge className="w-5 h-5 mx-auto mb-1" />
              <p className="font-bold">Latency Routing Rule</p>
              <p className="text-[10px] text-gray-300 mt-0.5">Evaluates nearest edge location</p>
            </div>

            <div className="bg-[#161e2e] border border-green-700/50 rounded p-3 text-green-300">
              <ShieldCheck className="w-5 h-5 text-green-400 mx-auto mb-1" />
              <p className="font-bold text-white">Healthy Endpoint</p>
              <p className="text-[10px] text-gray-400 mt-0.5">us-east-1 ALB</p>
            </div>
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
