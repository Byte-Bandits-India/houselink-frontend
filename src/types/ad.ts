export interface AdBanner {
  id: number;
  name: string;
  order: number;
  url?: string | null;
  openInNewTab: boolean;
  status: "published" | "draft" | "pending";
  expiredAt?: string | null;
  pcImage?: string | null;
  tabletImage?: string | null;
  mobileImage?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdsResponse {
  success: boolean;
  data: AdBanner[];
}
