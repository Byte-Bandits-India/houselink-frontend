import { apiClient } from "./client";
import type { SearchApiItem, SearchApiResponse } from "@/types/searches";

export type { SearchApiItem, SearchApiResponse };

/**
 * GET /api/v1/searches
 * If authenticated: returns the customer's recent searches.
 * If unauthenticated: returns global popular searches.
 */
export async function getSearches(): Promise<SearchApiResponse> {
  const res = await apiClient.get<SearchApiResponse>(
    "/searches",
    { skipAuth: false } // We want it to send Authorization header if token exists in tokenStore, but not fail if token is missing/expired. Since our client skips auth by default when token is not present if we tell it to, let's verify if skipAuth should be true or false.
  );
  return res;
}

/**
 * POST /api/v1/searches
 * Records a search query (always increments popular search count, and link to logged-in user if authenticated).
 */
export async function recordSearch(query: string): Promise<{ success: boolean; message: string }> {
  const res = await apiClient.post<{ success: boolean; message: string }>(
    "/searches",
    { query }
  );
  return res;
}

/**
 * DELETE /api/v1/searches/:id
 * Deletes a search history entry for the logged-in customer.
 */
export async function deleteSearchHistory(id: number): Promise<{ success: boolean; message: string }> {
  const res = await apiClient.delete<{ success: boolean; message: string }>(
    `/searches/${id}`
  );
  return res;
}
