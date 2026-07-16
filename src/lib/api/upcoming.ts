import { apiClient } from "./client";

export interface UpcomingConfig {
  images: string[];
}

export interface UpcomingConfigResponse {
  success: boolean;
  data: UpcomingConfig;
}

/**
 * GET /api/v1/upcoming
 * Fetches the upcoming banner configurations.
 */
export async function getUpcomingConfig(): Promise<UpcomingConfigResponse> {
  const res = await apiClient.get<UpcomingConfigResponse>("/upcoming");
  return res;
}
