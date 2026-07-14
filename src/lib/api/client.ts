/**
 * Centralized API Client for Houselink
 *
 * Web API  → http://localhost:4000/api/v1/
 * Mobile API → http://localhost:4001/mobile/api/v1/
 *
 * - Automatically injects the Bearer token from localStorage on every request
 * - Throws a normalized `ApiError` on non-2xx responses
 * - All auth & location functions import from here via `src/lib/api`
 */

const isProd = process.env.NODE_ENV === "production";
const fallbackUrl = isProd ? "http://127.0.0.1:5000" : "http://backend:4000";

const WEB_BASE_URL =
  typeof window === "undefined"
    ? (process.env.NEXT_SERVER_API_URL ?? process.env.NEXT_PUBLIC_WEB_API_URL ?? fallbackUrl)
    : (process.env.NEXT_PUBLIC_WEB_API_URL ?? "http://localhost");

const WEB_API_PREFIX = "/api/v1";

// ─── Token helpers ────────────────────────────────────────────────────────────

const TOKEN_KEY = "hl_access_token";
const REFRESH_KEY = "hl_refresh_token";

export const tokenStore = {
  getAccess: (): string | null =>
    typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null,

  getRefresh: (): string | null =>
    typeof window !== "undefined" ? localStorage.getItem(REFRESH_KEY) : null,

  setTokens: (accessToken: string, refreshToken: string) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_KEY, refreshToken);
  },

  clearTokens: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },

  isLoggedIn: (): boolean => !!tokenStore.getAccess(),
};

// ─── Normalized API error ─────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ─── Core fetch wrapper ───────────────────────────────────────────────────────

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** Skip automatic Authorization header injection */
  skipAuth?: boolean;
}

async function request<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, skipAuth = false, ...init } = options;

  const headers: Record<string, string> = {
    ...(init.headers as Record<string, string>),
  };

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  if (!isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (!skipAuth) {
    const token = tokenStore.getAccess();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${WEB_BASE_URL}${WEB_API_PREFIX}${path}`, {
    ...init,
    headers,
    body: body !== undefined ? (isFormData ? (body as FormData) : JSON.stringify(body)) : undefined,
    cache: "no-store",
  });

  let json: unknown;
  try {
    json = await response.json();
  } catch {
    json = null;
  }

  if (!response.ok) {
    const msg =
      (json as { message?: string })?.message ??
      `Request failed with status ${response.status}`;
    throw new ApiError(response.status, msg, json);
  }

  return json as T;
}

// ─── Public helpers ───────────────────────────────────────────────────────────

export const apiClient = {
  get: <T = unknown>(path: string, opts?: RequestOptions) =>
    request<T>(path, { method: "GET", ...opts }),

  post: <T = unknown>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>(path, { method: "POST", body, ...opts }),

  put: <T = unknown>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>(path, { method: "PUT", body, ...opts }),

  delete: <T = unknown>(path: string, opts?: RequestOptions) =>
    request<T>(path, { method: "DELETE", ...opts }),
};

