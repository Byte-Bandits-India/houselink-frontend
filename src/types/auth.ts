// ─── Location types ───────────────────────────────────────────────────────────

export interface State {
  id: number;
  name: string;
}

export interface City {
  id: number;
  name: string;
}

// ─── Customer / User types ────────────────────────────────────────────────────

export interface Customer {
  id: string;
  firstName: string;
  lastName: string | null;
  phone: string;
  email: string | null;
  username?: string | null;
  company?: string | null;
  dob?: string | null;
  state: string;
  city: string;
  status: "active" | "inactive" | "suspended";
  createdAt: string;
}

// ─── Auth request payloads ────────────────────────────────────────────────────

export interface SendOtpPayload {
  phone: string;
}

export interface SendOtpRegisterPayload {
  phone: string;
}

export interface RetryOtpPayload {
  phone: string;
  retryType?: "text" | "voice";
}

export interface RegisterPayload {
  firstName: string;
  lastName?: string;
  phone: string;
  email: string;
  otp: string;
  stateId: number;
  cityId: number;
}

export interface VerifyOtpLoginPayload {
  phone: string;
  otp: string;
}

// ─── Auth response shapes ─────────────────────────────────────────────────────

export interface SendOtpResponse {
  success: boolean;
  message: string;
}

export interface AuthTokenResponse {
  accessToken: string;
  refreshToken: string;
  customer: Customer;
}

export interface RegisterResponse extends AuthTokenResponse {
  // same shape — tokens + customer
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export interface MeResponse {
  customer: Customer;
}

// ─── Location response shapes ─────────────────────────────────────────────────

export interface StatesResponse {
  success: boolean;
  data: State[];
}

export interface CitiesResponse {
  success: boolean;
  data: City[];
}
