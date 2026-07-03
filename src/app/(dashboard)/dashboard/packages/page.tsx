"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { getCustomerInvoices, type UserInvoice } from "@/lib/api";

type Filter = "sell" | "rent";

/* ── Inline SVG illustrations matching the PHP dashboard icons ── */
function OwnerIcon() {
  return (
    <img className="w-20 h-20 mx-auto" src="/icon/accountant.png" alt="accountant" />
  );
}

function BuilderIcon() {
  return (
    <img className="w-20 h-20 mx-auto" src="/icon/house-builder.png" alt="builder" />
  );
}

function ConsultantIcon() {
  return (
    <img className="w-20 h-20 mx-auto" src="/icon/consultation (1).png" alt="consultant" />
  );
}

function EnquiryIcon() {
  return (
    <img className="w-20 h-20 mx-auto" src="/icon/accountant.png" alt="accountant" />
  );
}

/* ── Credit card data ──────────────────────────────────── */
interface CreditEntry {
  title: string;
  credits: number;
  expiry: string | null;
  buyHref: string;
  Icon: React.FC;
}

function CreditCard({ entry }: { entry: CreditEntry }) {
  const isActive = entry.credits > 0;
  const { Icon } = entry;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 flex flex-col items-center text-center min-h-[260px] hover:shadow-md transition-shadow duration-300">
      <Icon />

      <h4 className="text-base lg:text-xl font-bold text-brand mt-1">{entry.title}</h4>

      {isActive ? (
        <>
          <p className="text-4xl font-bold text-ink leading-none my-2">{entry.credits}</p>
          <p className="text-sm text-ink-secondary mb-1">
            {entry.expiry ? `Expiry-Date: ${entry.expiry}` : "Active Listing Points"}
          </p>
        </>
      ) : (
        <p className="text-sm font-semibold text-ink my-3">No package found</p>
      )}

      <div className="mt-auto w-full pt-1">
        {isActive ? (
          <button
            disabled
            className="w-full bg-emerald-600 text-white font-semibold text-sm py-2.5 rounded-lg opacity-95 cursor-not-allowed"
          >
            Active
          </button>
        ) : (
          <Link
            href={entry.buyHref}
            className="inline-block w-full border border-gray-300 text-ink-secondary font-medium text-sm px-6 py-2 rounded-lg hover:border-brand hover:text-brand transition-colors duration-200"
          >
            Buy Package
          </Link>
        )}
      </div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────── */
export default function PackageDetailsPage() {
  const { user, refreshUser } = useAuth();
  const [filter, setFilter] = useState<Filter>("sell");
  const [invoices, setInvoices] = useState<UserInvoice[]>([]);
  const [loading, setLoading] = useState(true);

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
      // Fallback: If no matching paid invoices, default to 30 days from user registration (or today)
      const refDate = user?.createdAt ? new Date(user.createdAt) : new Date();
      date = new Date(refDate);
      date.setDate(date.getDate() + 30);
    } else {
      // Find the latest paid invoice
      const latest = matching.reduce((latest, current) => {
        return new Date(current.created_at).getTime() > new Date(latest.created_at).getTime() ? current : latest;
      }, matching[0]);

      const daysLimit = latest.total_days_limit || 30;
      date = new Date(latest.created_at);
      date.setDate(date.getDate() + daysLimit);
    }

    // Format as DD-MM-YYYY
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  // 1. Separate user credits by type
  let ownerCreditsLeft = user?.creditPointsOwner ?? 0;
  let builderCreditsLeft = user?.creditPointsBuilder ?? 0;
  let consultantCreditsLeft = user?.creditPointsConsultant ?? 0;

  // 2. Sort invoices by created_at desc (most recent first) to allocate points properly
  const sortedInvoices = [...invoices].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  let ownerSellCredits = 0;
  let builderSellCredits = 0;
  let consultantSellCredits = 0;
  let rentCredits = 0;

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

  // Add any leftover credits (e.g. from manual admin adjustments)
  ownerSellCredits += ownerCreditsLeft;
  builderSellCredits += builderCreditsLeft;
  consultantSellCredits += consultantCreditsLeft;

  const sellCards: CreditEntry[] = [
    { title: "Owner Credit Points", credits: ownerSellCredits, expiry: getPackageExpiryDate("Owner", false), buyHref: "/dashboard/credits?tab=owners", Icon: OwnerIcon },
    { title: "Builder Credit Points", credits: builderSellCredits, expiry: getPackageExpiryDate("Builder", false), buyHref: "/dashboard/credits?tab=builders", Icon: BuilderIcon },
    { title: "Consultant Credit Points", credits: consultantSellCredits, expiry: getPackageExpiryDate("Consultant", false), buyHref: "/dashboard/credits?tab=consultants", Icon: ConsultantIcon },
  ];

  const rentCards: CreditEntry[] = [
    { title: "Rent/Lease Credit Points", credits: rentCredits, expiry: getPackageExpiryDate("Owner", true), buyHref: "/dashboard/credits?filter=rent", Icon: EnquiryIcon },
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
      <div className="flex gap-2">
        <button
          onClick={() => setFilter("sell")}
          className={cn(
            "px-6 py-2 rounded-lg text-sm font-bold border-2 transition-colors duration-200",
            filter === "sell"
              ? "bg-brand border-brand text-white"
              : "bg-white border-gray-300 text-ink hover:border-brand hover:text-brand"
          )}
        >
          Sell
        </button>
        <button
          onClick={() => setFilter("rent")}
          className={cn(
            "px-6 py-2 rounded-lg text-sm font-bold border-2 transition-colors duration-200",
            filter === "rent"
              ? "bg-brand border-brand text-white"
              : "bg-white border-gray-300 text-ink hover:border-brand hover:text-brand"
          )}
        >
          Rent/Lease
        </button>
      </div>

      {/* Credit point cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {cards.map((entry) => (
          <CreditCard key={entry.title} entry={entry} />
        ))}
      </div>
    </div>
  );
}
