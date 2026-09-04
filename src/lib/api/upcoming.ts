import { apiClient } from "./client";

export interface UpcomingBannerItem {
  id?: string | number;
  image: string;
  laptopImage?: string;
  tabletImage?: string;
  mobileImage?: string;
  title?: string;
  link?: string;
  status?: "active" | "inactive";
  order?: number;
  cityOrders?: Record<string, number>;
  cities?: string[];
}

export interface UpcomingConfig {
  images: string[];
  banners?: UpcomingBannerItem[];
}

export interface UpcomingConfigResponse {
  success: boolean;
  data: UpcomingConfig;
}

/**
 * GET /api/v1/upcoming
 * Fetches the upcoming banner configurations with images and destination links.
 */
export async function getUpcomingConfig(city?: string): Promise<UpcomingConfigResponse> {
  const path = city ? `/upcoming?city=${encodeURIComponent(city)}` : "/upcoming";
  const res = await apiClient.get<UpcomingConfigResponse>(path);
  return res;
}
