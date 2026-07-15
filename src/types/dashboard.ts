// ─── Property model used in dashboard tables and charts ───────────────────────

export type DashboardProperty = {
  id: number;
  name: string;
  state: string;
  city?: string;
  views: number;
  expiredAt: string;
  createdAt: string;
  status: string;
  moderationStatus: string;
  purpose: "sell" | "rent_lease" | "rent";
  ownerType: "owner" | "builder" | "consultant";
  categoriesId?: number;
};

/** Minimal property shape used in charts */
export type PropertyChartItem = {
  id: number;
  name: string;
  views: number;
  moderationStatus: string;
};

export type Enquiry = {
  id: number;
  date: string;
  property: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  myMessage: string;
  filter: "sell" | "rent" | "lease";
};
