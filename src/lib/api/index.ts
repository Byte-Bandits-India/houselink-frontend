/**
 * Central barrel export for all Houselink API functions.
 *
 * Usage:
 *   import { sendOtp, verifyOtpLogin, getStates, getCities } from "@/lib/api";
 *   import { tokenStore, ApiError } from "@/lib/api";
 */

// Client utilities
export { apiClient, tokenStore, ApiError } from "./client";
export type { } from "./client"; // keep module side-effects

// Auth API
export {
  sendOtpRegister,
  register,
  sendOtp,
  retryOtp,
  verifyOtpLogin,
  logout,
  getMe,
  updateMe,
} from "./auth";

// Location API
export { getStates, getCities } from "./locations";
