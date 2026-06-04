"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Trash2, Plus, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import PropertyCharts from "@/components/shared/PropertyCharts";
import { useAuth } from "@/context/AuthContext";
import { getUserProperties, deleteProperty } from "@/lib/api";

/* ── Types ───────────────────────────────────────────────── */
type Purpose = "sell" | "rent_lease";
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

const moderationBadge: Record<string, string> = {
  approved: "bg-blue-100 text-blue-700",
  pending: "bg-amber-100 text-amber-700",
  rejected: "bg-red-100 text-red-700",
};

const statusBadge: Record<string, string> = {
  Selling: "bg-cyan-100 text-cyan-700",
  Renting: "bg-purple-100 text-purple-700",
  Leasing: "bg-emerald-100 text-emerald-700",
};

export default function PropertiesPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [purpose, setPurpose] = useState<Purpose>("sell");
  const [ownerType, setOwnerType] = useState<OwnerType>("owner");

  const loadProperties = async (showLoadingState: boolean | React.MouseEvent<any> = true) => {
    if (!user) return;
    const shouldShow = showLoadingState === true || typeof showLoadingState !== "boolean";
    if (shouldShow) {
      setIsLoading(true);
      setError(null);
    }
    try {
      const res = await getUserProperties(Number(user.id));
      if (res.success && Array.isArray(res.data)) {
        const mapped: Property[] = res.data.map((p: any) => {
          // purpose: Map backend propertyFor ('sell', 'rent', 'lease') to Purpose ('sell', 'rent_lease')
          const purposeVal: Purpose = p.propertyFor === "sell" ? "sell" : "rent_lease";
          
          // ownerType: Map backend propertyOwnership ('owner', 'builder', 'consultant')
          const ownerTypeVal: OwnerType = (p.propertyOwnership?.toLowerCase() ?? "owner") as OwnerType;

          // state
          const stateName = p.state?.name || p.state || "N/A";

          // expiredAt
          let expiredAt = "N/A";
          if (p.expiredAt) {
            try {
              expiredAt = new Date(p.expiredAt).toLocaleDateString("en-GB").replace(/\//g, "-");
            } catch {
              expiredAt = "N/A";
            }
          }

          // createdAt
          let createdAt = "N/A";
          if (p.createdAt) {
            try {
              createdAt = new Date(p.createdAt).toLocaleDateString("en-GB").replace(/\//g, "-");
            } catch {
              createdAt = "N/A";
            }
          }

          // status
          const status = p.propertyFor === "sell" ? "Selling" : p.propertyFor === "rent" ? "Renting" : "Leasing";

          return {
            id: p.id,
            name: p.name || "Untitled Property",
            state: stateName,
            views: p.views ?? 0,
            expiredAt,
            createdAt,
            status,
            moderationStatus: p.moderationStatus || "pending",
            purpose: purposeVal,
            ownerType: ownerTypeVal,
          };
        });
        setProperties(mapped);
      } else {
        if (shouldShow) {
          setError("Failed to parse user properties from API response.");
        }
      }
    } catch (err: any) {
      console.error("Error fetching properties:", err);
      if (shouldShow) {
        setError(err?.message || "An unexpected error occurred while fetching properties.");
      }
    } finally {
      if (shouldShow) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        loadProperties(true);

        const interval = setInterval(() => {
          loadProperties(false);
        }, 5000);

        return () => clearInterval(interval);
      } else {
        setIsLoading(false);
        setProperties([]);
      }
    }
  }, [user, authLoading]);

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await deleteProperty(id);
      if (res.success) {
        loadProperties();
      } else {
        alert(res.message || "Failed to delete the property listing.");
      }
    } catch (err: any) {
      console.error("Error deleting property:", err);
      alert(err?.message || "An unexpected error occurred while deleting the property.");
    }
  };

  const ownerTypeTabs: { key: OwnerType; label: string }[] = [
    { key: "owner", label: "Owner" },
    ...(purpose === "sell" ? [{ key: "builder" as OwnerType, label: "Builder" }] : []),
    { key: "consultant", label: "Consultant" },
  ];

  const filtered = properties.filter(
    (p) => p.purpose === purpose && p.ownerType === ownerType && p.moderationStatus !== "archived"
  );

  if (authLoading || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-10 h-10 text-brand animate-spin" />
        <p className="text-sm font-semibold text-ink-muted animate-pulse">Loading properties...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center bg-red-50/50 rounded-2xl border border-red-100 max-w-lg mx-auto">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-ink mb-2">Failed to load properties</h3>
        <p className="text-sm text-ink-muted mb-6">{error}</p>
        <button
          onClick={loadProperties}
          className="px-5 py-2.5 bg-brand text-white font-semibold text-sm rounded-xl hover:bg-brand/90 transition-colors shadow-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

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

      <PropertyCharts properties={filtered} />

      {/* Sell / Rent-Lease toggle */}
      <div className="flex gap-2">
        {(["sell", "rent_lease"] as const).map((f) => (
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
                      <button 
                        onClick={() => handleDelete(p.id, p.name)}
                        className="flex items-center gap-1 text-xs font-semibold border border-red-400 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-600 hover:text-white transition-colors w-full justify-center"
                      >
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

