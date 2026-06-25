"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";
import {
  getWishlistIds,
  addToWishlist as apiAddToWishlist,
  removeFromWishlist as apiRemoveFromWishlist,
} from "@/lib/api/wishlist";
import { message } from "antd";

interface WishlistContextType {
  wishlistIds: number[];
  isWishlisted: (propertyId: number) => boolean;
  toggleWishlist: (propertyId: number) => Promise<boolean>;
  loading: boolean;
  refreshWishlistIds: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType>({
  wishlistIds: [],
  isWishlisted: () => false,
  toggleWishlist: async () => false,
  loading: false,
  refreshWishlistIds: async () => {},
});

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, user } = useAuth();
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshWishlistIds = useCallback(async () => {
    if (!isLoggedIn) {
      setWishlistIds([]);
      return;
    }
    setLoading(true);
    try {
      const res = await getWishlistIds();
      if (res.success && Array.isArray(res.data)) {
        setWishlistIds(res.data.map(Number));
      }
    } catch (err) {
      console.error("Failed to fetch wishlist IDs:", err);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  // Sync wishlist when login state or user changes
  useEffect(() => {
    refreshWishlistIds();
  }, [refreshWishlistIds, user]);

  const isWishlisted = useCallback(
    (propertyId: number) => {
      return wishlistIds.includes(Number(propertyId));
    },
    [wishlistIds]
  );

  const toggleWishlist = async (propertyId: number): Promise<boolean> => {
    if (!isLoggedIn) {
      message.warning("Please log in to add properties to your wishlist.");
      return false;
    }

    const id = Number(propertyId);
    const currentlyWishlisted = wishlistIds.includes(id);

    // Optimistic update
    if (currentlyWishlisted) {
      setWishlistIds((prev) => prev.filter((item) => item !== id));
    } else {
      setWishlistIds((prev) => [...prev, id]);
    }

    try {
      if (currentlyWishlisted) {
        const res = await apiRemoveFromWishlist(id);
        if (res.success) {
          message.success("Removed from wishlist");
          return true;
        } else {
          throw new Error(res.message || "Failed to remove");
        }
      } else {
        const res = await apiAddToWishlist(id);
        if (res.success) {
          message.success("Added to wishlist");
          return true;
        } else {
          throw new Error(res.message || "Failed to add");
        }
      }
    } catch (err: any) {
      console.error("Wishlist operation failed:", err);
      message.error(err.message || "Something went wrong. Please try again.");
      // Revert optimistic update
      if (currentlyWishlisted) {
        setWishlistIds((prev) => [...prev, id]);
      } else {
        setWishlistIds((prev) => prev.filter((item) => item !== id));
      }
      return false;
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        isWishlisted,
        toggleWishlist,
        loading,
        refreshWishlistIds,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
