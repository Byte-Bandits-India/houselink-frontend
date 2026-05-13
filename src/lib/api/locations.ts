/**
 * Locations API functions
 *
 * GET /api/v1/locations/states?countryId=13   → all Indian states
 * GET /api/v1/locations/cities?stateId=<id>   → cities for a given state
 *
 * No authentication required for these endpoints.
 */

import { apiClient } from "./client";
import type { StatesResponse, CitiesResponse } from "@/types/auth";

/**
 * Fetch all states for India (countryId=13).
 * Pass a different countryId to fetch states for another country.
 */
export async function getStates(
  countryId: number = 13
): Promise<StatesResponse> {
  return apiClient.get<StatesResponse>(
    `/locations/states?countryId=${countryId}`,
    { skipAuth: true }
  );
}

/**
 * Fetch cities for a given stateId.
 * Returns 400 if stateId is missing.
 */
export async function getCities(stateId: number): Promise<CitiesResponse> {
  return apiClient.get<CitiesResponse>(
    `/locations/cities?stateId=${stateId}`,
    { skipAuth: true }
  );
}
