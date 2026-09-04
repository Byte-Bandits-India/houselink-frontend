export type AdBanner = {
  id: number;
  name: string;
  order: number;
  state?: string | null;
  city?: string | null;
  cities?: string[];
  cityOrders?: Record<string, number>;
  url?: string | null;
  openInNewTab: boolean;
  status: "published" | "draft" | "pending";
  expiredAt?: string | null;
  pcImage?: string | null;
  tabletImage?: string | null;
  mobileImage?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AdsResponse = {
  success: boolean;
  data: AdBanner[];
};
