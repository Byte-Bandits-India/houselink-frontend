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

export interface LeadInput {
  property_id: number;
  name: string;
  phone: string;
  email: string;
  message?: string;
}

export interface LeadResponse {
  success: boolean;
  message: string;
  data: any;
}

/** Cooldown/points status returned by the check-status endpoint */
export interface EnquiryStatusResponse {
  success: boolean;
  data: {
    can_enquire: boolean;
    property_for: "sell" | "rent" | "lease";
    /** Only present when can_enquire = false */
    remaining_minutes?: number;
    remaining_seconds?: number;
    owner_details_expires_at?: string;
    last_enquiry_time?: string;
    current_time?: string;
    /** rent/lease specific */
    already_unlocked?: boolean;
    /** null = sell (no points needed) */
    has_points?: boolean | null;
  };
}

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
