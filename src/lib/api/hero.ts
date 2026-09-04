import { apiClient } from "./client";

export interface HeroConfig {
  id?: string;
  title?: string;
  bgImage: string;
  shinyText: string;
  rotatingTexts1: string[];
  rotatingTexts2: string[];
  cities?: string[];
  status?: string;
}

export interface HeroConfigResponse {
  success: boolean;
  data: HeroConfig;
}

/**
 * GET /api/v1/hero
 * Fetches the landing page hero configuration, optionally filtered by city.
 */
export async function getHeroConfig(city?: string): Promise<HeroConfigResponse> {
  const url = city ? `/hero?city=${encodeURIComponent(city)}` : "/hero";
  const res = await apiClient.get<HeroConfigResponse>(url);
  return res;
}
