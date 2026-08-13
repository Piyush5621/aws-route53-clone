"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Globe, ArrowLeft, CheckCircle2, Shield } from "lucide-react";
import { createHostedZone } from "@/lib/api";
import { useToast } from "@/components/aws/Toast";

export default function NewHostedZonePage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [zoneType, setZoneType] = useState<"PUBLIC" | "PRIVATE">("PUBLIC");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const created = await createHostedZone({
        name,
        zone_type: zoneType,
        comment,
        private: zoneType === "PRIVATE"
      });
      showToast("Hosted Zone Created", `Successfully created hosted zone for ${created.name}`, "success");
      router.push(`/route53/hosted-zones/${created.id}`);
    } catch (err: any) {
      showToast("Creation Failed", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/route53/hosted-zones"
          className="inline-flex items-center space-x-1 text-xs text-[#0073bb] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Hosted zones</span>
        </Link>
        <h1 className="text-xl font-bold text-white mt-2 flex items-center space-x-2">
          <Globe className="w-5 h-5 text-[#ec7211]" />
          <span>Create hosted zone</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Specify a domain name and zone type. Route 53 will automatically create standard NS and SOA records for your zone.
        </p>
      </div>

      {/* Creation Form */}
      <form onSubmit={handleSubmit} className="bg-[#161e2e] border border-[#384c63] rounded-lg p-6 space-y-6 shadow-xl text-xs">
        {/* Domain Name Input */}
        <div>
          <label className="block text-sm font-semibold text-white mb-1">Domain name *</label>
          <p className="text-gray-400 mb-2 text-[11px]">
            Enter the top-level domain name (e.g. <code className="text-[#ec7211]">example.com</code> or <code className="text-[#ec7211]">app.io</code>)
          </p>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="example.com"
            className="w-full bg-[#0f1b2a] border border-[#384c63] rounded p-2.5 text-white focus:outline-none focus:border-[#ec7211] text-xs font-mono"
          />
        </div>

        {/* Description / Comment */}
        <div>
          <label className="block text-sm font-semibold text-white mb-1">Comment - optional</label>
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Primary production domain for backend microservices"
            className="w-full bg-[#0f1b2a] border border-[#384c63] rounded p-2.5 text-white focus:outline-none focus:border-[#ec7211] text-xs"
          />
        </div>

        {/* Zone Type Selection */}
        <div>
          <label className="block text-sm font-semibold text-white mb-2">Type *</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                zoneType === "PUBLIC"
                  ? "bg-[#232f3e] border-[#ec7211] text-white"
                  : "bg-[#0f1b2a] border-[#384c63] text-gray-300 hover:border-gray-500"
              }`}
            >
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="zoneType"
                  value="PUBLIC"
                  checked={zoneType === "PUBLIC"}
                  onChange={() => setZoneType("PUBLIC")}
                  className="accent-[#ec7211]"
                />
                <span className="font-bold text-sm">Public hosted zone</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-2">
                Routes traffic on the internet. Anyone on the web can resolve DNS queries for records in this zone.
              </p>
            </label>

            <label
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                zoneType === "PRIVATE"
                  ? "bg-[#232f3e] border-[#ec7211] text-white"
                  : "bg-[#0f1b2a] border-[#384c63] text-gray-300 hover:border-gray-500"
              }`}
            >
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="zoneType"
                  value="PRIVATE"
                  checked={zoneType === "PRIVATE"}
                  onChange={() => setZoneType("PRIVATE")}
                  className="accent-[#ec7211]"
                />
                <span className="font-bold text-sm">Private hosted zone</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-2">
                Routes traffic within one or more Amazon VPCs in your AWS account.
              </p>
            </label>
          </div>
        </div>

        {/* Info Callout */}
        <div className="bg-[#1b2533] border border-[#384c63] rounded p-3 text-gray-300 text-[11px] flex items-start space-x-2">
          <CheckCircle2 className="w-4 h-4 text-[#ec7211] shrink-0 mt-0.5" />
          <span>
            Upon creation, Route 53 automatically allocates 4 Name Servers (NS) and a Start of Authority (SOA) record for your domain.
          </span>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3 pt-2">
          <Link
            href="/route53/hosted-zones"
            className="px-4 py-2 bg-[#0f1b2a] border border-[#384c63] rounded text-gray-300 hover:text-white transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-[#ec7211] hover:bg-[#eb5f07] font-semibold rounded text-white transition-colors shadow-sm"
          >
            {loading ? "Creating hosted zone..." : "Create hosted zone"}
          </button>
        </div>
      </form>
    </div>
  );
}
