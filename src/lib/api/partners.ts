/**
 * Partners API functions
 *
 * GET  /api/v1/partners              → list active partners
 * POST /api/v1/partners/inquiries    → submit a new partner inquiry
 *
 * No authentication required for these public endpoints.
 */

import { apiClient } from "./client";
import type { PartnersResponse, PartnerInquiryResponse } from "@/types/partner";

/**
 * Fetch all active partners.
 */
export async function getPartners(params?: {
  status?: "active" | "inactive";
  search?: string;
}): Promise<PartnersResponse> {
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
  return apiClient.get<PartnersResponse>(`/partners${query}`, {
    skipAuth: true,
  });
}

/**
 * Submit a partner inquiry form with a file attachment.
 */
export async function createPartnerInquiry(
  formData: FormData
): Promise<PartnerInquiryResponse> {
  return apiClient.post<PartnerInquiryResponse>("/partners/inquiries", formData, {
    skipAuth: true,
  });
}
