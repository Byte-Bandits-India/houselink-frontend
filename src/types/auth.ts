// ─── Location types ───────────────────────────────────────────────────────────

export type State = {
  id: number;
  name: string;
};

export type City = {
  id: number;
  name: string;
};

// ─── Customer / User types ────────────────────────────────────────────────────

export type Customer = {
  id: string;
  firstName: string;
  lastName: string | null;
  phone: string;
  email: string | null;
  username?: string | null;
  company?: string | null;
  dob?: string | null;
  avatarImage?: string | null;
  state: string;
  city: string;
  stateId?: number | null;
  cityId?: number | null;
  status: "active" | "inactive" | "suspended";
  creditPointsOwner?: number;
  creditPointsBuilder?: number;
  creditPointsConsultant?: number;
  createdAt: string;
};

// ─── Auth request payloads ────────────────────────────────────────────────────

export type SendOtpPayload = {
  phone: string;
};

export type SendOtpRegisterPayload = {
  phone: string;
};

export type RetryOtpPayload = {
  phone: string;
  retryType?: "text" | "voice";
};

export type RegisterPayload = {
  firstName: string;
  lastName?: string;
  phone: string;
  email: string;
  otp: string;
  stateId: number;
  cityId: number;
};

export type VerifyOtpLoginPayload = {
  phone: string;
  otp: string;
};

// ─── Auth response shapes ─────────────────────────────────────────────────────

export type SendOtpResponse = {
  success: boolean;
  message: string;
};

export type AuthTokenResponse = {
  accessToken: string;
  refreshToken: string;
  customer: Customer;
};

// same shape — tokens + customer
export type RegisterResponse = AuthTokenResponse;

export type LogoutResponse = {
  success: boolean;
  message: string;
};

export type MeResponse = {
  customer: Customer;
};

// ─── Location response shapes ─────────────────────────────────────────────────

export type StatesResponse = {
  success: boolean;
  data: State[];
};

export type CitiesResponse = {
  success: boolean;
  data: City[];
};
