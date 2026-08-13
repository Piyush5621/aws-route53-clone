"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Edit2,
  Globe,
  RefreshCw,
  X,
  SlidersHorizontal,
  Download
} from "lucide-react";
import {
  fetchHostedZoneById,
  fetchZoneRecords,
  createDNSRecord,
  updateDNSRecord,
  deleteDNSRecord,
  exportZoneBind,
  HostedZoneItem,
  DNSRecordItem
} from "@/lib/api";
import { useToast } from "@/components/aws/Toast";
import { SearchBar } from "@/components/aws/SearchBar";
import { Pagination } from "@/components/aws/Pagination";

export default function HostedZoneDetailPage() {
  const params = useParams();
  const zoneId = Number(params.id);

  const [zone, setZone] = useState<HostedZoneItem | null>(null);
  const [records, setRecords] = useState<DNSRecordItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const { showToast } = useToast();

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Create Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [recName, setRecName] = useState("");
  const [recType, setRecType] = useState("A");
  const [recTtl, setRecTtl] = useState(300);
  const [recValue, setRecValue] = useState("");
  const [creating, setCreating] = useState(false);

  // Edit Modal State
  const [editingRecord, setEditingRecord] = useState<DNSRecordItem | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editTtl, setEditTtl] = useState(300);
  const [updating, setUpdating] = useState(false);

  const loadData = async () => {
    if (!zoneId) return;
    setLoading(true);
    try {
      const z = await fetchHostedZoneById(zoneId);
      setZone(z);
      const r = await fetchZoneRecords(zoneId, search, typeFilter);
      setRecords(r);
    } catch (err: any) {
      showToast("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    setCurrentPage(1);
  }, [zoneId, search, typeFilter]);

  const handleExportBind = async () => {
    if (!zone) return;
    try {
      await exportZoneBind(zoneId, zone.name);
      showToast("Zone File Exported", `Exported BIND file for ${zone.name}`, "success");
    } catch (err: any) {
      showToast("Export Failed", err.message, "error");
    }
  };

  const handleCreateRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await createDNSRecord(zoneId, {
        name: recName ? `${recName}.${zone?.name}` : zone?.name || "",
        record_type: recType,
        ttl: recTtl,
        value: recValue,
        routing_policy: "Simple",
        alias: false,
      });
      showToast("Record Created", `Successfully created ${recType} record`, "success");
      setShowCreateModal(false);
      setRecName("");
      setRecValue("");
      loadData();
    } catch (err: any) {
      showToast("Creation Failed", err.message, "error");
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;
    setUpdating(true);
    try {
      await updateDNSRecord(editingRecord.id, {
        value: editValue,
        ttl: editTtl,
      });
      showToast("Record Updated", `Successfully updated record ${editingRecord.name}`, "success");
      setEditingRecord(null);
      loadData();
    } catch (err: any) {
      showToast("Update Failed", err.message, "error");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteRecord = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete record ${name}?`)) return;
    try {
      await deleteDNSRecord(id);
      showToast("Record Deleted", `Successfully deleted record ${name}`, "success");
      loadData();
    } catch (err: any) {
      showToast("Delete Failed", err.message, "error");
    }
  };

  // Pagination Calculation
  const totalPages = Math.ceil(records.length / pageSize) || 1;
  const paginatedRecords = records.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6 text-xs">
      {/* Navigation & Summary Header */}
      <div>
        <Link
          href="/route53/hosted-zones"
          className="inline-flex items-center space-x-1 text-[#0073bb] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Hosted zones</span>
        </Link>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2 gap-4">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center space-x-2">
              <Globe className="w-5 h-5 text-[#ec7211]" />
              <span>{zone ? zone.name : "Loading zone details..."}</span>
            </h1>
            <p className="text-gray-400 text-xs mt-1">
              Hosted zone ID: <code className="text-gray-200 bg-[#161e2e] px-1.5 py-0.5 rounded">{zoneId}</code> · Type: {zone?.zone_type || "PUBLIC"}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={loadData}
              className="p-2 bg-[#161e2e] border border-[#384c63] rounded text-gray-300 hover:text-white"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={handleExportBind}
              className="flex items-center space-x-1.5 bg-[#161e2e] border border-[#384c63] hover:border-gray-400 text-gray-200 px-3 py-1.5 rounded font-semibold transition-colors"
              title="Export BIND Zone File"
            >
              <Download className="w-4 h-4 text-[#ec7211]" />
              <span>Export BIND File</span>
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-1.5 bg-[#ec7211] hover:bg-[#eb5f07] text-white px-3 py-1.5 rounded font-semibold shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create record</span>
            </button>
          </div>
        </div>
      </div>

      {/* Control / Filter Bar */}
      <div className="bg-[#161e2e] border border-[#384c63] rounded p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search records by name..."
          />

          <div className="flex items-center space-x-1.5 bg-[#0f1b2a] border border-[#384c63] rounded px-2.5 py-1.5 text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-transparent border-none outline-none text-gray-200"
            >
              <option value="">All Record Types</option>
              <option value="A">A</option>
              <option value="AAAA">AAAA</option>
              <option value="CNAME">CNAME</option>
              <option value="TXT">TXT</option>
              <option value="MX">MX</option>
              <option value="NS">NS</option>
              <option value="SOA">SOA</option>
              <option value="CAA">CAA</option>
            </select>
          </div>
        </div>

        <span className="text-gray-400">
          Showing {paginatedRecords.length} of {records.length} record(s)
        </span>
      </div>

      {/* Records Data Table */}
      <div className="bg-[#161e2e] border border-[#384c63] rounded overflow-hidden shadow-lg">
        <table className="w-full text-left text-xs text-gray-200 border-collapse">
          <thead className="bg-[#232f3e] text-gray-300 border-b border-[#384c63] font-semibold text-[11px] uppercase tracking-wider">
            <tr>
              <th className="p-3">Record name</th>
              <th className="p-3">Type</th>
              <th className="p-3">Routing policy</th>
              <th className="p-3">TTL (Seconds)</th>
              <th className="p-3">Value / Route traffic to</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#232f3e]">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-400">
                  Loading DNS records...
                </td>
              </tr>
            ) : paginatedRecords.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-400">
                  No DNS records match your filter criteria.
                </td>
              </tr>
            ) : (
              paginatedRecords.map((r) => (
                <tr key={r.id} className="hover:bg-[#1f2937] transition-colors">
                  <td className="p-3 font-semibold text-white font-mono">{r.name}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#232f3e] text-[#ec7211] border border-[#ec7211]/40 font-mono">
                      {r.record_type}
                    </span>
                  </td>
                  <td className="p-3 text-gray-300">{r.routing_policy || "Simple"}</td>
                  <td className="p-3 font-mono text-gray-300">{r.ttl}</td>
                  <td className="p-3 font-mono text-gray-300 max-w-sm truncate">{r.value}</td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => {
                        setEditingRecord(r);
                        setEditValue(r.value);
                        setEditTtl(r.ttl);
                      }}
                      className="text-gray-300 hover:text-white p-1"
                      title="Edit record"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {r.record_type !== "NS" && r.record_type !== "SOA" && (
                      <button
                        onClick={() => handleDeleteRecord(r.id, r.name)}
                        className="text-red-400 hover:text-red-300 p-1"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination Footer */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={records.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Create Record Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#161e2e] border border-[#384c63] rounded-lg max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#384c63] pb-3">
              <h2 className="text-base font-bold text-white">Create record in {zone?.name}</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRecord} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 mb-1">Record name</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={recName}
                    onChange={(e) => setRecName(e.target.value)}
                    placeholder="api"
                    className="flex-1 bg-[#0f1b2a] border border-[#384c63] rounded p-2 text-white font-mono focus:border-[#ec7211]"
                  />
                  <span className="text-gray-400 font-mono">.{zone?.name}</span>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Record type</label>
                <select
                  value={recType}
                  onChange={(e) => setRecType(e.target.value)}
                  className="w-full bg-[#0f1b2a] border border-[#384c63] rounded p-2 text-white font-mono focus:border-[#ec7211]"
                >
                  <option value="A">A - Routes traffic to an IPv4 address</option>
                  <option value="AAAA">AAAA - Routes traffic to an IPv6 address</option>
                  <option value="CNAME">CNAME - Routes traffic to another domain name</option>
                  <option value="TXT">TXT - Arbitrary text record</option>
                  <option value="MX">MX - Routes mail to a mail server</option>
                  <option value="NS">NS - Name server record</option>
                  <option value="CAA">CAA - Certificate authority authorization</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-1">TTL (Seconds)</label>
                <input
                  type="number"
                  required
                  value={recTtl}
                  onChange={(e) => setRecTtl(Number(e.target.value))}
                  className="w-full bg-[#0f1b2a] border border-[#384c63] rounded p-2 text-white font-mono focus:border-[#ec7211]"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Value / Route traffic to</label>
                <textarea
                  required
                  rows={3}
                  value={recValue}
                  onChange={(e) => setRecValue(e.target.value)}
                  placeholder={recType === "A" ? "192.0.2.1" : "lb.example.com"}
                  className="w-full bg-[#0f1b2a] border border-[#384c63] rounded p-2 text-white font-mono focus:border-[#ec7211]"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 bg-[#0f1b2a] border border-[#384c63] rounded text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-1.5 bg-[#ec7211] hover:bg-[#eb5f07] font-semibold rounded text-white"
                >
                  {creating ? "Creating..." : "Create record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Record Modal */}
      {editingRecord && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#161e2e] border border-[#384c63] rounded-lg max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#384c63] pb-3">
              <h2 className="text-base font-bold text-white">Edit record {editingRecord.name}</h2>
              <button onClick={() => setEditingRecord(null)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateRecord} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 mb-1">TTL (Seconds)</label>
                <input
                  type="number"
                  required
                  value={editTtl}
                  onChange={(e) => setEditTtl(Number(e.target.value))}
                  className="w-full bg-[#0f1b2a] border border-[#384c63] rounded p-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Value / Target</label>
                <textarea
                  required
                  rows={3}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full bg-[#0f1b2a] border border-[#384c63] rounded p-2 text-white font-mono"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingRecord(null)}
                  className="px-3 py-1.5 bg-[#0f1b2a] border border-[#384c63] rounded text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-1.5 bg-[#ec7211] hover:bg-[#eb5f07] font-semibold rounded text-white"
                >
                  {updating ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
