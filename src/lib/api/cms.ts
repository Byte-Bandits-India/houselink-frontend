/**
 * CMS API functions for frontend
 *
 * GET /api/v1/cms           → List CMS pages
 * GET /api/v1/cms/:idOrSlug → Fetch single CMS page by ID or slug
 */

import { apiClient, ApiError } from "./client";
import type { CmsPageResponse, PaginatedCmsResponse } from "@/types/cms";

/**
 * Fetch list of public active CMS pages.
 */
export async function getCmsPages(search?: string): Promise<PaginatedCmsResponse> {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  return apiClient.get<PaginatedCmsResponse>(`/cms${query}`, {
    skipAuth: true,
  });
}

/**
 * Fetch a single CMS page by ID or slug (e.g., 'privacy-policy', 'terms').
 * Gracefully handles 404 responses when pages are not found.
 */
export async function getCmsPageBySlug(slug: string): Promise<CmsPageResponse> {
  try {
    return await apiClient.get<CmsPageResponse>(`/cms/${encodeURIComponent(slug)}`, {
      skipAuth: true,
    });
  } catch (err: any) {
    if (err instanceof ApiError && err.status === 404) {
      return {
        success: false,
        data: null as any,
        message: "Page not found",
      };
    }
    throw err;
  }
}
