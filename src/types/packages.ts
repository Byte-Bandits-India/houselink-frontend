export type Package = {
  id: number;
  type: "buy" | "rent";
  userType: "Owner" | "Builder" | "Consultant" | null;
  name: string;
  description: string | null;
  price: number;
  finalPrice: number | null;
  totalDaysLimit: number | null;
  noOfCredit: number;
  isGuest: boolean;
  status: "published" | "draft" | "pending";
};

export type CheckoutResponse = {
  success: boolean;
  data: {
    orderId: string;
    amount: number;
    currency: string;
    key: string;
    invoiceId: number;
  };
};

export type UserInvoice = {
  id: number;
  package_id: string;
  name: string;
  package_type: "buy" | "rent";
  user_type: "Owner" | "Builder" | "Consultant" | null;
  total_days_limit: number | null;
  no_of_credit: number;
  amount: string | number;
  status: string;
  created_at: string;
};

export type CustomerProfile = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  invoices: UserInvoice[];
};

export type CreditEntry = {
  title: string;
  credits: number;
  expiry: string | null;
  buyHref: string;
  Icon: React.FC;
};

export type HistoryPkg = {
  id: string;
  name: string;
  price: string;
  userType: string;
  type: "sell" | "rent";
  status: "live" | "expired";
  remainingPoints?: number;
  totalPoints?: number;
  rawInvoice: UserInvoice;
  formattedDate: string;
};
