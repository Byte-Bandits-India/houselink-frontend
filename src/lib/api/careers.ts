/**
 * Careers API functions
 *
 * GET /api/v1/careers       → list active career openings
 * GET /api/v1/careers/:id   → fetch a single career opening by ID
 *
 * No authentication required for these public endpoints.
 */

import { apiClient } from "./client";
import type { CareersResponse, CareerDetailResponse } from "@/types/career";

/**
 * Fetch all active career openings.
 */
export async function getCareers(params?: { search?: string }): Promise<CareersResponse> {
  let query = "";
  if (params?.search) {
    query = `?search=${encodeURIComponent(params.search)}`;
  }
  return apiClient.get<CareersResponse>(`/careers${query}`, {
    skipAuth: true,
  });
}

/**
 * Fetch a single career opening by its numeric ID.
 */
export async function getCareer(id: number): Promise<CareerDetailResponse> {
  return apiClient.get<CareerDetailResponse>(`/careers/${id}`, {
    skipAuth: true,
  });
}
