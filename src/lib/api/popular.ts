/**
 * Popular Properties / Popular Regions API functions
 *
 * GET /api/v1/popular-properties  → list active "High Demand Properties" entries
 * GET /api/v1/popular-regions     → list active "High Demand Regions" entries
 *
 * No authentication required for these public endpoints.
 */

import { apiClient } from "./client";

export interface PopularPropertyApiItem {
  id: number;
  type: string;
  title: string;
  price: string;
  location: string;
  image: string | null;
  order: number;
  status: "active" | "inactive";
}

export interface PopularRegionApiItem {
  id: number;
  name: string;
  propertiesCount: number;
  growthRate: string;
  image: string | null;
  order: number;
  status: "active" | "inactive";
}

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
