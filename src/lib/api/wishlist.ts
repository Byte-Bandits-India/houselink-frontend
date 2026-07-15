import { apiClient } from "./client";
import type { WishlistResponse } from "@/types/wishlist";

export type { WishlistResponse };

/**
 * Fetch all properties in the logged-in customer's wishlist.
 */
export async function getWishlist(): Promise<WishlistResponse> {
  return apiClient.get<WishlistResponse>("/wishlist");
}

/**
 * Fetch all property IDs in the logged-in customer's wishlist.
 */
export async function getWishlistIds(): Promise<WishlistResponse<number[]>> {
  return apiClient.get<WishlistResponse<number[]>>("/wishlist/ids");
}

/**
 * Add a property to the logged-in customer's wishlist.
 */
export async function addToWishlist(propertyId: number): Promise<WishlistResponse> {
  return apiClient.post<WishlistResponse>("/wishlist", { propertyId });
}

/**
 * Remove a property from the logged-in customer's wishlist.
 */
export async function removeFromWishlist(propertyId: number): Promise<WishlistResponse> {
  return apiClient.delete<WishlistResponse>(`/wishlist/${propertyId}`);
}
