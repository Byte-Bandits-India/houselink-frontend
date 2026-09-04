/**
 * Ads API functions
 *
 * GET /api/v1/ads   → list published ad banners
 *
 * No authentication required for these public endpoints.
 */

import { apiClient } from "./client";
import type { AdsResponse } from "@/types/ad";

/**
 * Fetch all active ad banners (optionally filtered by city).
 */
export async function getAds(city?: string): Promise<AdsResponse> {
  const query =
    city && city.toLowerCase() !== "all" && city.toLowerCase() !== "all cities"
      ? `?city=${encodeURIComponent(city)}`
      : "";
  return apiClient.get<AdsResponse>(`/ads${query}`, {
    skipAuth: true,
  });
}
