"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Globe,
  Plus,
  Activity,
  GitMerge,
  HeartPulse,
  Network,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ExternalLink
} from "lucide-react";
import { fetchHostedZones, HostedZoneItem } from "@/lib/api";

export default function Route53Dashboard() {
  const [zones, setZones] = useState<HostedZoneItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHostedZones()
      .then((data) => setZones(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const publicCount = zones.filter((z) => z.zone_type === "PUBLIC" || !z.private).length;
  const privateCount = zones.filter((z) => z.zone_type === "PRIVATE" || z.private).length;
  const totalRecords = zones.reduce((acc, z) => acc + (z.record_count || 0), 0);

  return (
    <div className="space-y-6 text-xs select-none">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-white flex items-center space-x-2">
          <Globe className="w-5 h-5 text-[#ec7211]" />
          <span>Route 53 Dashboard</span>
        </h1>
        <p className="text-gray-400 text-xs mt-1">
          Amazon Route 53 is a highly available and scalable Domain Name System (DNS) web service.
        </p>
      </div>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#161e2e] border border-[#384c63] rounded-lg p-4 space-y-2 shadow-lg">
          <div className="flex justify-between items-center text-gray-400">
            <span className="font-semibold text-gray-300">Hosted zones</span>
            <Globe className="w-4 h-4 text-[#ec7211]" />
          </div>
          <p className="text-2xl font-bold text-white">{zones.length}</p>
          <div className="text-[11px] text-gray-400 flex items-center space-x-2">
            <span>{publicCount} Public</span>
            <span>·</span>
            <span>{privateCount} Private</span>
          </div>
        </div>

        <div className="bg-[#161e2e] border border-[#384c63] rounded-lg p-4 space-y-2 shadow-lg">
          <div className="flex justify-between items-center text-gray-400">
            <span className="font-semibold text-gray-300">Total DNS records</span>
            <Activity className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">{totalRecords}</p>
          <p className="text-[11px] text-gray-400">Across all hosted zones</p>
        </div>

        <div className="bg-[#161e2e] border border-[#384c63] rounded-lg p-4 space-y-2 shadow-lg">
          <div className="flex justify-between items-center text-gray-400">
            <span className="font-semibold text-gray-300">Health checks</span>
            <HeartPulse className="w-4 h-4 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-green-400 flex items-center space-x-1">
            <span>100% Healthy</span>
          </p>
          <p className="text-[11px] text-gray-400">0 endpoints unhealthy</p>
        </div>

        <div className="bg-[#161e2e] border border-[#384c63] rounded-lg p-4 space-y-2 shadow-lg">
          <div className="flex justify-between items-center text-gray-400">
            <span className="font-semibold text-gray-300">Global DNS Status</span>
            <ShieldCheck className="w-4 h-4 text-green-400" />
          </div>
          <p className="text-lg font-bold text-white flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block animate-pulse"></span>
            <span>300+ Edge Nodes</span>
          </p>
          <p className="text-[11px] text-gray-400">100% SLA uptime</p>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div>
        <h2 className="text-sm font-bold text-white mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/route53/hosted-zones/new"
            className="bg-[#161e2e] border border-[#384c63] rounded-lg p-4 hover:border-[#ec7211] transition-all group shadow-md"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-[#ec7211]/20 text-[#ec7211] rounded">
                <Plus className="w-4 h-4" />
              </div>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
            </div>
            <h3 className="font-bold text-white text-sm">Create hosted zone</h3>
            <p className="text-gray-400 text-[11px] mt-1">
              Configure DNS routing for your domain name with public or private hosted zones.
            </p>
          </Link>

          <Link
            href="/route53/hosted-zones"
            className="bg-[#161e2e] border border-[#384c63] rounded-lg p-4 hover:border-[#ec7211] transition-all group shadow-md"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-blue-900/40 text-blue-400 rounded">
                <Globe className="w-4 h-4" />
              </div>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
            </div>
            <h3 className="font-bold text-white text-sm">Manage DNS records</h3>
            <p className="text-gray-400 text-[11px] mt-1">
              View, edit, and create A, CNAME, MX, TXT, and CAA records inside your domain.
            </p>
          </Link>

          <Link
            href="/route53/health-checks"
            className="bg-[#161e2e] border border-[#384c63] rounded-lg p-4 hover:border-[#ec7211] transition-all group shadow-md"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-green-900/40 text-green-400 rounded">
                <HeartPulse className="w-4 h-4" />
              </div>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
            </div>
            <h3 className="font-bold text-white text-sm">Configure health checks</h3>
            <p className="text-gray-400 text-[11px] mt-1">
              Monitor the health and performance of your web application servers.
            </p>
          </Link>
        </div>
      </div>

      {/* Recent Hosted Zones Table */}
      <div className="bg-[#161e2e] border border-[#384c63] rounded-lg p-4 space-y-3 shadow-lg">
        <div className="flex justify-between items-center border-b border-[#384c63] pb-2">
          <h2 className="text-sm font-bold text-white">Recent Hosted Zones</h2>
          <Link href="/route53/hosted-zones" className="text-[#0073bb] hover:underline text-xs font-semibold">
            View all hosted zones →
          </Link>
        </div>

        {zones.length === 0 ? (
          <p className="text-gray-400 py-4 text-center">No hosted zones created yet.</p>
        ) : (
          <div className="divide-y divide-[#232f3e]">
            {zones.slice(0, 5).map((z) => (
              <div key={z.id} className="py-2.5 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <Globe className="w-4 h-4 text-[#ec7211]" />
                  <div>
                    <Link href={`/route53/hosted-zones/${z.id}`} className="font-semibold text-white hover:text-[#0073bb]">
                      {z.name}
                    </Link>
                    <p className="text-[11px] text-gray-400">{z.comment || "Public hosted zone"}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-400">{z.record_count} records</span>
                  <Link
                    href={`/route53/hosted-zones/${z.id}`}
                    className="text-[#0073bb] hover:underline font-semibold"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
