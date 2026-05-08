"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";

type Filter = "sell" | "rent";

interface Enquiry {
  id: number;
  date: string;
  property: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  myMessage: string;
  filter: Filter;
}

/* Mock data — same structure as all_leads.blade.php but from buyer's POV */
const enquiries: Enquiry[] = [
  { id: 1, date: "06-05-2026", property: "Park Avenue 3BHK", ownerName: "Suresh Nair", ownerPhone: "+91 91234 56789", ownerEmail: "suresh@example.com", myMessage: "I am interested", filter: "sell" },
  { id: 2, date: "03-05-2026", property: "Golden Heights Villa", ownerName: "Anjali Mehta", ownerPhone: "+91 92345 67890", ownerEmail: "anjali@example.com", myMessage: "I am interested", filter: "sell" },
  { id: 3, date: "28-04-2026", property: "Tranquil Nest 2BHK", ownerName: "Rajesh Pillai", ownerPhone: "+91 93456 78901", ownerEmail: "rajesh@example.com", myMessage: "I am interested", filter: "rent" },
];

export default function EnquiriesPage() {
  const [filter, setFilter] = useState<Filter>("sell");

  const filtered = enquiries.filter((e) => e.filter === filter);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">My Enquiries</h1>
        {filtered.length > 0 && (
          <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors duration-200">
            <Download className="w-4 h-4" /> Download
          </button>
        )}
      </div>

      {/* For Sale / Rent-Lease toggle */}
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
            {f === "sell" ? "For Sale" : "Rent/Lease"}
          </button>
        ))}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-ink-muted">
          <p className="font-medium">No enquiries found.</p>
          <p className="text-sm mt-1">New enquiries will appear here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand text-white">
                <th className="text-center px-4 py-3 font-semibold w-10">#</th>
                <th className="text-left px-4 py-3 font-semibold">Date</th>
                <th className="text-left px-4 py-3 font-semibold">Property</th>
                <th className="text-left px-4 py-3 font-semibold">Owner Name</th>
                <th className="text-left px-4 py-3 font-semibold">Owner Phone</th>
                <th className="text-left px-4 py-3 font-semibold">Owner Email</th>
                <th className="text-left px-4 py-3 font-semibold">My Message</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((enq, idx) => (
                <tr key={enq.id} className={cn("border-t border-gray-100", idx % 2 === 0 ? "bg-white" : "bg-gray-50")}>
                  <td className="px-4 py-4 text-center font-semibold text-ink">{idx + 1}</td>
                  <td className="px-4 py-4 text-ink-secondary whitespace-nowrap">{enq.date}</td>
                  <td className="px-4 py-4 font-medium text-ink">{enq.property}</td>
                  <td className="px-4 py-4 text-ink">{enq.ownerName}</td>
                  <td className="px-4 py-4 text-ink whitespace-nowrap">{enq.ownerPhone}</td>
                  <td className="px-4 py-4 text-ink">{enq.ownerEmail}</td>
                  <td className="px-4 py-4 text-ink-secondary max-w-[200px]">{enq.myMessage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
