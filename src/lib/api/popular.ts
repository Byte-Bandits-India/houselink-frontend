/**
 * Popular Properties / Popular Regions API functions
 *
 * GET /api/v1/popular-properties  → list active "High Demand Properties" entries
 * GET /api/v1/popular-regions     → list active "High Demand Regions" entries
 *
 * No authentication required for these public endpoints.
 */

import { apiClient } from "./client";
import type { PopularPropertyApiItem, PopularRegionApiItem } from "@/types/popular";

export type { PopularPropertyApiItem, PopularRegionApiItem };

export async function getPopularProperties(city?: string): Promise<PopularPropertyApiItem[]> {
  const query = city && city !== "all" && city !== "All Cities" ? `?city=${encodeURIComponent(city)}` : "";
  const res = await apiClient.get<{ success: boolean; data: PopularPropertyApiItem[] }>(
    `/popular-properties${query}`,
    { skipAuth: true }
  );
  return res.data || [];
}

export async function getPopularRegions(city?: string): Promise<PopularRegionApiItem[]> {
  const query = city && city !== "all" && city !== "All Cities" ? `?city=${encodeURIComponent(city)}` : "";
  const res = await apiClient.get<{ success: boolean; data: PopularRegionApiItem[] }>(
    `/popular-regions${query}`,
    { skipAuth: true }
  );
  return res.data || [];
}
