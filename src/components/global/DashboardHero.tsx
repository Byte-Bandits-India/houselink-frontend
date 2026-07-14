"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getImageUrl } from "@/lib/api";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function DashboardHero() {
  const { user, isLoading } = useAuth();

  // Determine what to display for name
  const displayName = user
    ? `${user.firstName} ${user.lastName || ""}`.trim()
    : isLoading
    ? "Loading..."
    : "Dhanwanth Kumar"; // Fallback placeholder matching screenshot

  // Determine phone number
  const displayPhone = user?.phone || "9080403951"; // Fallback matching screenshot

  // Determine email
  const displayEmail = user?.email || null;

  // Profile image URL or null
  const avatarUrl = user?.avatarImage ? getImageUrl(user.avatarImage) : null;

  // Calculate initials for fallback
  const initials = displayName
    ? displayName
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <div
      className="relative w-full h-[200px] bg-cover bg-center flex items-center overflow-hidden"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&h=400&fit=crop')",
      }}
    >
      {/* Deep Blue Overlay */}
      <div className="absolute inset-0 bg-[#163D75]/90 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#163D75]/95 via-[#163D75]/85 to-[#163D75]/60" />

      {/* Inner Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="flex flex-row items-center gap-6 md:gap-8">
          {/* Avatar Area */}
          <Link
            href="/dashboard/profile"
            className="group relative w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:border-blue-200 shrink-0"
          >
            <Avatar className="w-full h-full rounded-none">
              {avatarUrl ? (
                <AvatarImage
                  src={avatarUrl}
                  alt={displayName}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              ) : null}
              <AvatarFallback className="bg-gradient-to-b from-blue-50 to-blue-200 text-[#163D75] text-2xl md:text-3xl font-bold flex items-center justify-center">
                {initials}
              </AvatarFallback>
            </Avatar>
            {/* Hover overlay to change image */}
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
              <i className="fa-solid fa-camera text-white text-lg mb-1 leading-none"></i>
              <span className="text-[10px] font-bold text-white uppercase tracking-wider">Update</span>
            </div>
          </Link>

          {/* User Details */}
          <div className="text-left text-white">
            <h1 className="text-2xl md:text-3xl font-bold tracking-wide drop-shadow-sm">
              {displayName}
            </h1>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-start gap-4 sm:gap-6 mt-3 text-sm md:text-base text-white/95">
              {/* Phone */}
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-phone text-white/80 text-sm shrink-0 leading-none"></i>
                <span className="font-medium">{displayPhone}</span>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-envelope text-white/80 text-sm shrink-0 leading-none"></i>
                {displayEmail ? (
                  <span className="font-medium">{displayEmail}</span>
                ) : (
                  <Link
                    href="/dashboard/profile"
                    className="font-medium text-white hover:text-white/80 underline decoration-dashed underline-offset-4 transition-colors"
                  >
                    Add Email Address
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
