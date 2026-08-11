"use client";

import { AuthProvider } from "@/context/AuthContext";
import { WishlistProvider } from "@/context/WishlistContext";
import HomeScrollReset from "@/components/global/HomeScrollReset";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <WishlistProvider>
        <HomeScrollReset />
        {children}
      </WishlistProvider>
    </AuthProvider>
  );
}
