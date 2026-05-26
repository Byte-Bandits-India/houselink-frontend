/**
 * FAQs API functions
 *
 * GET /api/v1/faqs              → list active FAQ questions
 * GET /api/v1/faqs/categories   → list parent FAQ categories
 *
 * No authentication required for these public endpoints.
 */

import { apiClient } from "./client";
import type { FaqsResponse, FaqCategoriesResponse } from "@/types/faq";

/**
 * Fetch all active FAQs, optionally filtered by category or search.
 */
export async function getFaqs(params?: {
  categoryId?: number;
  search?: string;
}): Promise<FaqsResponse> {
  let query = "";
  if (params) {
    const cleanParams: Record<string, string> = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        cleanParams[key] = String(value);
      }
    });
    const searchParams = new URLSearchParams(cleanParams);
    const queryString = searchParams.toString();
    if (queryString) query = `?${queryString}`;
  }
  return apiClient.get<FaqsResponse>(`/faqs${query}`, {
    skipAuth: true,
  });
}

/**
 * Fetch all active parent FAQ categories.
 */
export async function getFaqCategories(): Promise<FaqCategoriesResponse> {
  return apiClient.get<FaqCategoriesResponse>("/faqs/categories", {
    skipAuth: true,
  });
}
