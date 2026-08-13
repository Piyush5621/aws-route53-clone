// API Client for Hosted Zones & DNS Records
import { getAuthToken } from "./auth";

const API_BASE_URL = "http://localhost:8000/api";

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
