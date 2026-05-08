"use client";

import React, { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

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

const sellCards: CreditEntry[] = [
  { title: "Owner Credit Points", credits: 0, expiry: null, buyHref: "/dashboard/credits?tab=owner", Icon: OwnerIcon },
  { title: "Builder Credit Points", credits: 1, expiry: "19-05-2026", buyHref: "/dashboard/credits?tab=builder", Icon: BuilderIcon },
  { title: "Consultant Credit Points", credits: 2, expiry: "19-05-2026", buyHref: "/dashboard/credits?tab=consultant", Icon: ConsultantIcon },
];

const rentCards: CreditEntry[] = [
  { title: "Enquiry Credit Points", credits: 8, expiry: "30-06-2026", buyHref: "/dashboard/credits?filter=rent", Icon: EnquiryIcon },
];

function CreditCard({ entry }: { entry: CreditEntry }) {
  const isActive = entry.credits > 0;
  const { Icon } = entry;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 flex flex-col items-center text-center min-h-[260px]">
      <Icon />

      <h4 className="text-base lg:text-xl font-bold text-brand mt-4 mb-2">{entry.title}</h4>

      {isActive ? (
        <>
          <p className="text-4xl font-bold text-ink leading-none mb-1">{entry.credits}</p>
          {entry.expiry && (
            <p className="text-sm text-ink-secondary mb-4">Expiry-Date: {entry.expiry}</p>
          )}
        </>
      ) : (
        <p className="text-sm font-semibold text-ink mb-4">No package found</p>
      )}

      <div className="mt-auto w-full pt-2">
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
            className="inline-block border border-gray-300 text-ink-secondary font-medium text-sm px-6 py-2 rounded-lg hover:border-brand hover:text-brand transition-colors duration-200"
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
  const [filter, setFilter] = useState<Filter>("sell");

  const cards = filter === "sell" ? sellCards : rentCards;

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
