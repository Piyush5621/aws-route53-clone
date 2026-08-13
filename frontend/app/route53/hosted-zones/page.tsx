"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Search, Globe, RefreshCw, ExternalLink } from "lucide-react";
import { fetchHostedZones, deleteHostedZone, HostedZoneItem } from "@/lib/api";
import { useToast } from "@/components/aws/Toast";

export default function HostedZonesPage() {
  const [zones, setZones] = useState<HostedZoneItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const { showToast } = useToast();

  const loadZones = async () => {
    setLoading(true);
    try {
      const data = await fetchHostedZones(search);
      setZones(data);
    } catch (err: any) {
      showToast("Error loading hosted zones", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadZones();
  }, [search]);

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} hosted zone(s)?`)) return;

    try {
      for (const id of selectedIds) {
        await deleteHostedZone(id);
      }
      showToast("Hosted Zone Deleted", `Successfully deleted ${selectedIds.length} hosted zone(s).`, "success");
      setSelectedIds([]);
      loadZones();
    } catch (err: any) {
      showToast("Delete Failed", err.message, "error");
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === zones.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(zones.map((z) => z.id));
    }
  };

  const toggleSelectOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2">
            <Globe className="w-5 h-5 text-[#ec7211]" />
            <span>Hosted zones ({zones.length})</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            A hosted zone contains information about how you want Route 53 to respond to DNS queries for a domain.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={loadZones}
            className="p-2 bg-[#161e2e] border border-[#384c63] rounded text-gray-300 hover:text-white hover:border-gray-400 transition-colors text-xs"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={handleDeleteSelected}
            disabled={selectedIds.length === 0}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-medium border transition-colors ${
              selectedIds.length > 0
                ? "bg-red-900/40 border-red-600 text-red-200 hover:bg-red-900/70 cursor-pointer"
                : "bg-[#161e2e] border-[#384c63] text-gray-500 cursor-not-allowed"
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>

          <Link
            href="/route53/hosted-zones/new"
            className="flex items-center space-x-1.5 bg-[#ec7211] hover:bg-[#eb5f07] text-white px-3 py-1.5 rounded text-xs font-semibold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create hosted zone</span>
          </Link>
        </div>
      </div>

      {/* Control / Search Filter Bar */}
      <div className="bg-[#161e2e] border border-[#384c63] rounded p-3 flex items-center justify-between">
        <div className="flex items-center bg-[#0f1b2a] border border-[#384c63] rounded px-3 py-1.5 text-xs text-gray-300 w-80 focus-within:border-[#ec7211]">
          <Search className="w-3.5 h-3.5 text-gray-400 mr-2 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter hosted zones by domain name..."
            className="bg-transparent border-none outline-none text-xs text-white placeholder-gray-500 w-full"
          />
        </div>

        <span className="text-xs text-gray-400">
          Showing {zones.length} zone(s)
        </span>
      </div>

      {/* AWS CloudScape Data Table */}
      <div className="bg-[#161e2e] border border-[#384c63] rounded overflow-hidden shadow-lg">
        <table className="w-full text-left text-xs text-gray-200 border-collapse">
          <thead className="bg-[#232f3e] text-gray-300 border-b border-[#384c63] font-semibold text-[11px] uppercase tracking-wider select-none">
            <tr>
              <th className="p-3 w-10 text-center">
                <input
                  type="checkbox"
                  checked={zones.length > 0 && selectedIds.length === zones.length}
                  onChange={toggleSelectAll}
                  className="rounded accent-[#ec7211]"
                />
              </th>
              <th className="p-3">Domain name</th>
              <th className="p-3">Type</th>
              <th className="p-3">Record count</th>
              <th className="p-3">Comment / Description</th>
              <th className="p-3">Created date</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#232f3e]">
            {loading ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-400">
                  Loading hosted zones...
                </td>
              </tr>
            ) : zones.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-400 space-y-2">
                  <p className="font-medium text-sm text-gray-300">No hosted zones found</p>
                  <p className="text-xs text-gray-500">Create your first public or private hosted zone to manage DNS records.</p>
                  <Link
                    href="/route53/hosted-zones/new"
                    className="inline-block mt-2 bg-[#ec7211] hover:bg-[#eb5f07] text-white px-3 py-1.5 rounded text-xs font-semibold"
                  >
                    Create hosted zone
                  </Link>
                </td>
              </tr>
            ) : (
              zones.map((zone) => (
                <tr
                  key={zone.id}
                  className={`hover:bg-[#1f2937] transition-colors ${
                    selectedIds.includes(zone.id) ? "bg-[#232f3e]" : ""
                  }`}
                >
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(zone.id)}
                      onChange={() => toggleSelectOne(zone.id)}
                      className="rounded accent-[#ec7211]"
                    />
                  </td>
                  <td className="p-3 font-semibold text-white">
                    <Link
                      href={`/route53/hosted-zones/${zone.id}`}
                      className="text-[#0073bb] hover:underline flex items-center space-x-1"
                    >
                      <span>{zone.name}</span>
                      <ExternalLink className="w-3 h-3 text-gray-400" />
                    </Link>
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase ${
                        zone.zone_type === "PUBLIC" || !zone.private
                          ? "bg-blue-900/30 text-blue-300 border border-blue-700/50"
                          : "bg-purple-900/30 text-purple-300 border border-purple-700/50"
                      }`}
                    >
                      {zone.zone_type || (zone.private ? "PRIVATE" : "PUBLIC")}
                    </span>
                  </td>
                  <td className="p-3 font-medium text-gray-300">{zone.record_count}</td>
                  <td className="p-3 text-gray-400 max-w-xs truncate">{zone.comment || "-"}</td>
                  <td className="p-3 text-gray-400">{new Date(zone.created_at).toLocaleDateString()}</td>
                  <td className="p-3 text-right">
                    <Link
                      href={`/route53/hosted-zones/${zone.id}`}
                      className="text-[#0073bb] hover:text-blue-300 text-xs font-medium"
                    >
                      View Records →
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
