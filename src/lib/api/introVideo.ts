import { apiClient } from "./client";

export interface IntroVideoItem {
  id: string;
  title: string;
  subtitle?: string;
  videoUrl: string;
  posterUrl?: string;
  status: "active" | "inactive";
  order?: number;
  cityOrders?: Record<string, number>;
  cities?: string[];
}

export interface IntroVideoConfigData {
  videos?: IntroVideoItem[];
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
export async function getIntroVideoConfig(city?: string): Promise<IntroVideoConfigResponse> {
  const path = city ? `/intro-video?city=${encodeURIComponent(city)}` : "/intro-video";
  const res = await apiClient.get<IntroVideoConfigResponse>(path);
  return res;
}
