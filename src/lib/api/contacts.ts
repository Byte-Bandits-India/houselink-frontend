/**
 * Contacts API functions
 *
 * POST /api/v1/contacts    → submit a new contact inquiry
 *
 * No authentication required for this public endpoint.
 */

import { apiClient } from "./client";
import type { ContactResponse } from "@/types/contact";

export interface ContactInput {
  name: string;
  email: string;
  phone: string;
  message: string;
}

/**
 * Submit a new contact message to the backend database.
 */
export async function createContactMessage(
  data: ContactInput
): Promise<ContactResponse> {
  return apiClient.post<ContactResponse>("/contacts", data, {
    skipAuth: true,
  });
}
