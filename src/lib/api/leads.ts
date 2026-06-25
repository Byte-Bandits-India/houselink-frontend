/**
 * Leads API functions
 *
 * POST /api/v1/leads    → submit a new property enquiry (lead)
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
