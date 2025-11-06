import { AnalyzeResponse, HealthStatus, RecentSite, TracerouteResponse } from "../types";

const DEFAULT_BASE_URL = "http://localhost:8000";

const baseUrl =
  typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL
    ? String(import.meta.env.VITE_API_BASE_URL)
    : DEFAULT_BASE_URL;

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }
  return (await response.json()) as T;
}

export async function analyzeUrl(url: string): Promise<AnalyzeResponse> {
  const response = await fetch(`${baseUrl}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ url })
  });
  return handleResponse<AnalyzeResponse>(response);
}

export async function getRecentSites(): Promise<RecentSite[]> {
  const response = await fetch(`${baseUrl}/recent`);
  return handleResponse<RecentSite[]>(response);
}

export async function getHealth(): Promise<HealthStatus> {
  const response = await fetch(`${baseUrl}/health`);
  return handleResponse<HealthStatus>(response);
}

export function getApiBaseUrl(): string {
  return baseUrl;
}

export async function runTraceroute(url: string): Promise<TracerouteResponse> {
  const response = await fetch(`${baseUrl}/traceroute`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ url })
  });
  return handleResponse<TracerouteResponse>(response);
}
