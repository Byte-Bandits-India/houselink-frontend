import { apiClient } from "./client";

export interface Package {
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
}

export interface CheckoutResponse {
  success: boolean;
  data: {
    orderId: string;
    amount: number;
    currency: string;
    key: string;
    invoiceId: number;
  };
}

/** GET /packages?status=published */
export async function getPackagesList(): Promise<Package[]> {
  const data = await apiClient.get<{ success: boolean; data: Package[] }>(
    "/packages?status=published"
  );
  return data.data || [];
}

/** POST /checkout/create-order */
export async function createCheckoutOrder(customerId: number, packageId: number): Promise<CheckoutResponse> {
  return apiClient.post<CheckoutResponse>("/checkout/create-order", {
    customerId,
    packageId,
  });
}

/** POST /checkout/verify-payment */
export async function verifyCheckoutPayment(payload: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): Promise<{ success: boolean; message: string }> {
  return apiClient.post<{ success: boolean; message: string }>(
    "/checkout/verify-payment",
    payload
  );
}
