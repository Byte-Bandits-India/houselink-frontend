import { apiClient } from "./client";

export interface IntroVideoConfigData {
  videoUrl: string;
  posterUrl: string;
  enabled: boolean;
}

export interface IntroVideoConfigResponse {
  success: boolean;
  data: IntroVideoConfigData;
}

/**
 * GET /api/v1/intro-video
 * Fetches the homepage intro video configuration.
 */
export async function getIntroVideoConfig(): Promise<IntroVideoConfigResponse> {
  const res = await apiClient.get<IntroVideoConfigResponse>("/intro-video");
  return res;
}
