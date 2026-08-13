"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Globe2,
  GitMerge,
  HeartPulse,
  Network,
  Layers,
  ChevronLeft,
  ChevronRight,
  Plus
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { title: "Dashboard", path: "/route53", icon: LayoutDashboard },
    { title: "Hosted zones", path: "/route53/hosted-zones", icon: Globe2 },
    { title: "Traffic policies", path: "/route53/traffic-policies", icon: GitMerge, badge: "Beta" },
    { title: "Health checks", path: "/route53/health-checks", icon: HeartPulse },
    { title: "Resolver", path: "/route53/resolver", icon: Network },
    { title: "Profiles", path: "/route53/profiles", icon: Layers, badge: "New" }
  ];

  return (
    <aside
      className={`${
        collapsed ? "w-14" : "w-60"
      } bg-[#161e2e] border-r border-[#384c63] flex flex-col justify-between transition-all duration-200 shrink-0 h-[calc(100vh-3rem)] sticky top-12 z-40 select-none`}
    >
      <div>
        {/* Title */}
        <div className="h-12 border-b border-[#384c63] flex items-center justify-between px-3">
          {!collapsed && (
            <span className="font-bold text-xs uppercase tracking-wider text-[#ec7211]">
              Route 53
            </span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 hover:bg-[#232f3e] rounded text-gray-400 hover:text-white transition-colors ml-auto"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Quick Action Button */}
        {!collapsed && (
          <div className="p-3 border-b border-[#384c63]">
            <Link
              href="/route53/hosted-zones/new"
              className="w-full flex items-center justify-center space-x-1.5 bg-[#ec7211] hover:bg-[#eb5f07] text-white py-1.5 px-3 rounded text-xs font-semibold shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create hosted zone</span>
            </Link>
          </div>
        )}

        {/* Navigation Options */}
        <nav className="py-2 space-y-0.5 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.path || (item.path !== "/route53" && pathname.startsWith(item.path));
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center justify-between px-2.5 py-2 rounded text-xs transition-colors ${
                  isActive
                    ? "bg-[#232f3e] text-[#ec7211] font-semibold border-l-2 border-[#ec7211]"
                    : "text-gray-300 hover:bg-[#1f2937] hover:text-white"
                }`}
                title={collapsed ? item.title : undefined}
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#ec7211]" : "text-gray-400"}`} />
                  {!collapsed && <span className="truncate">{item.title}</span>}
                </div>
                {!collapsed && item.badge && (
                  <span className="text-[10px] bg-[#ec7211]/20 text-[#ec7211] font-semibold px-1.5 py-0.2 rounded border border-[#ec7211]/30">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Operational Status */}
      {!collapsed && (
        <div className="p-3 border-t border-[#384c63] text-[11px] text-gray-400 space-y-1 bg-[#131b26]">
          <div className="flex items-center justify-between text-gray-300">
            <span>DNS Status</span>
            <span className="text-green-400 font-semibold flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse"></span>
              <span>100% Operational</span>
            </span>
          </div>
        </div>
      )}
    </aside>
  );
};
