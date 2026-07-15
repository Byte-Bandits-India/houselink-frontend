import { apiClient } from "./client";
import type { Package, CheckoutResponse, UserInvoice, CustomerProfile } from "@/types/packages";

export type { Package, CheckoutResponse, UserInvoice, CustomerProfile };

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



/** GET /customers/:id */
export async function getCustomerInvoices(customerId: number): Promise<UserInvoice[]> {
  const res = await apiClient.get<{ success: boolean; data: CustomerProfile }>(
    `/customers/${customerId}`
  );
  return res.data?.invoices || [];
}
