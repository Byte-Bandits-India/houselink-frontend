"use client";

import { AuthProvider } from "@/context/AuthContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { PageFilterProvider } from "@/contexts/HomeFilterContext";
import HomeScrollReset from "@/components/global/HomeScrollReset";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <WishlistProvider>
        <PageFilterProvider>
          <HomeScrollReset />
          {children}
        </PageFilterProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
