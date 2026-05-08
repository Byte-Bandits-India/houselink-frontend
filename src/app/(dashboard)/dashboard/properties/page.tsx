"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import PropertyCharts from "@/components/shared/PropertyCharts";

/* ── Types ───────────────────────────────────────────────── */
type Purpose = "sell" | "rent";
type OwnerType = "owner" | "builder" | "consultant";

interface Property {
  id: number;
  name: string;
  state: string;
  views: number;
  expiredAt: string;
  createdAt: string;
  status: string;
  moderationStatus: string;
  purpose: Purpose;
  ownerType: OwnerType;
}

/* ── Mock data from properties.blade.php ─────────────────── */
const properties: Property[] = [
  { id: 101, name: "Greenwood Heights Apartment", state: "Karnataka", views: 142, expiredAt: "15-06-2026", createdAt: "10-03-2026", status: "Selling", moderationStatus: "approved", purpose: "sell", ownerType: "owner" },
  { id: 102, name: "Sunrise Villa", state: "Karnataka", views: 87, expiredAt: "20-07-2026", createdAt: "05-04-2026", status: "Selling", moderationStatus: "pending", purpose: "sell", ownerType: "owner" },
  { id: 103, name: "Metro Studio Flat", state: "Karnataka", views: 210, expiredAt: "01-05-2026", createdAt: "12-02-2026", status: "Selling", moderationStatus: "approved", purpose: "sell", ownerType: "builder" },
  { id: 104, name: "Coastal Dream Villa", state: "Karnataka", views: 55, expiredAt: "10-04-2026", createdAt: "22-01-2026", status: "Selling", moderationStatus: "approved", purpose: "sell", ownerType: "consultant" },
  { id: 105, name: "Tranquil Nest 2BHK", state: "Karnataka", views: 98, expiredAt: "N/A", createdAt: "01-04-2026", status: "Renting", moderationStatus: "approved", purpose: "rent", ownerType: "owner" },
  { id: 106, name: "Park View Flat", state: "Maharashtra", views: 44, expiredAt: "N/A", createdAt: "15-03-2026", status: "Renting", moderationStatus: "pending", purpose: "rent", ownerType: "owner" },
];

const moderationBadge: Record<string, string> = {
  approved: "bg-blue-100 text-blue-700",
  pending: "bg-amber-100 text-amber-700",
  rejected: "bg-red-100 text-red-700",
};

const statusBadge: Record<string, string> = {
  Selling: "bg-cyan-100 text-cyan-700",
  Renting: "bg-purple-100 text-purple-700",
};

export default function PropertiesPage() {
  const router = useRouter();
  const [purpose, setPurpose] = useState<Purpose>("sell");
  const [ownerType, setOwnerType] = useState<OwnerType>("owner");

  const ownerTypeTabs: { key: OwnerType; label: string }[] = [
    { key: "owner", label: "Owner" },
    ...(purpose === "sell" ? [{ key: "builder" as OwnerType, label: "Builder" }] : []),
    { key: "consultant", label: "Consultant" },
  ];

  const filtered = properties.filter(
    (p) => p.purpose === purpose && p.ownerType === ownerType && p.moderationStatus !== "archived"
  );

  return (
    <div className="space-y-5">
      {/* Title + Add Property */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Property</h1>
        <button
          onClick={() => router.push("/dashboard/properties/new")}
          className="flex items-center gap-2 border-2 border-brand text-brand font-bold text-sm px-4 py-2 rounded-lg hover:bg-brand hover:text-white transition-colors duration-200"
        >
          <Plus className="w-4 h-4" /> Add Property
        </button>
      </div>

      <PropertyCharts />

      {/* Sell / Rent-Lease toggle */}
      <div className="flex gap-2">
        {(["sell", "rent"] as const).map((f) => (
          <button
            key={f}
            onClick={() => { setPurpose(f); setOwnerType("owner"); }}
            className={cn(
              "px-6 py-2 rounded-lg text-sm font-bold border-2 transition-colors duration-200",
              purpose === f ? "bg-brand border-brand text-white" : "bg-white border-brand text-brand hover:bg-brand hover:text-white"
            )}
          >
            {f === "sell" ? "Sell" : "Rent/Lease"}
          </button>
        ))}
      </div>

      {/* Owner / Builder / Consultant tabs */}
      <div className="flex border border-gray-200 rounded-lg overflow-hidden">
        {ownerTypeTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setOwnerType(tab.key)}
            className={cn(
              "flex-1 py-3 text-sm font-semibold transition-colors duration-200 border-r border-gray-200 last:border-r-0",
              ownerType === tab.key ? "bg-brand text-white" : "bg-white text-brand hover:bg-brand/10"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-ink-muted">
          <p className="font-medium mb-3">No properties found.</p>
          <button
            onClick={() => router.push("/dashboard/properties/new")}
            className="text-sm font-semibold text-white bg-brand px-4 py-2 rounded-lg hover:bg-brand/90 transition-colors"
          >
            Add Property
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand text-white">
                <th className="text-left px-4 py-3 font-semibold">Property Name</th>
                <th className="text-center px-4 py-3 font-semibold w-20">Views</th>
                <th className="text-center px-4 py-3 font-semibold w-24">Unique ID</th>
                <th className="text-center px-4 py-3 font-semibold w-32">Expiry Date</th>
                <th className="text-center px-4 py-3 font-semibold w-28">Created At</th>
                <th className="text-center px-4 py-3 font-semibold w-28">Status</th>
                <th className="text-center px-4 py-3 font-semibold w-28">Moderation</th>
                <th className="text-center px-4 py-3 font-semibold w-32">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, idx) => (
                <tr key={p.id} className={cn("border-t border-gray-100", idx % 2 === 0 ? "bg-white" : "bg-gray-50")}>
                  <td className="px-4 py-4">
                    <p
                      className="font-bold text-ink hover:text-brand cursor-pointer transition-colors"
                      onClick={() => router.push(`/dashboard/properties/${p.id}`)}
                    >
                      {p.name}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-center text-ink">{p.views}</td>
                  <td className="px-4 py-4 text-center font-bold text-ink">{p.id}</td>
                  <td className="px-4 py-4 text-center font-bold text-emerald-600">{p.expiredAt}</td>
                  <td className="px-4 py-4 text-center text-ink-secondary">{p.createdAt}</td>
                  <td className="px-4 py-4 text-center">
                    <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", statusBadge[p.status] || "bg-gray-100 text-gray-700")}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", moderationBadge[p.moderationStatus] || "bg-gray-100 text-gray-700")}>
                      {p.moderationStatus}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-1.5 items-center">
                      {p.moderationStatus === "pending" ? (
                        /* Pending: view-only, no editing allowed */
                        <button
                          onClick={() => router.push(`/dashboard/properties/${p.id}`)}
                          className="flex items-center gap-1 text-xs font-semibold border border-brand text-brand px-3 py-1.5 rounded-lg hover:bg-brand hover:text-white transition-colors w-full justify-center"
                        >
                          <Eye className="w-3 h-3" /> View
                        </button>
                      ) : (
                        /* Approved / rejected: edit page doubles as the detail view */
                        <button
                          onClick={() => router.push(`/dashboard/properties/${p.id}/edit`)}
                          className="flex items-center gap-1 text-xs font-semibold border border-brand text-brand px-3 py-1.5 rounded-lg hover:bg-brand hover:text-white transition-colors w-full justify-center"
                        >
                          <Pencil className="w-3 h-3" /> Edit
                        </button>
                      )}
                      <button className="flex items-center gap-1 text-xs font-semibold border border-red-400 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-600 hover:text-white transition-colors w-full justify-center">
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
