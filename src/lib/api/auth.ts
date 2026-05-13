import { apiClient, tokenStore } from "./client";
import type {
  SendOtpPayload,
  SendOtpRegisterPayload,
  RetryOtpPayload,
  RegisterPayload,
  VerifyOtpLoginPayload,
  SendOtpResponse,
  RegisterResponse,
  AuthTokenResponse,
  LogoutResponse,
  MeResponse,
} from "@/types/auth";

// ─── Registration ─────────────────────────────────────────────────────────────

/**
 * Step 1 of registration: sends an OTP to the given phone.
 * Returns 409 if the phone is already registered.
 */
export async function sendOtpRegister(
  payload: SendOtpRegisterPayload
): Promise<SendOtpResponse> {
  return apiClient.post<SendOtpResponse>(
    "/auth/send-otp-register",
    payload,
    { skipAuth: true }
  );
}

/**
 * Step 2 of registration: submits user details + OTP.
 * On success, automatically persists tokens to localStorage.
 */
export async function register(
  payload: RegisterPayload
): Promise<RegisterResponse> {
  const res = await apiClient.post<RegisterResponse>(
    "/auth/register",
    payload,
    { skipAuth: true }
  );
  tokenStore.setTokens(res.accessToken, res.refreshToken);
  return res;
}

// ─── Login ────────────────────────────────────────────────────────────────────

/**
 * Step 1 of login: sends an OTP to the given (registered) phone.
 * Returns 404 if the phone is not found.
 */
export async function sendOtp(
  payload: SendOtpPayload
): Promise<SendOtpResponse> {
  return apiClient.post<SendOtpResponse>("/auth/send-otp", payload, {
    skipAuth: true,
  });
}

/**
 * Retry OTP delivery (text or voice).
 */
export async function retryOtp(
  payload: RetryOtpPayload
): Promise<SendOtpResponse> {
  return apiClient.post<SendOtpResponse>("/auth/retry-otp", payload, {
    skipAuth: true,
  });
}

/**
 * Step 2 of login: verifies OTP and exchanges it for tokens.
 * On success, automatically persists tokens to localStorage.
 */
export async function verifyOtpLogin(
  payload: VerifyOtpLoginPayload
): Promise<AuthTokenResponse> {
  const res = await apiClient.post<AuthTokenResponse>(
    "/auth/verify-otp-login",
    payload,
    { skipAuth: true }
  );
  tokenStore.setTokens(res.accessToken, res.refreshToken);
  return res;
}

// ─── Protected ────────────────────────────────────────────────────────────────

/**
 * Logs out the current session and clears tokens from localStorage.
 */
export async function logout(): Promise<LogoutResponse> {
  const res = await apiClient.post<LogoutResponse>("/auth/logout");
  tokenStore.clearTokens();
  return res;
}

/**
 * Returns the currently authenticated customer's profile.
 */
export async function getMe(): Promise<MeResponse> {
  return apiClient.get<MeResponse>("/auth/me");
}

/**
 * Updates the currently authenticated customer's profile.
 * Expects a FormData object containing optional fields: firstName, lastName, dob, avatar.
 */
export async function updateMe(formData: FormData): Promise<MeResponse> {
  return apiClient.put<MeResponse>("/auth/me", formData);
}
