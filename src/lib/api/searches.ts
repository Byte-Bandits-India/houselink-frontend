import { apiClient } from "./client";
import type { SearchApiItem, SearchApiResponse } from "@/types/searches";

export type { SearchApiItem, SearchApiResponse };

export interface SuggestionProperty {
  id: number;
  name: string;
  permalink: string;
  location: string;
  price: number | null;
  propertyFor: string;
  categoryName: string;
  image: string | null;
}

export interface SuggestionLocation {
  name: string;
  type: "locality" | "region" | "city";
}

export interface SuggestionCategory {
  id: number;
  name: string;
  type?: string;
}

export interface SuggestionFeature {
  id: number;
  name: string;
}

export interface SearchSuggestionsData {
  properties: SuggestionProperty[];
  locations: SuggestionLocation[];
  categories: SuggestionCategory[];
  features: SuggestionFeature[];
}

export interface SearchSuggestionsResponse {
  success: boolean;
  data: SearchSuggestionsData;
}

/**
 * GET /api/v1/searches
 * If authenticated: returns the customer's recent searches.
 * If unauthenticated: returns global popular searches.
 */
export async function getSearches(): Promise<SearchApiResponse> {
  const res = await apiClient.get<SearchApiResponse>(
    "/searches",
    { skipAuth: false }
  );
  return res;
}

/**
 * GET /api/v1/searches/suggestions?q=...&city=...&type=...
 * Dynamic multi-entity search suggestions for properties, locations, categories, and amenities
 */
export async function getSearchSuggestions(params: {
  q?: string;
  city?: string;
  type?: string;
  location?: string;
  category?: string;
}): Promise<SearchSuggestionsData> {
  const queryParts: string[] = [];
  if (params.q) queryParts.push(`q=${encodeURIComponent(params.q)}`);
  if (params.city) queryParts.push(`city=${encodeURIComponent(params.city)}`);
  if (params.type) queryParts.push(`type=${encodeURIComponent(params.type)}`);
  if (params.location) queryParts.push(`location=${encodeURIComponent(params.location)}`);
  if (params.category) queryParts.push(`category=${encodeURIComponent(params.category)}`);

  const qs = queryParts.length > 0 ? `?${queryParts.join("&")}` : "";
  const res = await apiClient.get<SearchSuggestionsResponse>(`/searches/suggestions${qs}`);
  return res.data || { properties: [], locations: [], categories: [], features: [] };
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
