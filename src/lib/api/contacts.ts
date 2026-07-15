import { apiClient } from "./client";
import type { ContactResponse } from "@/types/contact";
import type { ContactInput } from "@/types/contact-input";

export type { ContactInput };

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
