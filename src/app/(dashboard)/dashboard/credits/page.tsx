"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Filter = "sell" | "rent";
type Status = "live" | "expired";

const sellPackages = {
  owners: [
    { id: "os1", name: "TST - Owner Starter Plan", price: "₹500", posts: "5 post", description: "Test plan: 1 month, 5 credits, basic listings", validity: "30 Days validity", savePct: null, isActive: true, expiry: "01-06-2026" },
    { id: "os2", name: "TST - Owner Standard Plan", price: "₹1,350", posts: "20 post", description: "Test plan: 3 months, 20 credits, standard listings", validity: "90 Days validity", savePct: 10, isActive: false, expiry: null },
    { id: "os3", name: "TST - Owner Premium Plan", price: "₹2,400", posts: "50 post", description: "Test plan: 6 months, 50 credits, premium listings", validity: "180 Days validity", savePct: 20, isActive: false, expiry: null },
  ],
  builders: [
    { id: "bs1", name: "Builder Starter Plan", price: "₹2,000", posts: "10 post", description: "1 month, 10 credits, basic project listings", validity: "30 Days validity", savePct: null, isActive: false, expiry: null },
    { id: "bs2", name: "Builder Standard Plan", price: "₹5,000", posts: "30 post", description: "3 months, 30 credits, featured project listings", validity: "90 Days validity", savePct: 10, isActive: false, expiry: null },
    { id: "bs3", name: "Builder Premium Plan", price: "₹9,000", posts: "80 post", description: "6 months, 80 credits, premium projects", validity: "180 Days validity", savePct: 20, isActive: false, expiry: null },
  ],
  consultants: [
    { id: "cs1", name: "Consultant Basic", price: "₹800", posts: "8 post", description: "1 month, 8 credits, referral listings", validity: "30 Days validity", savePct: null, isActive: false, expiry: null },
    { id: "cs2", name: "Consultant Standard", price: "₹1,800", posts: "25 post", description: "3 months, 25 credits, priority visibility", validity: "90 Days validity", savePct: 10, isActive: false, expiry: null },
    { id: "cs3", name: "Consultant Premium", price: "₹3,200", posts: "60 post", description: "6 months, 60 credits, premium badge", validity: "180 Days validity", savePct: 20, isActive: false, expiry: null },
  ],
};

const rentPackages = [
  { id: "rp1", name: "Rent Starter Plan", price: "₹300", posts: "3 credits", description: "1 month, 3 credits, basic rental listings", validity: "30 Days validity", savePct: null, isActive: false },
  { id: "rp2", name: "Rent Standard Plan", price: "₹750", posts: "10 credits", description: "3 months, 10 credits, standard rental listings", validity: "90 Days validity", savePct: 10, isActive: false },
  { id: "rp3", name: "Rent Premium Plan", price: "₹1,400", posts: "25 credits", description: "6 months, 25 credits, premium rental listings", validity: "180 Days validity", savePct: 20, isActive: false },
];

type UserTab = "owners" | "builders" | "consultants";

interface Pkg { id: string; name: string; price: string; posts: string; description: string; validity: string; savePct: number | null; isActive: boolean; expiry?: string | null }

function PackageCard({ pkg }: { pkg: Pkg }) {
  return (
    <div className="relative bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center text-center shadow-md hover:shadow-lg transition-shadow duration-200">
      {pkg.savePct !== null && (
        <div className="absolute top-0 right-0 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-tr-2xl rounded-bl-xl">
          SAVE {pkg.savePct}.00%
        </div>
      )}

      <div className="mt-2 mb-2">
        <div className="w-16 h-16 flex items-center justify-center mx-auto">
          <img className="w-16 h-16" src="/icon/award.png" alt="" />
        </div>
      </div>

      <p className="text-lg font-bold text-ink">
        {pkg.price} <span className="text-ink-secondary font-normal text-sm">/ {pkg.posts}</span>
      </p>
      <p className="text-base font-semibold text-ink mt-0.5">{pkg.name}</p>
      <p className="text-sm text-ink-secondary mt-0.5">{pkg.description}</p>
      <p className="text-sm text-ink-secondary mb-3">{pkg.validity}</p>

      {pkg.isActive ? (
        <div className="w-full mt-auto">
          {pkg.expiry && <p className="text-xs text-ink-muted mb-1">Expiry-Date: {pkg.expiry}</p>}
          <button disabled className="w-full bg-emerald-600 text-white font-bold text-sm py-2.5 rounded-lg opacity-90 cursor-not-allowed">
            Active
          </button>
        </div>
      ) : (
        <button className="w-full mt-auto border-2 border-brand text-brand font-bold text-sm py-2.5 rounded-lg hover:bg-brand hover:text-white transition-colors duration-200">
          Buy Package
        </button>
      )}
    </div>
  );
}

export default function CreditsPage() {
  const [filter, setFilter] = useState<Filter>("sell");
  const [userTab, setUserTab] = useState<UserTab>("owners");

  const sellTabs: { key: UserTab; label: string }[] = [
    { key: "owners", label: "Owners" },
    { key: "builders", label: "Builders" },
    { key: "consultants", label: "Consultants" },
  ];

  const currentPackages = filter === "sell" ? sellPackages[userTab] : rentPackages;

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-ink">Buy Packages</h1>

      {/* Sell / Rent-Lease toggle */}
      <div className="flex gap-2">
        {(["sell", "rent"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-6 py-2 rounded-lg text-sm font-bold border-2 transition-colors duration-200",
              filter === f ? "bg-brand border-brand text-white" : "bg-white border-brand text-brand hover:bg-brand hover:text-white"
            )}
          >
            {f === "sell" ? "Sell" : "Rent/Lease"}
          </button>
        ))}
      </div>

      {/* Owner / Builder / Consultant tabs — only for sell */}
      {filter === "sell" && (
        <div className="flex border border-gray-200 rounded-lg overflow-hidden">
          {sellTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setUserTab(tab.key)}
              className={cn(
                "flex-1 py-3 text-sm font-semibold transition-colors duration-200 border-r border-gray-200 last:border-r-0",
                userTab === tab.key ? "bg-brand text-white" : "bg-white text-brand hover:bg-brand/10"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {currentPackages.map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} />
        ))}
      </div>
    </div>
  );
}
