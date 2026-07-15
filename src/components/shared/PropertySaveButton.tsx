"use client";

import React from "react";
import { Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";

import type { PropertySaveButtonProps } from "@/types/components";

export default function PropertySaveButton({ propertyId }: PropertySaveButtonProps) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(propertyId);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist(propertyId);
  };

  return (
    <button
      onClick={handleToggle}
      className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors text-sm ${
        wishlisted
          ? "border-red-200 bg-red-50/50 text-red-600 hover:bg-red-50"
          : "border-gray-200 text-gray-500 hover:bg-gray-50"
      }`}
    >
      <Heart
        size={16}
        className={wishlisted ? "text-red-500 fill-red-500" : "text-gray-400"}
      />
      {wishlisted ? "Saved" : "Save"}
    </button>
  );
}
