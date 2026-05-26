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
 * Fetch all active ad banners.
 */
export async function getAds(): Promise<AdsResponse> {
  return apiClient.get<AdsResponse>("/ads", {
    skipAuth: true,
  });
}
