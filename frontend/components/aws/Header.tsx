"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Bell, Globe, ChevronDown, ShieldCheck, HelpCircle } from "lucide-react";
import { getCurrentAuthUser, clearAuthSession } from "@/lib/auth";

export const Header: React.FC = () => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const user = getCurrentAuthUser();

  const handleLogout = () => {
    clearAuthSession();
    window.location.href = "/login";
  };

  return (
    <header className="h-12 bg-[#232f3e] text-white flex items-center justify-between px-4 border-b border-[#384c63] sticky top-0 z-50 select-none shadow-md">
      {/* Left: AWS Logo & Service Title */}
      <div className="flex items-center space-x-4">
        <Link href="/route53" className="flex items-center space-x-2 group">
          <div className="bg-[#ec7211] text-white font-black text-xs px-2 py-0.5 rounded tracking-tighter shadow-sm group-hover:bg-[#eb5f07] transition-colors">
            aws
          </div>
          <span className="font-semibold text-sm tracking-wide text-gray-100 group-hover:text-white transition-colors">
            Amazon Route 53
          </span>
        </Link>

        {/* Global AWS Service Search */}
        <div className="hidden md:flex items-center bg-[#161e2e] border border-[#384c63] rounded px-2.5 py-1 text-xs text-gray-300 w-72 focus-within:border-[#ec7211] transition-all">
          <Search className="w-3.5 h-3.5 text-gray-400 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search for services, features, docs..."
            className="bg-transparent border-none outline-none text-xs text-white placeholder-gray-400 w-full"
          />
        </div>
      </div>

      {/* Right: Region, Support, Notifications, IAM Profile */}
      <div className="flex items-center space-x-3 text-xs">
        {/* Global/Region Scope Indicator */}
        <div className="relative">
          <button
            onClick={() => setShowRegionDropdown(!showRegionDropdown)}
            className="flex items-center space-x-1.5 hover:bg-[#161e2e] px-2 py-1 rounded transition-colors text-gray-200"
          >
            <Globe className="w-3.5 h-3.5 text-[#ec7211]" />
            <span className="font-medium">Global</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>

          {showRegionDropdown && (
            <div className="absolute right-0 mt-1 w-64 bg-[#161e2e] border border-[#384c63] rounded shadow-xl py-2 z-50 text-xs">
              <div className="px-3 py-1.5 font-semibold text-gray-400 border-b border-[#384c63] text-[11px] uppercase tracking-wider">
                Route 53 Scope
              </div>
              <div className="px-3 py-2 text-gray-300">
                <p className="font-medium text-[#ec7211]">Global Edge Service</p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Route 53 DNS operates globally across 300+ AWS edge locations.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <button className="p-1.5 hover:bg-[#161e2e] rounded text-gray-300 hover:text-white transition-colors relative" title="Notifications">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#ec7211] rounded-full"></span>
        </button>

        {/* User IAM Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center space-x-1.5 hover:bg-[#161e2e] px-2 py-1 rounded transition-colors border border-transparent hover:border-[#384c63]"
          >
            <div className="w-5 h-5 rounded-full bg-[#ec7211] text-white flex items-center justify-center font-bold text-[10px]">
              AWS
            </div>
            <span className="font-medium text-gray-200">{user ? user.name : "admin@route53.com"}</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-1 w-64 bg-[#161e2e] border border-[#384c63] rounded shadow-xl py-2 z-50 text-xs">
              <div className="px-3 py-2 border-b border-[#384c63]">
                <p className="font-bold text-white flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
                  <span>IAM Administrator</span>
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">{user ? user.email : "admin@route53.com"}</p>
              </div>

              <div className="py-1">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-1.5 text-red-400 hover:bg-[#232f3e] hover:text-red-300 transition-colors"
                >
                  Sign Out of Console
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
