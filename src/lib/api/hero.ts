import { apiClient } from "./client";

export interface HeroConfig {
  bgImage: string;
  shinyText: string;
  rotatingTexts1: string[];
  rotatingTexts2: string[];
}

export interface HeroConfigResponse {
  success: boolean;
  data: HeroConfig;
}

/**
 * GET /api/v1/hero
 * Fetches the landing page hero configuration.
 */
export async function getHeroConfig(): Promise<HeroConfigResponse> {
  const res = await apiClient.get<HeroConfigResponse>("/hero");
  return res;
}
