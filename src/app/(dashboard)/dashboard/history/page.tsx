"use client";

import { useState } from "react";
import { Award, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Filter = "sell" | "rent";
type Status = "live" | "expired";

interface HistoryPkg {
  id: string;
  name: string;
  price: string;
  userType: string;
  type: "sell" | "rent";
  status: "live" | "expired";
  remainingPoints?: number;
  totalPoints?: number;
  invoiceUrl?: string;
}

/* Mock data from packages.blade.php */
const allPackages: HistoryPkg[] = [
  { id: "PKG001", name: "TST - Owner Standard Plan / Rs.1215.00", price: "1215.00", userType: "Owner", type: "sell", status: "live", invoiceUrl: "#" },
  { id: "PKG002", name: "TST - Owner Starter Plan / Rs.500.00", price: "500.00", userType: "Owner", type: "sell", status: "expired", invoiceUrl: "#" },
  { id: "PKG003", name: "Builder Standard Plan / Rs.4500.00", price: "4500.00", userType: "Builder", type: "sell", status: "live", invoiceUrl: "#" },
  { id: "PKG004", name: "Consultant Basic / Rs.800.00", price: "800.00", userType: "Consultant", type: "sell", status: "expired", invoiceUrl: "#" },
  { id: "PKG005", name: "Rent Standard Plan", price: "750.00", userType: "Enquiry", type: "rent", status: "live", remainingPoints: 8, totalPoints: 10 },
  { id: "PKG006", name: "Rent Starter Plan", price: "300.00", userType: "Enquiry", type: "rent", status: "expired", remainingPoints: 0, totalPoints: 3 },
];

export default function HistoryPage() {
  const [filter, setFilter] = useState<Filter>("sell");
  const [status, setStatus] = useState<Status>("live");

  const filtered = allPackages.filter((p) => p.type === filter && p.status === status);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-ink">History</h1>

      {/* Sell / Rent toggle */}
      <div className="flex gap-2">
        {(["sell", "rent"] as const).map((f) => (
          <button
            key={f}
            onClick={() => { setFilter(f); setStatus("live"); }}
            className={cn(
              "px-6 py-2 rounded-md text-sm font-semibold border transition-colors duration-200",
              filter === f ? "bg-[#163d75] border-[#163d75] text-white" : "bg-white border-[#163d75] text-[#163d75] hover:bg-[#163d75] hover:text-white"
            )}
          >
            {f === "sell" ? "Sell" : "Rent/Lease"}
          </button>
        ))}
      </div>

      {/* Live / Expired tabs */}
      <div className="flex border border-gray-200 rounded-md overflow-hidden mt-6">
        {(["live", "expired"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={cn(
              "flex-1 py-3 text-sm font-semibold transition-colors duration-200 border-r border-gray-200 last:border-r-0",
              status === s ? "bg-[#163d75] text-white" : "bg-white text-[#163d75] hover:bg-gray-50"
            )}
          >
            {s === "live" ? "Live Packages" : "Expired Packages List"}
          </button>
        ))}
      </div>

      {/* Package list */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-ink-muted">
          <p className="font-medium">No packages found.</p>
        </div>
      ) : (
        <div className="space-y-4 mt-6">
          {filtered.map((pkg) => (
            <div key={pkg.id} className="bg-white border border-gray-100 rounded-lg shadow-sm p-5 flex flex-col md:flex-row gap-5">
              <div className="shrink-0 flex items-start justify-center">
                <img src="/icon/validating-ticket.png" alt="Invoice Icon" className="w-16 h-16 object-contain" />
              </div>

              <div className="flex-1 min-w-0 flex flex-col items-start">
                <h3 className="text-base font-bold text-gray-900 mb-2">{pkg.name}</h3>

                <div className="flex flex-wrap gap-2 mb-3">
                  {pkg.type === "rent" ? (
                    <span className="text-xs font-bold px-2 py-1 rounded bg-[#0dcaf0] text-white">Type: Rent/Lease</span>
                  ) : (
                    <span className="text-xs font-bold px-2 py-1 rounded bg-[#ef4444] text-white">
                      User Type: {pkg.userType}
                    </span>
                  )}

                  {pkg.type === "rent" && (
                    <>
                      <span className="text-xs font-bold px-2 py-1 rounded bg-gray-500 text-white">Total Points: {pkg.totalPoints}</span>
                      <span className="text-xs font-bold px-2 py-1 rounded bg-[#ffc107] text-white">Remaining: {pkg.remainingPoints}</span>
                    </>
                  )}

                  {pkg.status === "live" ? (
                    <span className="text-xs font-bold px-2.5 py-1 rounded bg-[#198754] text-white">
                      Live
                    </span>
                  ) : (
                    <span className="text-xs font-bold px-2.5 py-1 rounded bg-[#dc3545] text-white">
                      Expired
                    </span>
                  )}
                </div>

                {pkg.type === "sell" && pkg.invoiceUrl && (
                  <a
                    href={pkg.invoiceUrl}
                    target="_blank"
                    className="mt-1 text-sm font-semibold border border-[#163d75] text-[#163d75] px-4 py-1.5 rounded-md hover:bg-[#163d75] hover:text-white transition-colors duration-200"
                  >
                    View Details
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
