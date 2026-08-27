/**
 * Locations API functions
 *
 * GET /api/v1/locations/countries             → all countries
 * GET /api/v1/locations/states?countryId=<id> → states for a given country
 * GET /api/v1/locations/cities?stateId=<id>   → cities for a given state
 *
 * No authentication required for these endpoints.
 */

import { apiClient } from "./client";
import type { CountriesResponse, StatesResponse, CitiesResponse } from "@/types/auth";

/**
 * Fetch all countries.
 */
export async function getCountries(): Promise<CountriesResponse> {
  return apiClient.get<CountriesResponse>(`/locations/countries`, {
    skipAuth: true,
  });
}

/**
 * Fetch all states for a given countryId (defaults to countryId=13 India on backend if omitted).
 */
export async function getStates(countryId?: number): Promise<StatesResponse> {
  const query = countryId !== undefined && countryId !== null ? `?countryId=${countryId}` : "";
  return apiClient.get<StatesResponse>(
    `/locations/states${query}`,
    { skipAuth: true }
  );
}

/**
 * Fetch cities for a given stateId.
 * Returns 400 if stateId is missing.
 */
export async function getCities(stateId?: number): Promise<CitiesResponse> {
  if (stateId === undefined || stateId === null || isNaN(Number(stateId))) {
    return { success: true, data: [] } as CitiesResponse;
  }
  return apiClient.get<CitiesResponse>(
    `/locations/cities?stateId=${stateId}`,
    { skipAuth: true }
  );
}
