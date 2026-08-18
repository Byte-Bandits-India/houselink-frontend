"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { getCustomerInvoices, type UserInvoice } from "@/lib/api";
import { Button } from "@/components/ui/button";
import PurposeToggle from "@/components/shared/PurposeToggle";
import type { CreditEntry } from "@/types/packages";

type Filter = "sell" | "rent";

/* ── Inline SVG illustrations matching the PHP dashboard icons ── */
function OwnerIcon() {
  return (
    <img className="w-24 h-24 mx-auto" src="/icon/accountant.png" alt="accountant" />
  );
}

function BuilderIcon() {
  return (
    <img className="w-24 h-24 mx-auto" src="/icon/house-builder.png" alt="builder" />
  );
}

function ConsultantIcon() {
  return (
    <img className="w-24 h-24 mx-auto" src="/icon/consultation (1).png" alt="consultant" />
  );
}

function EnquiryIcon() {
  return (
    <img className="w-24 h-24 mx-auto" src="/icon/accountant.png" alt="accountant" />
  );
}

function CreditCard({ entry }: { entry: CreditEntry }) {
  const isActive = entry.credits > 0;
  const { Icon } = entry;

  return (
    <div
      className={cn(
        "relative rounded-3xl p-6 flex flex-col items-center text-center h-[390px] justify-between shadow-sm transition-all duration-300 border",
        isActive
          ? "bg-white border-[#163D75] hover:shadow-md"
          : "bg-gradient-to-b from-[#243555] to-[#141E30] border-transparent hover:shadow-md text-white"
      )}
    >
      {/* "Post a Property" Badge for Inactive Card */}
      {!isActive && (
        <div className="absolute top-0 right-0 bg-[#347ED7] text-white text-[12px] font-medium px-4 py-1.5 rounded-tr-[24px] rounded-bl-2xl shadow-sm">
          Post a Property
        </div>
      )}

      {/* Icon Area */}
      <div className={cn("shrink-0", !isActive && "brightness-0 invert")}>
        <Icon />
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col justify-center my-3 w-full">
        <h4
          className={cn(
            "text-base lg:text-xl font-bold leading-tight",
            isActive ? "text-[#163D75]" : "text-white"
          )}
        >
          {entry.title}
        </h4>

        {isActive ? (
          <div className="mt-2.5">
            <p className="text-3xl font-extrabold text-[#163D75] leading-none mb-1">
              {entry.credits} Credits
            </p>
            <p className="text-sm font-medium text-ink-muted">
              {entry.expiry ? `Expiry-Date: ${entry.expiry}` : "Active Listing Points"}
            </p>
          </div>
        ) : (
          <div className="mt-2 px-1">
            <p className="text-sm font-semibold text-white/80 leading-none mb-1.5">
              No Package Found
            </p>
            <p className="text-sm leading-relaxed text-white/60">
              Purchase a Package to post a property and list in our platform
            </p>
          </div>
        )}
      </div>

      {/* Dotted Divider */}
      <div
        className={cn(
          "w-full border-t border-dashed mb-4 shrink-0",
          isActive ? "border-gray-200" : "border-white/20"
        )}
      />

      {/* Button Action */}
      <div className="w-full shrink-0">
        {isActive ? (
          <Button
            disabled
            className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm py-2.5 rounded-[50px] cursor-not-allowed shadow-sm shadow-primary/20 opacity-80"
          >
            Active
          </Button>
        ) : (
          <Link
            href={entry.buyHref}
            className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm py-2.5 rounded-[50px] transition-all duration-200 flex items-center justify-center shadow-sm shadow-primary/20 hover:brightness-110"
          >
            Buy Plan
          </Link>
        )}
      </div>
    </div>
  );
}

function PackageDetailsContent() {
  const { user, refreshUser } = useAuth();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type") || searchParams.get("filter");
  const returnUrl = searchParams.get("returnUrl") || searchParams.get("redirect") || "";

  const [filter, setFilter] = useState<Filter>(typeParam === "rent" || typeParam === "rent_lease" ? "rent" : "sell");
  const [invoices, setInvoices] = useState<UserInvoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeParam === "rent" || typeParam === "rent_lease") {
      setFilter("rent");
    } else if (typeParam === "sell") {
      setFilter("sell");
    }
  }, [typeParam]);

  useEffect(() => {
    async function loadData() {
      try {
        await refreshUser();
        if (user?.id) {
          const invs = await getCustomerInvoices(Number(user.id));
          setInvoices(invs);
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user?.id, refreshUser]);

  const getBuyHref = (baseHref: string) => {
    if (!returnUrl) return baseHref;
    const sep = baseHref.includes("?") ? "&" : "?";
    return `${baseHref}${sep}returnUrl=${encodeURIComponent(returnUrl)}`;
  };

  // Expiry calculation helper
  function getPackageExpiryDate(userType: string, isRent: boolean): string | null {
    const matching = invoices.filter((inv) => {
      const invStatus = String(inv.status).toLowerCase();
      if (invStatus !== "paid" && invStatus !== "successful") return false;
      const invType = inv.package_type === "rent" ? "rent" : "sell";
      if (isRent) {
        return invType === "rent";
      } else {
        if (invType === "rent") return false;
        const invUserType = inv.user_type || "Owner";
        return invUserType.toLowerCase() === userType.toLowerCase();
      }
    });

    let date: Date;
    if (matching.length === 0) {
      const refDate = user?.createdAt ? new Date(user.createdAt) : new Date();
      date = new Date(refDate);
      date.setDate(date.getDate() + 30);
    } else {
      const latest = matching.reduce((latest, current) => {
        return new Date(current.created_at).getTime() > new Date(latest.created_at).getTime() ? current : latest;
      }, matching[0]);

      const daysLimit = latest.total_days_limit || 30;
      date = new Date(latest.created_at);
      date.setDate(date.getDate() + daysLimit);
    }

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  // 1. Separate user credits by type
  let ownerCreditsLeft = user?.creditPointsOwner ?? 0;
  let builderCreditsLeft = user?.creditPointsBuilder ?? 0;
  let consultantCreditsLeft = user?.creditPointsConsultant ?? 0;
  let rentCredits = 0;

  // 2. Sort invoices by created_at desc (most recent first) to allocate points properly
  const sortedInvoices = [...invoices].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  let ownerSellCredits = 0;
  let builderSellCredits = 0;
  let consultantSellCredits = 0;

  sortedInvoices.forEach((inv) => {
    const type: "sell" | "rent" = inv.package_type === "rent" ? "rent" : "sell";
    const userType = inv.user_type || "Owner";

    let allocatedCredits = 0;
    const totalPoints = inv.no_of_credit;

    if (inv.status === "Paid") {
      if (type === "rent") {
        allocatedCredits = Math.min(totalPoints, ownerCreditsLeft);
        ownerCreditsLeft -= allocatedCredits;
        rentCredits += allocatedCredits;
      } else {
        const uType = userType.toLowerCase();
        if (uType === "builder") {
          allocatedCredits = Math.min(totalPoints, builderCreditsLeft);
          builderCreditsLeft -= allocatedCredits;
          builderSellCredits += allocatedCredits;
        } else if (uType === "consultant") {
          allocatedCredits = Math.min(totalPoints, consultantCreditsLeft);
          consultantCreditsLeft -= allocatedCredits;
          consultantSellCredits += allocatedCredits;
        } else {
          allocatedCredits = Math.min(totalPoints, ownerCreditsLeft);
          ownerCreditsLeft -= allocatedCredits;
          ownerSellCredits += allocatedCredits;
        }
      }
    }
  });

  ownerSellCredits += ownerCreditsLeft;
  builderSellCredits += builderCreditsLeft;
  consultantSellCredits += consultantCreditsLeft;

  const sellCards: CreditEntry[] = [
    { title: "Owner Credit Points", credits: ownerSellCredits, expiry: getPackageExpiryDate("Owner", false), buyHref: getBuyHref("/dashboard/credits?tab=owners"), Icon: OwnerIcon },
    { title: "Builder Credit Points", credits: builderSellCredits, expiry: getPackageExpiryDate("Builder", false), buyHref: getBuyHref("/dashboard/credits?tab=builders"), Icon: BuilderIcon },
    { title: "Consultant Credit Points", credits: consultantSellCredits, expiry: getPackageExpiryDate("Consultant", false), buyHref: getBuyHref("/dashboard/credits?tab=consultants"), Icon: ConsultantIcon },
  ];

  const rentCards: CreditEntry[] = [
    { title: "Rent/Lease Credit Points", credits: rentCredits, expiry: getPackageExpiryDate("Owner", true), buyHref: getBuyHref("/dashboard/credits?filter=rent"), Icon: EnquiryIcon },
  ];

  const cards = filter === "sell" ? sellCards : rentCards;

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-brand">Dashboard</h1>
        <div className="flex gap-2">
          <div className="w-24 h-10 bg-gray-200 rounded-lg animate-pulse" />
          <div className="w-32 h-10 bg-gray-200 rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col items-center min-h-[260px] animate-pulse">
              <div className="w-20 h-20 bg-gray-200 rounded-full mb-3" />
              <div className="h-6 bg-gray-200 rounded w-2/3 mb-4" />
              <div className="h-10 bg-gray-200 rounded w-1/3 mb-4" />
              <div className="h-10 bg-gray-200 rounded w-full mt-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand">Dashboard</h1>

      {/* Sell / Rent/Lease toggle */}
      <PurposeToggle value={filter} onChange={setFilter} />

      {/* Credit point cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {cards.map((entry) => (
          <CreditCard key={entry.title} entry={entry} />
        ))}
      </div>
    </div>
  );
}

export default function PackageDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-brand">Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col items-center min-h-[260px] animate-pulse" />
            ))}
          </div>
        </div>
      }
    >
      <PackageDetailsContent />
    </Suspense>
  );
}
