// API Client for Hosted Zones & DNS Records
import { getAuthToken } from "./auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const getHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export interface HostedZoneItem {
  id: number;
  name: string;
  zone_type: string;
  comment?: string;
  private: boolean;
  record_count: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface HostedZoneCreateInput {
  name: string;
  zone_type?: string;
  comment?: string;
  private?: boolean;
}

export interface DNSRecordItem {
  id: number;
  hosted_zone_id: number;
  name: string;
  record_type: string;
  ttl: number;
  value: string;
  routing_policy?: string;
  alias: boolean;
  created_at: string;
  updated_at: string;
}

export interface DNSRecordCreateInput {
  name: string;
  record_type: string;
  ttl?: number;
  value: string;
  routing_policy?: string;
  alias?: boolean;
}

export interface DNSRecordUpdateInput {
  name?: string;
  record_type?: string;
  ttl?: number;
  value?: string;
  routing_policy?: string;
  alias?: boolean;
}

// Hosted Zones API
export async function fetchHostedZones(search?: string): Promise<HostedZoneItem[]> {
  const url = new URL(`${API_BASE_URL}/hosted-zones`);
  if (search) url.searchParams.append("search", search);

  const res = await fetch(url.toString(), {
    headers: getHeaders(),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch hosted zones");
  }

  return await res.json();
}

export async function fetchHostedZoneById(id: number): Promise<HostedZoneItem> {
  const res = await fetch(`${API_BASE_URL}/hosted-zones/${id}`, {
    headers: getHeaders(),
  });

  if (!res.ok) {
    throw new Error("Hosted zone not found");
  }

  return await res.json();
}

export async function createHostedZone(data: HostedZoneCreateInput): Promise<HostedZoneItem> {
  const res = await fetch(`${API_BASE_URL}/hosted-zones`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Failed to create hosted zone" }));
    throw new Error(err.detail || "Creation failed");
  }

  return await res.json();
}

export async function updateHostedZone(id: number, comment: string): Promise<HostedZoneItem> {
  const res = await fetch(`${API_BASE_URL}/hosted-zones/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({ comment }),
  });

  if (!res.ok) {
    throw new Error("Failed to update hosted zone");
  }

  return await res.json();
}

export async function deleteHostedZone(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/hosted-zones/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (!res.ok) {
    throw new Error("Failed to delete hosted zone");
  }
}

// DNS Records API
export async function fetchZoneRecords(
  zoneId: number,
  search?: string,
  recordType?: string
): Promise<DNSRecordItem[]> {
  const url = new URL(`${API_BASE_URL}/hosted-zones/${zoneId}/records`);
  if (search) url.searchParams.append("search", search);
  if (recordType) url.searchParams.append("record_type", recordType);

  const res = await fetch(url.toString(), {
    headers: getHeaders(),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch DNS records");
  }

  return await res.json();
}

export async function createDNSRecord(
  zoneId: number,
  data: DNSRecordCreateInput
): Promise<DNSRecordItem> {
  const res = await fetch(`${API_BASE_URL}/hosted-zones/${zoneId}/records`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Failed to create DNS record" }));
    throw new Error(err.detail || "Record creation failed");
  }

  return await res.json();
}

export async function fetchDNSRecordById(recordId: number): Promise<DNSRecordItem> {
  const res = await fetch(`${API_BASE_URL}/records/${recordId}`, {
    headers: getHeaders(),
  });

  if (!res.ok) {
    throw new Error("DNS record not found");
  }

  return await res.json();
}

export async function updateDNSRecord(
  recordId: number,
  data: DNSRecordUpdateInput
): Promise<DNSRecordItem> {
  const res = await fetch(`${API_BASE_URL}/records/${recordId}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Failed to update DNS record" }));
    throw new Error(err.detail || "Record update failed");
  }

  return await res.json();
}

export async function deleteDNSRecord(recordId: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/records/${recordId}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (!res.ok) {
    throw new Error("Failed to delete DNS record");
  }
}
