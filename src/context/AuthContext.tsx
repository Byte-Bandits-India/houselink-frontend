"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { tokenStore, getMe, logout as apiLogout } from "@/lib/api";
import type { Customer } from "@/types/auth";

// ─── Shape ────────────────────────────────────────────────────────────────────

type AuthState = {
  user: Customer | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  /** Call after a successful login/register to re-fetch the profile */
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
  /** Update user directly without API call */
  setAuthUser: (user: Customer | null) => void;
};

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthState>({
  user: null,
  isLoggedIn: false,
  isLoading: true,
  refreshUser: async () => {},
  logout: async () => {},
  setAuthUser: () => {},
});

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /** Fetch profile from /auth/me using the stored access token */
  const refreshUser = useCallback(async () => {
    if (!tokenStore.isLoggedIn()) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      const { customer } = await getMe();
      setUser(customer);
    } catch {
      // Token expired or invalid — clear it
      tokenStore.clearTokens();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /** Logout: call API, clear tokens, reset state */
  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch {
      // Even if the API fails, clear locally
      tokenStore.clearTokens();
    }
    setUser(null);
  }, []);

  // On mount, hydrate user from token
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoading,
        refreshUser,
        logout,
        setAuthUser: setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth() {
  return useContext(AuthContext);
}
