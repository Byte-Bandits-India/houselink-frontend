/**
 * Leads API functions
 *
 * POST /api/v1/leads           → submit a new property enquiry (lead)
 * GET  /api/v1/leads/my/enquiries → my submitted enquiries
 * GET  /api/v1/leads/check-status/:propertyId → cooldown/points pre-check
 *
 * Requires authentication.
 */

import { apiClient } from "./client";
import type { LeadInput, LeadResponse, EnquiryStatusResponse } from "@/types/leads";

export type { LeadInput, LeadResponse, EnquiryStatusResponse };

/**
 * Submit a new property enquiry lead to the backend.
 */
export async function createLead(data: LeadInput): Promise<LeadResponse> {
  return apiClient.post<LeadResponse>("/leads", data);
}

/**
 * Fetch all property leads/enquiries from the backend.
 */
export async function getLeads(): Promise<LeadResponse> {
  return apiClient.get<LeadResponse>("/leads");
}

/**
 * Fetch enquiries submitted by the logged-in customer.
 */
export async function getMyEnquiries(): Promise<LeadResponse> {
  return apiClient.get<LeadResponse>("/leads/my/enquiries");
}

/**
 * Pre-flight check: returns cooldown status and points info for a property.
 * Call this before showing the enquiry form to display the right UI state.
 */
export async function checkEnquiryStatus(
  propertyId: number,
  phone?: string
): Promise<EnquiryStatusResponse> {
  const params = phone ? `?phone=${encodeURIComponent(phone)}` : "";
  return apiClient.get<EnquiryStatusResponse>(
    `/leads/check-status/${propertyId}${params}`
  );
}

/**
 * Directly unlock contact info for a Rent / Lease property (consumes 1 point or checks 30-day cache).
 */
export async function unlockPropertyContact(propertyId: number): Promise<LeadResponse> {
  return apiClient.post<LeadResponse>(`/leads/unlock/${propertyId}`);
}
