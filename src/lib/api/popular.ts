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

export async function getPopularProperties(): Promise<PopularPropertyApiItem[]> {
  const res = await apiClient.get<{ success: boolean; data: PopularPropertyApiItem[] }>(
    "/popular-properties",
    { skipAuth: true }
  );
  return res.data || [];
}

export async function getPopularRegions(): Promise<PopularRegionApiItem[]> {
  const res = await apiClient.get<{ success: boolean; data: PopularRegionApiItem[] }>(
    "/popular-regions",
    { skipAuth: true }
  );
  return res.data || [];
}
