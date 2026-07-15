export type LeadInput = {
  property_id: number;
  name: string;
  phone: string;
  email: string;
  message?: string;
};

export type LeadResponse = {
  success: boolean;
  message: string;
  data: any;
};

/** Cooldown/points status returned by the check-status endpoint */
export type EnquiryStatusResponse = {
  success: boolean;
  data: {
    can_enquire: boolean;
    property_for: "sell" | "rent" | "lease";
    /** Only present when can_enquire = false */
    remaining_minutes?: number;
    remaining_seconds?: number;
    owner_details_expires_at?: string;
    last_enquiry_time?: string;
    current_time?: string;
    /** rent/lease specific */
    already_unlocked?: boolean;
    /** null = sell (no points needed) */
    has_points?: boolean | null;
  };
};

/** Lead as used in dashboard tables and charts */
export type Lead = {
  id: number;
  date: string;
  property: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  filter: "sell" | "rent";
  avatarImage?: string | null;
};

/** Minimal lead shape used in charts */
export type LeadChartItem = {
  id: number;
  property: string;
  filter: "sell" | "rent";
};
